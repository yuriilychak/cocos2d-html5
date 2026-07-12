import { RendererConfig } from "../../sys/renderer-config";
import { Point, Size } from "../../geometry";
import { log, assert, _LogInfos } from "../../boot/debugger";
import { NextPOT } from "../../platform/macro/utils";
import { ServiceLocator } from "../../service-locator";
import { GLState, PIXEL_FORMAT, ShaderName, VertexAttribute } from "../../enums";
import {
  PIXEL_FORMAT_BITS,
  PIXEL_FORMAT_NAMES,
  WEBGL_ALIAS_TEXTURE_FILTERS,
  WEBGL_ANTI_ALIAS_TEXTURE_FILTERS,
  WEBGL_DEFAULT_TEXTURE_PARAMETERS,
  WEBGL_PIXEL_FORMATS
} from "./constants";
import Texture2DRenderer from "./texture-2d-renderer";
import { isObject } from "../../boot";
import createPixelData from "./pixel-data-factories";

import type { PointLike, RectLike, SizeLike } from "../../geometry";
import type {
  Texture2DInterface,
  Texture2DParameters,
  TextureImage
} from "./types";

export default class WebGLTextureRenderer extends Texture2DRenderer {
  #name = "";
  #webTexture: WebGLTexture | null = null;
  #pixelFormat = PIXEL_FORMAT.NONE;
  #max = new Point();
  #hasMipmaps = false;
  #hasPremultipliedAlpha = false;
  #aliasing: boolean | null = null;

  constructor(texture: Texture2DInterface) {
    super(texture);
  }

  initWithElement(): void {
    if (ServiceLocator.game.rendererInitialized) {
      this.#webTexture =
      ServiceLocator.sys.rendererConfig.renderContext.createTexture();
    }

    this.#hasPremultipliedAlpha = true;
  }

  handleLoadedTexture(premultiplied = this.#hasPremultipliedAlpha): void {
    const element = this.texture.htmlElement;

    if (
      !ServiceLocator.game.rendererInitialized ||
      !Size.isLike(element) ||
      !element.width ||
      !element.height
    )
      return;

    const gl = ServiceLocator.sys.rendererConfig.renderContext;

    if (!this.#webTexture) {
      this.#webTexture = gl.createTexture();
    }

    ServiceLocator.glStateCache.bindTexture2D(this.texture);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    
    if (premultiplied) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      element
    );

    for (const [parameter, value] of WEBGL_DEFAULT_TEXTURE_PARAMETERS) {
      gl.texParameteri(gl.TEXTURE_2D, gl[parameter], gl[value]);
    }

    this.shaderProgram = ServiceLocator.shaderCache.get(
      ShaderName.POSITION_TEXTURE
    );

    ServiceLocator.glStateCache.bindTexture2D(null);

    if (premultiplied) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
    }

    this.#pixelFormat = PIXEL_FORMAT.RGBA8888;
    this.#max.set(1, 1);

    this.#hasPremultipliedAlpha = premultiplied;
    this.hasMipmaps = false;
    this.texture.resetSize(RendererConfig.ENABLE_IMAGE_POOL);
  }

  releaseTexture(): void {
    if (this.#webTexture) {
      ServiceLocator.sys.rendererConfig.renderContext.deleteTexture(
        this.#webTexture
      );
    }
    this.texture.releaseElement();
  }

  toString(): string {
    return (
      `<Texture2D | Name = ${this.#name} | Dimensions = ${this.texture.pixelSize.toString()} | Coordinates = ${this.#max.toString()}>`
    );
  }

  initWithData(
    data: ArrayBufferView | null,
    pixelFormat: PIXEL_FORMAT,
    pixelsWide: number,
    pixelsHigh: number,
    contentSize: SizeLike
  ): boolean {
    const gl = ServiceLocator.sys.rendererConfig.renderContext;

    gl.pixelStorei(
      gl.UNPACK_ALIGNMENT,
      WebGLTextureRenderer.#getUnpackAlignment(pixelFormat, pixelsWide)
    );

    this.#webTexture = gl.createTexture();
    ServiceLocator.glStateCache.bindTexture2D(this.texture);

    for (const [parameter, value] of WEBGL_DEFAULT_TEXTURE_PARAMETERS) {
      gl.texParameteri(gl.TEXTURE_2D, gl[parameter], gl[value]);
    }

    const requestedPixelFormatMapping = WEBGL_PIXEL_FORMATS[pixelFormat];
    const pixelFormatMapping = requestedPixelFormatMapping
      ? requestedPixelFormatMapping
      : WEBGL_PIXEL_FORMATS[PIXEL_FORMAT.NONE]!;
    if (!requestedPixelFormatMapping) {
      assert(0, _LogInfos.Texture2D_initWithData);
    }
    const format = gl[pixelFormatMapping.format];
    const type = gl[pixelFormatMapping.type];

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format,
      pixelsWide,
      pixelsHigh,
      0,
      format,
      type,
      data
    );

    const pixelSize = new Size(pixelsWide, pixelsHigh);
    this.texture.contentSize = contentSize;
    this.texture.pixelSize = pixelSize;
    this.#pixelFormat = pixelFormat;
    this.#max.set(
      contentSize.width / pixelSize.width,
      contentSize.height / pixelSize.height
    );

    this.#hasPremultipliedAlpha = false;
    this.hasMipmaps = false;
    this.shaderProgram = ServiceLocator.shaderCache.get(
      ShaderName.POSITION_TEXTURE
    );

    return true;
  }

  drawAtPoint(point: PointLike): void {
    const size = Size.compMultIn(this.texture.pixelSize, this.#max);

    const vertices = [
      point.x,
      point.y,
      0,
      size.width + point.x,
      point.y,
      0,
      point.x,
      size.height + point.y,
      0,
      size.width + point.x,
      size.height + point.y,
      0
    ];

    this.#drawTexture(vertices);
  }

  drawInRect(rect: RectLike): void {
    const vertices = [
      rect.x,
      rect.y,
      rect.x + rect.width,
      rect.y,
      rect.x,
      rect.y + rect.height,
      rect.x + rect.width,
      rect.y + rect.height
    ];

    this.#drawTexture(vertices);
  }

  initWithImage(uiImage: TextureImage | null): boolean {
    if (uiImage == null) {
      log(_LogInfos.Texture2D_initWithImage);
      return false;
    }

    const imageWidth = uiImage.getWidth();
    const imageHeight = uiImage.getHeight();

    const maxTextureSize = ServiceLocator.sys.configuration.maxTextureSize;
    if (imageWidth > maxTextureSize || imageHeight > maxTextureSize) {
      log(
        _LogInfos.Texture2D_initWithImage_2,
        imageWidth,
        imageHeight,
        maxTextureSize,
        maxTextureSize
      );
      return false;
    }
    return this.#initPremultipliedATextureWithImage(
      uiImage,
      imageWidth,
      imageHeight
    );
  }

  setTexParameters(texParams: Texture2DParameters): void;
  setTexParameters(minFilter: number, magFilter: number, wrapS: GLState, wrapT: GLState): void;
  setTexParameters(
    texParamsOrMinFilter: Texture2DParameters | number,
    magFilter?: number,
    wrapS?: GLState,
    wrapT?: GLState
  ): void {
    const t = this.texture;
    const gl = ServiceLocator.sys.rendererConfig.renderContext;

    const texParams: Texture2DParameters = isObject(texParamsOrMinFilter)
      ? texParamsOrMinFilter
      : {
        minFilter: texParamsOrMinFilter,
        magFilter: magFilter as number,
        wrapS: wrapS as GLState,
        wrapT: wrapT as GLState
      };

    assert(
      (t.pixelSize.width === NextPOT(t.pixelSize.width) &&
        t.pixelSize.height === NextPOT(t.pixelSize.height)) ||
        (texParams.wrapS === gl.CLAMP_TO_EDGE &&
          texParams.wrapT === gl.CLAMP_TO_EDGE),
      "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures"
    );

    ServiceLocator.glStateCache.bindTexture2D(t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texParams.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texParams.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texParams.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texParams.wrapT);
    this.#aliasing = null;
  }

  bitsPerPixelForFormat(format = this.pixelFormat): number {
    format = format || this.pixelFormat;
    const value = PIXEL_FORMAT_BITS[format];
    if (value != null) return value;
    log(_LogInfos.Texture2D_bitsPerPixelForFormat, format);
    return -1;
  }

  // Canvas-only methods — no-ops for WebGL
  generateColorTexture(): null {
    return null;
  }
  generateTextureCacheForColor(): null {
    return null;
  }

  generateGrayTexture(): null {
    return null;
  }

  #drawTexture(vertices: number[]): void {
    const coordinates = [
      0.0,
      this.#max.y,
      this.#max.x,
      this.#max.y,
      0.0,
      0.0,
      this.#max.x,
      0.0
    ];

    this.shaderProgram!.use();
    this.shaderProgram!.setUniformsForBuiltins();

    ServiceLocator.glStateCache.bindTexture2D(this.texture);

    const gl = ServiceLocator.sys.rendererConfig.renderContext;
    gl.enableVertexAttribArray(VertexAttribute.POSITION);
    gl.enableVertexAttribArray(VertexAttribute.TEX_COORDS);
    gl.vertexAttribPointer(
      VertexAttribute.POSITION,
      2,
      gl.FLOAT,
      false,
      0,
      vertices
    );
    gl.vertexAttribPointer(
      VertexAttribute.TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      0,
      coordinates
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  #initPremultipliedATextureWithImage(
    uiImage: TextureImage,
    width: number,
    height: number
  ): boolean {
    let pixelFormat = PIXEL_FORMAT.DEFAULT;

    if (!uiImage.hasAlpha()) {
      if (uiImage.getBitsPerComponent() >= 8) {
        pixelFormat = PIXEL_FORMAT.RGB888;
      } else {
        log(_LogInfos.Texture2D__initPremultipliedATextureWithImage);
        pixelFormat = PIXEL_FORMAT.RGB565;
      }
    }

    const tempData = createPixelData(
      pixelFormat,
      uiImage,
      width,
      height
    );
    const imageSize = new Size(uiImage.getWidth(), uiImage.getHeight());

    this.initWithData(
      tempData as ArrayBufferView,
      pixelFormat,
      width,
      height,
      imageSize
    );

    this.#hasPremultipliedAlpha = uiImage.isPremultipliedAlpha();

    return true;
  }

  static #getUnpackAlignment(pixelFormat: PIXEL_FORMAT, pixelsWide: number): number {
    const bitsPerPixel = PIXEL_FORMAT_BITS[pixelFormat] ?? 0;
    const bytesPerRow = (pixelsWide * bitsPerPixel) / 8;

    for (let i = 3; i >= 0; i--) {
      const alignment = 1 << i;
      if (bytesPerRow % alignment === 0) {
        return alignment;
      }
    }

    return 1;
  }

  get maxS(): number {
    return this.#max.x;
  }

  set maxS(maxS: number) {
    this.#max.x = maxS;
  }

  get maxT(): number {
    return this.#max.y;
  }

  set maxT(maxT: number) {
    this.#max.y = maxT;
  }

  get pixelFormat(): PIXEL_FORMAT {
    return this.#pixelFormat;
  }

  get hasMipmaps(): boolean {
    return this.#hasMipmaps;
  }

  set hasMipmaps(value: boolean) {
    if (this.#hasMipmaps === value) {
      return;
    }

    if (value) {
     assert(
        this.texture.pixelSize.width === NextPOT(this.texture.pixelSize.width) &&
          this.texture.pixelSize.height === NextPOT(this.texture.pixelSize.height),
        "Mimpap texture only works in POT textures"
      );

      ServiceLocator.glStateCache.bindTexture2D(this.texture);
      ServiceLocator.sys.rendererConfig.renderContext.generateMipmap(
        ServiceLocator.sys.rendererConfig.renderContext.TEXTURE_2D
      );
    }

    this.#hasMipmaps = value;
    this.#aliasing = null;
  }

  get hasPremultipliedAlpha(): boolean {
    return this.#hasPremultipliedAlpha;
  }

  get webTexture(): WebGLTexture | null {
    return this.#webTexture;
  }

  set webTexture(value: WebGLTexture | null) {
    this.#webTexture = value;
  }

  get stringForFormat(): string {
    return PIXEL_FORMAT_NAMES[this.pixelFormat] ?? "";
  }

  get aliasing(): boolean | null {
    return this.#aliasing;
  }

  set aliasing(isAlias: boolean | null) {
    if (isAlias === null || this.#aliasing === isAlias) {
      return;
    }

    const gl = ServiceLocator.sys.rendererConfig.renderContext;
    const textureFilters = isAlias
      ? WEBGL_ALIAS_TEXTURE_FILTERS
      : WEBGL_ANTI_ALIAS_TEXTURE_FILTERS;
    const minFilter = this.#hasMipmaps
      ? gl[textureFilters.mipmapMinFilter]
      : gl[textureFilters.filter];

    ServiceLocator.glStateCache.bindTexture2D(this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      gl[textureFilters.filter]
    );
    this.#aliasing = isAlias;
  }

  get grayscaled(): boolean {
    return false;
  }

  set grayscaled(grayscaled: boolean) {}
}

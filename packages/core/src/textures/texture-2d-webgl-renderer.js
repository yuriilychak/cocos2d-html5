import { RendererConfig } from "../sys";
import { Point, Size } from "../geometry";
import { log, assert, _LogInfos } from "../boot/debugger";
import { NextPOT } from "../platform/macro/utils";
import { ServiceLocator } from "../service-locator";
import { PIXEL_FORMAT, ShaderName, VertexAttribute } from "../enums";
import { PIXEL_FORMAT_BITS, PIXEL_FORMAT_NAMES } from "./constants";
import Texture2DRenderer from "./texture-2d-renderer";
import { isObject } from "../boot";

export default class WebGLTextureRenderer extends Texture2DRenderer {
  #name = "";
  #webTexture = null;
  #pixelFormat = PIXEL_FORMAT.NONE;
  #max = new Point();
  #hasMipmaps = false;
  #hasPremultipliedAlpha = false;

  constructor(texture) {
    super(texture);
  }

  get maxS() {
    return this.#max.x;
  }

  set maxS(maxS) {
    this.#max.x = maxS;
  }

  get maxT() {
    return this.#max.y;
  }

  set maxT(maxT) {
    this.#max.y = maxT;
  }

  get pixelFormat() {
    return this.#pixelFormat;
  }

  get hasMipmaps() {
    return this.#hasMipmaps;
  }

  get hasPremultipliedAlpha() {
    return this.#hasPremultipliedAlpha;
  }

  get webTexture() {
    return this.#webTexture;
  }

  set webTexture(value) {
    this.#webTexture = value;
  }

  initWithElement() {
    if (!ServiceLocator.game.rendererInitialized) {
      this.#hasPremultipliedAlpha = true;
      return;
    }

    this.#webTexture =
      ServiceLocator.sys.rendererConfig.renderContext.createTexture();
    this.#hasPremultipliedAlpha = true;
  }

  handleLoadedTexture(premultiplied = this.#hasPremultipliedAlpha) {
    const element = this.texture.htmlElement;

    if (
      !ServiceLocator.game.rendererInitialized ||
      !Size.isLike(element) ||
      !element.width ||
      !element.height
    )
      return;

    var gl = ServiceLocator.sys.rendererConfig.renderContext;

    if (!this.#webTexture) {
      this.#webTexture = gl.createTexture();
    }

    ServiceLocator.glStateCache.bindTexture2D(this.texture);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    if (premultiplied) gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      element
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.shaderProgram = ServiceLocator.shaderCache.get(
      ShaderName.POSITION_TEXTURE
    );
    ServiceLocator.glStateCache.bindTexture2D(null);
    if (premultiplied) gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

    this.#pixelFormat = PIXEL_FORMAT.RGBA8888;
    this.#max.set(1, 1);

    this.#hasPremultipliedAlpha = premultiplied;
    this.#hasMipmaps = false;
    this.texture.resetSize(RendererConfig.ENABLE_IMAGE_POOL);
  }

  releaseTexture() {
    if (this.#webTexture) {
      ServiceLocator.sys.rendererConfig.renderContext.deleteTexture(
        this.#webTexture
      );
    }
    this.texture.releaseElement();
  }

  get description() {
    var t = this.texture;
    return (
      `<Texture2D | Name = ${this.#name} | Dimensions = ${this.texture.pixelSize.toString()} | Coordinates = ${this.#max.toString()}>`
    );
  }

  initWithData(data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    var format = gl.RGBA,
      type = gl.UNSIGNED_BYTE;

    var bitsPerPixel = PIXEL_FORMAT_BITS[pixelFormat];

    var bytesPerRow = (pixelsWide * bitsPerPixel) / 8;
    if (bytesPerRow % 8 === 0) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
    } else if (bytesPerRow % 4 === 0) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    } else if (bytesPerRow % 2 === 0) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
    } else {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }

    this.#webTexture = gl.createTexture();
    ServiceLocator.glStateCache.bindTexture2D(this.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    switch (pixelFormat) {
      case PIXEL_FORMAT.RGBA8888:
        format = gl.RGBA;
        break;
      case PIXEL_FORMAT.RGB888:
        format = gl.RGB;
        break;
      case PIXEL_FORMAT.RGBA4444:
        type = gl.UNSIGNED_SHORT_4_4_4_4;
        break;
      case PIXEL_FORMAT.RGB5A1:
        type = gl.UNSIGNED_SHORT_5_5_5_1;
        break;
      case PIXEL_FORMAT.RGB565:
        type = gl.UNSIGNED_SHORT_5_6_5;
        break;
      case PIXEL_FORMAT.AI88:
        format = gl.LUMINANCE_ALPHA;
        break;
      case PIXEL_FORMAT.A8:
        format = gl.ALPHA;
        break;
      case PIXEL_FORMAT.I8:
        format = gl.LUMINANCE;
        break;
      default:
        assert(0, _LogInfos.Texture2D_initWithData);
    }
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
    this.#hasMipmaps = false;
    this.shaderProgram = ServiceLocator.shaderCache.get(
      ShaderName.POSITION_TEXTURE
    );

    return true;
  }

  drawAtPoint(point) {
    var coordinates = [
        0.0,
        this.#max.y,
        this.#max.x,
        this.#max.y,
        0.0,
        0.0,
        this.#max.x,
        0.0
      ],
      gl = ServiceLocator.sys.rendererConfig.renderContext;

    const size = Size.compMultIn(this.texture.pixelSize, this.#max);

    var vertices = [
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

    this.shaderProgram.use();
    this.shaderProgram.setUniformsForBuiltins();

    ServiceLocator.glStateCache.bindTexture2D(this.texture);

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

  drawInRect(rect) {
    var t = this.texture;
    var coordinates = [
      0.0,
      this.#max.y,
      this.#max.x,
      this.#max.y,
      0.0,
      0.0,
      this.#max.x,
      0.0
    ];

    var vertices = [
      rect.x,
      rect.y,
      rect.x + rect.width,
      rect.y,
      rect.x,
      rect.y + rect.height,
      rect.x + rect.width,
      rect.y + rect.height
    ];

    this.shaderProgram.use();
    this.shaderProgram.setUniformsForBuiltins();

    ServiceLocator.glStateCache.bindTexture2D(t);

    var gl = ServiceLocator.sys.rendererConfig.renderContext;
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

  initWithImage(uiImage) {
    if (uiImage == null) {
      log(_LogInfos.Texture2D_initWithImage);
      return false;
    }

    var imageWidth = uiImage.getWidth();
    var imageHeight = uiImage.getHeight();

    var maxTextureSize = ServiceLocator.sys.configuration.maxTextureSize;
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
    return this._initPremultipliedATextureWithImage(
      uiImage,
      imageWidth,
      imageHeight
    );
  }

  setTexParameters(texParamsOrMagFilter, magFilter, wrapS, wrapT) {
    var t = this.texture;
    var gl = ServiceLocator.sys.rendererConfig.renderContext;

    const texParams = isObject(texParamsOrMagFilter) 
    ? texParamsOrMagFilter 
    : { minFilter: texParamsOrMagFilter, magFilter, wrapS, wrapT };

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
  }

  setAntiAliasTexParameters() {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    var t = this.texture;

    ServiceLocator.glStateCache.bindTexture2D(t);
    if (!this.#hasMipmaps)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    else
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  setAliasTexParameters() {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    var t = this.texture;

    ServiceLocator.glStateCache.bindTexture2D(t);
    if (!this.#hasMipmaps)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    else
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_NEAREST
      );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  generateMipmap() {
    var t = this.texture;
    assert(
      t.pixelSize.width === NextPOT(t.pixelSize.width) &&
        t.pixelSize.height === NextPOT(t.pixelSize.height),
      "Mimpap texture only works in POT textures"
    );

    ServiceLocator.glStateCache.bindTexture2D(t);
    ServiceLocator.sys.rendererConfig.renderContext.generateMipmap(
      ServiceLocator.sys.rendererConfig.renderContext.TEXTURE_2D
    );
    this.#hasMipmaps = true;
  }

  get stringForFormat() {
    return PIXEL_FORMAT_NAMES[this.pixelFormat];
  }

  bitsPerPixelForFormat(format) {
    format = format || this.pixelFormat;
    var value = PIXEL_FORMAT_BITS[format];
    if (value != null) return value;
    log(_LogInfos.Texture2D_bitsPerPixelForFormat, format);
    return -1;
  }

  _initPremultipliedATextureWithImage(uiImage, width, height) {
    var t = this.texture;
    var tempData = uiImage.getData();
    var inPixel32 = null;
    var inPixel8 = null;
    var outPixel16 = null;
    var hasAlpha = uiImage.hasAlpha();
    var imageSize = new Size(uiImage.getWidth(), uiImage.getHeight());
    var pixelFormat = PIXEL_FORMAT.DEFAULT;
    var bpp = uiImage.getBitsPerComponent();

    if (!hasAlpha) {
      if (bpp >= 8) {
        pixelFormat = PIXEL_FORMAT.RGB888;
      } else {
        log(_LogInfos.Texture2D__initPremultipliedATextureWithImage);
        pixelFormat = PIXEL_FORMAT.RGB565;
      }
    }

    var i,
      length = width * height;

    if (pixelFormat === PIXEL_FORMAT.RGB565) {
      if (hasAlpha) {
        tempData = new Uint16Array(width * height);
        inPixel32 = uiImage.getData();

        for (i = 0; i < length; ++i) {
          tempData[i] =
            ((((inPixel32[i] >> 0) & 0xff) >> 3) << 11) |
            ((((inPixel32[i] >> 8) & 0xff) >> 2) << 5) |
            ((((inPixel32[i] >> 16) & 0xff) >> 3) << 0);
        }
      } else {
        tempData = new Uint16Array(width * height);
        inPixel8 = uiImage.getData();

        for (i = 0; i < length; ++i) {
          tempData[i] =
            (((inPixel8[i] & 0xff) >> 3) << 11) |
            (((inPixel8[i] & 0xff) >> 2) << 5) |
            (((inPixel8[i] & 0xff) >> 3) << 0);
        }
      }
    } else if (pixelFormat === PIXEL_FORMAT.RGBA4444) {
      tempData = new Uint16Array(width * height);
      inPixel32 = uiImage.getData();

      for (i = 0; i < length; ++i) {
        tempData[i] =
          ((((inPixel32[i] >> 0) & 0xff) >> 4) << 12) |
          ((((inPixel32[i] >> 8) & 0xff) >> 4) << 8) |
          ((((inPixel32[i] >> 16) & 0xff) >> 4) << 4) |
          ((((inPixel32[i] >> 24) & 0xff) >> 4) << 0);
      }
    } else if (pixelFormat === PIXEL_FORMAT.RGB5A1) {
      tempData = new Uint16Array(width * height);
      inPixel32 = uiImage.getData();

      for (i = 0; i < length; ++i) {
        tempData[i] =
          ((((inPixel32[i] >> 0) & 0xff) >> 3) << 11) |
          ((((inPixel32[i] >> 8) & 0xff) >> 3) << 6) |
          ((((inPixel32[i] >> 16) & 0xff) >> 3) << 1) |
          ((((inPixel32[i] >> 24) & 0xff) >> 7) << 0);
      }
    } else if (pixelFormat === PIXEL_FORMAT.A8) {
      tempData = new Uint8Array(width * height);
      inPixel32 = uiImage.getData();

      for (i = 0; i < length; ++i) {
        tempData[i] = (inPixel32 >> 24) & 0xff;
      }
    }

    if (hasAlpha && pixelFormat === PIXEL_FORMAT.RGB888) {
      inPixel32 = uiImage.getData();
      tempData = new Uint8Array(width * height * 3);

      for (i = 0; i < length; ++i) {
        tempData[i * 3] = (inPixel32 >> 0) & 0xff;
        tempData[i * 3 + 1] = (inPixel32 >> 8) & 0xff;
        tempData[i * 3 + 2] = (inPixel32 >> 16) & 0xff;
      }
    }

    this.initWithData(tempData, pixelFormat, width, height, imageSize);

    if (tempData != uiImage.getData()) tempData = null;

    this.#hasPremultipliedAlpha = uiImage.isPremultipliedAlpha();
    return true;
  }

  // Canvas-only methods — no-ops for WebGL
  generateColorTexture() {
    return null;
  }
  generateTextureCacheForColor() {
    return null;
  }

  get grayscaled() {
    return false;
  }

  set grayscaled(grayscaled) {}

  generateGrayTexture() {
    return null;
  }
}

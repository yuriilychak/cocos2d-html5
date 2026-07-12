import { Rect, Size } from "../../geometry";
import { Texture2D } from "./texture-2d";

import { ServiceLocator } from "../../service-locator";
import { GLState, PIXEL_FORMAT } from "../../enums";
import { BYTE } from "../../constants";
import Texture2DRenderer from "./texture-2d-renderer";
import type { RectLike } from "../../geometry";
import type {
  Texture2DInterface,
  Texture2DParameters,
  TextureElement
} from "./types";

export default class CanvasTextureRenderer extends Texture2DRenderer {
  #grayElement: HTMLCanvasElement | null = null;
  #backupElement: TextureElement | null = null;
  #grayscaled: boolean = false;

  constructor(texture: Texture2DInterface) {
    super(texture);
  }

  initWithElement(): void {}

  handleLoadedTexture(): void {
    this.texture.resetSize(false);
  }

  releaseTexture(): void {
    this.texture.releaseElement();
  }

  bitsPerPixelForFormat(format = PIXEL_FORMAT.NONE): number {
    return -1;
  }

  get webTexture(): WebGLTexture | null {
    return null;
  }

  set webTexture(value: WebGLTexture | null) { }

  get maxS(): number {
    return 1;
  }

  set maxS(maxS: number) { }

  get maxT(): number {
    return 1;
  }

  set maxT(maxT: number) { }

  get pixelFormat(): PIXEL_FORMAT {
    return PIXEL_FORMAT.NONE;
  }

  get hasPremultipliedAlpha(): boolean {
    return false;
  }

  get hasMipmaps(): boolean {
    return false;
  }

  set hasMipmaps(value: boolean) {}

  get aliasing(): boolean | null {
    return null;
  }

  set aliasing(value: boolean | null) {}

  get stringForFormat(): string {
    return "";
  }

  toString(): string {
    return `<Texture2D | ${this.texture.contentSize.toString()}>`;
  }

  setTexParameters(texParams: Texture2DParameters): void;
  setTexParameters(minFilter: number, magFilter: number, wrapS: GLState, wrapT: GLState): void;
  setTexParameters(
    texParamsOrMinFilter: Texture2DParameters | number,
    magFilter?: number,
    wrapS?: GLState,
    wrapT?: GLState
  ): void {
    const texParams: Texture2DParameters =
      typeof texParamsOrMinFilter === "number"
        ? {
          minFilter: texParamsOrMinFilter,
          magFilter: magFilter as number,
          wrapS: wrapS as GLState,
          wrapT: wrapT as GLState
        }
        : texParamsOrMinFilter;

    if (
      texParams.wrapS === GLState.REPEAT &&
      texParams.wrapT === GLState.REPEAT
    ) {
      this.texture.pattern = "repeat";
      return;
    }

    if (texParams.wrapS === GLState.REPEAT) {
      this.texture.pattern = "repeat-x";
      return;
    }

    if (texParams.wrapT === GLState.REPEAT) {
      this.texture.pattern = "repeat-y";
      return;
    }

    this.texture.pattern = "";
  }

  generateColorTexture(
    r = 0,
    g = 0,
    b = 0,
    rect?: RectLike,
    canvas?: HTMLCanvasElement
  ): Texture2D | HTMLCanvasElement | null {
    return ServiceLocator.sys.capabilities.newBlendModes
      ? CanvasTextureRenderer.generateColorTextureMultiply(
        this.texture,
        r,
        g,
        b,
        rect,
        canvas
      )
      : CanvasTextureRenderer.generateColorTextureFourChannel(
        this.texture,
        r,
        g,
        b,
        rect,
        canvas
      );
  }

  generateTextureCacheForColor(): HTMLCanvasElement[] | null {
    const element = this.texture.htmlElement;
    if (!element) {
      return null;
    }

    const textureCache = this.texture.channelCache;

    return !Size.equalTo(textureCache[0], element)
       ? CanvasTextureRenderer.renderToCache(element, textureCache)
       : textureCache;
  }

  get grayscaled(): boolean {
    return this.#grayscaled;
  }

  set grayscaled(grayscaled: boolean) {
    if (!this.texture.loaded || this.#grayscaled === grayscaled) {
      return;
    }

    this.#grayscaled = grayscaled;
    if (this.#grayscaled) {
      this.#backupElement = this.texture.htmlElement;
      if (!this.#grayElement)
        this.#grayElement = CanvasTextureRenderer.generateGrayTexture(
          this.texture.htmlElement
        );
      this.texture.htmlElement = this.#grayElement;
    } else {
      if (this.#backupElement !== null) {
        this.texture.htmlElement = this.#backupElement;
      }
    }
  }

  generateGrayTexture(): Texture2D | null {
    if (!this.texture.loaded) {
      return null;
    }
    const grayElement = CanvasTextureRenderer.generateGrayTexture(
      this.texture.htmlElement
    );
    if (!grayElement) {
      return null;
    }

    const newTexture = new Texture2D();
    newTexture.htmlElement = grayElement;
    newTexture.renderer.handleLoadedTexture();

    return newTexture;
  }

  static generateGrayTexture(
    texture: TextureElement | null,
    rect?: RectLike,
    renderCanvas?: HTMLCanvasElement
  ): HTMLCanvasElement | null {
    if (texture === null) return null;
    renderCanvas = renderCanvas || document.createElement("canvas");
    rect = rect || new Rect(0, 0, texture.width, texture.height);
    renderCanvas.width = rect.width;
    renderCanvas.height = rect.height;

    const context = renderCanvas.getContext("2d");
    if (!context) {
      return null;
    }

    context.drawImage(
      texture,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      0,
      0,
      rect.width,
      rect.height
    );
    const imgData = context.getImageData(0, 0, rect.width, rect.height);
    const data = imgData.data;
    for (let i = 0, len = data.length; i < len; i += 4) {
      data[i] =
        data[i + 1] =
        data[i + 2] =
        0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    }
    context.putImageData(imgData, 0, 0);
    return renderCanvas;
  }

  static renderToCache(
    image: TextureElement,
    cache: HTMLCanvasElement[]
  ): HTMLCanvasElement[] | null {
    const w = image.width;
    const h = image.height;

    cache[0].width = w;
    cache[0].height = h;
    cache[1].width = w;
    cache[1].height = h;
    cache[2].width = w;
    cache[2].height = h;
    cache[3].width = w;
    cache[3].height = h;

    const cacheCtx = cache[3].getContext("2d");
    if (!cacheCtx) {
      return null;
    }

    cacheCtx.drawImage(image, 0, 0);
    const pixels = cacheCtx.getImageData(0, 0, w, h).data;

    for (let rgbI = 0; rgbI < 4; rgbI++) {
      const ctx = cache[rgbI].getContext("2d");
      if (!ctx) {
        return null;
      }

      const to = ctx.getImageData(0, 0, w, h);
      const data = to.data;
      for (let i = 0; i < pixels.length; i += 4) {
        data[i] = rgbI === 0 ? pixels[i] : 0;
        data[i + 1] = rgbI === 1 ? pixels[i + 1] : 0;
        data[i + 2] = rgbI === 2 ? pixels[i + 2] : 0;
        data[i + 3] = pixels[i + 3];
      }
      ctx.putImageData(to, 0, 0);
    }
    image.onload = null;

    return cache;
  }

  static generateColorTextureMultiply(
    texture: Texture2DInterface,
    r: number,
    g: number,
    b: number,
    rect?: RectLike,
    canvas?: HTMLCanvasElement
  ): Texture2D | HTMLCanvasElement | null {
    let onlyCanvas = false;
    if (canvas) onlyCanvas = true;
    else canvas = document.createElement("canvas");
    const textureImage = texture.htmlElement;
    if (!textureImage) {
      return null;
    }

    if (!rect) rect = new Rect(0, 0, textureImage.width, textureImage.height);

    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }

    context.globalCompositeOperation = "source-over";
    context.fillStyle = "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
    context.fillRect(0, 0, rect.width, rect.height);
    context.globalCompositeOperation = "multiply";
    context.drawImage(
      textureImage,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      0,
      0,
      rect.width,
      rect.height
    );
    context.globalCompositeOperation = "destination-atop";
    context.drawImage(
      textureImage,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      0,
      0,
      rect.width,
      rect.height
    );

    if (onlyCanvas) {
      return canvas;
    }

    const newTexture = new Texture2D();
    newTexture.htmlElement = canvas;
    newTexture.renderer.handleLoadedTexture();
    return newTexture;
  }

  static generateColorTextureFourChannel(
    texture: Texture2DInterface,
    r: number,
    g: number,
    b: number,
    rect?: RectLike,
    canvas?: HTMLCanvasElement
  ): Texture2D | HTMLCanvasElement | null {
    let onlyCanvas = false;
    if (canvas) onlyCanvas = true;
    else canvas = document.createElement("canvas");

    const textureImage = texture.htmlElement;
    if (!textureImage) {
      return null;
    }

    if (!rect) rect = new Rect(0, 0, textureImage.width, textureImage.height);
    const x = rect.x;
    const y = rect.y;
    const w = rect.width;
    const h = rect.height;
    if (!w || !h) return null;

    Size.copy(canvas, rect);

    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }

    const tintedImgCache = ServiceLocator.textureCache.getTextureColors(texture);
    if (!tintedImgCache) {
      return null;
    }

    context.globalCompositeOperation = "lighter";
    context.drawImage(tintedImgCache[3], x, y, w, h, 0, 0, w, h);
    if (r > 0) {
      context.globalAlpha = r / BYTE;
      context.drawImage(tintedImgCache[0], x, y, w, h, 0, 0, w, h);
    }
    if (g > 0) {
      context.globalAlpha = g / BYTE;
      context.drawImage(tintedImgCache[1], x, y, w, h, 0, 0, w, h);
    }
    if (b > 0) {
      context.globalAlpha = b / BYTE;
      context.drawImage(tintedImgCache[2], x, y, w, h, 0, 0, w, h);
    }
    if (onlyCanvas) return canvas;

    const newTexture = new Texture2D();
    newTexture.htmlElement = canvas;
    newTexture.renderer.handleLoadedTexture();
    return newTexture;
  }
}

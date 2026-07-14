import type { PointLike, RectLike, SizeLike } from "../../geometry";
import type { GLState, PIXEL_FORMAT } from "../../enums";
import type { ShaderProgram } from "../../shaders";
import type { EventHelperInterface } from "../../event-manager/event-helper";

export type TextureElement = (HTMLImageElement | HTMLCanvasElement) & SizeLike;

export type Texture2DParameters = {
  minFilter: number;
  magFilter: number;
  wrapS: GLState;
  wrapT: GLState;
}

export type NumericPixelData = ArrayBufferView & {
  readonly length: number;
  [index: number]: number;
};

export type TextureImage = {
  getWidth(): number;
  getHeight(): number;
  getData(): NumericPixelData;
  hasAlpha(): boolean;
  getBitsPerComponent(): number;
  isPremultipliedAlpha(): boolean;
};

export type PixelDataFactory = (
  uiImage: TextureImage,
  width: number,
  height: number,
  hasAlpha: boolean
) => NumericPixelData;

export type TextureParameterKey =
  | "TEXTURE_MIN_FILTER"
  | "TEXTURE_MAG_FILTER"
  | "TEXTURE_WRAP_S"
  | "TEXTURE_WRAP_T";

export type TextureParameterValueKey = "LINEAR" | "CLAMP_TO_EDGE";

export type WebGLPixelFormatKey =
  | "RGBA"
  | "RGB"
  | "LUMINANCE_ALPHA"
  | "ALPHA"
  | "LUMINANCE";

export type WebGLPixelTypeKey =
  | "UNSIGNED_BYTE"
  | "UNSIGNED_SHORT_4_4_4_4"
  | "UNSIGNED_SHORT_5_5_5_1"
  | "UNSIGNED_SHORT_5_6_5";

export type WebGLTextureFilterKey =
  | "LINEAR"
  | "LINEAR_MIPMAP_NEAREST"
  | "NEAREST"
  | "NEAREST_MIPMAP_NEAREST";

export type WebGLPixelFormatMapping = {
  format: WebGLPixelFormatKey;
  type: WebGLPixelTypeKey;
};

export type WebGLTextureFilterMapping = {
  filter: WebGLTextureFilterKey;
  mipmapMinFilter: WebGLTextureFilterKey;
};

export interface Texture2DRendererInterface {
  initWithElement(): void;
  releaseTexture(): void;
  bitsPerPixelForFormat(format?: PIXEL_FORMAT): number;
  handleLoadedTexture(premultiplied?: boolean): void;
  setTexParameters(texParams: Texture2DParameters): void;
  setTexParameters(minFilter: number, magFilter: number, wrapS: GLState, wrapT: GLState): void;
  initWithData(
    data: ArrayBufferView | null,
    pixelFormat: PIXEL_FORMAT,
    pixelsWide: number,
    pixelsHigh: number,
    contentSize: SizeLike
  ): boolean;
  initWithImage(uiImage: unknown): boolean;
  drawAtPoint(point: PointLike): void;
  drawInRect(rect: RectLike): void;
  generateColorTexture(
    r?: number,
    g?: number,
    b?: number,
    rect?: RectLike,
    canvas?: HTMLCanvasElement
  ): Texture2DInterface | HTMLCanvasElement | null;
  generateTextureCacheForColor(): HTMLCanvasElement[] | null;
  generateGrayTexture(): Texture2DInterface | null;

  grayscaled: boolean;
  toString(): string;
  readonly stringForFormat: string;
  webTexture: WebGLTexture | null;
  maxS: number;
  maxT: number;
  readonly pixelFormat: PIXEL_FORMAT;
  readonly hasPremultipliedAlpha: boolean;
  hasMipmaps: boolean;
  aliasing: boolean | null;
  shaderProgram: ShaderProgram | null;
}

export interface Texture2DInterface extends EventHelperInterface {
  contentSize: SizeLike;
  pixelSize: SizeLike;
  htmlElement: TextureElement | null;
  readonly channelCache: HTMLCanvasElement[];
  readonly loaded: boolean;
  readonly renderer: Texture2DRendererInterface;
  readonly pixelsWidth: number;
  readonly pixelsHeight: number;
  readonly width: number;
  readonly height: number;
  readonly rect: RectLike;
  pattern: string;
  url: string | null;

  initWithElement(element: TextureElement | null): boolean;
  releaseElement(): void;
  initWithData(
    data: ArrayBufferView | null,
    pixelFormat: PIXEL_FORMAT,
    pixelsWide: number,
    pixelsHigh: number,
    contentSize: SizeLike
  ): boolean;
  initWithImage(uiImage: unknown): boolean;
  releaseTexture(): void;
  resetSize(clearHtmlObject: boolean): void;
  removeLoadedEventListener(target: unknown): void;
}

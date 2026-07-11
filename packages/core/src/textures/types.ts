import type { PointLike, RectLike, SizeLike } from "../geometry";
import type { GLState, PIXEL_FORMAT } from "../enums";
import type { ShaderProgram } from "../shaders";

export type TextureElement = (HTMLImageElement | HTMLCanvasElement) & SizeLike;

export type Texture2DParameters = {
  minFilter: number;
  magFilter: number;
  wrapS: GLState;
  wrapT: GLState;
}

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
  setAntiAliasTexParameters(): void;
  setAliasTexParameters(): void;
  generateMipmap(): void;
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
  readonly description: string;
  readonly stringForFormat: string;
  webTexture: WebGLTexture | null;
  maxS: number;
  maxT: number;
  readonly pixelFormat: PIXEL_FORMAT;
  readonly hasPremultipliedAlpha: boolean;
  readonly hasMipmaps: boolean;
  shaderProgram: ShaderProgram | null;
}

export interface Texture2DInterface {
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

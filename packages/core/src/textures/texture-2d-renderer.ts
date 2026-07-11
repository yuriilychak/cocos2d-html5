import { GLState, PIXEL_FORMAT } from "../enums";
import { PointLike, RectLike, SizeLike } from "../geometry";
import type { ShaderProgram } from "../shaders/types";
import { Texture2D } from "./texture-2d";
import type {
  Texture2DParameters,
  Texture2DRendererInterface,
  Texture2DInterface
} from "./types";

export default abstract class Texture2DRenderer
  implements Texture2DRendererInterface {
  #texture: Texture2DInterface;
  #shaderProgram: ShaderProgram | null = null;

  protected constructor(texture: Texture2DInterface) {
    this.#texture = texture;
  }

  abstract initWithElement(): void;

  abstract releaseTexture(): void;

  abstract bitsPerPixelForFormat(format?: PIXEL_FORMAT): number;

  abstract handleLoadedTexture(premultiplied?: boolean): void;

  abstract setTexParameters(texParams: Texture2DParameters): void;

  abstract setTexParameters(minFilter: number, magFilter: number, wrapS: GLState, wrapT: GLState): void;

  initWithData(
    data: ArrayBufferView | null,
    pixelFormat: PIXEL_FORMAT,
    pixelsWide: number,
    pixelsHigh: number,
    contentSize: SizeLike
  ): boolean {
    return false;
  }

  initWithImage(uiImage: unknown): boolean {
    return false;
  }

  drawAtPoint(point: PointLike): void {}

  drawInRect(rect: RectLike): void {}

  setAntiAliasTexParameters(): void {}

  setAliasTexParameters(): void {}

  generateMipmap(): void {}

  generateColorTexture(
    r?: number,
    g?: number,
    b?: number,
    rect?: RectLike,
    canvas?: HTMLCanvasElement
  ): Texture2D | HTMLCanvasElement | null {
    return null;
  }

  generateTextureCacheForColor(): HTMLCanvasElement[] | null {
    return null;
  }

  generateGrayTexture(): Texture2D | null {
    return null;
  }

  abstract get grayscaled(): boolean;

  abstract set grayscaled(value: boolean);

  abstract get description(): string;

  abstract get stringForFormat(): string;

  abstract get webTexture(): WebGLTexture | null;
  abstract set webTexture(value: WebGLTexture | null);

  abstract get maxS(): number;
  abstract set maxS(maxS: number);

  abstract get maxT(): number;
  abstract set maxT(maxT: number);

  abstract get pixelFormat(): PIXEL_FORMAT;

  abstract get hasPremultipliedAlpha(): boolean;

  abstract get hasMipmaps(): boolean;

  get shaderProgram(): ShaderProgram | null {
    return this.#shaderProgram;
  }

  set shaderProgram(shaderProgram: ShaderProgram | null) {
    this.#shaderProgram = shaderProgram;
  }

  protected get texture(): Texture2DInterface {
    return this.#texture;
  }
}

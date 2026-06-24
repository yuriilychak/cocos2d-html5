import {
  CONFIG_KEY,
  GLVersion,
  RenderType,
  UserRenderMode
} from "../enums";

import type SysCapabilities from "./sys-capabilities";
import type { RenderContext } from './types';

export class RendererConfig {
  #renderType: RenderType = RenderType.CANVAS;
  #supportRender: boolean = false;
  #renderContext: RenderContext = null;
  #renderer: unknown = null;
  #numberOfDraws: number = 0;
  #glVersion: GLVersion = GLVersion.CANVAS;
  #maxBatchTextures: number = 0;
  #capabilities: SysCapabilities;

  constructor(capabilities: SysCapabilities) {
    this.#capabilities = capabilities;
  }

  public incrementDrawCount(n: number = 1): void {
    this.#numberOfDraws += n;
  }

  public resetDrawCount(): void {
    this.#numberOfDraws = 0;
  }

  public determineRenderType(config: Record<CONFIG_KEY, unknown>): void {
    let mode = parseInt(String(config[CONFIG_KEY.renderMode]), 10);

    const allModes = [
      UserRenderMode.AUTO,
      UserRenderMode.CANVAS,
      UserRenderMode.WEBGL
    ];

    if (!allModes.includes(mode)) {
      mode = UserRenderMode.AUTO;
      config[CONFIG_KEY.renderMode] = UserRenderMode.AUTO;
    }

    switch (mode) {
      case UserRenderMode.AUTO: {
        this.#renderType = this.#capabilities.opengl
          ? RenderType.WEBGL
          : RenderType.CANVAS;
        this.#supportRender =
          this.#capabilities.opengl || this.#capabilities.canvas;
        break;
      }
      case UserRenderMode.CANVAS: {
        this.#renderType = RenderType.CANVAS;
        this.#supportRender = this.#capabilities.canvas;
        break;
      }
      case UserRenderMode.WEBGL: {
        this.#renderType = this.#capabilities.opengl
          ? RenderType.WEBGL
          : RenderType.CANVAS;
        this.#supportRender = this.#capabilities.opengl;
        break;
      }
      default:
        this.#renderType = RenderType.CANVAS;
        this.#supportRender = false;
    }
  }

  public get renderContext(): RenderContext {
    return this.#renderContext;
  }

  public set renderContext(context: RenderContext) {
    if (this.#renderContext !== context) {
      this.#renderContext = context;
      this.#maxBatchTextures = 0;
    }
  }

  public get glVersion(): GLVersion {
    return this.#glVersion;
  }

  public set glVersion(version: GLVersion) {
    this.#glVersion = version;
  }

  /**
   * Number of distinct textures the WebGL2 multi-texture batcher may bind in a
   * single draw call. Resolved lazily from MAX_TEXTURE_IMAGE_UNITS and capped at
   * HARD_MAX_BATCH_TEXTURES. Returns 1 on WebGL1/Canvas (single-texture path).
   */
  public get maxBatchTextures(): number {
    if (this.#maxBatchTextures === 0) {
      if (this.isWebGL2 && this.#renderContext) {
        const units = this.#renderContext.getParameter(this.#renderContext.MAX_TEXTURE_IMAGE_UNITS) || RendererConfig.HARD_MAX_BATCH_TEXTURES;
        this.#maxBatchTextures = Math.max(
          1,
          Math.min(units, RendererConfig.HARD_MAX_BATCH_TEXTURES)
        );
      } else {
        this.#maxBatchTextures = 1;
      }
    }
    return this.#maxBatchTextures;
  }

  public get renderer(): unknown {
    return this.#renderer;
  }

  public set renderer(value: unknown) {
    this.#renderer = value;
  }

  public get drawCount(): number {
    return this.#numberOfDraws;
  }

  public get isWebGL2(): boolean {
    return this.#glVersion === GLVersion.WEBGL2;
  }

  public get isWebGL(): boolean {
    return this.#renderType === RenderType.WEBGL;
  }

  public get isCanvas(): boolean {
    return this.#renderType === RenderType.CANVAS;
  }

  public get supportRenderer(): boolean {
    return this.#supportRender;
  }

  public set supportRenderer(val: boolean) {
    this.#supportRender = val;
  }

  public get renderType(): RenderType {
    return this.#renderType;
  }

  public set renderType(type: RenderType) {
    this.#renderType = type;
  }

  static ENABLE_IMAGE_POOL: boolean = true;

  static HARD_MAX_BATCH_TEXTURES: number = 8;
}

export default RendererConfig;

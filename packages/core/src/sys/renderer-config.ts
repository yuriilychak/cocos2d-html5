import { CONFIG_KEY, GLVersion, RenderType, UserRenderMode } from "../enums";

import type SysCapabilities from "./sys-capabilities";
import type { RenderContext, WebGLContext } from "./types";
import type { PointLike } from "../geometry/types";
import {
  CanvasContextWrapper,
  RendererCanvas,
  RendererWebGL,
  type RendererInterface
} from "./renderer";
import { DrawingPrimitiveCanvas, DrawingPrimitiveWebGL } from "./primitives";

export type RendererConfigRenderContext = NonNullable<RenderContext> &
  WebGLRenderingContext & {
    offset?: PointLike;
  };

export class RendererConfig {
  static readonly #webGLContextNames = [
    "webgl2",
    "webgl",
    "experimental-webgl",
    "webkit-3d",
    "moz-webgl"
  ];

  #renderType: RenderType = RenderType.CANVAS;
  #supportRender: boolean = false;
  #renderContext: RenderContext = null;
  #renderer: RendererInterface | null = null;
  #numberOfDraws: number = 0;
  #glVersion: GLVersion = GLVersion.CANVAS;
  #maxBatchTextures: number = 0;
  #capabilities: SysCapabilities;
  #drawingUtil: DrawingPrimitiveWebGL | DrawingPrimitiveCanvas | null = null;
  #glExtensions: object | null = null;

  constructor(capabilities: SysCapabilities) {
    this.#capabilities = capabilities;
  }

  public static create3DContext(
    canvas: HTMLCanvasElement,
    optAttribs?: WebGLContextAttributes
  ): WebGLContext | null {
    for (let i = 0; i < RendererConfig.#webGLContextNames.length; ++i) {
      try {
        const context = canvas.getContext(
          RendererConfig.#webGLContextNames[i] as any,
          optAttribs
        ) as WebGLContext | null;
        if (context) {
          return context;
        }
      } catch (e) {}
    }
    return null;
  }

  public createContext(element: HTMLCanvasElement) {
    if (!this.isWebGL || !this.#createWebGLContext(element)) {
       this.#createCanvasContext(element);
    }
  }

  #createWebGLContext(element: HTMLCanvasElement): boolean {
    const renderContext = RendererConfig.create3DContext(element, {
      stencil: true,
      alpha: false
    });

    if (renderContext === null) {
      return false;
    }

    this.#renderContext = renderContext;
    //@ts-expect-error TODO deprecated remove when all references will be migrated
    window.gl = this.#renderContext;
    const isWebGL2 =
      typeof WebGL2RenderingContext !== "undefined" &&
      this.#renderContext instanceof WebGL2RenderingContext;
    this.#glVersion = isWebGL2 ? GLVersion.WEBGL2 : GLVersion.WEBGL;
    this.#renderer = new RendererWebGL();
    this.#drawingUtil = new DrawingPrimitiveWebGL(this.#renderContext);

    if (isWebGL2) {
      const context = renderContext as WebGL2RenderingContext;
      this.#glExtensions = {
        instanced_arrays: {
          drawArraysInstancedANGLE: context.drawArraysInstanced.bind(context),
          drawElementsInstancedANGLE:
            context.drawElementsInstanced.bind(context),
          vertexAttribDivisorANGLE: context.vertexAttribDivisor.bind(context)
        },
        vertex_array_object: {
          createVertexArrayOES: context.createVertexArray.bind(context),
          bindVertexArrayOES: context.bindVertexArray.bind(context),
          deleteVertexArrayOES: context.deleteVertexArray.bind(context),
          isVertexArrayOES: context.isVertexArray.bind(context)
        },
        element_uint: { native: true }
      };
    } else {
      this.#glExtensions = {
        instanced_arrays: renderContext.getExtension("ANGLE_instanced_arrays"),
        vertex_array_object: renderContext.getExtension(
          "OES_vertex_array_object"
        ),
        element_uint: renderContext.getExtension("OES_element_index_uint")
      };
    }

    return true;
  }

  #createCanvasContext(element: HTMLCanvasElement): void {
    this.#renderType = RenderType.CANVAS;
    this.#glVersion = GLVersion.CANVAS;
    this.#renderer = new RendererCanvas();
    this.#renderContext = new CanvasContextWrapper(
      element.getContext("2d") as CanvasRenderingContext2D
    ) as RenderContext;

    this.#drawingUtil = new DrawingPrimitiveCanvas(this.#renderContext);
  }

  public incrementDrawCount(n: number = 1): void {
    this.#numberOfDraws += n;
  }

  public resetDrawCount(): void {
    this.#numberOfDraws = 0;
  }

  public get drawingUtil(): DrawingPrimitiveWebGL | DrawingPrimitiveCanvas {
    return this.#drawingUtil!;
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

  public get glExtensions(): object | null {
    return this.#glExtensions;
  }

  public get renderContext(): RendererConfigRenderContext {
    return this.#renderContext as RendererConfigRenderContext;
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
        const units =
          (this.#renderContext as WebGL2RenderingContext).getParameter(
            (this.#renderContext as WebGL2RenderingContext)
              .MAX_TEXTURE_IMAGE_UNITS
          ) || RendererConfig.HARD_MAX_BATCH_TEXTURES;
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

  public get renderer(): RendererInterface {
    return this.#renderer!;
  }

  public set renderer(value: RendererInterface) {
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

import { CONFIG_KEY, GLVersion, RenderType, UserRenderMode } from "../enums";

export class RendererConfig {
  #renderType = RenderType.CANVAS;
  #supportRender = false;
  #renderContext = null;
  #renderer = null;
  #numberOfDraws = 0;
  #glVersion = GLVersion.CANVAS;
  #maxBatchTextures = 0;
  #sys = null;

  injectServices({ sys }) {
    this.#sys = sys;
  }

  incrementDrawCount(n = 1) {
    this.#numberOfDraws += n;
  }

  resetDrawCount() {
    this.#numberOfDraws = 0;
  }

  determineRenderType(config) {
    let mode = parseInt(config[CONFIG_KEY.renderMode], 10);

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
        this.#renderType = this.#sys.capabilities.opengl
          ? RenderType.WEBGL
          : RenderType.CANVAS;
        this.#supportRender =
          this.#sys.capabilities.opengl || this.#sys.capabilities.canvas;
        break;
      }
      case UserRenderMode.CANVAS: {
        this.#renderType = RenderType.CANVAS;
        this.#supportRender = this.#sys.capabilities.canvas;
        break;
      }
      case UserRenderMode.WEBGL: {
        this.#renderType = this.#sys.capabilities.opengl
          ? RenderType.WEBGL
          : RenderType.CANVAS;
        this.#supportRender = this.#sys.capabilities.opengl;
        break;
      }
      default:
        this.#renderType = RenderType.CANVAS;
        this.#supportRender = false;
    }
  }

  get renderContext() {
    return this.#renderContext;
  }

  set renderContext(context) {
    if (this.#renderContext !== context) {
      this.#renderContext = context;
      this.#maxBatchTextures = 0;
    }
  }

  get glVersion() {
    return this.#glVersion;
  }

  set glVersion(version) {
    this.#glVersion = version;
  }

  get isWebGL2() {
    return this.#glVersion === GLVersion.WEBGL2;
  }

  /**
   * Number of distinct textures the WebGL2 multi-texture batcher may bind in a
   * single draw call. Resolved lazily from MAX_TEXTURE_IMAGE_UNITS and capped at
   * HARD_MAX_BATCH_TEXTURES. Returns 1 on WebGL1/Canvas (single-texture path).
   */
  get maxBatchTextures() {
    if (this.#maxBatchTextures === 0) {
      if (this.isWebGL2 && this.#renderContext) {
        const gl = this.#renderContext;
        const units = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) || 8;
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

  get renderer() {
    return this.#renderer;
  }

  set renderer(value) {
    this.#renderer = value;
  }

  get drawCount() {
    return this.#numberOfDraws;
  }

  get isWebGL() {
    return this.#renderType === RenderType.WEBGL;
  }

  get isCanvas() {
    return this.#renderType === RenderType.CANVAS;
  }

  get supportRenderer() {
    return this.#supportRender;
  }

  set supportRenderer(val) {
    this.#supportRender = val;
  }

  get renderType() {
    return this.#renderType;
  }

  set renderType(type) {
    this.#renderType = type;
  }

  static ENABLE_IMAGE_POOL = true;

  static HARD_MAX_BATCH_TEXTURES = 8;
}

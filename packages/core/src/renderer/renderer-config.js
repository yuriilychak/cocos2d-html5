import Game from "../boot/game";
import { RenderType } from "../enums";

export class RendererConfig {
  _renderType = RenderType.CANVAS;
  _supportRender = false;
  _renderContext = null;
  _renderer = null;
  _numberOfDraws = 0;
  _glVersion = "canvas";
  _maxBatchTextures = 0;
  _sys = null;

  injectServices({ sys }) {
    this._sys = sys;
  }

  get renderContext() {
    return this._renderContext;
  }

  initRenderContext(context) {
    this._renderContext = context;
  }

  get glVersion() {
    return this._glVersion;
  }

  setGLVersion(version) {
    this._glVersion = version;
  }

  get isWebGL2() {
    return this._glVersion === "webgl2";
  }

  /**
   * Number of distinct textures the WebGL2 multi-texture batcher may bind in a
   * single draw call. Resolved lazily from MAX_TEXTURE_IMAGE_UNITS and capped at
   * HARD_MAX_BATCH_TEXTURES. Returns 1 on WebGL1/Canvas (single-texture path).
   * @returns {Number}
   */
  getMaxBatchTextures() {
    if (this._maxBatchTextures === 0) {
      if (this.isWebGL2 && this._renderContext) {
        const gl = this._renderContext;
        const units = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) || 8;
        this._maxBatchTextures = Math.max(
          1,
          Math.min(units, RendererConfig.HARD_MAX_BATCH_TEXTURES)
        );
      } else {
        this._maxBatchTextures = 1;
      }
    }
    return this._maxBatchTextures;
  }

  get renderer() {
    return this._renderer;
  }

  setRenderer(renderer) {
    this._renderer = renderer;
  }

  get numberOfDraws() {
    return this._numberOfDraws;
  }

  incrementDrawCount(n) {
    this._numberOfDraws += n === undefined ? 1 : n;
  }

  resetDrawCount() {
    this._numberOfDraws = 0;
  }

  get isWebGL() {
    return this._renderType === RenderType.WEBGL;
  }

  get isCanvas() {
    return this._renderType === RenderType.CANVAS;
  }

  get isSupportRenderer() {
    return this._supportRender;
  }

  setRenderType(type) {
    this._renderType = type;
  }

  setSupportRender(val) {
    this._supportRender = val;
  }

  determineRenderType(config) {
    var CONFIG_KEY = Game.CONFIG_KEY,
      userRenderMode = parseInt(config[CONFIG_KEY.renderMode]) || 0;

    if (isNaN(userRenderMode) || userRenderMode > 2 || userRenderMode < 0)
      config[CONFIG_KEY.renderMode] = 0;

    this._renderType = RenderType.CANVAS;
    this._supportRender = false;

    if (userRenderMode === 0) {
      if (this._sys.capabilities["opengl"]) {
        this._renderType = RenderType.WEBGL;
        this._supportRender = true;
      } else if (this._sys.capabilities["canvas"]) {
        this._renderType = RenderType.CANVAS;
        this._supportRender = true;
      }
    } else if (
      userRenderMode === 1 &&
      this._sys.capabilities["canvas"]
    ) {
      this._renderType = RenderType.CANVAS;
      this._supportRender = true;
    } else if (
      userRenderMode === 2 &&
      this._sys.capabilities["opengl"]
    ) {
      this._renderType = RenderType.WEBGL;
      this._supportRender = true;
    }
  }
  
  static ENABLE_IMAGE_POOL = true;

  static HARD_MAX_BATCH_TEXTURES = 8;
}

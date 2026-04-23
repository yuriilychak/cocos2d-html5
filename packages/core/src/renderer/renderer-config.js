import Game from "../boot/game";
import Sys from "../boot/sys";

export class RendererConfig {
  static _instance = null;

  static getInstance() {
    if (!RendererConfig._instance) {
      RendererConfig._instance = new RendererConfig();
    }
    return RendererConfig._instance;
  }

  _renderType = Game.RENDER_TYPE_CANVAS;
  _supportRender = false;
  _renderContext = null;
  _renderer = null;

  get renderContext() {
    return this._renderContext;
  }

  initRenderContext(context) {
    this._renderContext = context;
  }

  get renderer() {
    return this._renderer;
  }

  setRenderer(renderer) {
    this._renderer = renderer;
  }

  get isWebGL() {
    return this._renderType === Game.RENDER_TYPE_WEBGL;
  }

  get isCanvas() {
    return this._renderType === Game.RENDER_TYPE_CANVAS;
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

    this._renderType = Game.RENDER_TYPE_CANVAS;
    this._supportRender = false;

    if (userRenderMode === 0) {
      if (Sys.getInstance().capabilities["opengl"]) {
        this._renderType = Game.RENDER_TYPE_WEBGL;
        this._supportRender = true;
      } else if (Sys.getInstance().capabilities["canvas"]) {
        this._renderType = Game.RENDER_TYPE_CANVAS;
        this._supportRender = true;
      }
    } else if (
      userRenderMode === 1 &&
      Sys.getInstance().capabilities["canvas"]
    ) {
      this._renderType = Game.RENDER_TYPE_CANVAS;
      this._supportRender = true;
    } else if (
      userRenderMode === 2 &&
      Sys.getInstance().capabilities["opengl"]
    ) {
      this._renderType = Game.RENDER_TYPE_WEBGL;
      this._supportRender = true;
    }
  }
}

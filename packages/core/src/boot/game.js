import { BaseClass } from "../platform/class";
import EventHelper from "../event-manager/event-helper";
import EventCustom from "../event-manager/event/event-custom";
import { DrawingPrimitiveCanvas } from "../drawing-primitives-canvas";
import { DrawingPrimitiveWebGL } from "../drawing-primitives-webgl";
import {
  rendererCanvas,
  CanvasContextWrapper
} from "../renderer/renderer-canvas";
import { rendererWebGL } from "../renderer/renderer-webgl";
import Path from "./path";
import { initDebugSetting, log } from "./debugger";
import { Sys } from "../sys";
import { isUndefined } from "./utils";
import { ENGINE_VERSION } from "../platform/config";
import {
  CONFIG_KEY,
  GLVersion,
  GameEvent,
  RenderType,
  UserRenderMode
} from "../enums";

/**
 * An object to boot the game.
 */
export default class Game extends EventHelper(BaseClass) {
  static _isContextMenuEnable = false;

  _eventHide = null;
  _eventShow = null;

  _director = null;
  _eglView = null;
  _eventManager = null;
  _inputManager = null;
  _loader = null;
  _rendererConfig = null;
  _textureCache = null;

  injectServices({
    director,
    eglView,
    eventManager,
    inputManager,
    loader,
    rendererConfig,
    textureCache
  }) {
    this._director = director;
    this._eglView = eglView;
    this._eventManager = eventManager;
    this._inputManager = inputManager;
    this._loader = loader;
    this._rendererConfig = rendererConfig;
    this._textureCache = textureCache;
  }

  constructor() {
    super();
    this.CONFIG_KEY = CONFIG_KEY;
  }

  // states
  _paused = true;
  _configLoaded = false;
  _engineLoaded = false;
  _prepareCalled = false;
  _prepared = false;
  _rendererInitialized = false;

  _renderContext = null;

  _intervalId = null;

  _lastTime = null;
  _frameTime = null;
  _gameDiv = null;

  /**
   * The outer frame of the game canvas, parent of container
   * @type {Object}
   */
  frame = null;
  /**
   * The container of game canvas, equals to container
   * @type {Object}
   */
  container = null;
  /**
   * The canvas of the game, equals to _canvas
   * @type {Object}
   */
  canvas = null;

  /**
   * Config of game
   * @type {Object}
   */
  config = null;

  /**
   * Callback when the scripts of engine have been load.
   * @type {Function|null}
   */
  onStart = null;

  audioEngine = null;

  /**
   * Callback when game exits.
   * @type {Function|null}
   */
  onStop = null;

  drawingUtil = null;

  glExt = null;

  /**
   * Set frameRate of game.
   * @param frameRate
   */
  setFrameRate(frameRate) {
    var config = this.config;
    config[CONFIG_KEY.frameRate] = frameRate;
    if (this._intervalId) window.cancelAnimationFrame(this._intervalId);
    this._intervalId = 0;
    this._paused = true;
    this._setAnimFrame();
    this._runMainLoop();
  }

  /**
   * Run the game frame by frame.
   */
  step() {
    this._director.mainLoop();
  }

  /**
   * Pause the game.
   */
  pause() {
    if (this._paused) return;
    this._paused = true;
    if (this.audioEngine) {
      this.audioEngine._pausePlaying();
    }
    if (this._intervalId) window.cancelAnimationFrame(this._intervalId);
    this._intervalId = 0;
  }

  /**
   * Resume the game from pause.
   */
  resume() {
    if (!this._paused) return;
    this._paused = false;
    if (this.audioEngine) {
      this.audioEngine._resumePlaying();
    }
    this._runMainLoop();
  }

  /**
   * Check whether the game is paused.
   */
  isPaused() {
    return this._paused;
  }

  /**
   * Restart game.
   */
  restart() {
    this._director.popToSceneStackLevel(0);
    this.audioEngine && this.audioEngine.end();
    this.onStart();
  }

  /**
   * End game, it will close the game window
   */
  end() {
    close();
  }

  /**
   * Prepare game.
   * @param cb
   */
  prepare(cb) {
    var config = this.config;

    if (!this._configLoaded) {
      this._loadConfig(() => {
        this.prepare(cb);
      });
      return;
    }

    if (this._prepared) {
      if (cb) cb();
      return;
    }
    if (this._prepareCalled) {
      return;
    }
    if (this._engineLoaded) {
      this._prepareCalled = true;

      this._initRenderer(config[CONFIG_KEY.width], config[CONFIG_KEY.height]);

      // eglView is wired lazily; initialize it now that the renderer (and thus
      // game.container/canvas) is ready.
      this._eglView.initialize();
      // Director is created lazily; this is its first access, so initialize it here.
      const director = this._director;
      director.init();
      if (director.setOpenGLView) director.setOpenGLView(this._eglView);

      this._initEvents();

      this._setAnimFrame();
      this._runMainLoop();

      var jsList = config[CONFIG_KEY.jsList];
      if (jsList) {
        this._loader.loadJsWithImg(jsList, (err) => {
          if (err) throw new Error(err);
          this._prepared = true;
          if (cb) cb();
        });
      } else {
        if (cb) cb();
      }

      return;
    }

    this._initEngine();
    this.prepare(cb);
  }

  /**
   * Run game with configuration object and onStart function.
   * @param {Object|Function} [config] Pass configuration object or onStart function
   * @param {onStart} [onStart] onStart function to be executed after game initialized
   */
  run(config, onStart) {
    if (typeof config === "function") {
      this.onStart = config;
    } else {
      if (config) {
        if (typeof config === "string") {
          if (!this.config) this._loadConfig();
          this.config[CONFIG_KEY.id] = config;
        } else {
          this.config = config;
        }
      }
      if (typeof onStart === "function") {
        this.onStart = onStart;
      }
    }

    this.prepare(this.onStart && this.onStart.bind(this));
  }

  _initEngine() {
    this._rendererConfig.determineRenderType(this.config);
    initDebugSetting(this.config[CONFIG_KEY.debugMode]);
    this._engineLoaded = true;
    console.log(ENGINE_VERSION);
  }

  _setAnimFrame() {
    this._lastTime = new Date();
    var frameRate = this.config[CONFIG_KEY.frameRate];
    this._frameTime = 1000 / frameRate;
    if (frameRate !== 60 && frameRate !== 30) {
      window.requestAnimFrame = this._stTime;
      window.cancelAnimationFrame = this._ctTime;
    } else {
      window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        this._stTime;
      window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.cancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        this._ctTime;
    }
  }

  _stTime = (callback) => {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, this._frameTime - (currTime - this._lastTime));
    var id = window.setTimeout(() => {
      callback();
    }, timeToCall);
    this._lastTime = currTime + timeToCall;
    return id;
  };

  _ctTime = (id) => {
    window.clearTimeout(id);
  };

  _runMainLoop() {
    var config = this.config,
      director = this._director,
      skip = true,
      frameRate = config[CONFIG_KEY.frameRate];

    director.setDisplayStats(config[CONFIG_KEY.showFPS]);

    var callback = () => {
      if (!this._paused) {
        if (frameRate === 30) {
          if ((skip = !skip)) {
            this._intervalId = window.requestAnimFrame(callback);
            return;
          }
        }

        director.mainLoop();
        this._intervalId = window.requestAnimFrame(callback);
      }
    };

    this._intervalId = window.requestAnimFrame(callback);
    this._paused = false;
  }

  _loadConfig(cb) {
    var config = this.config || document["ccConfig"];
    if (config) {
      this._initConfig(config);
      cb && cb();
    } else {
      var cocos_script = document.getElementsByTagName("script");
      for (var i = 0; i < cocos_script.length; i++) {
        var _t = cocos_script[i].getAttribute("cocos");
        if (_t === "" || _t) {
          break;
        }
      }
      var loaded = (err, txt) => {
        var data = JSON.parse(txt);
        this._initConfig(data);
        cb && cb();
      };
      var _src, txt, _resPath;
      if (i < cocos_script.length) {
        _src = cocos_script[i].src;
        if (_src) {
          _resPath = /(.*)\//.exec(_src)[0];
          this._loader.resPath = _resPath;
          _src = Path.join(_resPath, "project.json");
        }
        this._loader.loadTxt(_src, loaded);
      }
      if (!txt) {
        this._loader.loadTxt("project.json", loaded);
      }
    }
  }

  _initConfig(config) {
    var modules = config[CONFIG_KEY.modules];

    config[CONFIG_KEY.showFPS] =
      typeof config[CONFIG_KEY.showFPS] === "undefined"
        ? true
        : config[CONFIG_KEY.showFPS];
    config[CONFIG_KEY.engineDir] =
      config[CONFIG_KEY.engineDir] || "frameworks/cocos2d-html5";
    if (config[CONFIG_KEY.debugMode] == null) config[CONFIG_KEY.debugMode] = 0;
    config[CONFIG_KEY.exposeClassName] = !!config[CONFIG_KEY.exposeClassName];
    config[CONFIG_KEY.frameRate] = config[CONFIG_KEY.frameRate] || 60;
    if (config[CONFIG_KEY.renderMode] == null)
      config[CONFIG_KEY.renderMode] = UserRenderMode.AUTO;
    if (config[CONFIG_KEY.registerSystemEvent] == null)
      config[CONFIG_KEY.registerSystemEvent] = true;

    if (modules && modules.indexOf("core") < 0) modules.splice(0, 0, "core");
    modules && (config[CONFIG_KEY.modules] = modules);
    this.config = config;
    this._configLoaded = true;
  }

  _initRenderer(width, height) {
    if (this._rendererInitialized) return;

    if (!this._rendererConfig.supportRenderer) {
      throw new Error(
        "The renderer doesn't support the renderMode " +
          this.config[CONFIG_KEY.renderMode]
      );
    }

    var el = this.config[CONFIG_KEY.id],
      win = window,
      element = document.getElementById(el),
      localCanvas,
      localContainer,
      localConStyle;

    if (element.tagName === "CANVAS") {
      width = width || element.width;
      height = height || element.height;

      this.canvas = localCanvas = element;
      this.container =
        localContainer =
          document.createElement("DIV");
      if (localCanvas.parentNode)
        localCanvas.parentNode.insertBefore(localContainer, localCanvas);
    } else {
      if (element.tagName !== "DIV") {
        log("Warning: target element is not a DIV or CANVAS");
      }
      width = width || element.clientWidth;
      height = height || element.clientHeight;
      this.canvas = localCanvas = document.createElement("CANVAS");
      this.container =
        localContainer =
          document.createElement("DIV");
      element.appendChild(localContainer);
    }
    localContainer.setAttribute("id", "Cocos2dGameContainer");
    localContainer.appendChild(localCanvas);
    this.frame =
      localContainer.parentNode === document.body
        ? document.documentElement
        : localContainer.parentNode;

    localCanvas.classList.add("gameCanvas");
    localCanvas.setAttribute("width", width || 480);
    localCanvas.setAttribute("height", height || 320);
    localCanvas.setAttribute("tabindex", 99);

    if (this._rendererConfig.isWebGL) {
      this._renderContext = Sys.create3DContext(localCanvas, {
        stencil: true,
        alpha: false
      });
      this._rendererConfig.renderContext = this._renderContext;
    }
    if (this._renderContext) {
      win.gl = this._renderContext;
      const gl = this._renderContext;
      const isWebGL2 =
        typeof WebGL2RenderingContext !== "undefined" &&
        gl instanceof WebGL2RenderingContext;
      this._rendererConfig.glVersion = isWebGL2
        ? GLVersion.WEBGL2
        : GLVersion.WEBGL;
      this._rendererConfig.renderer = rendererWebGL;
      this._rendererConfig.renderer.init();
      this.drawingUtil = new DrawingPrimitiveWebGL(this._renderContext);
      this.glExt = isWebGL2
        ? {
            instanced_arrays: {
              drawArraysInstancedANGLE: gl.drawArraysInstanced.bind(gl),
              drawElementsInstancedANGLE: gl.drawElementsInstanced.bind(gl),
              vertexAttribDivisorANGLE: gl.vertexAttribDivisor.bind(gl)
            },
            vertex_array_object: {
              createVertexArrayOES: gl.createVertexArray.bind(gl),
              bindVertexArrayOES: gl.bindVertexArray.bind(gl),
              deleteVertexArrayOES: gl.deleteVertexArray.bind(gl),
              isVertexArrayOES: gl.isVertexArray.bind(gl)
            },
            element_uint: { native: true }
          }
        : {
            instanced_arrays: gl.getExtension("ANGLE_instanced_arrays"),
            vertex_array_object: gl.getExtension("OES_vertex_array_object"),
            element_uint: gl.getExtension("OES_element_index_uint")
          };
    } else {
      this._rendererConfig.renderType = RenderType.CANVAS;
      this._rendererConfig.glVersion = GLVersion.CANVAS;
      this._rendererConfig.renderer = rendererCanvas;
      this._renderContext = new CanvasContextWrapper(
        localCanvas.getContext("2d")
      );
      this._rendererConfig.renderContext = this._renderContext;
      this.drawingUtil = DrawingPrimitiveCanvas
        ? new DrawingPrimitiveCanvas(this._renderContext)
        : null;
    }

    this._gameDiv = localContainer;
    this.canvas.oncontextmenu = function () {
      if (!Game._isContextMenuEnable) return false;
    };

    this.dispatchEvent(GameEvent.RENDERER_INITED, true);

    this._rendererInitialized = true;

    // Initialize TextureCache renderer after renderer type is determined
    this._textureCache.initRenderer();
  }

  _initEvents() {
    var win = window,
      hidden;

    this._eventHide = this._eventHide || new EventCustom(GameEvent.HIDE);
    this._eventHide.userData = this;
    this._eventShow = this._eventShow || new EventCustom(GameEvent.SHOW);
    this._eventShow.userData = this;

    if (this.config[CONFIG_KEY.registerSystemEvent])
      this._inputManager.registerSystemEvent(this.canvas);

    if (!isUndefined(document.hidden)) {
      hidden = "hidden";
    } else if (!isUndefined(document.mozHidden)) {
      hidden = "mozHidden";
    } else if (!isUndefined(document.msHidden)) {
      hidden = "msHidden";
    } else if (!isUndefined(document.webkitHidden)) {
      hidden = "webkitHidden";
    }

    var changeList = [
      "visibilitychange",
      "mozvisibilitychange",
      "msvisibilitychange",
      "webkitvisibilitychange",
      "qbrowserVisibilityChange"
    ];
    var onHidden = () => {
      if (this._eventManager && this._eventHide)
        this._eventManager.dispatchEvent(this._eventHide);
    };
    var onShow = () => {
      if (this._eventManager && this._eventShow)
        this._eventManager.dispatchEvent(this._eventShow);
    };

    if (hidden) {
      for (var i = 0; i < changeList.length; i++) {
        document.addEventListener(
          changeList[i],
          (event) => {
            var visible = document[hidden];
            visible = visible || event["hidden"];
            if (visible) onHidden();
            else onShow();
          },
          false
        );
      }
    } else {
      win.addEventListener("blur", onHidden, false);
      win.addEventListener("focus", onShow, false);
    }

    if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
      win.onfocus = () => {
        onShow();
      };
    }

    if ("onpageshow" in window && "onpagehide" in window) {
      win.addEventListener("pagehide", onHidden, false);
      win.addEventListener("pageshow", onShow, false);
    }

    this._eventManager.addCustomListener(GameEvent.HIDE, () => {
      this.pause();
    });
    this._eventManager.addCustomListener(GameEvent.SHOW, () => {
      this.resume();
    });
  }
}

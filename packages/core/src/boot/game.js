import { Director } from "../director/director";
import { NewClass } from "../platform/class";
import EventHelper from "../event-manager/event-helper";
import EventManager from "../event-manager/event-manager";
import Loader from "./loader";
import Path from "./path";

/**
 * An object to boot the game.
 */
export default class Game extends EventHelper(NewClass) {
  static _instance = null;

  /**
   * @returns {Game}
   */
  static getInstance() {
    if (!Game._instance) {
      Game._instance = new Game();
    }
    return Game._instance;
  }

  static DEBUG_MODE_NONE = 0;
  static DEBUG_MODE_INFO = 1;
  static DEBUG_MODE_WARN = 2;
  static DEBUG_MODE_ERROR = 3;
  static DEBUG_MODE_INFO_FOR_WEB_PAGE = 4;
  static DEBUG_MODE_WARN_FOR_WEB_PAGE = 5;
  static DEBUG_MODE_ERROR_FOR_WEB_PAGE = 6;

  static EVENT_HIDE = "game_on_hide";
  static EVENT_SHOW = "game_on_show";
  static EVENT_RESIZE = "game_on_resize";
  static EVENT_RENDERER_INITED = "renderer_inited";

  static RENDER_TYPE_CANVAS = 0;
  static RENDER_TYPE_WEBGL = 1;
  static RENDER_TYPE_OPENGL = 2;

  static CONFIG_KEY = {
    width: "width",
    height: "height",
    engineDir: "engineDir",
    modules: "modules",
    debugMode: "debugMode",
    exposeClassName: "exposeClassName",
    showFPS: "showFPS",
    frameRate: "frameRate",
    id: "id",
    renderMode: "renderMode",
    jsList: "jsList"
  };

  _eventHide = null;
  _eventShow = null;

  constructor() {
    super();
    // Copy static constants to instance for backward compatibility (cc.game.RENDER_TYPE_WEBGL etc.)
    this.DEBUG_MODE_NONE = Game.DEBUG_MODE_NONE;
    this.DEBUG_MODE_INFO = Game.DEBUG_MODE_INFO;
    this.DEBUG_MODE_WARN = Game.DEBUG_MODE_WARN;
    this.DEBUG_MODE_ERROR = Game.DEBUG_MODE_ERROR;
    this.DEBUG_MODE_INFO_FOR_WEB_PAGE = Game.DEBUG_MODE_INFO_FOR_WEB_PAGE;
    this.DEBUG_MODE_WARN_FOR_WEB_PAGE = Game.DEBUG_MODE_WARN_FOR_WEB_PAGE;
    this.DEBUG_MODE_ERROR_FOR_WEB_PAGE = Game.DEBUG_MODE_ERROR_FOR_WEB_PAGE;
    this.EVENT_HIDE = Game.EVENT_HIDE;
    this.EVENT_SHOW = Game.EVENT_SHOW;
    this.EVENT_RESIZE = Game.EVENT_RESIZE;
    this.EVENT_RENDERER_INITED = Game.EVENT_RENDERER_INITED;
    this.RENDER_TYPE_CANVAS = Game.RENDER_TYPE_CANVAS;
    this.RENDER_TYPE_WEBGL = Game.RENDER_TYPE_WEBGL;
    this.RENDER_TYPE_OPENGL = Game.RENDER_TYPE_OPENGL;
    this.CONFIG_KEY = Game.CONFIG_KEY;
  }

  // states
  _paused = true;
  _configLoaded = false;
  _prepareCalled = false;
  _prepared = false;
  _rendererInitialized = false;

  _renderContext = null;

  _intervalId = null;

  _lastTime = null;
  _frameTime = null;

  /**
   * The outer frame of the game canvas, parent of cc.container
   * @type {Object}
   */
  frame = null;
  /**
   * The container of game canvas, equals to cc.container
   * @type {Object}
   */
  container = null;
  /**
   * The canvas of the game, equals to cc._canvas
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

  /**
   * Callback when game exits.
   * @type {Function|null}
   */
  onStop = null;

  /**
   * Set frameRate of game.
   * @param frameRate
   */
  setFrameRate(frameRate) {
    var config = this.config,
      CONFIG_KEY = Game.CONFIG_KEY;
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
    cc.director.mainLoop();
  }

  /**
   * Pause the game.
   */
  pause() {
    if (this._paused) return;
    this._paused = true;
    if (cc.audioEngine) {
      cc.audioEngine._pausePlaying();
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
    if (cc.audioEngine) {
      cc.audioEngine._resumePlaying();
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
    cc.director.popToSceneStackLevel(0);
    cc.audioEngine && cc.audioEngine.end();
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
    var config = this.config,
      CONFIG_KEY = Game.CONFIG_KEY;

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
    if (cc._engineLoaded) {
      this._prepareCalled = true;

      this._initRenderer(config[CONFIG_KEY.width], config[CONFIG_KEY.height]);

      cc.view = cc.EGLView._getInstance();
      cc.director = Director.getInstance();
      if (cc.director.setOpenGLView) cc.director.setOpenGLView(cc.view);
      cc.winSize = cc.director.getWinSize();

      this._initEvents();

      this._setAnimFrame();
      this._runMainLoop();

      var jsList = config[CONFIG_KEY.jsList];
      if (jsList) {
        Loader.getInstance().loadJsWithImg(jsList, (err) => {
          if (err) throw new Error(err);
          this._prepared = true;
          if (cb) cb();
        });
      } else {
        if (cb) cb();
      }

      return;
    }

    cc.initEngine(this.config, () => {
      this.prepare(cb);
    });
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
          this.config[Game.CONFIG_KEY.id] = config;
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

  _setAnimFrame() {
    this._lastTime = new Date();
    var frameRate = this.config[Game.CONFIG_KEY.frameRate];
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
      CONFIG_KEY = Game.CONFIG_KEY,
      director = cc.director,
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
          Loader.getInstance().resPath = _resPath;
          _src = Path.join(_resPath, "project.json");
        }
        Loader.getInstance().loadTxt(_src, loaded);
      }
      if (!txt) {
        Loader.getInstance().loadTxt("project.json", loaded);
      }
    }
  }

  _initConfig(config) {
    var CONFIG_KEY = Game.CONFIG_KEY,
      modules = config[CONFIG_KEY.modules];

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
      config[CONFIG_KEY.renderMode] = 0;
    if (config[CONFIG_KEY.registerSystemEvent] == null)
      config[CONFIG_KEY.registerSystemEvent] = true;

    if (modules && modules.indexOf("core") < 0) modules.splice(0, 0, "core");
    modules && (config[CONFIG_KEY.modules] = modules);
    this.config = config;
    this._configLoaded = true;
  }

  _initRenderer(width, height) {
    if (this._rendererInitialized) return;

    if (!cc._supportRender) {
      throw new Error(
        "The renderer doesn't support the renderMode " +
          this.config[Game.CONFIG_KEY.renderMode]
      );
    }

    var el = this.config[Game.CONFIG_KEY.id],
      win = window,
      element = document.getElementById(el),
      localCanvas,
      localContainer,
      localConStyle;

    if (element.tagName === "CANVAS") {
      width = width || element.width;
      height = height || element.height;

      this.canvas = cc._canvas = localCanvas = element;
      this.container =
        cc.container =
        localContainer =
          document.createElement("DIV");
      if (localCanvas.parentNode)
        localCanvas.parentNode.insertBefore(localContainer, localCanvas);
    } else {
      if (element.tagName !== "DIV") {
        cc.log("Warning: target element is not a DIV or CANVAS");
      }
      width = width || element.clientWidth;
      height = height || element.clientHeight;
      this.canvas = cc._canvas = localCanvas = document.createElement("CANVAS");
      this.container =
        cc.container =
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

    if (cc._renderType === Game.RENDER_TYPE_WEBGL) {
      this._renderContext =
        cc._renderContext =
        cc.webglContext =
          cc.create3DContext(localCanvas, {
            stencil: true,
            alpha: false
          });
    }
    if (this._renderContext) {
      cc.renderer = cc.rendererWebGL;
      win.gl = this._renderContext;
      cc.renderer.init();
      cc._drawingUtil = new cc.DrawingPrimitiveWebGL(this._renderContext);
      cc.textureCache._initializingRenderer();
      cc.glExt = {};
      cc.glExt.instanced_arrays = win.gl.getExtension("ANGLE_instanced_arrays");
      cc.glExt.element_uint = win.gl.getExtension("OES_element_index_uint");
    } else {
      cc._renderType = Game.RENDER_TYPE_CANVAS;
      cc.renderer = cc.rendererCanvas;
      this._renderContext = cc._renderContext = new cc.CanvasContextWrapper(
        localCanvas.getContext("2d")
      );
      cc._drawingUtil = cc.DrawingPrimitiveCanvas
        ? new cc.DrawingPrimitiveCanvas(this._renderContext)
        : null;
    }

    cc._gameDiv = localContainer;
    this.canvas.oncontextmenu = function () {
      if (!cc._isContextMenuEnable) return false;
    };

    this.dispatchEvent(Game.EVENT_RENDERER_INITED, true);

    this._rendererInitialized = true;
  }

  _initEvents() {
    var win = window,
      hidden;

    this._eventHide = this._eventHide || new cc.EventCustom(Game.EVENT_HIDE);
    this._eventHide.setUserData(this);
    this._eventShow = this._eventShow || new cc.EventCustom(Game.EVENT_SHOW);
    this._eventShow.setUserData(this);

    if (this.config[Game.CONFIG_KEY.registerSystemEvent])
      cc.inputManager.registerSystemEvent(this.canvas);

    if (!cc.isUndefined(document.hidden)) {
      hidden = "hidden";
    } else if (!cc.isUndefined(document.mozHidden)) {
      hidden = "mozHidden";
    } else if (!cc.isUndefined(document.msHidden)) {
      hidden = "msHidden";
    } else if (!cc.isUndefined(document.webkitHidden)) {
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
      if (EventManager.getInstance() && this._eventHide)
        EventManager.getInstance().dispatchEvent(this._eventHide);
    };
    var onShow = () => {
      if (EventManager.getInstance() && this._eventShow)
        EventManager.getInstance().dispatchEvent(this._eventShow);
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

    EventManager.getInstance().addCustomListener(Game.EVENT_HIDE, () => {
      this.pause();
    });
    EventManager.getInstance().addCustomListener(Game.EVENT_SHOW, () => {
      this.resume();
    });
  }
}

import { BaseClass, ENGINE_VERSION } from "../platform";
import { EventHelper, EventCustom } from "../event-manager";
import { ServiceLocator } from "../service-locator";
import { initDebugSetting, log, Path, isUndefined } from "../boot";
import { Sys, RendererConfig } from "../sys";
import {
  CONFIG_KEY,
  GLVersion,
  GameEvent,
  UserRenderMode
} from "../enums";

/**
 * An object to boot the game.
 */
export default class Game extends EventHelper(BaseClass) {
  #eventHide = null;
  #eventShow = null;
  // states
  #paused = true;
  #configLoaded = false;
  #engineLoaded = false;
  #prepareCalled = false;
  #prepared = false;
  rendererInitialized = false;
  #intervalId = null;
  #lastTime = null;
  #frameTime = null;
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

  #director;
  #eglView;
  #eventManager;
  #inputManager;
  #loader;
  #sys;
  #textureCache;

  constructor(sys, loader, eglView, director, eventManager, inputManager, textureCache) {
    super();
    this.#sys = sys;
    this.#loader = loader;
    this.#eglView = eglView;
    this.#director = director;
    this.#eventManager = eventManager;
    this.#inputManager = inputManager;
    this.#textureCache = textureCache;
  }

  /**
   * Set frameRate of game.
   * @param frameRate
   */
  setFrameRate(frameRate) {
    var config = this.config;
    config[CONFIG_KEY.frameRate] = frameRate;
    if (this.#intervalId) window.cancelAnimationFrame(this.#intervalId);
    this.#intervalId = 0;
    this.#paused = true;
    this.#setAnimFrame();
    this.#runMainLoop();
  }

  /**
   * Run the game frame by frame.
   */
  step() {
    this.#director.mainLoop(this.config[CONFIG_KEY.debugMode]);
  }

  /**
   * Pause the game.
   */
  pause() {
    if (this.#paused) return;
    this.#paused = true;
    if (this.audioEngine) {
      this.audioEngine._pausePlaying();
    }
    if (this.#intervalId) window.cancelAnimationFrame(this.#intervalId);
    this.#intervalId = 0;
  }

  /**
   * Resume the game from pause.
   */
  resume() {
    if (!this.#paused) return;
    this.#paused = false;
    if (this.audioEngine) {
      this.audioEngine._resumePlaying();
    }
    this.#runMainLoop();
  }

  /**
   * Check whether the game is paused.
   */
  isPaused() {
    return this.#paused;
  }

  /**
   * Restart game.
   */
  restart() {
    this.#director.popToSceneStackLevel(0);
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

    if (!this.#configLoaded) {
      this.#loadConfig(() => {
        this.prepare(cb);
      });
      return;
    }

    if (this.#prepared) {
      if (cb) cb();
      return;
    }
    if (this.#prepareCalled) {
      return;
    }
    if (this.#engineLoaded) {
      this.#prepareCalled = true;

      this.#initRenderer();

      // Director is created lazily; this is its first access, so initialize it here.
      this.#director.init();
      this.#eglView.postInit();

      this.#initEvents();

      this.#setAnimFrame();
      this.#runMainLoop();

      var jsList = config[CONFIG_KEY.jsList];
      if (jsList) {
        this.#loader.loadJsWithImg(jsList, (err) => {
          if (err) throw new Error(err);
          this.#prepared = true;
          if (cb) cb();
        });
      } else {
        if (cb) cb();
      }

      return;
    }

    this.#initEngine();
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
          if (!this.config) this.#loadConfig();
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

  #initEngine() {
    this.#sys.rendererConfig.determineRenderType(this.config);
    initDebugSetting(this.config[CONFIG_KEY.debugMode]);
    this.#engineLoaded = true;
    console.log(ENGINE_VERSION);
  }

  #setAnimFrame() {
    this.#lastTime = new Date();
    var frameRate = this.config[CONFIG_KEY.frameRate];
    this.#frameTime = 1000 / frameRate;
    if (frameRate !== 60 && frameRate !== 30) {
      window.requestAnimFrame = this.#stTime;
      window.cancelAnimationFrame = this.#ctTime;
    } else {
      window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        this.#stTime;
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
        this.#ctTime;
    }
  }

  #stTime = (callback) => {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, this.#frameTime - (currTime - this.#lastTime));
    var id = window.setTimeout(() => {
      callback();
    }, timeToCall);
    this.#lastTime = currTime + timeToCall;
    return id;
  };

  #ctTime = (id) => {
    window.clearTimeout(id);
  };

  #runMainLoop() {
    var skip = true,
      frameRate = this.config[CONFIG_KEY.frameRate];

    ServiceLocator.profiler.statsShowing = this.config[CONFIG_KEY.showFPS];

    var callback = () => {
      if (!this.#paused) {
        if (frameRate === 30) {
          if ((skip = !skip)) {
            this.#intervalId = window.requestAnimFrame(callback);
            return;
          }
        }

        this.#director.mainLoop(this.config[CONFIG_KEY.debugMode]);
        this.#intervalId = window.requestAnimFrame(callback);
      }
    };

    this.#intervalId = window.requestAnimFrame(callback);
    this.#paused = false;
  }

  #loadConfig(cb) {
    var config = this.config || document["ccConfig"];
    if (config) {
      this.#initConfig(config);
      this.#loader.setNoCache(!!this.config["noCache"]);
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
        this.#initConfig(data);
        this.#loader.setNoCache(!!this.config["noCache"]);
        cb && cb();
      };
      var _src, txt;
      if (i < cocos_script.length) {
        _src = cocos_script[i].src;
        if (_src) {
          const _resPath = /(.*)\//.exec(_src)[0];
          this.#loader.resPath = _resPath;
          _src = Path.join(_resPath, "project.json");
        }
        this.#loader.loadTxt(_src, loaded);
      }
      if (!txt) {
        this.#loader.loadTxt("project.json", loaded);
      }
    }
  }

  onHidden() {
    if (this.#eventManager && this.#eventHide)
      this.#eventManager.dispatchEvent(this.#eventHide);
  }

  onShow() {
    if (this.#eventManager && this.#eventShow)
      this.#eventManager.dispatchEvent(this.#eventShow);
  }

  #initConfig(config) {
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
    this.#configLoaded = true;
  }

  #initRenderer() {
    if (this.rendererInitialized) {
      return;
    }

    if (!this.#sys.rendererConfig.supportRenderer) {
      throw new Error(
        "The renderer doesn't support the renderMode " +
          this.config[CONFIG_KEY.renderMode]
      );
    }

    // eglView is wired lazily; initialize it now that the renderer.
    this.#eglView.initialize(
      this.config[CONFIG_KEY.id],
      this.config[CONFIG_KEY.width],
      this.config[CONFIG_KEY.height]
    );
    this.#sys.rendererConfig.createContext(this.#eglView.canvas);

    this.dispatchEvent(GameEvent.RENDERER_INITED, true);

    this.rendererInitialized = true;

    // Initialize TextureCache renderer after renderer type is determined
    this.#textureCache.initRenderer();
  }

  #initEvents() {
    let hidden = "";

    this.#eventHide = this.#eventHide || new EventCustom(GameEvent.HIDE, this);
    this.#eventShow = this.#eventShow || new EventCustom(GameEvent.SHOW, this);

    if (this.config[CONFIG_KEY.registerSystemEvent])
      this.#inputManager.registerSystemEvent();

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

    if (hidden) {
      for (var i = 0; i < changeList.length; i++) {
        document.addEventListener(
          changeList[i],
          (event) => {
            var visible = document[hidden];
            visible = visible || event["hidden"];
            if (visible) this.onHidden();
            else this.onShow();
          },
          false
        );
      }
    } else {
      window.addEventListener("blur", this.onHidden.bind(this), false);
      window.addEventListener("focus", this.onShow.bind(this), false);
    }

    if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
      window.onfocus = this.onShow.bind(this);
    }

    if ("onpageshow" in window && "onpagehide" in window) {
      window.addEventListener("pagehide", this.onHidden.bind(this), false);
      window.addEventListener("pageshow", this.onShow.bind(this), false);
    }

    this.#eventManager.addCustomListener(GameEvent.HIDE, this.pause.bind(this));
    this.#eventManager.addCustomListener(
      GameEvent.SHOW,
      this.resume.bind(this)
    );
  }
}

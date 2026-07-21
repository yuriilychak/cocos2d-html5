import { BaseClass, ENGINE_VERSION } from "../platform";
import { EventHelper, EventCustom } from "../event-manager";
import { ServiceLocator } from "../service-locator";
import { initDebugSetting, log, Path } from "../boot";
import { Sys, RendererConfig } from "../sys";
import { CONFIG_KEY, GLVersion, GameEvent, UserRenderMode } from "../enums";

/**
 * An object to boot the game.
 */
export default class Game extends EventHelper(BaseClass) {
  // states
  #paused = true;
  #initialized = false;
  #intervalId = null;
  #lastTime = 0;
  #frameTime = 0;
  #frameRate = 60;
  #debugMode = 0;
  #showFPS = false;
  #requestAnimFrame = null;
  #cancelAnimFrame = null;
  /**
   * Config of game
   * @type {Object}
   */
  #config = null;

  /**
   * Callback when the scripts of engine have been load.
   * @type {Function|null}
   */
  #onStart = null;

  audioEngine = null;

  /**
   * Callback when game exits.
   * @type {Function|null}
   */
  #onStop = null;

  #director;
  #eglView;
  #eventManager;
  #inputManager;
  #loader;
  #sys;
  #textureCache;

  #eventHide;
  #eventShow;

  constructor(
    sys,
    loader,
    eglView,
    director,
    eventManager,
    inputManager,
    textureCache
  ) {
    super();
    this.#sys = sys;
    this.#loader = loader;
    this.#eglView = eglView;
    this.#director = director;
    this.#eventManager = eventManager;
    this.#inputManager = inputManager;
    this.#textureCache = textureCache;
    this.#eventHide = new EventCustom(GameEvent.HIDE, this);
    this.#eventShow = new EventCustom(GameEvent.SHOW, this);
  }

  /**
   * Restart game.
   */
  restart() {
    this.#director.popToSceneStackLevel(0);
    this.audioEngine && this.audioEngine.end();
    this.#handleStart();
  }

  /**
   * Close the game window.
   */
  close() {
    if (this.#onStop) {
      this.#onStop();
    }
    close();
  }

  /**
   * Run game with configuration object and onStart function.
   * @param {Object} [config] Pass configuration object or onStart function
   * @param {onStart} [onStart] onStart function to be executed after game initialized
   */
  run(config, onStart = null, onStop = null) {
    if (this.#initialized) {
      return;
    }

    this.#initialized = true;
    this.#initConfig(config);
    this.#initEngine();
    this.#initRenderer();
    // Director is created lazily; this is its first access, so initialize it here.
    this.#director.init();

    this.#initEvents();
    this.showFPS = this.#showFPS;
    this.#setAnimFrame();
    this.#runMainLoop();

    if (onStart) this.#onStart = onStart;
    if (onStop) this.#onStop = onStop;

    this.#handleStart();
  }

  /**
   * Run the game frame by frame.
   */
  step() {
    this.#director.mainLoop(this.#debugMode);
  }

  #onHidden() {
    this.paused = true;
  }

  #onShow() {
    this.paused = false;
  }

  #handleStart() {
    if (this.#onStart) {
      this.#onStart();
    }
  }

  #initEngine() {
    this.#sys.rendererConfig.determineRenderType(this.#config);
    initDebugSetting(this.#debugMode);
    console.log(ENGINE_VERSION);
  }

  #setAnimFrame() {
    const standardFrameRate = this.#frameRate === 60 || this.#frameRate === 30;

    this.#lastTime = new Date();
    this.#frameTime = 1000 / this.#frameRate;
    this.#requestAnimFrame =
      standardFrameRate && window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : this.#stTime;
    this.#cancelAnimFrame =
      standardFrameRate && window.cancelAnimationFrame
        ? window.cancelAnimationFrame.bind(window)
        : this.#ctTime;
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
    let skip = true;

    const callback = () => {
      if (!this.#paused) {
        if (this.#frameRate === 30) {
          if ((skip = !skip)) {
            this.#intervalId = this.#requestAnimFrame(callback);
            return;
          }
        }

        this.#director.mainLoop(this.#debugMode);
        this.#intervalId = this.#requestAnimFrame(callback);
      }
    };

    this.#intervalId = this.#requestAnimFrame(callback);
    this.#paused = false;
  }

  #initConfig(value) {
    this.#config = value;
    this.#showFPS = this.#config[CONFIG_KEY.showFPS] ?? true;
    this.#config[CONFIG_KEY.engineDir] =
      this.#config[CONFIG_KEY.engineDir] || "frameworks/cocos2d-html5";
    this.#debugMode = this.#config[CONFIG_KEY.debugMode] ?? 0;
    this.#config[CONFIG_KEY.exposeClassName] =
      !!this.#config[CONFIG_KEY.exposeClassName];
    this.#frameRate = this.#config[CONFIG_KEY.frameRate] || 60;
    if (this.#config[CONFIG_KEY.renderMode] == null)
      this.#config[CONFIG_KEY.renderMode] = UserRenderMode.AUTO;
    if (this.#config[CONFIG_KEY.registerSystemEvent] == null)
      this.#config[CONFIG_KEY.registerSystemEvent] = true;

    this.#loader.setNoCache(!!this.#config["noCache"]);
  }

  #initRenderer() {
    if (!this.#sys.rendererConfig.supportRenderer) {
      throw new Error(
        "The renderer doesn't support the renderMode " +
          this.#config[CONFIG_KEY.renderMode]
      );
    }

    // eglView is wired lazily; initialize it now that the renderer.
    this.#eglView.initialize(
      this.#config[CONFIG_KEY.id],
      this.#config[CONFIG_KEY.width],
      this.#config[CONFIG_KEY.height]
    );

    this.dispatchEvent(GameEvent.RENDERER_INITED, true);

    this.rendererInitialized = true;

    // Initialize TextureCache renderer after renderer type is determined
    this.#textureCache.initRenderer();
  }

  #initEvents() {
    this.#eventManager.enabled = true;

    if (this.#config[CONFIG_KEY.registerSystemEvent])
      this.#inputManager.registerSystemEvent();

    const showCallback = this.#onShow.bind(this);
    const hideCallback = this.#onHidden.bind(this);

    document.addEventListener(
      "visibilitychange",
      () => (document.hidden ? hideCallback() : showCallback()),
      false
    );

    window.addEventListener("pagehide", hideCallback, false);
    window.addEventListener("pageshow", showCallback, false);
  }

  get frameRate() {
    return this.#frameRate;
  }

  get debugMode() {
    return this.#debugMode;
  }

  get showFPS() {
    return this.#showFPS;
  }

  set showFPS(value) {
    this.#showFPS = !!value;

    if (!ServiceLocator.eglView?.container) {
      return;
    }

    ServiceLocator.profiler.statsShowing = this.#showFPS;
  }

  /**
   * Set frameRate of game.
   * @param frameRate
   */
  set frameRate(frameRate) {
    this.#frameRate = frameRate;

    if (this.#intervalId) {
      this.#cancelAnimFrame(this.#intervalId);
    }

    this.#intervalId = 0;
    this.#paused = true;
    this.#setAnimFrame();
    this.#runMainLoop();
  }

  get config() {
    return this.#config;
  }

  /**
   * Set whether the game is paused.
   * @param paused
   */
  set paused(paused) {
    if (this.#paused === paused) {
      return;
    }

    this.#paused = paused;

    if (this.audioEngine) {
      if (paused) this.audioEngine._pausePlaying();
      else this.audioEngine._resumePlaying();
    }

    if (paused) {
      if (this.#intervalId) {
        this.#cancelAnimFrame(this.#intervalId);
      }

      this.#intervalId = 0;
    } else {
      this.#runMainLoop();
    }

    this.#eventManager.dispatchEvent(
      paused ? this.#eventHide : this.#eventShow
    );
  }

  /**
   * Check whether the game is paused.
   */
  get paused() {
    return this.#paused;
  }
}

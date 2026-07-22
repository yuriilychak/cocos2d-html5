import { BaseClass, ENGINE_VERSION } from "../platform";
import { EventHelper, EventCustom } from "../event-manager";
import { ServiceLocator } from "../service-locator";
import { initDebugSetting, Loader } from "../boot";
import { Sys } from "../sys";
import { CONFIG_KEY, GameEvent, UserRenderMode } from "../enums";
import type { EGLView, InputManager } from "../platform";
import type Director from "../director";
import type EventManager from "../event-manager/event-manager";
import type TextureCache from "../textures/texture-cache";

type GameConfig = Record<string, any>;
type GameCallback = () => void;
type AnimationCallback = () => void;

interface AudioEngine {
  end(): void;
  _pausePlaying(): void;
  _resumePlaying(): void;
}

/**
 * An object to boot the game.
 */
export default class Game extends EventHelper(BaseClass) {
  // states
  #paused = true;
  #initialized = false;
  #intervalId: number | null = null;
  #lastTime = 0;
  #frameTime = 0;
  #frameRate = 60;
  #debugMode = 0;
  #showFPS = false;
  #requestAnimFrame: ((callback: AnimationCallback) => number) | null = null;
  #cancelAnimFrame: ((id: number) => void) | null = null;
  /**
   * Config of game
   * @type {Object}
   */
  #config: GameConfig = {};

  /**
   * Callback when the scripts of engine have been load.
   * @type {Function|null}
   */
  #onStart: GameCallback | null = null;

  audioEngine: AudioEngine | null = null;
  rendererInitialized = false;

  /**
   * Callback when game exits.
   * @type {Function|null}
   */
  #onStop: GameCallback | null = null;

  #director: Director;
  #eglView: EGLView;
  #eventManager: EventManager;
  #inputManager: InputManager;
  #loader: Loader;
  #sys: Sys;
  #textureCache: TextureCache;

  #eventHide: EventCustom<Game>;
  #eventShow: EventCustom<Game>;

  constructor(
    sys: Sys,
    loader: Loader,
    eglView: EGLView,
    director: Director,
    eventManager: EventManager,
    inputManager: InputManager,
    textureCache: TextureCache
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
  restart(): void {
    this.#director.popToSceneStackLevel(0);
    this.audioEngine && this.audioEngine.end();
    this.#handleStart();
  }

  /**
   * Close the game window.
   */
  close(): void {
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
  run(config: GameConfig, onStart: GameCallback | null = null, onStop: GameCallback | null = null): void {
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
  step(): void {
    this.#director.mainLoop(this.#debugMode);
  }

  #onHidden(): void {
    this.paused = true;
  }

  #onShow(): void {
    this.paused = false;
  }

  #handleStart(): void {
    if (this.#onStart) {
      this.#onStart();
    }
  }

  #initEngine(): void {
    this.#sys.rendererConfig.determineRenderType(this.#config as Record<CONFIG_KEY, unknown>);
    initDebugSetting(this.#debugMode);
    console.log(ENGINE_VERSION);
  }

  #setAnimFrame(): void {
    const standardFrameRate = this.#frameRate === 60 || this.#frameRate === 30;

    this.#lastTime = Date.now();
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

  #stTime = (callback: AnimationCallback): number => {
    const currTime = Date.now();
    const timeToCall = Math.max(0, this.#frameTime - (currTime - this.#lastTime));
    const id = window.setTimeout(() => {
      callback();
    }, timeToCall);
    this.#lastTime = currTime + timeToCall;
    return id;
  };

  #ctTime = (id: number): void => {
    window.clearTimeout(id);
  };

  #runMainLoop(): void {
    let skip = true;

    const callback = () => {
      if (!this.#paused) {
        if (this.#frameRate === 30) {
          if ((skip = !skip)) {
            this.#intervalId = this.#requestAnimFrame!(callback);
            return;
          }
        }

        this.#director.mainLoop(this.#debugMode);
        this.#intervalId = this.#requestAnimFrame!(callback);
      }
    };

    this.#intervalId = this.#requestAnimFrame!(callback);
    this.#paused = false;
  }

  #initConfig(value: GameConfig): void {
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

  #initRenderer(): void {
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

  #initEvents(): void {
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

  get frameRate(): number {
    return this.#frameRate;
  }

  get debugMode(): number {
    return this.#debugMode;
  }

  get showFPS(): boolean {
    return this.#showFPS;
  }

  set showFPS(value: boolean) {
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
  set frameRate(frameRate: number) {
    this.#frameRate = frameRate;

    if (this.#intervalId) {
      this.#cancelAnimFrame!(this.#intervalId);
    }

    this.#intervalId = 0;
    this.#paused = true;
    this.#setAnimFrame();
    this.#runMainLoop();
  }

  get config(): GameConfig {
    return this.#config;
  }

  /**
   * Set whether the game is paused.
   * @param paused
   */
  set paused(paused: boolean) {
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
        this.#cancelAnimFrame!(this.#intervalId);
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
  get paused(): boolean {
    return this.#paused;
  }
}

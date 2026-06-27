// Service Locator
// ---------------------------------------------------------------------------
// Central access point and owner of the engine's core services. Each service
// is a plain class. Lifetime is managed in two phases:
//
//   1. Construction — on the first service access, ALL service instances are
//      constructed together (`#constructAll`). Service constructors are
//      side-effect free (they only initialise their own fields), so the order
//      is irrelevant and no constructor reads another service.
//   2. Injection — dependencies are injected lazily, per service, the first
//      time that service is accessed (`injectServices`, assignment-only). By
//      the time injection runs every instance already exists, so the cyclic
//      service graph (e.g. game<->eglView, sys<->renderingConfig) resolves to
//      the already-constructed singletons without re-entrant construction.
//
// IMPORTANT: construction/injection are deferred to the first runtime access,
// never module-evaluation time. No module imported by this file may read a
// `ServiceLocator.*` getter at module top level (it would observe the
// `ServiceLocator` class in its temporal dead zone). Lazy access from inside
// methods/constructors is safe.

import { DisplayLinkDirector } from "./director/director";
import { Sys } from "./sys";
import Loader from "./boot/loader";
import Game from "./boot/game";
import EventManager from "./event-manager/event-manager";
import { EGLView } from "./platform/egl-view/egl-view";
import TextureCache from "./textures/texture-cache";
import SpriteFrameCache from "./sprites/sprite-frame-cache";
import AnimationCache from "./sprites/animation-cache";
import ShaderCache from "./shaders/CCShaderCache";
import { GLStateCache } from "./shaders/CCGLStateCache";
import { KMGLMatrix } from "./kazmath/km-gl-matrix";
import { Profiler } from "./utils/profiler";
import { InputManager } from "./platform/input-manager";
import { Screen } from "./platform/screen";

// Service configuration data: loader handlers and base64 boot images. Imported
// here (not in index.js) so all service wiring lives in the locator. These are
// only used at construct() time (runtime), so the circular import with the
// loaders module is safe.
import {
  _txtLoader,
  _jsonLoader,
  _jsLoader,
  _imgLoader,
  _serverImgLoader,
  _plistLoader,
  _fontLoader,
  _csbLoader
} from "./platform/loaders";
import { _LogInfos, _loadingImage, _fpsImage, _loaderImage } from "./boot";
import { initBinaryLoader } from "./utils/binary-loader";

export class ServiceLocator {
  static #director;
  static #sys;
  static #loader;
  static #game;
  static #eventManager;
  static #eglView;
  static #textureCache;
  static #spriteFrameCache;
  static #animationCache;
  static #shaderCache;
  static #glStateCache;
  static #kmglMatrix;
  static #profiler;
  static #inputManager;
  static #screen;

  static #constructed = false;

  // Construct, wire and configure every service exactly once, in three ordered
  // phases inside this single method: (1) allocate all instances, (2) inject
  // dependencies, (3) configure them. Called explicitly at engine start from
  // core's index.js.
  //
  // Why a method and not static field initializers (`static #x = new X()`):
  // field initializers run at class-definition (module-evaluation) time, but
  // the services and this locator form a circular import graph, so a service
  // constructor can transitively reference another service class that is still
  // in its temporal dead zone — e.g. `new Sys()` throws "Cannot
  // access 'Game' before initialization". Deferring to a method called after
  // all modules have evaluated avoids this.
  //
  // The phases must stay ordered: constructors only initialise their own fields
  // (no constructor reads another service), so every instance exists before
  // injection; injection is assignment-only, so the cyclic service graph (e.g.
  // game<->eglView, sys<->renderingConfig, director<->eventManager) resolves to
  // the already-constructed singletons; configuration runs last because it
  // touches live services. Idempotent.
  static construct() {
    if (ServiceLocator.#constructed) {
      return;
    }
    ServiceLocator.#constructed = true;

    ServiceLocator.#director = new DisplayLinkDirector();
    ServiceLocator.#sys = new Sys();
    ServiceLocator.#loader = new Loader();
    ServiceLocator.#game = new Game();
    ServiceLocator.#eventManager = new EventManager();
    ServiceLocator.#eglView = new EGLView();
    ServiceLocator.#textureCache = new TextureCache();
    ServiceLocator.#spriteFrameCache = new SpriteFrameCache();
    ServiceLocator.#animationCache = new AnimationCache();
    ServiceLocator.#shaderCache = new ShaderCache();
    ServiceLocator.#glStateCache = new GLStateCache();
    ServiceLocator.#kmglMatrix = new KMGLMatrix();
    ServiceLocator.#profiler = new Profiler();
    ServiceLocator.#inputManager = new InputManager();
    ServiceLocator.#screen = new Screen(ServiceLocator.#game);

    const renderingConfig = ServiceLocator.#sys.rendererConfig;

    // Wire dependencies (assignment-only). Every instance already exists,
    // so the cyclic service graph resolves to the constructed singletons.
    ServiceLocator.#director.injectServices({
      animationCache: ServiceLocator.#animationCache,
      eglView: ServiceLocator.#eglView,
      eventManager: ServiceLocator.#eventManager,
      game: ServiceLocator.#game,
      profiler: ServiceLocator.#profiler,
      rendererConfig: renderingConfig,
      spriteFrameCache: ServiceLocator.#spriteFrameCache,
      textureCache: ServiceLocator.#textureCache
    });

    ServiceLocator.#loader.injectServices({
      game: ServiceLocator.#game,
      rendererConfig: renderingConfig,
      sys: ServiceLocator.#sys
    });

    ServiceLocator.#game.injectServices({
      director: ServiceLocator.#director,
      eglView: ServiceLocator.#eglView,
      eventManager: ServiceLocator.#eventManager,
      inputManager: ServiceLocator.#inputManager,
      loader: ServiceLocator.#loader,
      rendererConfig: renderingConfig,
      textureCache: ServiceLocator.#textureCache
    });

    ServiceLocator.#eventManager.injectServices({
      director: ServiceLocator.#director
    });

    // eglView.initialize() needs game.container and is invoked later from
    // Game.prepare() once the renderer is set up — only deps are wired here.
    ServiceLocator.#eglView.injectServices({
      director: ServiceLocator.#director,
      eventManager: ServiceLocator.#eventManager,
      game: ServiceLocator.#game,
      rendererConfig: renderingConfig,
      screen: ServiceLocator.#screen,
      sys: ServiceLocator.#sys
    });

    ServiceLocator.#textureCache.injectServices({
      loader: ServiceLocator.#loader,
      rendererConfig: renderingConfig
    });

    ServiceLocator.#spriteFrameCache.injectServices({
      loader: ServiceLocator.#loader,
      rendererConfig: renderingConfig,
      textureCache: ServiceLocator.#textureCache
    });

    ServiceLocator.#animationCache.injectServices({
      loader: ServiceLocator.#loader,
      spriteFrameCache: ServiceLocator.#spriteFrameCache
    });

    ServiceLocator.#shaderCache.injectServices({
      rendererConfig: renderingConfig
    });

    ServiceLocator.#glStateCache.injectServices({
      kmglMatrix: ServiceLocator.#kmglMatrix,
      rendererConfig: renderingConfig
    });

    ServiceLocator.#kmglMatrix.injectServices({
      director: ServiceLocator.#director
    });

    ServiceLocator.#profiler.injectServices({
      director: ServiceLocator.#director,
      eventManager: ServiceLocator.#eventManager,
      game: ServiceLocator.#game,
      rendererConfig: renderingConfig
    });

    ServiceLocator.#inputManager.injectServices({
      director: ServiceLocator.#director,
      eglView: ServiceLocator.#eglView,
      eventManager: ServiceLocator.#eventManager,
      game: ServiceLocator.#game,
      sys: ServiceLocator.#sys
    });

    // Configure services: register the loader's file-type handlers and boot
    // images and initialise the matrix stacks. Kept here so index.js never
    // manipulates service instances directly.
    const loader = ServiceLocator.#loader;
    loader._LogInfos = _LogInfos;
    loader._loadingImage = _loadingImage;
    loader._fpsImage = _fpsImage;
    loader._loaderImage = _loaderImage;

    loader.register(["txt", "xml", "vsh", "fsh", "atlas"], _txtLoader);
    loader.register(["json", "ExportJson"], _jsonLoader);
    loader.register(["js"], _jsLoader);
    loader.register(
      ["png", "jpg", "bmp", "jpeg", "gif", "ico", "tiff", "webp"],
      _imgLoader
    );
    loader.register(["serverImg"], _serverImgLoader);
    loader.register(["plist"], _plistLoader);
    loader.register(["font", "eot", "ttf", "woff", "svg", "ttc"], _fontLoader);
    loader.register(["csb"], _csbLoader);

    // Attach binary-loading methods to the loader (+ IE VBScript shim).
    initBinaryLoader(loader);

    ServiceLocator.#kmglMatrix.lazyInitialize();
  }

  static get director() {
    return ServiceLocator.#director;
  }

  static get sys() {
    return ServiceLocator.#sys;
  }

  static get loader() {
    return ServiceLocator.#loader;
  }

  static get game() {
    return ServiceLocator.#game;
  }

  static get eventManager() {
    return ServiceLocator.#eventManager;
  }

  static get eglView() {
    return ServiceLocator.#eglView;
  }

  static get textureCache() {
    return ServiceLocator.#textureCache;
  }

  static get spriteFrameCache() {
    return ServiceLocator.#spriteFrameCache;
  }

  static get animationCache() {
    return ServiceLocator.#animationCache;
  }

  static get shaderCache() {
    return ServiceLocator.#shaderCache;
  }

  static get glStateCache() {
    return ServiceLocator.#glStateCache;
  }

  static get kmglMatrix() {
    return ServiceLocator.#kmglMatrix;
  }

  static get profiler() {
    return ServiceLocator.#profiler;
  }

  static get inputManager() {
    return ServiceLocator.#inputManager;
  }

  static get screen() {
    return ServiceLocator.#screen;
  }
}

export default ServiceLocator;

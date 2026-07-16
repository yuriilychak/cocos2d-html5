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
import { Loader } from "./boot/loader";
import Game from "./boot/game";
import EventManager from "./event-manager/event-manager";
import { EGLView } from "./platform/egl-view/egl-view";
import TextureCache from "./textures/texture-cache";
import SpriteFrameCache from "./sprites/sprite-frame-cache";
import AnimationCache from "./sprites/animation-cache";
import ShaderCache from "./shaders/shader-cache";
import { GLStateCache } from "./shaders/gl-state-cache";
import { KMGLMatrix } from "./kazmath/km-gl-matrix";
import { Profiler } from "./utils/profiler";
import { InputManager } from "./platform/input-manager";
import { Screen } from "./platform/screen";

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
    ServiceLocator.#loader = new Loader(ServiceLocator.#sys);
    ServiceLocator.#game = new Game();
    ServiceLocator.#eventManager = new EventManager(ServiceLocator.#director);
    ServiceLocator.#screen = new Screen();
    ServiceLocator.#eglView = new EGLView(
      ServiceLocator.#sys,
      ServiceLocator.#screen,
      ServiceLocator.#eventManager
    );
    ServiceLocator.#textureCache = new TextureCache(ServiceLocator.#loader);
    ServiceLocator.#spriteFrameCache = new SpriteFrameCache();
    ServiceLocator.#animationCache = new AnimationCache();
    ServiceLocator.#shaderCache = new ShaderCache(ServiceLocator.#sys);
    ServiceLocator.#kmglMatrix = new KMGLMatrix();
    ServiceLocator.#glStateCache = new GLStateCache(ServiceLocator.#sys, ServiceLocator.#kmglMatrix);
    ServiceLocator.#profiler = new Profiler();
    ServiceLocator.#inputManager = new InputManager();

    const renderingConfig = ServiceLocator.#sys.rendererConfig;

    // Wire dependencies (assignment-only). Every instance already exists,
    // so the cyclic service graph resolves to the constructed singletons.
    ServiceLocator.#director.injectServices({
      animationCache: ServiceLocator.#animationCache,
      eventManager: ServiceLocator.#eventManager,
      game: ServiceLocator.#game,
      profiler: ServiceLocator.#profiler,
      rendererConfig: renderingConfig,
      spriteFrameCache: ServiceLocator.#spriteFrameCache,
      textureCache: ServiceLocator.#textureCache
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

    ServiceLocator.#spriteFrameCache.injectServices({
      loader: ServiceLocator.#loader,
      rendererConfig: renderingConfig,
      textureCache: ServiceLocator.#textureCache
    });

    ServiceLocator.#animationCache.injectServices({
      loader: ServiceLocator.#loader,
      spriteFrameCache: ServiceLocator.#spriteFrameCache
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

    // Configure services and initialise the matrix stacks. Kept here so
    // index.js never manipulates service instances directly.
    ServiceLocator.#loader.registerDefaultLoaders(ServiceLocator.#textureCache);
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

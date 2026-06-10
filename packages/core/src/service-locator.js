// Service Locator
// ---------------------------------------------------------------------------
// Central access point and owner of the engine's core services. Each service
// is a plain class; the locator lazily constructs a single instance on first
// access and caches it for subsequent gets. This replaces the per-class
// singleton (`static getInstance()` / `static _instance`) pattern and keeps
// service lifetime ownership in one place, reducing circular dependencies.
//
// IMPORTANT: getters are lazy — they only construct on first runtime access,
// never at module-evaluation time. No module imported by this file may read a
// `ServiceLocator.*` getter at module top level (it would observe the
// `ServiceLocator` class in its temporal dead zone). Lazy access from inside
// methods/constructors is safe.

import { DisplayLinkDirector } from "./director/director";
import { RendererConfig } from "./renderer/renderer-config";
import Sys from "./boot/sys";
import Loader from "./boot/loader";
import Game from "./boot/game";
import { Engine } from "./boot/engine";
import EventManager from "./event-manager/event-manager";
import { EGLView } from "./platform/egl-view/egl-view";
import TextureCache from "./textures/texture-cache";
import SpriteFrameCache from "./sprites/sprite-frame-cache";
import AnimationCache from "./sprites/animation-cache";
import ShaderCache from "./shaders/CCShaderCache";
import { GLStateCache } from "./shaders/CCGLStateCache";
import { KMGLMatrix } from "./kazmath/gl/km-gl-matrix";
import { Configuration } from "./configuration";
import { Profiler } from "./utils/profiler";

export class ServiceLocator {
  static #director;
  static #rendererConfig;
  static #sys;
  static #loader;
  static #game;
  static #engine;
  static #eventManager;
  static #eglView;
  static #textureCache;
  static #spriteFrameCache;
  static #animationCache;
  static #shaderCache;
  static #glStateCache;
  static #kmglMatrix;
  static #configuration;
  static #profiler;

  static get director() {
    if (!ServiceLocator.#director) {
      ServiceLocator.#director = new DisplayLinkDirector();
    }
    return ServiceLocator.#director;
  }

  static get rendererConfig() {
    if (!ServiceLocator.#rendererConfig) {
      ServiceLocator.#rendererConfig = new RendererConfig();
    }
    return ServiceLocator.#rendererConfig;
  }

  static get sys() {
    if (!ServiceLocator.#sys) {
      ServiceLocator.#sys = new Sys();
    }
    return ServiceLocator.#sys;
  }

  static get loader() {
    if (!ServiceLocator.#loader) {
      ServiceLocator.#loader = new Loader();
    }
    return ServiceLocator.#loader;
  }

  static get game() {
    if (!ServiceLocator.#game) {
      ServiceLocator.#game = new Game();
    }
    return ServiceLocator.#game;
  }

  static get engine() {
    if (!ServiceLocator.#engine) {
      ServiceLocator.#engine = new Engine();
    }
    return ServiceLocator.#engine;
  }

  static get eventManager() {
    if (!ServiceLocator.#eventManager) {
      ServiceLocator.#eventManager = new EventManager();
    }
    return ServiceLocator.#eventManager;
  }

  static get eglView() {
    if (!ServiceLocator.#eglView) {
      // Assign before initialize() for re-entrancy safety (see director).
      ServiceLocator.#eglView = new EGLView();
      ServiceLocator.#eglView.initialize();
    }
    return ServiceLocator.#eglView;
  }

  static get textureCache() {
    if (!ServiceLocator.#textureCache) {
      ServiceLocator.#textureCache = new TextureCache();
    }
    return ServiceLocator.#textureCache;
  }

  static get spriteFrameCache() {
    if (!ServiceLocator.#spriteFrameCache) {
      ServiceLocator.#spriteFrameCache = new SpriteFrameCache();
    }
    return ServiceLocator.#spriteFrameCache;
  }

  static get animationCache() {
    if (!ServiceLocator.#animationCache) {
      ServiceLocator.#animationCache = new AnimationCache();
    }
    return ServiceLocator.#animationCache;
  }

  static get shaderCache() {
    if (!ServiceLocator.#shaderCache) {
      ServiceLocator.#shaderCache = new ShaderCache();
    }
    return ServiceLocator.#shaderCache;
  }

  static get glStateCache() {
    if (!ServiceLocator.#glStateCache) {
      ServiceLocator.#glStateCache = new GLStateCache();
    }
    return ServiceLocator.#glStateCache;
  }

  static get kmglMatrix() {
    if (!ServiceLocator.#kmglMatrix) {
      ServiceLocator.#kmglMatrix = new KMGLMatrix();
    }
    return ServiceLocator.#kmglMatrix;
  }

  static get configuration() {
    if (!ServiceLocator.#configuration) {
      ServiceLocator.#configuration = new Configuration();
    }
    return ServiceLocator.#configuration;
  }

  static get profiler() {
    if (!ServiceLocator.#profiler) {
      ServiceLocator.#profiler = new Profiler();
    }
    return ServiceLocator.#profiler;
  }
}

export default ServiceLocator;

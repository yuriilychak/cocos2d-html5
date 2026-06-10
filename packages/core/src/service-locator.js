// Service Locator
// ---------------------------------------------------------------------------
// Central access point for the engine's singleton services. Instead of each
// consumer importing a concrete service class and calling `getInstance()`
// directly (which couples modules together and encourages circular
// dependencies), code can read the corresponding static getter on
// `ServiceLocator`.
//
// As a first migration step every getter simply forwards to the existing
// `getInstance()` of the underlying service, so behaviour is unchanged. Later
// the locator can become the single owner of service construction/lifetime.

import { Director } from "./director/director";
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
  static get director() {
    return Director.getInstance();
  }

  static get rendererConfig() {
    return RendererConfig.getInstance();
  }

  static get sys() {
    return Sys.getInstance();
  }

  static get loader() {
    return Loader.getInstance();
  }

  static get game() {
    return Game.getInstance();
  }

  static get engine() {
    return Engine.getInstance();
  }

  static get eventManager() {
    return EventManager.getInstance();
  }

  static get eglView() {
    return EGLView.getInstance();
  }

  static get textureCache() {
    return TextureCache.getInstance();
  }

  static get spriteFrameCache() {
    return SpriteFrameCache.getInstance();
  }

  static get animationCache() {
    return AnimationCache.getInstance();
  }

  static get shaderCache() {
    return ShaderCache.getInstance();
  }

  static get glStateCache() {
    return GLStateCache.getInstance();
  }

  static get kmglMatrix() {
    return KMGLMatrix.getInstance();
  }

  static get configuration() {
    return Configuration.getInstance();
  }

  static get profiler() {
    return Profiler.getInstance();
  }
}

export default ServiceLocator;

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { BaseClass } from "./platform/class";
import { ActionManager } from "./action-manager";
import EventCustom from "./event-manager/event/event-custom";
import { Node } from "./base-nodes/node";
import {
  DirectorEvent,
  GameEvent,
  NodeStateCallbackType
} from "./enums";
import { assert, _LogInfos } from "./boot/debugger";
import { _fpsImage } from "./boot/base64-images";
import { checkGLErrorDebug } from "./platform/macro/utils";
import Sys from "./sys/sys";
import Scheduler from "./scheduler/scheduler";
import SpriteFrameCache from "./sprites/sprite-frame-cache";
import AnimationCache from "./sprites/animation-cache";
import TextureCache from "./textures/texture-cache";
import EventManager from "./event-manager/event-manager";

type Scene = Node;

/**
 * Director is a singleton object which manage your game's logic flow.
 */
export default class Director extends BaseClass {
  static readonly defaultFPS = 60;

  #transitionSceneClass: (new (...args: any[]) => unknown) | null = null;
  #nextDeltaTimeZero = false;
  #paused = false;
  #purgeDirectorInNextLoop = false;
  #sendCleanupToScene = false;
  #animationInterval = 1.0 / Director.defaultFPS;
  #oldAnimationInterval = 1.0 / Director.defaultFPS;
  #deltaTime = 0.0;
  #lastUpdate = Date.now();
  #nextScene: Scene | null = null;
  #notificationNode: Scene | null = null;
  #scenesStack: Scene[] = [];
  #runningScene: Scene | null = null;
  #totalFrames = 0;
  #secondsPerFrame = 0;
  #animationEnabled = false;
  #animationCache: AnimationCache;
  #eventManager: EventManager | null = null;
  #fpsImage: HTMLImageElement | null = null;
  #eventAfterUpdate: EventCustom<Director>;
  #eventAfterVisit: EventCustom<Director>;
  #eventAfterDraw: EventCustom<Director>;
  #sys: Sys;
  #scheduler: Scheduler;
  #spriteFrameCache: SpriteFrameCache;
  #actionManager: ActionManager;
  #textureCache: TextureCache;

  constructor(
    sys: Sys,
    scheduler: Scheduler,
    actionManager: ActionManager,
    spriteFrameCache: SpriteFrameCache,
    textureCache: TextureCache,
    animationCache: AnimationCache
  ) {
    super();

    this.#sys = sys;
    this.#scheduler = scheduler;
    this.#actionManager = actionManager;
    this.#spriteFrameCache = spriteFrameCache;
    this.#textureCache = textureCache;
    this.#animationCache = animationCache;
    this.#eventAfterUpdate = new EventCustom(DirectorEvent.AFTER_UPDATE, this);
    this.#eventAfterVisit = new EventCustom(DirectorEvent.AFTER_VISIT, this);
    this.#eventAfterDraw = new EventCustom(DirectorEvent.AFTER_DRAW, this);
  }

  injectServices({ eventManager }: { eventManager: EventManager }): void {
    this.#eventManager = eventManager;
  }

  init(): boolean {
    this.#oldAnimationInterval = this.#animationInterval =
      1.0 / Director.defaultFPS;

    this.#lastUpdate = Date.now();

    this.#actionManager.scheduleUpdate();

    if (!this.#sys.rendererConfig.isCanvas) {
      this.#fpsImage = new Image();

      if (_fpsImage) {
        this.#fpsImage!.src = _fpsImage;
      }

      this.#eventManager!.addCustomListener(
        DirectorEvent.PROJECTION_CHANGED,
        this.#onProjectionChange.bind(this)
      );
    }

    this.#eventManager!.addCustomListener(
      GameEvent.SHOW,
      this.#onGameShow.bind(this)
    );

    return true;
  }

  calculateDeltaTime(debugMode: number): void {
    const now = Date.now();

    this.#deltaTime = this.#nextDeltaTimeZero
       ? 0
       : (now - this.#lastUpdate) / 1000;

    this.#nextDeltaTimeZero = false;

    if (debugMode > 0 && this.#deltaTime > 0.2) {
      this.#deltaTime = 1 / 60.0;
    }

    this.#lastUpdate = now;
  }

  drawScene(debugMode: number): void {
    const renderer = this.#sys.rendererConfig.renderer;

    this.calculateDeltaTime(debugMode);

    if (!this.#paused) {
      this.#scheduler.update(this.#deltaTime);
      this.#eventManager!.dispatchEvent(this.#eventAfterUpdate);
    }

    if (this.#nextScene) {
      this.setNextScene();
    }

    if (this.#runningScene) {
      if (renderer.childrenOrderDirty) {
        renderer.clearRenderCommands();
        renderer.assignedZ = 0;
        this.#runningScene.renderCmd._curLevel = 0;
        this.#runningScene.visit(null, renderer);
        renderer.resetFlag();
      } else if (renderer.transformDirty()) {
        renderer.transform();
      }
    }

    renderer.clear();

    if (this.notificationNode) {
      this.notificationNode.visit(null, renderer);
    }

    this.#eventManager!.dispatchEvent(this.#eventAfterVisit);
    this.#sys.rendererConfig.resetDrawCount();

    renderer.rendering(this.#sys.rendererConfig.renderContext);
    this.#totalFrames++;

    this.#eventManager!.dispatchEvent(this.#eventAfterDraw);
    this.#eventManager!.frameUpdateListeners();

    this.#calculateMPF();
  }

  mainLoop(debugMode: number): void {
    if (this.#purgeDirectorInNextLoop) {
      this.#purgeDirectorInNextLoop = false;
      this.purgeDirector();
      return;
    }

    if (this.animationEnabled) {
      this.drawScene(debugMode);
    }
  }

  end(): void {
    this.#purgeDirectorInNextLoop = true;
  }

  popScene(): void {
    assert(this.#runningScene, _LogInfos.Director_popScene);

    this.#scenesStack.pop();

    const stackSize = this.#scenesStack.length;

    if (stackSize === 0) {
      this.end();
      return;
    }

    this.#changeScene(this.#scenesStack[stackSize - 1], true);
  }

  purgeCachedData(): void {
    this.#animationCache.clear();
    this.#spriteFrameCache.clear();
    this.#textureCache.clear();
  }

  purgeDirector(): void {
    this.#scheduler.unscheduleAll();

    if (this.#eventManager) {
      this.#eventManager.enabled = false;
    }

    if (this.#runningScene) {
      this.#performSceneActions(this.#runningScene);
    }

    this.#runningScene = null;
    this.#nextScene = null;
    this.#scenesStack.length = 0;

    this.animationEnabled = false;

    this.purgeCachedData();

    checkGLErrorDebug();
  }

  pushScene(scene: Scene): void {
    assert(scene, _LogInfos.Director_pushScene);
    this.#changeScene(scene, false);
  }

  runScene(scene: Scene): void {
    assert(scene, _LogInfos.Director_pushScene);

    if (!this.#runningScene) {
      this.pushScene(scene);
      this.animationEnabled = true;
      return;
    }

    const index = Math.max(this.#scenesStack.length - 1, 0);
    this.#changeScene(scene, true, index);
  }

  setNextScene(): void {
    const runningIsTransition =
      !!this.#transitionSceneClass &&
      this.#runningScene instanceof this.#transitionSceneClass;
    const newIsTransition =
      !!this.#transitionSceneClass &&
      this.#nextScene instanceof this.#transitionSceneClass;

    if (!newIsTransition) {
      this.#setRunningSceneState(false);
    }

    this.#runningScene = this.#nextScene;
    this.#sys.rendererConfig.renderer.childrenOrderDirty = true;
    this.#nextScene = null;

    if (!runningIsTransition) {
      this.#setRunningSceneState(true);
    }
  }

  popToRootScene(): void {
    this.popToSceneStackLevel(1);
  }

  popToSceneStackLevel(level: number): void {
    assert(this.#runningScene, _LogInfos.Director_popToSceneStackLevel_2);

    let stackSize = this.#scenesStack.length;

    if (level === 0) {
      this.end();
      return;
    }
    if (level >= stackSize) {
      return;
    }

    while (stackSize > level) {
      this.#performSceneActions(this.#scenesStack.pop()!);
      stackSize--;
    }

    this.#changeScene(this.#scenesStack[this.#scenesStack.length - 1], true);
  }

  #changeScene(scene: Scene, sendCleanupToScene: boolean, index = -1): void {
    this.#sendCleanupToScene = sendCleanupToScene;

    if (!sendCleanupToScene) {
      this.#scenesStack.push(scene);
    } else if (index !== -1) {
      this.#scenesStack[index] = scene;
    }

    this.#nextScene = scene;
  }

  #calculateMPF(): void {
    const now = Date.now();
    this.#secondsPerFrame = (now - this.#lastUpdate) / 1000;
  }

  #setRunningSceneState(entering: boolean): void {
    if (!this.#runningScene) {
      return;
    }

    return entering
      ? this.#enterScene(this.#runningScene)
      : this.#performSceneActions(this.#runningScene, this.#sendCleanupToScene);
  }

  #performSceneActions(scene: Scene, cleanup = true): void {
    if (scene.running) {
      scene._performRecursive(NodeStateCallbackType.onExitTransitionDidStart);
      scene._performRecursive(NodeStateCallbackType.onExit);
    }

    if (cleanup) {
      scene._performRecursive(NodeStateCallbackType.cleanup);
    }
  }

  #enterScene(scene: Scene): void {
    scene._performRecursive(NodeStateCallbackType.onEnter);
    scene._performRecursive(NodeStateCallbackType.onEnterTransitionDidFinish);
  }

  #onProjectionChange(): void {
    for (let i = 0; i < this.#scenesStack.length; ++i) {
      Director.recursiveChild(this.#scenesStack[i]);
    }
  }

  #onGameShow(): void {
    this.#lastUpdate = Date.now();
  }

  get animationEnabled(): boolean {
    return this.#animationEnabled;
  }

  get transitionSceneClass(): (new (...args: any[]) => unknown) | null {
    return this.#transitionSceneClass;
  }

  set transitionSceneClass(
    transitionSceneClass: (new (...args: any[]) => unknown) | null
  ) {
    this.#transitionSceneClass = transitionSceneClass;
  }

  set animationEnabled(enabled: boolean) {
    if (this.#animationEnabled === enabled) {
      return;
    }
    this.#animationEnabled = enabled;
    if (enabled) {
      this.nextDeltaTimeZero = true;
    }
  }

  get deltaTime(): number {
    return this.#deltaTime;
  }

  get totalFrames(): number {
    return this.#totalFrames;
  }

  get sendCleanupToScene(): boolean {
    return this.#sendCleanupToScene;
  }

  get runningScene(): Scene | null {
    return this.#runningScene;
  }

  get animationInterval(): number {
    return this.#animationInterval;
  }

  set animationInterval(value: number) {
    this.#animationInterval = value;
    if (this.animationEnabled) {
      this.animationEnabled = false;
      this.animationEnabled = true;
    }
  }

  get secondsPerFrame(): number {
    return this.#secondsPerFrame;
  }

  get nextDeltaTimeZero(): boolean {
    return this.#nextDeltaTimeZero;
  }

  set nextDeltaTimeZero(nextDeltaTimeZero: boolean) {
    this.#nextDeltaTimeZero = nextDeltaTimeZero;
  }

  get paused(): boolean {
    return this.#paused;
  }

  set paused(paused: boolean) {
    if (this.#paused === paused) {
      return;
    }

    this.#paused = paused;

    if (paused) {
      this.#oldAnimationInterval = this.#animationInterval;
      this.animationInterval = 1 / 4.0;
    } else {
      this.animationInterval = this.#oldAnimationInterval;
      this.#lastUpdate = Date.now();
      this.#deltaTime = 0;
    }
  }

  get notificationNode(): Scene | null {
    return this.#notificationNode;
  }

  set notificationNode(node: Scene | null) {
    this.#sys.rendererConfig.renderer.childrenOrderDirty = true;
    if (this.#notificationNode) {
      this.#performSceneActions(this.#notificationNode);
    }

    this.#notificationNode = node;

    if (!node) {
      return;
    }
    
    this.#enterScene(this.#notificationNode!);
  }

  static recursiveChild(node: Scene): void {
    if (node && node.renderCmd) {
      node.renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
      const children = node.children;
      for (let i = 0; i < children.length; i++) {
        Director.recursiveChild(children[i]);
      }
    }
  }
}

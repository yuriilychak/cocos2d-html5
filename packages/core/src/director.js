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
import Scheduler from "./scheduler/scheduler";
import { ActionManager } from "./action-manager";
import EventCustom from "./event-manager/event/event-custom";
import { Node } from "./base-nodes/node";
import {
  CONFIG_KEY,
  DirectorEvent,
  DirectorProjection,
  GameEvent
} from "./enums";
import { log, assert, _LogInfos } from "./boot/debugger";
import { _fpsImage } from "./boot/base64-images";
import { checkGLErrorDebug } from "./platform/macro/utils";

/**
 * Director is a singleton object which manage your game's logic flow.
 */
export default class Director extends BaseClass {
  static defaultFPS = 60;

  TransitionSceneClass = null;
  #nextDeltaTimeZero = false;
  #paused = false;
  #purgeDirectorInNextLoop = false;
  #sendCleanupToScene = false;
  #animationInterval = 1.0 / Director.defaultFPS;
  #oldAnimationInterval = 1.0 / Director.defaultFPS;
  #deltaTime = 0.0;
  #lastUpdate = Date.now();
  #nextScene = null;
  #notificationNode = null;
  #scenesStack = [];
  #runningScene = null;
  #totalFrames = 0;
  #secondsPerFrame = 0;
  #animationEnabled = false;
  #animationCache;
  #eventManager = null;
  #fpsImage = null;
  #fpsImageLoaded = false;
  #eventAfterUpdate;
  #eventAfterVisit;
  #eventAfterDraw;
  #sys;
  #scheduler;
  #spriteFrameCache;
  #actionManager;
  #textureCache;

  constructor(
    sys,
    scheduler,
    actionManager,
    spriteFrameCache,
    textureCache,
    animationCache
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

  injectServices({ eventManager }) {
    this.#eventManager = eventManager;
  }

  init() {
    this.#oldAnimationInterval = this.#animationInterval =
      1.0 / Director.defaultFPS;

    this.#lastUpdate = Date.now();

    this.#scheduler.scheduleUpdate(
      this.#actionManager,
      Scheduler.PRIORITY_SYSTEM,
      false
    );

    if (!this.#sys.rendererConfig.isCanvas) {
      this.#fpsImage = new Image();
      this.#fpsImage.addEventListener("load", () => {
        this.#fpsImageLoaded = true;
      });

      if (_fpsImage) {
        this.#fpsImage.src = _fpsImage;
      }

      this.#eventManager.addCustomListener(
        DirectorEvent.PROJECTION_CHANGED,
        this.#onProjectionChange.bind(this)
      );
    }

    this.#eventManager.addCustomListener(
      GameEvent.SHOW,
      this.#onGameShow.bind(this)
    );

    return true;
  }

  calculateDeltaTime(debugMode) {
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

  drawScene(debugMode) {
    const renderer = this.#sys.rendererConfig.renderer;

    this.calculateDeltaTime(debugMode);

    if (!this.#paused) {
      this.#scheduler.update(this.#deltaTime);
      this.#eventManager.dispatchEvent(this.#eventAfterUpdate);
    }

    if (this.#nextScene) {
      this.setNextScene();
    }

    if (this.#runningScene) {
      if (renderer.childrenOrderDirty) {
        renderer.clearRenderCommands();
        renderer.assignedZ = 0;
        this.#runningScene._renderCmd._curLevel = 0;
        this.#runningScene.visit();
        renderer.resetFlag();
      } else if (renderer.transformDirty()) {
        renderer.transform();
      }
    }

    renderer.clear();

    if (this.notificationNode) {
      this.notificationNode.visit();
    }

    this.#eventManager.dispatchEvent(this.#eventAfterVisit);
    this.#sys.rendererConfig.resetDrawCount();

    renderer.rendering(this.#sys.rendererConfig.renderContext);
    this.#totalFrames++;

    this.#eventManager.dispatchEvent(this.#eventAfterDraw);
    this.#eventManager.frameUpdateListeners();

    this.#calculateMPF();
  }

  mainLoop(debugMode) {
    if (this.#purgeDirectorInNextLoop) {
      this.#purgeDirectorInNextLoop = false;
      this.purgeDirector();
      return;
    }

    if (this.animationEnabled) {
      this.drawScene(debugMode);
    }
  }

  end() {
    this.#purgeDirectorInNextLoop = true;
  }

  popScene() {
    assert(this.#runningScene, _LogInfos.Director_popScene);

    this.#scenesStack.pop();

    const stackSize = this.#scenesStack.length;

    if (stackSize === 0) {
      this.end();
      return;
    }

    this.#changeScene(this.#scenesStack[stackSize - 1], true);
  }

  purgeCachedData() {
    this.#animationCache.clear();
    this.#spriteFrameCache.clear();
    this.#textureCache.clear();
  }

  purgeDirector() {
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

  pushScene(scene) {
    assert(scene, _LogInfos.Director_pushScene);
    this.#changeScene(scene, false);
  }

  runScene(scene) {
    assert(scene, _LogInfos.Director_pushScene);

    if (!this.#runningScene) {
      this.pushScene(scene);
      this.animationEnabled = true;
      return;
    }

    const index = Math.max(this.#scenesStack.length - 1, 0);
    this.#changeScene(scene, true, index);
  }

  setNextScene() {
    const runningIsTransition =
      !!this.TransitionSceneClass &&
      this.#runningScene instanceof this.TransitionSceneClass;
    const newIsTransition =
      !!this.TransitionSceneClass &&
      this.#nextScene instanceof this.TransitionSceneClass;

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

  popToRootScene() {
    this.popToSceneStackLevel(1);
  }

  popToSceneStackLevel(level) {
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
      this.#performSceneActions(this.#scenesStack.pop());
      stackSize--;
    }

    this.#changeScene(this.#scenesStack[this.#scenesStack.length - 1], true);
  }

  #changeScene(scene, sendCleanupToScene, index = -1) {
    this.#sendCleanupToScene = sendCleanupToScene;

    if (!sendCleanupToScene) {
      this.#scenesStack.push(scene);
    } else if (index !== -1) {
      this.#scenesStack[index] = scene;
    }

    this.#nextScene = scene;
  }

  #calculateMPF() {
    var now = Date.now();
    this.#secondsPerFrame = (now - this.#lastUpdate) / 1000;
  }

  #setRunningSceneState(entering) {
    if (!this.#runningScene) {
      return;
    }

    return entering
      ? this.#enterScene(this.#runningScene)
      : this.#performSceneActions(this.#runningScene, this.#sendCleanupToScene);
  }

  #performSceneActions(scene, cleanup = true) {
    if (scene.running) {
      scene._performRecursive(Node._stateCallbackType.onExitTransitionDidStart);
      scene._performRecursive(Node._stateCallbackType.onExit);
    }

    if (cleanup) {
      scene._performRecursive(Node._stateCallbackType.cleanup);
    }
  }

  #enterScene(scene) {
    scene._performRecursive(Node._stateCallbackType.onEnter);
    scene._performRecursive(Node._stateCallbackType.onEnterTransitionDidFinish);
  }

  #onProjectionChange() {
    for (let i = 0; i < this.#scenesStack.length; ++i) {
      Director.recursiveChild(this.#scenesStack[i]);
    }
  }

  #onGameShow() {
    this.#lastUpdate = Date.now();
  }

  get animationEnabled() {
    return this.#animationEnabled;
  }

  set animationEnabled(enabled) {
    if (this.#animationEnabled === enabled) {
      return;
    }
    this.#animationEnabled = enabled;
    if (enabled) {
      this.nextDeltaTimeZero = true;
    }
  }

  get deltaTime() {
    return this.#deltaTime;
  }

  get totalFrames() {
    return this.#totalFrames;
  }

  get sendCleanupToScene() {
    return this.#sendCleanupToScene;
  }

  get runningScene() {
    return this.#runningScene;
  }

  get animationInterval() {
    return this.#animationInterval;
  }

  set animationInterval(value) {
    this.#animationInterval = value;
    if (this.animationEnabled) {
      this.animationEnabled = false;
      this.animationEnabled = true;
    }
  }

  get secondsPerFrame() {
    return this.#secondsPerFrame;
  }

  get nextDeltaTimeZero() {
    return this.#nextDeltaTimeZero;
  }

  set nextDeltaTimeZero(nextDeltaTimeZero) {
    this.#nextDeltaTimeZero = nextDeltaTimeZero;
  }

  get paused() {
    return this.#paused;
  }

  set paused(paused) {
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

  get notificationNode() {
    return this.#notificationNode;
  }

  set notificationNode(node) {
    this.#sys.rendererConfig.renderer.childrenOrderDirty = true;
    if (this.#notificationNode) {
      this.#performSceneActions(this.#notificationNode);
    }

    this.#notificationNode = node;

    if (!node) {
      return;
    }
    this.#enterScene(this.#notificationNode);
  }

  static recursiveChild(node) {
    if (node && node._renderCmd) {
      node._renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
      var children = node._children;
      for (var i = 0; i < children.length; i++) {
        Director.recursiveChild(children[i]);
      }
    }
  }
}

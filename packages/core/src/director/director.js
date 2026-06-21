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

import { BaseClass } from "../platform/class";
import { DirectorCanvasRenderer } from "./director-canvas";
import { DirectorWebGLRenderer } from "./director-webgl";
import Scheduler from "../scheduler/scheduler";
import { ActionManager } from "../action-manager";
import EventCustom from "../event-manager/event/event-custom";
import { Node } from "../base-nodes/node";
import Game from "../boot/game";
import { DirectorEvent, DirectorProjection, GameEvent } from "../enums";
import { Size } from "../geometry";
import { log, assert, _LogInfos } from "../boot/debugger";
import { checkGLErrorDebug } from "../platform/macro/utils";

export const defaultFPS = 60;

/**
 * Director is a singleton object which manage your game's logic flow.
 */
export class Director extends BaseClass {
  constructor() {
    super();
    this.TransitionSceneClass = null;
    this._landscape = false;
    this._nextDeltaTimeZero = false;
    this._paused = false;
    this._purgeDirectorInNextLoop = false;
    this._sendCleanupToScene = false;
    this._animationInterval = 0.0;
    this._oldAnimationInterval = 0.0;
    this._projection = 0;
    this._contentScaleFactor = 1.0;
    this._deltaTime = 0.0;
    this._winSizeInPoints = null;
    this._lastUpdate = null;
    this._nextScene = null;
    this._notificationNode = null;
    this._openGLView = null;
    this._scenesStack = null;
    this._projectionDelegate = null;
    this._runningScene = null;
    this._totalFrames = 0;
    this._secondsPerFrame = 0;
    this._dirtyRegion = null;
    this._scheduler = null;
    this._actionManager = null;
    this._eventProjectionChanged = null;
    this._eventAfterUpdate = null;
    this._eventAfterVisit = null;
    this._eventAfterDraw = null;
    this._rendererDelegate = null;
    this._lastUpdate = Date.now();
    this._animationCache = null;
    this._eglView = null;
    this._eventManager = null;
    this._game = null;
    this._profiler = null;
    this._rendererConfig = null;
    this._spriteFrameCache = null;
    this._textureCache = null;
    this._showEventListenerRegistered = false;
  }

  injectServices({
    animationCache,
    eglView,
    eventManager,
    game,
    profiler,
    rendererConfig,
    spriteFrameCache,
    textureCache
  }) {
    this._animationCache = animationCache;
    this._eglView = eglView;
    this._eventManager = eventManager;
    this._game = game;
    this._profiler = profiler;
    this._rendererConfig = rendererConfig;
    this._spriteFrameCache = spriteFrameCache;
    this._textureCache = textureCache;
  }

  init() {
    this._oldAnimationInterval = this._animationInterval = 1.0 / defaultFPS;
    this._scenesStack = [];
    this._projection = DirectorProjection.DEFAULT;
    this._projectionDelegate = null;

    this._totalFrames = 0;
    this._lastUpdate = Date.now();

    this._paused = false;
    this._purgeDirectorInNextLoop = false;

    this._winSizeInPoints = new Size(0, 0);

    this._openGLView = null;
    this._contentScaleFactor = 1.0;

    this._scheduler = new Scheduler();
    if (ActionManager) {
      this._actionManager = new ActionManager();
      this._scheduler.scheduleUpdate(
        this._actionManager,
        Scheduler.PRIORITY_SYSTEM,
        false
      );
    } else {
      this._actionManager = null;
    }

    this._eventAfterUpdate = new EventCustom(DirectorEvent.AFTER_UPDATE);
    this._eventAfterUpdate.setUserData(this);
    this._eventAfterVisit = new EventCustom(DirectorEvent.AFTER_VISIT);
    this._eventAfterVisit.setUserData(this);
    this._eventAfterDraw = new EventCustom(DirectorEvent.AFTER_DRAW);
    this._eventAfterDraw.setUserData(this);
    this._eventProjectionChanged = new EventCustom(
      DirectorEvent.PROJECTION_CHANGED
    );
    this._eventProjectionChanged.setUserData(this);

    if (this._rendererConfig.isCanvas) {
      this._rendererDelegate = new DirectorCanvasRenderer(this);
    } else {
      this._rendererDelegate = new DirectorWebGLRenderer(this);
    }

    if (!this._showEventListenerRegistered) {
      this._showEventListenerRegistered = true;
      this._eventManager.addCustomListener(GameEvent.SHOW, () => {
        this._lastUpdate = Date.now();
      });
    }

    return true;
  }

  calculateDeltaTime() {
    var now = Date.now();

    if (this._nextDeltaTimeZero) {
      this._deltaTime = 0;
      this._nextDeltaTimeZero = false;
    } else {
      this._deltaTime = (now - this._lastUpdate) / 1000;
    }

    if (
      this._game.config[Game.CONFIG_KEY.debugMode] > 0 &&
      this._deltaTime > 0.2
    )
      this._deltaTime = 1 / 60.0;

    this._lastUpdate = now;
  }

  convertToGL(uiPoint) {
    var docElem = document.documentElement;
    var view = this._eglView;
    var box = docElem.getBoundingClientRect();
    box.left += window.pageXOffset - docElem.clientLeft;
    box.top += window.pageYOffset - docElem.clientTop;
    var x = view._devicePixelRatio * (uiPoint.x - box.left);
    var y = view._devicePixelRatio * (box.top + box.height - uiPoint.y);
    return view._isRotated
      ? { x: view._viewPortRect.width - y, y: x }
      : { x: x, y: y };
  }

  convertToUI(glPoint) {
    var docElem = document.documentElement;
    var view = this._eglView;
    var box = docElem.getBoundingClientRect();
    box.left += window.pageXOffset - docElem.clientLeft;
    box.top += window.pageYOffset - docElem.clientTop;
    var uiPoint = { x: 0, y: 0 };
    if (view._isRotated) {
      uiPoint.x = box.left + glPoint.y / view._devicePixelRatio;
      uiPoint.y =
        box.top +
        box.height -
        (view._viewPortRect.width - glPoint.x) / view._devicePixelRatio;
    } else {
      uiPoint.x = box.left + glPoint.x / view._devicePixelRatio;
      uiPoint.y = box.top + box.height - glPoint.y / view._devicePixelRatio;
    }
    return uiPoint;
  }

  drawScene() {
    var renderer = this._rendererConfig.renderer;

    this.calculateDeltaTime();

    if (!this._paused) {
      this._scheduler.update(this._deltaTime);
      this._eventManager.dispatchEvent(this._eventAfterUpdate);
    }

    if (this._nextScene) {
      this.setNextScene();
    }

    if (this._runningScene) {
      if (renderer.childrenOrderDirty) {
        this._rendererConfig.renderer.clearRenderCommands();
        this._rendererConfig.renderer.assignedZ = 0;
        this._runningScene._renderCmd._curLevel = 0;
        this._runningScene.visit();
        renderer.resetFlag();
      } else if (renderer.transformDirty()) {
        renderer.transform();
      }
    }

    renderer.clear();

    if (this._notificationNode) this._notificationNode.visit();

    this._eventManager.dispatchEvent(this._eventAfterVisit);
    this._rendererConfig.resetDrawCount();

    renderer.rendering(this._rendererConfig.renderContext);
    this._totalFrames++;

    this._eventManager.dispatchEvent(this._eventAfterDraw);
    this._eventManager.frameUpdateListeners();

    this._calculateMPF();
  }

  end() {
    this._purgeDirectorInNextLoop = true;
  }

  getContentScaleFactor() {
    return this._contentScaleFactor;
  }

  getNotificationNode() {
    return this._notificationNode;
  }

  getWinSize() {
    return new Size(this._winSizeInPoints);
  }

  getWinSizeInPixels() {
    return new Size(
      this._winSizeInPoints.width * this._contentScaleFactor,
      this._winSizeInPoints.height * this._contentScaleFactor
    );
  }

  pause() {
    if (this._paused) return;

    this._oldAnimationInterval = this._animationInterval;
    this.setAnimationInterval(1 / 4.0);
    this._paused = true;
  }

  popScene() {
    assert(this._runningScene, _LogInfos.Director_popScene);

    this._scenesStack.pop();
    var c = this._scenesStack.length;

    if (c === 0) this.end();
    else {
      this._sendCleanupToScene = true;
      this._nextScene = this._scenesStack[c - 1];
    }
  }

  purgeCachedData() {
    this._animationCache._clear();
    this._spriteFrameCache._clear();
    this._textureCache._clear();
  }

  purgeDirector() {
    this.getScheduler().unscheduleAll();

    if (this._eventManager)
      this._eventManager.enabled = false;

    if (this._runningScene) {
      this._runningScene._performRecursive(
        Node._stateCallbackType.onExitTransitionDidStart
      );
      this._runningScene._performRecursive(Node._stateCallbackType.onExit);
      this._runningScene._performRecursive(Node._stateCallbackType.cleanup);
    }

    this._runningScene = null;
    this._nextScene = null;

    this._scenesStack.length = 0;

    this.stopAnimation();

    this.purgeCachedData();

    checkGLErrorDebug();
  }

  pushScene(scene) {
    assert(scene, _LogInfos.Director_pushScene);

    this._sendCleanupToScene = false;

    this._scenesStack.push(scene);
    this._nextScene = scene;
  }

  runScene(scene) {
    assert(scene, _LogInfos.Director_pushScene);

    if (!this._runningScene) {
      this.pushScene(scene);
      this.startAnimation();
    } else {
      var i = this._scenesStack.length;
      if (i === 0) {
        this._sendCleanupToScene = true;
        this._scenesStack[i] = scene;
        this._nextScene = scene;
      } else {
        this._sendCleanupToScene = true;
        this._scenesStack[i - 1] = scene;
        this._nextScene = scene;
      }
    }
  }

  resume() {
    if (!this._paused) {
      return;
    }

    this.setAnimationInterval(this._oldAnimationInterval);
    this._lastUpdate = Date.now();
    if (!this._lastUpdate) {
      log(_LogInfos.Director_resume);
    }

    this._paused = false;
    this._deltaTime = 0;
  }

  setContentScaleFactor(scaleFactor) {
    if (scaleFactor !== this._contentScaleFactor) {
      this._contentScaleFactor = scaleFactor;
    }
  }

  setDefaultValues() {}

  // Renderer-delegated methods
  getProjection() {
    return this._rendererDelegate.getProjection();
  }

  setProjection(projection) {
    this._rendererDelegate.setProjection(projection);
  }

  setDepthTest(on) {
    this._rendererDelegate.setDepthTest(on);
  }

  setClearColor(clearColor) {
    this._rendererDelegate.setClearColor(clearColor);
  }

  setOpenGLView(openGLView) {
    this._rendererDelegate.setOpenGLView(openGLView);
  }

  getVisibleSize() {
    return this._rendererDelegate.getVisibleSize();
  }

  getVisibleOrigin() {
    return this._rendererDelegate.getVisibleOrigin();
  }

  getOpenGLView() {
    return this._rendererDelegate.getOpenGLView();
  }

  getZEye() {
    return this._rendererDelegate.getZEye();
  }

  setViewport() {
    this._rendererDelegate.setViewport();
  }

  setAlphaBlending(on) {
    this._rendererDelegate.setAlphaBlending(on);
  }

  setGLDefaultValues() {
    this._rendererDelegate.setGLDefaultValues();
  }

  setNextDeltaTimeZero(nextDeltaTimeZero) {
    this._nextDeltaTimeZero = nextDeltaTimeZero;
  }

  setNextScene() {
    var runningIsTransition = false,
      newIsTransition = false;
    if (this.TransitionSceneClass) {
      runningIsTransition = this._runningScene
        ? this._runningScene instanceof this.TransitionSceneClass
        : false;
      newIsTransition = this._nextScene
        ? this._nextScene instanceof this.TransitionSceneClass
        : false;
    }

    if (!newIsTransition) {
      var locRunningScene = this._runningScene;
      if (locRunningScene) {
        locRunningScene._performRecursive(
          Node._stateCallbackType.onExitTransitionDidStart
        );
        locRunningScene._performRecursive(Node._stateCallbackType.onExit);
      }

      if (this._sendCleanupToScene && locRunningScene)
        locRunningScene._performRecursive(Node._stateCallbackType.cleanup);
    }

    this._runningScene = this._nextScene;
    this._rendererConfig.renderer.childrenOrderDirty = true;

    this._nextScene = null;
    if (!runningIsTransition && this._runningScene !== null) {
      this._runningScene._performRecursive(Node._stateCallbackType.onEnter);
      this._runningScene._performRecursive(
        Node._stateCallbackType.onEnterTransitionDidFinish
      );
    }
  }

  setNotificationNode(node) {
    this._rendererConfig.renderer.childrenOrderDirty = true;
    if (this._notificationNode) {
      this._notificationNode._performRecursive(
        Node._stateCallbackType.onExitTransitionDidStart
      );
      this._notificationNode._performRecursive(Node._stateCallbackType.onExit);
      this._notificationNode._performRecursive(Node._stateCallbackType.cleanup);
    }
    this._notificationNode = node;
    if (!node) return;
    this._notificationNode._performRecursive(Node._stateCallbackType.onEnter);
    this._notificationNode._performRecursive(
      Node._stateCallbackType.onEnterTransitionDidFinish
    );
  }

  getDelegate() {
    return this._projectionDelegate;
  }

  setDelegate(delegate) {
    this._projectionDelegate = delegate;
  }

  isSendCleanupToScene() {
    return this._sendCleanupToScene;
  }

  getRunningScene() {
    return this._runningScene;
  }

  getAnimationInterval() {
    return this._animationInterval;
  }

  isDisplayStats() {
    return this._profiler.isShowingStats();
  }

  setDisplayStats(displayStats) {
    displayStats ? this._profiler.showStats() : this._profiler.hideStats();
  }

  getSecondsPerFrame() {
    return this._secondsPerFrame;
  }

  isNextDeltaTimeZero() {
    return this._nextDeltaTimeZero;
  }

  isPaused() {
    return this._paused;
  }

  getTotalFrames() {
    return this._totalFrames;
  }

  popToRootScene() {
    this.popToSceneStackLevel(1);
  }

  popToSceneStackLevel(level) {
    assert(this._runningScene, _LogInfos.Director_popToSceneStackLevel_2);

    var locScenesStack = this._scenesStack;
    var c = locScenesStack.length;

    if (level === 0) {
      this.end();
      return;
    }
    if (level >= c) return;

    while (c > level) {
      var current = locScenesStack.pop();
      if (current.running) {
        current._performRecursive(
          Node._stateCallbackType.onExitTransitionDidStart
        );
        current._performRecursive(Node._stateCallbackType.onExit);
      }
      current._performRecursive(Node._stateCallbackType.cleanup);
      c--;
    }
    this._nextScene = locScenesStack[locScenesStack.length - 1];
    this._sendCleanupToScene = true;
  }

  getScheduler() {
    return this._scheduler;
  }

  setScheduler(scheduler) {
    if (this._scheduler !== scheduler) {
      this._scheduler = scheduler;
    }
  }

  getActionManager() {
    return this._actionManager;
  }

  setActionManager(actionManager) {
    if (this._actionManager !== actionManager) {
      this._actionManager = actionManager;
    }
  }

  getDeltaTime() {
    return this._deltaTime;
  }

  _calculateMPF() {
    var now = Date.now();
    this._secondsPerFrame = (now - this._lastUpdate) / 1000;
  }
}

export class DisplayLinkDirector extends Director {
  constructor() {
    super();
    this.invalid = false;
  }

  startAnimation() {
    this._nextDeltaTimeZero = true;
    this.invalid = false;
  }

  mainLoop() {
    if (this._purgeDirectorInNextLoop) {
      this._purgeDirectorInNextLoop = false;
      this.purgeDirector();
    } else if (!this.invalid) {
      this.drawScene();
    }
  }

  stopAnimation() {
    this.invalid = true;
  }

  setAnimationInterval(value) {
    this._animationInterval = value;
    if (!this.invalid) {
      this.stopAnimation();
      this.startAnimation();
    }
  }
}

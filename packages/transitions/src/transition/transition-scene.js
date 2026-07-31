import { Scene, Node, NodeStateCallbackType, ServiceLocator } from "@aspect/core";

export class TransitionScene extends Scene {
  _inScene = null;
  _outScene = null;
  _duration = null;
  _isInSceneOnTop = false;
  _isSendCleanupToScene = false;

  constructor(t, scene) {
    super();
    if (t !== undefined && scene !== undefined) this.initWithDuration(t, scene);
  }

  _setNewScene(dt) {
    this.scheduler.unschedule(this._setNewScene);
    var director = ServiceLocator.director;
    this._isSendCleanupToScene = director.sendCleanupToScene;
    director.runScene(this._inScene);
    ServiceLocator.eventManager.enabled = true;
    this._outScene.visible = true;
  }

  _sceneOrder() {
    this._isInSceneOnTop = true;
  }

  visit() {
    if (this._isInSceneOnTop) {
      this._outScene.visit();
      this._inScene.visit();
    } else {
      this._inScene.visit();
      this._outScene.visit();
    }
    Node.prototype.visit.call(this);
  }

  onEnter() {
    Node.prototype.onEnter.call(this);
    ServiceLocator.eventManager.enabled = false;
    this._outScene.performRecursive(
      NodeStateCallbackType.onExitTransitionDidStart
    );
    this._inScene.performRecursive(NodeStateCallbackType.onEnter);
  }

  onExit() {
    Node.prototype.onExit.call(this);
    ServiceLocator.eventManager.enalbed = true;
    this._outScene.performRecursive(NodeStateCallbackType.onExit);
    this._inScene.performRecursive(
      NodeStateCallbackType.onEnterTransitionDidFinish
    );
  }

  cleanup() {
    Node.prototype.cleanup.call(this);
    if (this._isSendCleanupToScene)
      this._outScene.performRecursive(NodeStateCallbackType.cleanup);
  }

  initWithDuration(t, scene) {
    if (!scene)
      throw new Error(
        "TransitionScene.initWithDuration(): Argument scene must be non-nil"
      );

    if (this.init()) {
      this._duration = t;
      this.x = 0;
      this.y = 0;
      this.anchorX = 0;
      this.anchorY = 0;;
      this._inScene = scene;
      this._outScene = ServiceLocator.director.runningScene;
      if (!this._outScene) {
        this._outScene = new Scene();
        this._outScene.init();
      }

      if (this._inScene === this._outScene)
        throw new Error(
          "TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene"
        );

      this._sceneOrder();
      return true;
    } else {
      return false;
    }
  }

  finish() {
    this._inScene.visible = true;
    this._inScene.x = 0;
    this._inScene.y = 0;
    this._inScene.scale = 1.0;
    this._inScene.rotation = 0.0;;

    this._outScene.visible = false;
    this._outScene.x = 0;
    this._outScene.y = 0;
    this._outScene.scale = 1.0;
    this._outScene.rotation = 0.0;;

    this.scheduler.schedule(this._setNewScene, 0);
  }

  hideOutShowIn() {
    this._inScene.visible = true;
    this._outScene.visible = false;
  }
}

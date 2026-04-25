import { Scene, Node, Director, EventManager } from "@aspect/core";

export class TransitionScene extends Scene {
  _inScene = null;
  _outScene = null;
  _duration = null;
  _isInSceneOnTop = false;
  _isSendCleanupToScene = false;
  _className = "TransitionScene";

  constructor(t, scene) {
    super();
    if (t !== undefined && scene !== undefined) this.initWithDuration(t, scene);
  }

  _setNewScene(dt) {
    this.unschedule(this._setNewScene);
    var director = Director.getInstance();
    this._isSendCleanupToScene = director.isSendCleanupToScene();
    director.runScene(this._inScene);
    EventManager.getInstance().setEnabled(true);
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
    EventManager.getInstance().setEnabled(false);
    this._outScene._performRecursive(
      Node._stateCallbackType.onExitTransitionDidStart
    );
    this._inScene._performRecursive(Node._stateCallbackType.onEnter);
  }

  onExit() {
    Node.prototype.onExit.call(this);
    EventManager.getInstance().setEnabled(true);
    this._outScene._performRecursive(Node._stateCallbackType.onExit);
    this._inScene._performRecursive(
      Node._stateCallbackType.onEnterTransitionDidFinish
    );
  }

  cleanup() {
    Node.prototype.cleanup.call(this);
    if (this._isSendCleanupToScene)
      this._outScene._performRecursive(Node._stateCallbackType.cleanup);
  }

  initWithDuration(t, scene) {
    if (!scene)
      throw new Error(
        "cc.TransitionScene.initWithDuration(): Argument scene must be non-nil"
      );

    if (this.init()) {
      this._duration = t;
      this.attr({
        x: 0,
        y: 0,
        anchorX: 0,
        anchorY: 0
      });
      this._inScene = scene;
      this._outScene = Director.getInstance().getRunningScene();
      if (!this._outScene) {
        this._outScene = new Scene();
        this._outScene.init();
      }

      if (this._inScene === this._outScene)
        throw new Error(
          "cc.TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene"
        );

      this._sceneOrder();
      return true;
    } else {
      return false;
    }
  }

  finish() {
    this._inScene.attr({
      visible: true,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0.0
    });

    this._outScene.attr({
      visible: false,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0.0
    });

    this.schedule(this._setNewScene, 0);
  }

  hideOutShowIn() {
    this._inScene.visible = true;
    this._outScene.visible = false;
  }
}

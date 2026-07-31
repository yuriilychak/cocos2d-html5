import { Node, NodeStateCallbackType, Size, ServiceLocator } from "@aspect/core";
import { NodeGrid } from "@aspect/node-grid";
import { fadeOutTRTiles, stopGrid } from "@aspect/actions3d";
import { Sequence, CallFunc } from "@aspect/actions";
import { TransitionScene } from "./transition-scene";

export class TransitionFadeTR extends TransitionScene {
  _gridProxy = null;

  constructor(t, scene) {
    super();
    this._gridProxy = new NodeGrid();
    scene && this.initWithDuration(t, scene);
  }

  _sceneOrder() {
    this._isInSceneOnTop = false;
  }

  onEnter() {
    super.onEnter();

    this._gridProxy.setTarget(this._outScene);
    this._gridProxy.performRecursive(NodeStateCallbackType.onEnter);

    var winSize = ServiceLocator.eglView.winSizeInPoints;
    var aspect = winSize.width / winSize.height;
    var x = 0 | (12 * aspect);
    var y = 12;

    var action = this.actionWithSize(new Size(x, y));
    this._gridProxy.actionManager.runAction(
      new Sequence(
        this.easeActionWithAction(action),
        new CallFunc(this.finish, this),
        stopGrid()
      )
    );
  }

  visit() {
    this._inScene.visit();
    this._gridProxy.visit();
  }

  easeActionWithAction(action) {
    return action;
  }

  actionWithSize(size) {
    return fadeOutTRTiles(this._duration, size);
  }
}

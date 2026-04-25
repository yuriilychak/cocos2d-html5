import { Director, Node, Size } from "@aspect/core";
import { NodeGrid } from "@aspect/node-grid";
import { pageTurn3D, reverseTime, stopGrid } from "@aspect/actions3d";
import { sequence, CallFunc, Show } from "@aspect/actions";
import { TransitionScene } from "./transition/transition-scene";

export class TransitionPageTurn extends TransitionScene {
  _back = true;
  _gridProxy = null;
  _className = "TransitionPageTurn";

  constructor(t, scene, backwards) {
    super();
    this._gridProxy = new NodeGrid();
    this.initWithDuration(t, scene, backwards);
  }

  initWithDuration(t, scene, backwards) {
    this._back = backwards;
    if (super.initWithDuration(t, scene)) {
      // do something
    }
    return true;
  }

  actionWithSize(vector) {
    if (this._back)
      return reverseTime(pageTurn3D(this._duration, vector));
    else return pageTurn3D(this._duration, vector);
  }

  onEnter() {
    super.onEnter();
    var winSize = Director.getInstance().getWinSize();
    var x, y;
    if (winSize.width > winSize.height) {
      x = 16;
      y = 12;
    } else {
      x = 12;
      y = 16;
    }

    var action = this.actionWithSize(new Size(x, y)),
      gridProxy = this._gridProxy;

    if (!this._back) {
      gridProxy.setTarget(this._outScene);
      gridProxy._performRecursive(Node._stateCallbackType.onEnter);
      gridProxy.runAction(
        sequence(action, new CallFunc(this.finish, this), stopGrid())
      );
    } else {
      gridProxy.setTarget(this._inScene);
      gridProxy._performRecursive(Node._stateCallbackType.onEnter);
      this._inScene.visible = false;
      gridProxy.runAction(
        sequence(action, new CallFunc(this.finish, this), stopGrid())
      );
      this._inScene.runAction(new Show());
    }
  }

  visit() {
    if (this._back) this._outScene.visit();
    else this._inScene.visit();
    this._gridProxy.visit();
  }

  _sceneOrder() {
    this._isInSceneOnTop = this._back;
  }
}

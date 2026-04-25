import { Node } from "@aspect/core";
import { EaseInOut, sequence, CallFunc } from "@aspect/actions";
import { NodeGrid } from "@aspect/node-grid";
import { splitCols, stopGrid } from "@aspect/actions3d";
import { TransitionScene } from "./transition-scene";

export class TransitionSplitCols extends TransitionScene {
  _gridProxy = null;

  _switchTargetToInscene() {
    this._gridProxy.setTarget(this._inScene);
  }

  constructor(t, scene) {
    super();
    this._gridProxy = new NodeGrid();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();
    this._gridProxy.setTarget(this._outScene);
    this._gridProxy._performRecursive(Node._stateCallbackType.onEnter);

    var split = this.action();
    var seq = sequence(
      split,
      new CallFunc(this._switchTargetToInscene, this),
      split.reverse()
    );

    this._gridProxy.runAction(
      sequence(
        this.easeActionWithAction(seq),
        new CallFunc(this.finish, this),
        stopGrid()
      )
    );
  }

  onExit() {
    this._gridProxy.setTarget(null);
    this._gridProxy._performRecursive(Node._stateCallbackType.onExit);
    super.onExit();
  }

  visit() {
    this._gridProxy.visit();
  }

  easeActionWithAction(action) {
    return new EaseInOut(action, 3.0);
  }

  action() {
    return splitCols(this._duration / 2.0, 3);
  }
}

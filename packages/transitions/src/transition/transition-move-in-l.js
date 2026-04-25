import { Director, Point } from "@aspect/core";
import { EaseOut } from "@aspect/actions";
import { TransitionScene } from "./transition-scene";

export class TransitionMoveInL extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();
    this.initScenes();

    var action = this.action();
    this._inScene.runAction(
      cc.sequence(
        this.easeActionWithAction(action),
        cc.callFunc(this.finish, this)
      )
    );
  }

  initScenes() {
    this._inScene.setPosition(-Director.getInstance().getWinSize().width, 0);
  }

  action() {
    return cc.moveTo(this._duration, new Point(0, 0));
  }

  easeActionWithAction(action) {
    return new EaseOut(action, 2.0);
  }
}

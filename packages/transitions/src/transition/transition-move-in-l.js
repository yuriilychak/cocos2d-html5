import { Director, Point } from "@aspect/core";
import { EaseOut, sequence, MoveTo, CallFunc } from "@aspect/actions";
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
      sequence(
        this.easeActionWithAction(action),
        new CallFunc(this.finish, this)
      )
    );
  }

  initScenes() {
    this._inScene.setPosition(-Director.getInstance().getWinSize().width, 0);
  }

  action() {
    return new MoveTo(this._duration, new Point(0, 0));
  }

  easeActionWithAction(action) {
    return new EaseOut(action, 2.0);
  }
}

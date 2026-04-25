import { Director, Point } from "@aspect/core";
import { EaseInOut, sequence, MoveBy, CallFunc } from "@aspect/actions";
import { ADJUST_FACTOR } from "./constants";
import { TransitionScene } from "./transition-scene";

export class TransitionSlideInL extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  _sceneOrder() {
    this._isInSceneOnTop = false;
  }

  onEnter() {
    super.onEnter();
    this.initScenes();

    var inA = this.action();
    var outA = this.action();

    var inAction = sequence(
      this.easeActionWithAction(inA),
      new CallFunc(this.finish, this)
    );
    var outAction = this.easeActionWithAction(outA);
    this._inScene.runAction(inAction);
    this._outScene.runAction(outAction);
  }

  initScenes() {
    this._inScene.setPosition(
      -Director.getInstance().getWinSize().width + ADJUST_FACTOR,
      0
    );
  }

  action() {
    return new MoveBy(
      this._duration,
      new Point(Director.getInstance().getWinSize().width - ADJUST_FACTOR, 0)
    );
  }

  easeActionWithAction(action) {
    return new EaseInOut(action, 2.0);
  }
}

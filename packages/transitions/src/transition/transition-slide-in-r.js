import { Director, Point } from "@aspect/core";
import { ADJUST_FACTOR } from "./constants";
import { TransitionSlideInL } from "./transition-slide-in-l";

export class TransitionSlideInR extends TransitionSlideInL {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  _sceneOrder() {
    this._isInSceneOnTop = true;
  }

  initScenes() {
    this._inScene.setPosition(
      Director.getInstance().getWinSize().width - ADJUST_FACTOR,
      0
    );
  }

  action() {
    return cc.moveBy(
      this._duration,
      new Point(
        -(Director.getInstance().getWinSize().width - ADJUST_FACTOR),
        0
      )
    );
  }
}

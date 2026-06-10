import { Point, ServiceLocator } from "@aspect/core";
import { MoveBy } from "@aspect/actions";
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
      ServiceLocator.director.getWinSize().width - ADJUST_FACTOR,
      0
    );
  }

  action() {
    return new MoveBy(
      this._duration,
      new Point(
        -(ServiceLocator.director.getWinSize().width - ADJUST_FACTOR),
        0
      )
    );
  }
}

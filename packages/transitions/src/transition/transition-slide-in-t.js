import { Point, ServiceLocator } from "@aspect/core";
import { MoveBy } from "@aspect/actions";
import { ADJUST_FACTOR } from "./constants";
import { TransitionSlideInL } from "./transition-slide-in-l";

export class TransitionSlideInT extends TransitionSlideInL {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  _sceneOrder() {
    this._isInSceneOnTop = true;
  }

  initScenes() {
    this._inScene.position = { x: 0, y: ServiceLocator.eglView.winSizeInPoints.height - ADJUST_FACTOR };
  }

  action() {
    return new MoveBy(
      this._duration,
      new Point(
        0,
        -(ServiceLocator.eglView.winSizeInPoints.height - ADJUST_FACTOR)
      )
    );
  }
}

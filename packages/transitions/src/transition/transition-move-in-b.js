import { ServiceLocator } from "@aspect/core";
import { TransitionMoveInL } from "./transition-move-in-l";

export class TransitionMoveInB extends TransitionMoveInL {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  initScenes() {
    this._inScene.position = { x: 0, y: -ServiceLocator.eglView.winSizeInPoints.height };
  }
}

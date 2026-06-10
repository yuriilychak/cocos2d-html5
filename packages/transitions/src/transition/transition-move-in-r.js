import { ServiceLocator } from "@aspect/core";
import { TransitionMoveInL } from "./transition-move-in-l";

export class TransitionMoveInR extends TransitionMoveInL {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  initScenes() {
    this._inScene.setPosition(ServiceLocator.director.getWinSize().width, 0);
  }
}

import { Director } from "@aspect/core";
import { TransitionMoveInL } from "./transition-move-in-l";

export class TransitionMoveInR extends TransitionMoveInL {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  initScenes() {
    this._inScene.setPosition(Director.getInstance().getWinSize().width, 0);
  }
}

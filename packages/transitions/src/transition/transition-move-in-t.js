import { Director } from "@aspect/core";
import { TransitionMoveInL } from "./transition-move-in-l";

export class TransitionMoveInT extends TransitionMoveInL {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  initScenes() {
    this._inScene.setPosition(0, Director.getInstance().getWinSize().height);
  }
}

import { TransitionScene } from "./transition-scene";

export class TransitionSceneOriented extends TransitionScene {
  _orientation = 0;

  constructor(t, scene, orientation) {
    super();
    orientation != undefined && this.initWithDuration(t, scene, orientation);
  }

  initWithDuration(t, scene, orientation) {
    if (super.initWithDuration(t, scene)) {
      this._orientation = orientation;
    }
    return true;
  }
}

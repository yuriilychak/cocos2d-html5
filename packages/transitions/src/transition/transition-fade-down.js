import { TransitionFadeTR } from "./transition-fade-tr";
import { fadeOutDownTiles } from "@aspect/actions3d";

export class TransitionFadeDown extends TransitionFadeTR {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  actionWithSize(size) {
    return fadeOutDownTiles(this._duration, size);
  }
}

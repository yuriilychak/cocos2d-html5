import { TransitionFadeTR } from "./transition-fade-tr";
import { fadeOutBLTiles } from "@aspect/actions3d";

export class TransitionFadeBL extends TransitionFadeTR {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  actionWithSize(size) {
    return fadeOutBLTiles(this._duration, size);
  }
}

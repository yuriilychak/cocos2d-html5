import { TransitionFadeTR } from "./transition-fade-tr";
import { FadeOutUpTiles } from "@aspect/actions3d";

export class TransitionFadeUp extends TransitionFadeTR {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  actionWithSize(size) {
    return new FadeOutUpTiles(this._duration, size);
  }
}

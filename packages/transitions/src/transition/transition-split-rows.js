import { TransitionSplitCols } from "./transition-split-cols";
import { splitRows } from "@aspect/actions3d";

export class TransitionSplitRows extends TransitionSplitCols {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  action() {
    return splitRows(this._duration / 2.0, 3);
  }
}

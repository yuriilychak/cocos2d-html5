import Grid3DAction from "../action-grid/grid3d-action";
import { Point, rand } from "@aspect/core";

/**
 * Shaky3D action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Size} gridSize
 * @param {Number} range
 * @param {Boolean} shakeZ
 */
export default class Shaky3D extends Grid3DAction {
  _randRange = 0;
  _shakeZ = false;

  /**
   * Create a shaky3d action with a range, shake Z vertices.
   * @param {Number} duration
   * @param {Size} gridSize
   * @param {Number} range
   * @param {Boolean} shakeZ
   */
  constructor(duration, gridSize, range, shakeZ) {
    super();
    shakeZ !== undefined &&
      this.initWithDuration(duration, gridSize, range, shakeZ);
  }

  initWithDuration(duration, gridSize, range, shakeZ) {
    if (super.initWithDuration(duration, gridSize)) {
      this._randRange = range;
      this._shakeZ = shakeZ;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    const locGridSizeWidth = this._gridSize.width;
    const locGridSizeHeight = this._gridSize.height;
    const locRandRange = this._randRange;
    const locShakeZ = this._shakeZ;
    const locP = new Point(0, 0);
    let v;
    for (let i = 0; i < locGridSizeWidth + 1; ++i) {
      for (let j = 0; j < locGridSizeHeight + 1; ++j) {
        locP.x = i;
        locP.y = j;
        v = this.getOriginalVertex(locP);
        v.x += (rand() % (locRandRange * 2)) - locRandRange;
        v.y += (rand() % (locRandRange * 2)) - locRandRange;
        if (locShakeZ) v.z += (rand() % (locRandRange * 2)) - locRandRange;
        this.setVertex(locP, v);
      }
    }
  }
}

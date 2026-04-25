import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";
import { Point, rand } from "@aspect/core";

/**
 * ShatteredTiles3D action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Size} gridSize
 * @param {Number} range
 * @param {Boolean} shatterZ
 */
export default class ShatteredTiles3D extends TiledGrid3DAction {
  _randRange = 0;
  _once = false;
  _shatterZ = false;

  /**
   * Creates the action with a range, whether of not to shatter Z vertices, a grid size and duration.
   * @param {Number} duration
   * @param {Size} gridSize
   * @param {Number} range
   * @param {Boolean} shatterZ
   */
  constructor(duration, gridSize, range, shatterZ) {
    super();
    shatterZ !== undefined &&
      this.initWithDuration(duration, gridSize, range, shatterZ);
  }

  initWithDuration(duration, gridSize, range, shatterZ) {
    if (super.initWithDuration(duration, gridSize)) {
      this._once = false;
      this._randRange = range;
      this._shatterZ = shatterZ;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    if (this._once === false) {
      const locGridSize = this._gridSize;
      const locRandRange = this._randRange;
      let coords;
      const locPos = new Point(0, 0);
      for (let i = 0; i < locGridSize.width; ++i) {
        for (let j = 0; j < locGridSize.height; ++j) {
          locPos.x = i;
          locPos.y = j;
          coords = this.getOriginalTile(locPos);

          // X
          coords.bl.x += (rand() % (locRandRange * 2)) - locRandRange;
          coords.br.x += (rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.x += (rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.x += (rand() % (locRandRange * 2)) - locRandRange;

          // Y
          coords.bl.y += (rand() % (locRandRange * 2)) - locRandRange;
          coords.br.y += (rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.y += (rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.y += (rand() % (locRandRange * 2)) - locRandRange;

          if (this._shatterZ) {
            coords.bl.z += (rand() % (locRandRange * 2)) - locRandRange;
            coords.br.z += (rand() % (locRandRange * 2)) - locRandRange;
            coords.tl.z += (rand() % (locRandRange * 2)) - locRandRange;
            coords.tr.z += (rand() % (locRandRange * 2)) - locRandRange;
          }
          this.setTile(locPos, coords);
        }
      }
      this._once = true;
    }
  }
}

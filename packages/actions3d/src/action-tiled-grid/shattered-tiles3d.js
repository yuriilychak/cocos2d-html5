import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";

/**
 * cc.ShatteredTiles3D action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
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
   * @param {cc.Size} gridSize
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
      const locPos = new cc.Point(0, 0);
      for (let i = 0; i < locGridSize.width; ++i) {
        for (let j = 0; j < locGridSize.height; ++j) {
          locPos.x = i;
          locPos.y = j;
          coords = this.getOriginalTile(locPos);

          // X
          coords.bl.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.br.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.x += (cc.rand() % (locRandRange * 2)) - locRandRange;

          // Y
          coords.bl.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.br.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.y += (cc.rand() % (locRandRange * 2)) - locRandRange;

          if (this._shatterZ) {
            coords.bl.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
            coords.br.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
            coords.tl.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
            coords.tr.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
          }
          this.setTile(locPos, coords);
        }
      }
      this._once = true;
    }
  }
}

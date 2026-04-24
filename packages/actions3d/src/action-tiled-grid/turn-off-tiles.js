import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";

/**
 * cc.TurnOffTiles action.
 * Turn off the tiles in random order.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number|Null} [seed=0]
 */
export default class TurnOffTiles extends TiledGrid3DAction {
  _seed = null;
  _tilesCount = 0;
  _tilesOrder = null;

  /**
   * Creates the action with a random seed, the grid size and the duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number|Null} [seed=0]
   */
  constructor(duration, gridSize, seed) {
    super();
    this._tilesOrder = [];

    gridSize !== undefined && this.initWithDuration(duration, gridSize, seed);
  }

  initWithDuration(duration, gridSize, seed) {
    if (super.initWithDuration(duration, gridSize)) {
      this._seed = seed || 0;
      this._tilesOrder.length = 0;
      return true;
    }
    return false;
  }

  shuffle(array, len) {
    for (let i = len - 1; i >= 0; i--) {
      const j = 0 | (cc.rand() % (i + 1));
      const v = array[i];
      array[i] = array[j];
      array[j] = v;
    }
  }

  turnOnTile(pos) {
    this.setTile(pos, this.getOriginalTile(pos));
  }

  turnOffTile(pos) {
    this.setTile(pos, new cc.Quad3());
  }

  startWithTarget(target) {
    super.startWithTarget(target);

    this._tilesCount = this._gridSize.width * this._gridSize.height;
    const locTilesOrder = this._tilesOrder;
    locTilesOrder.length = 0;
    for (let i = 0; i < this._tilesCount; ++i) locTilesOrder[i] = i;
    this.shuffle(locTilesOrder, this._tilesCount);
  }

  update(dt) {
    const l = 0 | (dt * this._tilesCount);
    const locGridSize = this._gridSize;
    let t;
    const tilePos = new cc.Point(0, 0);
    const locTilesOrder = this._tilesOrder;
    for (let i = 0; i < this._tilesCount; i++) {
      t = locTilesOrder[i];
      tilePos.x = 0 | (t / locGridSize.height);
      tilePos.y = t % (0 | locGridSize.height);
      if (i < l) this.turnOffTile(tilePos);
      else this.turnOnTile(tilePos);
    }
  }
}

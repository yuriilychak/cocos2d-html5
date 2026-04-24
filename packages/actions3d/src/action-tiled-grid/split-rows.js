import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";

/**
 * cc.SplitRows action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Number} rows
 */
export default class SplitRows extends TiledGrid3DAction {
  _rows = 0;
  _winSize = null;

  /**
   * creates the action with the number of rows to split and the duration.
   * @param {Number} duration
   * @param {Number} rows
   */
  constructor(duration, rows) {
    super();
    rows !== undefined && this.initWithDuration(duration, rows);
  }

  initWithDuration(duration, rows) {
    this._rows = rows;
    return super.initWithDuration(duration, new cc.Size(1, rows));
  }

  update(dt) {
    const locGridSize = this._gridSize;
    const locWinSizeWidth = this._winSize.width;
    let coords, direction;
    const locPos = new cc.Point(0, 0);
    for (let j = 0; j < locGridSize.height; ++j) {
      locPos.y = j;
      coords = this.getOriginalTile(locPos);
      direction = 1;

      if (j % 2 === 0) direction = -1;

      coords.bl.x += direction * locWinSizeWidth * dt;
      coords.br.x += direction * locWinSizeWidth * dt;
      coords.tl.x += direction * locWinSizeWidth * dt;
      coords.tr.x += direction * locWinSizeWidth * dt;

      this.setTile(locPos, coords);
    }
  }

  startWithTarget(target) {
    super.startWithTarget(target);
    this._winSize = cc.director.getWinSizeInPixels();
  }
}

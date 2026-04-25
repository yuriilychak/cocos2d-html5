import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";
import { Size, Point, Director, RendererConfig } from "@aspect/core";

/**
 * SplitCols action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Number} cols
 */
export default class SplitCols extends TiledGrid3DAction {
  _cols = 0;
  _winSize = null;

  /**
   * Creates the action with the number of columns to split and the duration.
   * @param {Number} duration
   * @param {Number} cols
   */
  constructor(duration, cols) {
    super();
    cols !== undefined && this.initWithDuration(duration, cols);
  }

  initWithDuration(duration, cols) {
    this._cols = cols;
    return super.initWithDuration(duration, new Size(cols, 1));
  }

  update(dt) {
    const locGridSizeWidth = this._gridSize.width;
    const locWinSizeHeight = this._winSize.height;
    let coords, direction;
    const locPos = new Point(0, 0);
    for (let i = 0; i < locGridSizeWidth; ++i) {
      locPos.x = i;
      coords = this.getOriginalTile(locPos);
      direction = 1;

      if (i % 2 === 0) direction = -1;

      coords.bl.y += direction * locWinSizeHeight * dt;
      coords.br.y += direction * locWinSizeHeight * dt;
      coords.tl.y += direction * locWinSizeHeight * dt;
      coords.tr.y += direction * locWinSizeHeight * dt;

      this.setTile(locPos, coords);
    }
    RendererConfig.getInstance().renderer.childrenOrderDirty = true;
  }

  startWithTarget(target) {
    super.startWithTarget(target);
    this._winSize = Director.getInstance().getWinSizeInPixels();
  }
}

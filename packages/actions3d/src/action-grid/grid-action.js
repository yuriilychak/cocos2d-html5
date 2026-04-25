import { ActionInterval, ReverseTime } from "@aspect/actions";
import { Size, RendererConfig, Sys, log } from "@aspect/core";

/**
 * Base class for Grid actions
 * @param {Number} duration
 * @param {Size} gridSize
 */
export default class GridAction extends ActionInterval {
  _gridSize = null;
  _gridNodeTarget = null;

  /**
   * Constructor function
   * @param {Number} duration
   * @param {Size} gridSize
   */
  constructor(duration, gridSize) {
    Sys.getInstance()._checkWebGLRenderMode();
    super();
    this._gridSize = new Size(0, 0);

    gridSize && this.initWithDuration(duration, gridSize);
  }

  _cacheTargetAsGridNode(target) {
    this._gridNodeTarget = target;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {GridAction}
   */
  clone() {
    const action = new GridAction();
    const locGridSize = this._gridSize;
    action.initWithDuration(
      this._duration,
      new Size(locGridSize.width, locGridSize.height)
    );
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    RendererConfig.getInstance().renderer.childrenOrderDirty = true;
    this._cacheTargetAsGridNode(target);

    const newGrid = this.getGrid();

    const targetGrid = this._gridNodeTarget.getGrid();
    if (targetGrid && targetGrid.getReuseGrid() > 0) {
      const locGridSize = targetGrid.getGridSize();
      if (
        targetGrid.isActive() &&
        locGridSize.width === this._gridSize.width &&
        locGridSize.height === this._gridSize.height
      )
        targetGrid.reuse();
    } else {
      if (targetGrid && targetGrid.isActive()) targetGrid.setActive(false);
      this._gridNodeTarget.setGrid(newGrid);
      this._gridNodeTarget.getGrid().setActive(true);
    }
  }

  /**
   * Create a ReverseTime action. Opposite with the original motion trajectory.
   * @return {ReverseTime}
   */
  reverse() {
    return new ReverseTime(this);
  }

  /**
   * Initializes the action with size and duration.
   * @param {Number} duration
   * @param {Size} gridSize
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize) {
    if (super.initWithDuration(duration)) {
      this._gridSize.width = gridSize.width;
      this._gridSize.height = gridSize.height;
      return true;
    }
    return false;
  }

  /**
   * Returns the grid.
   * @return {GridBase}
   */
  getGrid() {
    // Abstract class needs implementation
    log("GridAction.getGrid(): it should be overridden in subclass.");
  }
}

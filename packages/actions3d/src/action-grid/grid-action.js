import { ActionInterval } from "@aspect/actions";

/**
 * Base class for Grid actions
 * @param {Number} duration
 * @param {cc.Size} gridSize
 */
export default class GridAction extends ActionInterval {
  _gridSize = null;
  _gridNodeTarget = null;

  /**
   * Constructor function
   * @param {Number} duration
   * @param {cc.Size} gridSize
   */
  constructor(duration, gridSize) {
    cc.sys._checkWebGLRenderMode();
    super();
    this._gridSize = new cc.Size(0, 0);

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
      new cc.Size(locGridSize.width, locGridSize.height)
    );
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    cc.rendererConfig.renderer.childrenOrderDirty = true;
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
   * Create a cc.ReverseTime action. Opposite with the original motion trajectory.
   * @return {cc.ReverseTime}
   */
  reverse() {
    return new cc.ReverseTime(this);
  }

  /**
   * Initializes the action with size and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
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
   * @return {cc.GridBase}
   */
  getGrid() {
    // Abstract class needs implementation
    cc.log("cc.GridAction.getGrid(): it should be overridden in subclass.");
  }
}

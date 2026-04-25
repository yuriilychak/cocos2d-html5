import { ActionInstant } from "@aspect/actions";
import { RendererConfig } from "@aspect/core";

/**
 * ReuseGrid action
 * @param {Number} times
 */
export default class ReuseGrid extends ActionInstant {
  _times = null;

  /**
   * Constructor function
   * @param {Number} times
   */
  constructor(times) {
    super();
    times !== undefined && this.initWithTimes(times);
  }

  /**
   * initializes an action with the number of times that the current grid will be reused
   * @param {Number} times
   * @return {Boolean}
   */
  initWithTimes(times) {
    this._times = times;
    return true;
  }

  /**
   * called before the action start. It will also set the target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    RendererConfig.getInstance().renderer.childrenOrderDirty = true;
    if (this.target.grid && this.target.grid.isActive())
      this.target.grid.setReuseGrid(
        this.target.grid.getReuseGrid() + this._times
      );
  }
}

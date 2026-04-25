import { ActionInstant } from "@aspect/actions";
import { RendererConfig } from "@aspect/core";

/**
 * StopGrid action.
 * @warning Don't call this action if another grid action is active.
 * Call if you want to remove the grid effect. Example:
 * sequence(Lens.action(...), stopGrid(...), null);
 */
export default class StopGrid extends ActionInstant {
  /**
   * called before the action start. It will also set the target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    RendererConfig.getInstance().renderer.childrenOrderDirty = true;
    const grid = this.target.grid;
    if (grid && grid.isActive()) grid.setActive(false);
  }
}

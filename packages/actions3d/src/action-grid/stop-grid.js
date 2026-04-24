import { ActionInstant } from "@aspect/actions";

/**
 * cc.StopGrid action.
 * @warning Don't call this action if another grid action is active.
 * Call if you want to remove the grid effect. Example:
 * cc.sequence(Lens.action(...), cc.stopGrid(...), null);
 */
export default class StopGrid extends ActionInstant {
  /**
   * called before the action start. It will also set the target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    cc.rendererConfig.renderer.childrenOrderDirty = true;
    const grid = this.target.grid;
    if (grid && grid.isActive()) grid.setActive(false);
  }
}

import { ActionInstant } from './ActionInstant.js';

/**
 * Toggles the visibility of a node.
 * @class
 * @extends cc.ActionInstant
 */
export class ToggleVisibility extends ActionInstant {
  /** @lends cc.ToggleVisibility# */

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this.target.visible = !this.target.visible;
  }

  /**
   * returns a reversed action.
   * @returns {cc.ToggleVisibility}
   */
  reverse() {
    return new ToggleVisibility();
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.ToggleVisibility}
   */
  clone() {
    return new ToggleVisibility();
  }
};

import ActionInstant from './action-instant';
import Show from './show';

/**
 * Hide the node.
 * @class
 * @extends cc.ActionInstant
 */
export default class Hide extends ActionInstant {
  /** @lends cc.Hide# */

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this.target.visible = false;
  }

  /**
   * returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @returns {cc.Show}
   */
  reverse() {
    return new Show();
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.Hide}
   */
  clone() {
    return new Hide();
  }
};

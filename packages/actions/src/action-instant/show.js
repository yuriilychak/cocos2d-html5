import ActionInstant from './action-instant';
import Hide from './hide';

/**
 * Show the node.
 */
export default class Show extends ActionInstant {

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this.target.visible = true;
  }

  /**
   * returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @returns {cc.Hide}
   */
  reverse() {
    return new Hide();
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.FiniteTimeAction}
   */
  clone() {
    return new Show();
  }
};

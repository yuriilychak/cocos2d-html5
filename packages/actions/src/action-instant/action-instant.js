import { FiniteTimeAction } from '../action/finite-time-action.js';

/**
 * Instant actions are immediate actions. They don't have a duration like.
 * the CCIntervalAction actions.
 * @class
 * @extends cc.FiniteTimeAction
 */
export class ActionInstant extends FiniteTimeAction {
  /** @lends cc.ActionInstant# */
  /**
   * return true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return true;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   * @param {Number} dt
   */
  step(dt) {
    this.update(1);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    //nothing
  }

  /**
   * returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @returns {cc.Action}
   */
  reverse() {
    return this.clone();
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.FiniteTimeAction}
   */
  clone() {
    return new ActionInstant();
  }
};

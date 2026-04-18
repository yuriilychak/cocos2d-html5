import { ActionInterval } from './action-interval.js';

/** Delays the action a certain amount of seconds
 * @class
 * @extends cc.ActionInterval
 */
export class DelayTime extends ActionInterval {
  /** @lends cc.DelayTime# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * Will be overwrite.
   * @param {Number} dt time in seconds
   */
  update(dt) {}

  /**
   * Returns a reversed action.
   * @return {cc.DelayTime}
   */
  reverse() {
    var action = new DelayTime(this._duration);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.DelayTime}
   */
  clone() {
    var action = new DelayTime();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration);
    return action;
  }
};

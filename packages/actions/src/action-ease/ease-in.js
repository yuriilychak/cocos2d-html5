import { EaseRateAction } from './ease-rate-action.js';

/**
 * cc.EaseIn action with a rate. From slow to fast.
 *
 * @class
 * @extends cc.EaseRateAction
 *
 * @example
 * action.easing(cc.easeIn(3.0));
 */
export class EaseIn extends EaseRateAction {
  /** @lends cc.EaseIn# */

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(Math.pow(dt, this._rate));
  }

  /**
   * Create a cc.easeIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseIn}
   */
  reverse() {
    return new EaseIn(this._inner.reverse(), 1 / this._rate);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseIn}
   */
  clone() {
    var action = new EaseIn();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }
};

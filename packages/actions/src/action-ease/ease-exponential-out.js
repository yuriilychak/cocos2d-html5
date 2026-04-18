import { ActionEase } from './action-ease.js';

/**
 * Ease Exponential Out. <br />
 * Reference easeOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeExponentialOut());
 */
export class EaseExponentialOut extends ActionEase {
  /** @lends cc.EaseExponentialOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(dt === 1 ? 1 : -Math.pow(2, -10 * dt) + 1);
  }

  /**
   * Create a cc.EaseExponentialIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseExponentialIn}
   */
  reverse() {
    return new cc.EaseExponentialIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseExponentialOut}
   */
  clone() {
    var action = new EaseExponentialOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

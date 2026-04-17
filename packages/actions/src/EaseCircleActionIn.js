import { ActionEase } from './ActionEase.js';

/**
 * cc.EaseCircleActionIn action. <br />
 * Reference easeInCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCircleActionIn());
 */
export class EaseCircleActionIn extends ActionEase {
  /** @lends cc.EaseCircleActionIn# */
  _updateTime(time) {
    return -1 * (Math.sqrt(1 - time * time) - 1);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(this._updateTime(dt));
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseCircleActionIn}
   */
  clone() {
    var action = new EaseCircleActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCircleActionIn}
   */
  reverse() {
    return new EaseCircleActionIn(this._inner.reverse());
  }
};

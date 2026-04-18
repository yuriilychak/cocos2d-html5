import { ActionEase } from './action-ease.js';

/**
 * cc.EaseCircleActionOut action. <br />
 * Reference easeOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCircleActionOut());
 */
export class EaseCircleActionOut extends ActionEase {
  /** @lends cc.EaseCircleActionOut# */
  _updateTime(time) {
    time = time - 1;
    return Math.sqrt(1 - time * time);
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
   * @returns {cc.EaseCircleActionOut}
   */
  clone() {
    var action = new EaseCircleActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCircleActionOut}
   */
  reverse() {
    return new EaseCircleActionOut(this._inner.reverse());
  }
};

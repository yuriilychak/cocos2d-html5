import { ActionEase } from './action-ease.js';

/**
 * cc.EaseQuinticActionInOut action. <br />
 * Reference easeInOutQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeQuinticActionInOut());
 */
export class EaseQuinticActionInOut extends ActionEase {
  /** @lends cc.EaseQuinticActionInOut# */
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return 0.5 * time * time * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time * time * time + 2);
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
   * @returns {cc.EaseQuinticActionInOut}
   */
  clone() {
    var action = new EaseQuinticActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuinticActionInOut}
   */
  reverse() {
    return new EaseQuinticActionInOut(this._inner.reverse());
  }
};

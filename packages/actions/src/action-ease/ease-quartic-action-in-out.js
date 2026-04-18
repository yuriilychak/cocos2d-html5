import { ActionEase } from './action-ease.js';

/**
 * cc.EaseQuarticActionInOut action. <br />
 * Reference easeInOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuarticActionInOut());
 */
export class EaseQuarticActionInOut extends ActionEase {
  /** @lends cc.EaseQuarticActionInOut# */
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return 0.5 * time * time * time * time;
    time -= 2;
    return -0.5 * (time * time * time * time - 2);
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
   * @returns {cc.EaseQuarticActionInOut}
   */
  clone() {
    var action = new EaseQuarticActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuarticActionInOut}
   */
  reverse() {
    return new EaseQuarticActionInOut(this._inner.reverse());
  }
};

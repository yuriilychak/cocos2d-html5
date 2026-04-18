import { ActionEase } from './action-ease.js';

/**
 * cc.EaseQuarticActionOut action. <br />
 * Reference easeOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.EaseQuarticActionOut());
 */
export class EaseQuarticActionOut extends ActionEase {
  /** @lends cc.EaseQuarticActionOut# */
  _updateTime(time) {
    time -= 1;
    return -(time * time * time * time - 1);
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
   * @returns {cc.EaseQuarticActionOut}
   */
  clone() {
    var action = new EaseQuarticActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuarticActionOut}
   */
  reverse() {
    return new EaseQuarticActionOut(this._inner.reverse());
  }
};

import ActionEase from './action-ease';

/**
 * cc.EaseQuarticActionIn action. <br />
 * Reference easeInQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuarticActionIn());
 */
export default class EaseQuarticActionIn extends ActionEase {
  /** @lends cc.EaseQuarticActionIn# */
  _updateTime(time) {
    return time * time * time * time;
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
   * @returns {cc.EaseQuarticActionIn}
   */
  clone() {
    var action = new EaseQuarticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuarticActionIn}
   */
  reverse() {
    return new EaseQuarticActionIn(this._inner.reverse());
  }
};

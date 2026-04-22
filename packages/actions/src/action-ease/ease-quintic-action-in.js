import ActionEase from './action-ease';

/**
 * cc.EaseQuinticActionIn action. <br />
 * Reference easeInQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(cc.easeQuinticActionIn());
 */
export default class EaseQuinticActionIn extends ActionEase {
  _updateTime(time) {
    return time * time * time * time * time;
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
   * @returns {cc.EaseQuinticActionIn}
   */
  clone() {
    var action = new EaseQuinticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuinticActionIn}
   */
  reverse() {
    return new EaseQuinticActionIn(this._inner.reverse());
  }
};

import ActionEase from "./action-ease";

/**
 * EaseQuinticActionOut action. <br />
 * Reference easeQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(easeQuadraticActionOut());
 */
export default class EaseQuinticActionOut extends ActionEase {
  _updateTime(time) {
    time -= 1;
    return time * time * time * time * time + 1;
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
   * @returns {EaseQuinticActionOut}
   */
  clone() {
    var action = new EaseQuinticActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseQuinticActionOut}
   */
  reverse() {
    return new EaseQuinticActionOut(this._inner.reverse());
  }
}

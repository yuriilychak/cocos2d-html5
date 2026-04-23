import ActionEase from "./action-ease";

/**
 * EaseQuarticActionIn action. <br />
 * Reference easeInQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @example
 * action.easing(easeQuarticActionIn());
 */
export default class EaseQuarticActionIn extends ActionEase {
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
   * @returns {EaseQuarticActionIn}
   */
  clone() {
    var action = new EaseQuarticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseQuarticActionIn}
   */
  reverse() {
    return new EaseQuarticActionIn(this._inner.reverse());
  }
}

import ActionEase from "./action-ease";

/**
 * EaseQuadraticActionIn action. <br />
 * Reference easeInQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @example
 * action.easing(easeQuadraticActionIn());
 */
export default class EaseQuadraticActionIn extends ActionEase {
  _updateTime(time) {
    return Math.pow(time, 2);
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
   * @returns {EaseQuadraticActionIn}
   */
  clone() {
    var action = new EaseQuadraticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseQuadraticActionIn}
   */
  reverse() {
    return new EaseQuadraticActionIn(this._inner.reverse());
  }
}

import ActionEase from "./action-ease";

/**
 * EaseQuadraticActionIn action. <br />
 * Reference easeOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @example
 * action.easing(easeQuadraticActionOut());
 */
export default class EaseQuadraticActionOut extends ActionEase {
  _updateTime(time) {
    return -time * (time - 2);
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
   * @returns {EaseQuadraticActionOut}
   */
  clone() {
    var action = new EaseQuadraticActionOut();
    action.initWithAction();
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseQuadraticActionOut}
   */
  reverse() {
    return new EaseQuadraticActionOut(this._inner.reverse());
  }
}

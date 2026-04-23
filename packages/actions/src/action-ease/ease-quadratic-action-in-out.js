import ActionEase from "./action-ease";

/**
 * EaseQuadraticActionInOut action. <br />
 * Reference easeInOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @example
 * action.easing(easeQuadraticActionInOut());
 */
export default class EaseQuadraticActionInOut extends ActionEase {
  _updateTime(time) {
    var resultTime = time;
    time *= 2;
    if (time < 1) {
      resultTime = time * time * 0.5;
    } else {
      --time;
      resultTime = -0.5 * (time * (time - 2) - 1);
    }
    return resultTime;
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
   * @returns {EaseQuadraticActionInOut}
   */
  clone() {
    var action = new EaseQuadraticActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseQuadraticActionInOut}
   */
  reverse() {
    return new EaseQuadraticActionInOut(this._inner.reverse());
  }
}

import ActionEase from "./action-ease";

/**
 * Ease Exponential InOut. <br />
 * Reference easeInOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 *
 * @example
 * action.easing(easeExponentialInOut());
 */
export default class EaseExponentialInOut extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    if (dt !== 1 && dt !== 0) {
      dt *= 2;
      if (dt < 1) dt = 0.5 * Math.pow(2, 10 * (dt - 1));
      else dt = 0.5 * (-Math.pow(2, -10 * (dt - 1)) + 2);
    }
    this._inner.update(dt);
  }

  /**
   * Create a EaseExponentialInOut action. Opposite with the original motion trajectory.
   * @return {EaseExponentialInOut}
   */
  reverse() {
    return new EaseExponentialInOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseExponentialInOut}
   */
  clone() {
    var action = new EaseExponentialInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
}

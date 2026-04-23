import ActionEase from "./action-ease";

/**
 * Ease Exponential Out. <br />
 * Reference easeOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(easeExponentialOut());
 */
export default class EaseExponentialOut extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(dt === 1 ? 1 : -Math.pow(2, -10 * dt) + 1);
  }

  /**
   * Create a EaseExponentialIn action. Opposite with the original motion trajectory.
   * @return {EaseExponentialIn}
   */
  reverse() {
    return new cc.EaseExponentialIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseExponentialOut}
   */
  clone() {
    var action = new EaseExponentialOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
}

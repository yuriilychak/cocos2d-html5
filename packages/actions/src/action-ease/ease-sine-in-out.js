import ActionEase from "./action-ease";

/**
 * Ease Sine InOut. <br />
 * Reference easeInOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(easeSineInOut());
 */
export default class EaseSineInOut extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt = dt === 0 || dt === 1 ? dt : -0.5 * (Math.cos(Math.PI * dt) - 1);
    this._inner.update(dt);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseSineInOut}
   */
  clone() {
    var action = new EaseSineInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a EaseSineInOut action. Opposite with the original motion trajectory.
   * @return {EaseSineInOut}
   */
  reverse() {
    return new EaseSineInOut(this._inner.reverse());
  }
}

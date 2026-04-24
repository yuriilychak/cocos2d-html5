import ActionEase from "./action-ease";

/**
 * Ease Sine Out. <br />
 * Reference easeOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(easeSineOut());
 */
export default class EaseSineOut extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt = dt === 0 || dt === 1 ? dt : Math.sin((dt * Math.PI) / 2);
    this._inner.update(dt);
  }

  /**
   * @type {EaseSineIn}
   */
  static ReversedAction = null;

  /**
   * Create a EaseSineIn action. Opposite with the original motion trajectory.
   * @return {EaseSineIn}
   */
  reverse() {
    return new EaseSineOut.ReversedAction(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseSineOut}
   */
  clone() {
    var action = new EaseSineOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
}

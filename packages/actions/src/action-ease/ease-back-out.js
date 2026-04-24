import ActionEase from "./action-ease";

/**
 * EaseBackOut action. <br />
 * Fast moving more than the finish, and then slowly back to the finish.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @example
 * action.easing(easeBackOut());
 */
export default class EaseBackOut extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var overshoot = 1.70158;
    dt = dt - 1;
    this._inner.update(dt * dt * ((overshoot + 1) * dt + overshoot) + 1);
  }

  /**
   * @type {EaseBackIn}
   */
  static ReversedAction = null;

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseBackIn}
   */
  reverse() {
    return new EaseBackOut.ReversedAction(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseBackOut}
   */
  clone() {
    var action = new EaseBackOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
}

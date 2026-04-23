import EaseBounce from "./ease-bounce";

/**
 * EaseBounceIn action. <br />
 * Eased bounce effect at the beginning.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 *
 * @example
 * action.easing(easeBounceIn());
 */
export default class EaseBounceIn extends EaseBounce {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var newT = 1 - this.bounceTime(1 - dt);
    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseBounceOut}
   */
  reverse() {
    return new cc.EaseBounceOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseBounceIn}
   */
  clone() {
    var action = new EaseBounceIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
}

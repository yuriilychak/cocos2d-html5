import ActionEase from './action-ease';

/**
 * cc.EaseBackIn action. <br />
 * In the opposite direction to move slowly, and then accelerated to the right direction.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @example
 * action.easing(cc.easeBackIn());
 */
export default class EaseBackIn extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var overshoot = 1.70158;
    dt =
      dt === 0 || dt === 1 ? dt : dt * dt * ((overshoot + 1) * dt - overshoot);
    this._inner.update(dt);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBackOut}
   */
  reverse() {
    return new cc.EaseBackOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBackIn}
   */
  clone() {
    var action = new EaseBackIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

import { ActionEase } from './ActionEase.js';

/**
 * cc.EaseBackInOut action. <br />
 * Beginning of cc.EaseBackIn. Ending of cc.EaseBackOut.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeBackInOut());
 */
export class EaseBackInOut extends ActionEase {
  /** @lends cc.EaseBackInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var overshoot = 1.70158 * 1.525;
    dt = dt * 2;
    if (dt < 1) {
      this._inner.update((dt * dt * ((overshoot + 1) * dt - overshoot)) / 2);
    } else {
      dt = dt - 2;
      this._inner.update(
        (dt * dt * ((overshoot + 1) * dt + overshoot)) / 2 + 1
      );
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBackInOut}
   */
  clone() {
    var action = new EaseBackInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBackInOut}
   */
  reverse() {
    return new EaseBackInOut(this._inner.reverse());
  }
};

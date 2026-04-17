import { EaseBounce } from './EaseBounce.js';

/**
 * cc.EaseBounceInOut action. <br />
 * Eased bounce effect at the beginning and ending.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseBounce
 * @example
 * action.easing(cc.easeBounceInOut());
 */
export class EaseBounceInOut extends EaseBounce {
  /** @lends cc.EaseBounceInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var newT = 0;
    if (dt < 0.5) {
      dt = dt * 2;
      newT = (1 - this.bounceTime(1 - dt)) * 0.5;
    } else {
      newT = this.bounceTime(dt * 2 - 1) * 0.5 + 0.5;
    }
    this._inner.update(newT);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBounceInOut}
   */
  clone() {
    var action = new EaseBounceInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounceInOut}
   */
  reverse() {
    return new EaseBounceInOut(this._inner.reverse());
  }
};

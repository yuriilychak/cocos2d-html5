import EaseBounce from './ease-bounce';

/**
 * cc.EaseBounceOut action. <br />
 * Eased bounce effect at the ending.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @example
 * action.easing(cc.easeBounceOut());
 */
export default class EaseBounceOut extends EaseBounce {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var newT = this.bounceTime(dt);
    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounceIn}
   */
  reverse() {
    return new cc.EaseBounceIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBounceOut}
   */
  clone() {
    var action = new EaseBounceOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

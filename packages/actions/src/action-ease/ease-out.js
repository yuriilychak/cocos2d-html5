import EaseRateAction from './ease-rate-action';

/**
 * cc.EaseOut action with a rate. From fast to slow.
 *
 *
 * @example
 * action.easing(cc.easeOut(3.0));
 */
export default class EaseOut extends EaseRateAction {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(Math.pow(dt, 1 / this._rate));
  }

  /**
   * Create a cc.easeIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseOut}
   */
  reverse() {
    return new EaseOut(this._inner.reverse(), 1 / this._rate);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseOut}
   */
  clone() {
    var action = new EaseOut();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }
};

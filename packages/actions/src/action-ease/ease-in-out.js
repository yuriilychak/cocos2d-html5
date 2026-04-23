import EaseRateAction from "./ease-rate-action";

/**
 * EaseInOut action with a rate. <br />
 * Slow to fast then to slow.
 *
 * @example
 * action.easing(easeInOut(3.0));
 */
export default class EaseInOut extends EaseRateAction {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt *= 2;
    if (dt < 1) this._inner.update(0.5 * Math.pow(dt, this._rate));
    else this._inner.update(1.0 - 0.5 * Math.pow(2 - dt, this._rate));
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseInOut}
   */
  clone() {
    var action = new EaseInOut();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }

  /**
   * Create a EaseInOut action. Opposite with the original motion trajectory.
   * @return {EaseInOut}
   */
  reverse() {
    return new EaseInOut(this._inner.reverse(), this._rate);
  }
}

import ActionEase from "./action-ease";
import { log } from "@aspect/core/src/boot/debugger";

/**
 * Ease Elastic abstract class.
 * @param {ActionInterval} action
 * @param {Number} [period=0.3]
 */
export default class EaseElastic extends ActionEase {
  _period = 0.3;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates the action with the inner action and the period in radians (default is 0.3).
   * @param {ActionInterval} action
   * @param {Number} [period=0.3]
   */
  constructor(action, period) {
    super();

    action && this.initWithAction(action, period);
  }

  /**
   * get period of the wave in radians. default is 0.3
   * @return {Number}
   */
  getPeriod() {
    return this._period;
  }

  /**
   * set period of the wave in radians.
   * @param {Number} period
   */
  setPeriod(period) {
    this._period = period;
  }

  /**
   * Initializes the action with the inner action and the period in radians (default is 0.3)
   * @param {ActionInterval} action
   * @param {Number} [period=0.3]
   * @return {Boolean}
   */
  initWithAction(action, period) {
    super.initWithAction(action);
    this._period = period == null ? 0.3 : period;
    return true;
  }

  /**
   * Create a action. Opposite with the original motion trajectory. <br />
   * Will be overwrite.
   * @return {?Action}
   */
  reverse() {
    log("EaseElastic.reverse(): it should be overridden in subclass.");
    return null;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseElastic}
   */
  clone() {
    const action = new EaseElastic();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
}

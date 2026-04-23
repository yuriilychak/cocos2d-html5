import ActionEase from "./action-ease";

/**
 * Base class for Easing actions with rate parameters
 *
 * @param {ActionInterval} action
 * @param {Number} rate
 *
 * @example
 * var moveEaseRateAction = easeRateAction(action, 3.0);
 */
export default class EaseRateAction extends ActionEase {
  _rate = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates the action with the inner action and the rate parameter.
   * @param {ActionInterval} action
   * @param {Number} rate
   */
  constructor(action, rate) {
    super();

    rate !== undefined && this.initWithAction(action, rate);
  }

  /**
   * set rate value for the actions
   * @param {Number} rate
   */
  setRate(rate) {
    this._rate = rate;
  }

  /** get rate value for the actions
   * @return {Number}
   */
  getRate() {
    return this._rate;
  }

  /**
   * Initializes the action with the inner action and the rate parameter
   * @param {ActionInterval} action
   * @param {Number} rate
   * @return {Boolean}
   */
  initWithAction(action, rate) {
    if (super.initWithAction(action)) {
      this._rate = rate;
      return true;
    }
    return false;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {EaseRateAction}
   */
  clone() {
    const action = new EaseRateAction();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }

  /**
   * Create new action to original operation effect opposite. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @return {EaseRateAction}
   */
  reverse() {
    return new EaseRateAction(this._inner.reverse(), 1 / this._rate);
  }
}

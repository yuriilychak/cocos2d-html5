import { ActionInterval } from './ActionInterval.js';

/**
 * <p>
 * Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * </p>
 * @class
 * @extends cc.ActionInterval
 * @param {cc.FiniteTimeAction} action
 * @example
 *  var reverse = new cc.ReverseTime(this);
 */
export class ReverseTime extends ActionInterval {
  /** @lends cc.ReverseTime# */
  _other = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {cc.FiniteTimeAction} action
   */
  constructor(action) {
    super();
    this._other = null;

    action && this.initWithAction(action);
  }

  /**
   * @param {cc.FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithAction(action) {
    if (!action)
      throw new Error(
        "cc.ReverseTime.initWithAction(): action must be non null"
      );
    if (action === this._other)
      throw new Error(
        "cc.ReverseTime.initWithAction(): the action was already passed in."
      );
    if (super.initWithDuration(action._duration)) {
      // Don't leak if action is reused
      this._other = action;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.ReverseTime}
   */
  clone() {
    var action = new ReverseTime();
    this._cloneDecoration(action);
    action.initWithAction(this._other.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._other.startWithTarget(target);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._other) this._other.update(1 - dt);
  }

  /**
   * Returns a reversed action.
   * @return {cc.ActionInterval}
   */
  reverse() {
    return this._other.clone();
  }

  /**
   * Stop the action
   */
  stop() {
    this._other.stop();
    super.stop();
  }
};

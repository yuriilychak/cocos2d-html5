import { ActionInterval } from './ActionInterval.js';

/**  Repeats an action for ever.  <br/>
 * To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class
 * @extends cc.ActionInterval
 * @param {cc.FiniteTimeAction} action
 * @example
 * var rep = new cc.RepeatForever(cc.sequence(jump2, jump1), 5);
 */
export class RepeatForever extends ActionInterval {
  /** @lends cc.RepeatForever# */
  _innerAction = null; //CCActionInterval

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create a acton which repeat forever.
   * @param {cc.FiniteTimeAction} action
   */
  constructor(action) {
    super();
    this._innerAction = null;

    action && this.initWithAction(action);
  }

  /**
   * @param {cc.ActionInterval} action
   * @return {Boolean}
   */
  initWithAction(action) {
    if (!action)
      throw new Error(
        "cc.RepeatForever.initWithAction(): action must be non null"
      );

    this._innerAction = action;
    return true;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.RepeatForever}
   */
  clone() {
    var action = new RepeatForever();
    this._cloneDecoration(action);
    action.initWithAction(this._innerAction.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._innerAction.startWithTarget(target);
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   * @param dt delta time in seconds
   */
  step(dt) {
    var locInnerAction = this._innerAction;
    locInnerAction.step(dt);
    if (locInnerAction.isDone()) {
      //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
      locInnerAction.startWithTarget(this.target);
      // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);
      locInnerAction.step(
        locInnerAction.getElapsed() - locInnerAction._duration
      );
    }
  }

  /**
   * Return true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return false;
  }

  /**
   * Returns a reversed action.
   * @return {cc.RepeatForever}
   */
  reverse() {
    var action = new RepeatForever(this._innerAction.reverse());
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * Set inner action.
   * @param {cc.ActionInterval} action
   */
  setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  }

  /**
   * Get inner action.
   * @return {cc.ActionInterval}
   */
  getInnerAction() {
    return this._innerAction;
  }
};

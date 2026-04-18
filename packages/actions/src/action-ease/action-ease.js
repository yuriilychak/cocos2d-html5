import ActionInterval from '../action-interval/action-interval';

/**
 * Base class for Easing actions
 * @class
 * @extends cc.ActionInterval
 * @param {cc.ActionInterval} action
 *
 * @example
 * var moveEase = new cc.ActionEase(action);
 */
export default class ActionEase extends ActionInterval {
  /** @lends cc.ActionEase# */
  _inner = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * creates the action of ActionEase.
   * @param {cc.ActionInterval} action
   */
  constructor(action) {
    super();
    action && this.initWithAction(action);
  }

  /**
   * initializes the action
   *
   * @param {cc.ActionInterval} action
   * @return {Boolean}
   */
  initWithAction(action) {
    if (!action)
      throw new Error("cc.ActionEase.initWithAction(): action must be non nil");

    if (this.initWithDuration(action.getDuration())) {
      this._inner = action;
      return true;
    }
    return false;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.ActionEase}
   */
  clone() {
    const action = new ActionEase();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._inner.startWithTarget(this.target);
  }

  /**
   * Stop the action.
   */
  stop() {
    this._inner.stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(dt);
  }

  /**
   * Create new action to original operation effect opposite. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @return {cc.ActionEase}
   */
  reverse() {
    return new ActionEase(this._inner.reverse());
  }

  /**
   * Get inner Action.
   *
   * @return {cc.ActionInterval}
   */
  getInnerAction() {
    return this._inner;
  }
};

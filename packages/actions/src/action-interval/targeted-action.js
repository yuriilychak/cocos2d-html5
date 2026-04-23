import ActionInterval from "./action-interval";

/**
 * <p>
 *     Overrides the target of an action so that it always runs on the target<br/>
 *     specified at action creation rather than the one specified by runAction.
 * </p>
 * @param {Node} target
 * @param {FiniteTimeAction} action
 */
export default class TargetedAction extends ActionInterval {
  _action = null;
  _forcedTarget = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create an action with the specified action and forced target.
   * @param {Node} target
   * @param {FiniteTimeAction} action
   */
  constructor(target, action) {
    super();
    action && this.initWithTarget(target, action);
  }

  /**
   * Init an action with the specified action and forced target
   * @param {Node} target
   * @param {FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithTarget(target, action) {
    if (this.initWithDuration(action._duration)) {
      this._forcedTarget = target;
      this._action = action;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {TargetedAction}
   */
  clone() {
    var action = new TargetedAction();
    this._cloneDecoration(action);
    action.initWithTarget(this._forcedTarget, this._action.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._action.startWithTarget(this._forcedTarget);
  }

  /**
   * stop the action
   */
  stop() {
    this._action.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    this._action.update(dt);
  }

  /**
   * return the target that the action will be forced to run with
   * @return {Node}
   */
  getForcedTarget() {
    return this._forcedTarget;
  }

  /**
   * set the target that the action will be forced to run with
   * @param {Node} forcedTarget
   */
  setForcedTarget(forcedTarget) {
    if (this._forcedTarget !== forcedTarget) this._forcedTarget = forcedTarget;
  }
}

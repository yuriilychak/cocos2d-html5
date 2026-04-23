import Action from "./action";

/**
 * Changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 *
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @param {ActionInterval} action
 * @param {Number} speed
 */
export default class Speed extends Action {
  _speed = 0.0;
  _innerAction = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {ActionInterval} action
   * @param {Number} speed
   */
  constructor(action, speed) {
    super();
    this._speed = 0;
    this._innerAction = null;

    action && this.initWithAction(action, speed);
  }

  /**
   * Gets the current running speed. <br />
   * Will get a percentage number, compared to the original speed.
   *
   * @return {Number}
   */
  getSpeed() {
    return this._speed;
  }

  /**
   * alter the speed of the inner function in runtime.
   *
   * @param {Number} speed
   */
  setSpeed(speed) {
    this._speed = speed;
  }

  /**
   * initializes the action.
   *
   * @param {ActionInterval} action
   * @param {Number} speed
   * @return {Boolean}
   */
  initWithAction(action, speed) {
    if (!action)
      throw new Error("Speed.initWithAction(): action must be non nil");

    this._innerAction = action;
    this._speed = speed;
    return true;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {Speed}
   */
  clone() {
    var action = new Speed();
    action.initWithAction(this._innerAction.clone(), this._speed);
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._innerAction.startWithTarget(target);
  }

  /**
   *  Stop the action.
   */
  stop() {
    this._innerAction.stop();
    super.stop();
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    this._innerAction.step(dt * this._speed);
  }

  /**
   * return true if the action has finished.
   *
   * @return {Boolean}
   */
  isDone() {
    return this._innerAction.isDone();
  }

  /**
   * returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   *
   * @return {Speed}
   */
  reverse() {
    return new Speed(this._innerAction.reverse(), this._speed);
  }

  /**
   * Set inner Action.
   * @param {ActionInterval} action
   */
  setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  }

  /**
   * Get inner Action.
   *
   * @return {ActionInterval}
   */
  getInnerAction() {
    return this._innerAction;
  }
}

import Action from "./action";

/**
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 */
export default class FiniteTimeAction extends Action {
  // duration in seconds
  _duration = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   */
  constructor() {
    super();
    this._duration = 0;
  }

  /**
   * get duration of the action. (seconds)
   *
   * @return {Number}
   */
  getDuration() {
    return this._duration * (this._timesForRepeat || 1);
  }

  /**
   * set duration of the action. (seconds)
   *
   * @param {Number} duration
   */
  setDuration(duration) {
    this._duration = duration;
  }

  /**
   * Returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   *
   * @return {?Action}
   */
  reverse() {
    cc.log("cocos2d: FiniteTimeAction#reverse: Implement me");
    return null;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {FiniteTimeAction}
   */
  clone() {
    return new FiniteTimeAction();
  }
}

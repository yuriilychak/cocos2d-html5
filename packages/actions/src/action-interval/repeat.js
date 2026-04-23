import ActionInterval from "./action-interval";
import ActionInstant from "../action-instant/action-instant";

/**
 * Repeats an action a number of times.
 * To repeat an action forever use the RepeatForever action.
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @example
 * var rep = new Repeat(sequence(jump2, jump1), 5);
 */
export default class Repeat extends ActionInterval {
  _times = 0;
  _total = 0;
  _nextDt = 0;
  _actionInstant = false;
  _innerAction = null; //FiniteTimeAction

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30).
   * @param {FiniteTimeAction} action
   * @param {Number} times
   */
  constructor(action, times) {
    super();

    times !== undefined && this.initWithAction(action, times);
  }

  /**
   * @param {FiniteTimeAction} action
   * @param {Number} times
   * @return {Boolean}
   */
  initWithAction(action, times) {
    var duration = action._duration * times;

    if (this.initWithDuration(duration)) {
      this._times = times;
      this._innerAction = action;
      if (action instanceof ActionInstant) {
        this._actionInstant = true;
        this._times -= 1;
      }
      this._total = 0;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {Repeat}
   */
  clone() {
    var action = new Repeat();
    this._cloneDecoration(action);
    action.initWithAction(this._innerAction.clone(), this._times);
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    this._total = 0;
    this._nextDt = this._innerAction._duration / this._duration;
    super.startWithTarget(target);
    this._innerAction.startWithTarget(target);
  }

  /**
   * stop the action
   */
  stop() {
    this._innerAction.stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    var locInnerAction = this._innerAction;
    var locDuration = this._duration;
    var locTimes = this._times;
    var locNextDt = this._nextDt;

    if (dt >= locNextDt) {
      while (dt > locNextDt && this._total < locTimes) {
        locInnerAction.update(1);
        this._total++;
        locInnerAction.stop();
        locInnerAction.startWithTarget(this.target);
        locNextDt += locInnerAction._duration / locDuration;
        this._nextDt = locNextDt;
      }

      // fix for issue #1288, incorrect end value of repeat
      if (dt >= 1.0 && this._total < locTimes) this._total++;

      // don't set a instant action back or update it, it has no use because it has no duration
      if (!this._actionInstant) {
        if (this._total === locTimes) {
          locInnerAction.update(1);
          locInnerAction.stop();
        } else {
          // issue #390 prevent jerk, use right update
          locInnerAction.update(
            dt - (locNextDt - locInnerAction._duration / locDuration)
          );
        }
      }
    } else {
      locInnerAction.update((dt * locTimes) % 1.0);
    }
  }

  /**
   * Return true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return this._total === this._times;
  }

  /**
   * returns a reversed action.
   * @return {Repeat}
   */
  reverse() {
    var action = new Repeat(this._innerAction.reverse(), this._times);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * Set inner Action.
   * @param {FiniteTimeAction} action
   */
  setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  }

  /**
   * Get inner Action.
   * @return {FiniteTimeAction}
   */
  getInnerAction() {
    return this._innerAction;
  }
}

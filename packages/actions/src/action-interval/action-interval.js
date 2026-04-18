import { FiniteTimeAction } from '../action/finite-time-action.js';

/**
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 *
 * @class
 * @extends cc.FiniteTimeAction
 * @param {Number} d duration in seconds
 * @example
 * var actionInterval = new cc.ActionInterval(3);
 */
export class ActionInterval extends FiniteTimeAction {
  /** @lends cc.ActionInterval# */
  _elapsed = 0;
  _firstTick = false;
  _easeList = null;
  _timesForRepeat = 1;
  _repeatForever = false;
  _repeatMethod = false; //Compatible with repeat class, Discard after can be deleted

  _speed = 1;
  _speedMethod = false; //Compatible with speed class, Discard after can be deleted

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} d duration in seconds
   */
  constructor(d) {
    super();
    this._speed = 1;
    this._timesForRepeat = 1;
    this._repeatForever = false;
    this.MAX_VALUE = 2;
    this._repeatMethod = false; //Compatible with repeat class, Discard after can be deleted
    this._speedMethod = false; //Compatible with repeat class, Discard after can be deleted
    d !== undefined && this.initWithDuration(d);
  }

  /**
   * How many seconds had elapsed since the actions started to run.
   * @return {Number}
   */
  getElapsed() {
    return this._elapsed;
  }

  /**
   * Initializes the action.
   * @param {Number} d duration in seconds
   * @return {Boolean}
   */
  initWithDuration(d) {
    this._duration = d === 0 ? cc.FLT_EPSILON : d;
    // prevent division by 0
    // This comparison could be in step:, but it might decrease the performance
    // by 3% in heavy based action games.
    this._elapsed = 0;
    this._firstTick = true;
    return true;
  }

  /**
   * Returns true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return this._elapsed >= this._duration;
  }

  /**
   * Some additional parameters of cloning.
   * @param {cc.Action} action
   * @private
   */
  _cloneDecoration(action) {
    action._repeatForever = this._repeatForever;
    action._speed = this._speed;
    action._timesForRepeat = this._timesForRepeat;
    action._easeList = this._easeList;
    action._speedMethod = this._speedMethod;
    action._repeatMethod = this._repeatMethod;
  }

  _reverseEaseList(action) {
    if (this._easeList) {
      action._easeList = [];
      for (var i = 0; i < this._easeList.length; i++) {
        action._easeList.push(this._easeList[i].reverse());
      }
    }
  }

  /**
   * Returns a new clone of the action.
   * @returns {cc.ActionInterval}
   */
  clone() {
    var action = new ActionInterval(this._duration);
    this._cloneDecoration(action);
    return action;
  }

  /**
   * Implementation of ease motion.
   *
   * @example
   * //example
   * action.easing(cc.easeIn(3.0));
   * @param {Object} easeObj
   * @returns {cc.ActionInterval}
   */
  easing(easeObj) {
    if (this._easeList) this._easeList.length = 0;
    else this._easeList = [];
    for (var i = 0; i < arguments.length; i++)
      this._easeList.push(arguments[i]);
    return this;
  }

  _computeEaseTime(dt) {
    var locList = this._easeList;
    if (!locList || locList.length === 0) return dt;
    for (var i = 0, n = locList.length; i < n; i++) dt = locList[i].easing(dt);
    return dt;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    if (this._firstTick) {
      this._firstTick = false;
      this._elapsed = 0;
    } else this._elapsed += dt;

    //this.update((1 > (this._elapsed / this._duration)) ? this._elapsed / this._duration : 1);
    //this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, cc.FLT_EPSILON))));
    var t =
      this._elapsed /
      (this._duration > 0.0000001192092896
        ? this._duration
        : 0.0000001192092896);
    t = 1 > t ? t : 1;
    this.update(t > 0 ? t : 0);

    //Compatible with repeat class, Discard after can be deleted (this._repeatMethod)
    if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
      if (!this._repeatForever) {
        this._timesForRepeat--;
      }
      //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
      this.startWithTarget(this.target);
      // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);
      this.step(this._elapsed - this._duration);
    }
  }

  /**
   * Start this action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._elapsed = 0;
    this._firstTick = true;
  }

  /**
   * returns a reversed action. <br />
   * Will be overwrite.
   *
   * @return {?cc.Action}
   */
  reverse() {
    cc.log("cc.IntervalAction: reverse not implemented.");
    return null;
  }

  /**
   * Set amplitude rate.
   * @warning It should be overridden in subclass.
   * @param {Number} amp
   */
  setAmplitudeRate(amp) {
    // Abstract class needs implementation
    cc.log(
      "cc.ActionInterval.setAmplitudeRate(): it should be overridden in subclass."
    );
  }

  /**
   * Get amplitude rate.
   * @warning It should be overridden in subclass.
   * @return {Number} 0
   */
  getAmplitudeRate() {
    // Abstract class needs implementation
    cc.log(
      "cc.ActionInterval.getAmplitudeRate(): it should be overridden in subclass."
    );
    return 0;
  }

  /**
   * Changes the speed of an action, making it take longer (speed>1)
   * or less (speed<1) time. <br/>
   * Useful to simulate 'slow motion' or 'fast forward' effect.
   *
   * @param speed
   * @returns {cc.Action}
   */
  speed(speed) {
    if (speed <= 0) {
      cc.log("The speed parameter error");
      return this;
    }

    this._speedMethod = true; //Compatible with repeat class, Discard after can be deleted
    this._speed *= speed;
    return this;
  }

  /**
   * Get this action speed.
   * @return {Number}
   */
  getSpeed() {
    return this._speed;
  }

  /**
   * Set this action speed.
   * @param {Number} speed
   * @returns {cc.ActionInterval}
   */
  setSpeed(speed) {
    this._speed = speed;
    return this;
  }

  /**
   * Repeats an action a number of times.
   * To repeat an action forever use the CCRepeatForever action.
   * @param times
   * @returns {cc.ActionInterval}
   */
  repeat(times) {
    times = Math.round(times);
    if (isNaN(times) || times < 1) {
      cc.log("The repeat parameter error");
      return this;
    }
    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted
    this._timesForRepeat *= times;
    return this;
  }

  /**
   * Repeats an action for ever.  <br/>
   * To repeat the an action for a limited number of times use the Repeat action. <br/>
   * @returns {cc.ActionInterval}
   */
  repeatForever() {
    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted
    this._timesForRepeat = this.MAX_VALUE;
    this._repeatForever = true;
    return this;
  }
};

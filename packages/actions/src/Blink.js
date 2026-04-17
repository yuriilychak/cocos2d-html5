import { ActionInterval } from './ActionInterval.js';

/** Blinks a cc.Node object by modifying it's visible attribute
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks  blinks in times
 * @example
 * var action = new cc.Blink(2, 10);
 */
export class Blink extends ActionInterval {
  /** @lends cc.Blink# */
  _times = 0;
  _originalState = false;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration  duration in seconds
   * @param {Number} blinks  blinks in times
   */
  constructor(duration, blinks) {
    super();
    blinks !== undefined && this.initWithDuration(duration, blinks);
  }

  /**
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} blinks blinks in times
   * @return {Boolean}
   */
  initWithDuration(duration, blinks) {
    if (super.initWithDuration(duration)) {
      this._times = blinks;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.Blink}
   */
  clone() {
    var action = new Blink();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._times);
    return action;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target && !this.isDone()) {
      var slice = 1.0 / this._times;
      var m = dt % slice;
      this.target.visible = m > slice / 2;
    }
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._originalState = target.visible;
  }

  /**
   * stop the action
   */
  stop() {
    this.target.visible = this._originalState;
    super.stop();
  }

  /**
   * Returns a reversed action.
   * @return {cc.Blink}
   */
  reverse() {
    var action = new Blink(this._duration, this._times);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

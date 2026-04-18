import { ActionInterval } from './action-interval.js';

/** Fades an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @example
 * var action = new cc.FadeTo(1.0, 0);
 */
export class FadeTo extends ActionInterval {
  /** @lends cc.FadeTo# */
  _toOpacity = 0;
  _fromOpacity = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Number} opacity 0-255, 0 is transparent
   */
  constructor(duration, opacity) {
    super();
    opacity !== undefined && this.initWithDuration(duration, opacity);
  }

  /**
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Number} opacity
   * @return {Boolean}
   */
  initWithDuration(duration, opacity) {
    if (super.initWithDuration(duration)) {
      this._toOpacity = opacity;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.FadeTo}
   */
  clone() {
    const action = new FadeTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} time time in seconds
   */
  update(time) {
    time = this._computeEaseTime(time);
    const fromOpacity =
      this._fromOpacity !== undefined ? this._fromOpacity : 255;
    this.target.opacity = fromOpacity + (this._toOpacity - fromOpacity) * time;
  }

  /**
   * Start this action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._fromOpacity = target.opacity;
  }
};

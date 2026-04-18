import { ActionInterval } from './action-interval.js';

/** Scales a cc.Node object to a zoom factor by modifying it's scale attribute.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = new cc.ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = new cc.ScaleTo(2, 0.5, 2);
 */
export class ScaleTo extends ActionInterval {
  /** @lends cc.ScaleTo# */
  _scaleX = 1;
  _scaleY = 1;
  _startScaleX = 1;
  _startScaleY = 1;
  _endScaleX = 0;
  _endScaleY = 0;
  _deltaX = 0;
  _deltaY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Number} sx  scale parameter in X
   * @param {Number} [sy] scale parameter in Y, if Null equal to sx
   */
  constructor(duration, sx, sy) {
    super();
    sx !== undefined && this.initWithDuration(duration, sx, sy);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} sx
   * @param {Number} [sy=]
   * @return {Boolean}
   */
  initWithDuration(duration, sx, sy) {
    //function overload here
    if (super.initWithDuration(duration)) {
      this._endScaleX = sx;
      this._endScaleY = sy != null ? sy : sx;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.ScaleTo}
   */
  clone() {
    var action = new ScaleTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._startScaleX = target.scaleX;
    this._startScaleY = target.scaleY;
    this._deltaX = this._endScaleX - this._startScaleX;
    this._deltaY = this._endScaleY - this._startScaleY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      this.target.scaleX = this._startScaleX + this._deltaX * dt;
      this.target.scaleY = this._startScaleY + this._deltaY * dt;
    }
  }
};

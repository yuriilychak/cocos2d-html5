import { ActionInterval } from './ActionInterval.js';

/**
 * Skews a cc.Node object to given angles by modifying it's skewX and skewY attributes
 * @class
 * @extends cc.ActionInterval
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @example
 * var actionTo = new cc.SkewTo(2, 37.2, -37.2);
 */
export class SkewTo extends ActionInterval {
  /** @lends cc.SkewTo# */
  _skewX = 0;
  _skewY = 0;
  _startSkewX = 0;
  _startSkewY = 0;
  _endSkewX = 0;
  _endSkewY = 0;
  _deltaX = 0;
  _deltaY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t time in seconds
   * @param {Number} sx
   * @param {Number} sy
   */
  constructor(t, sx, sy) {
    super();

    sy !== undefined && this.initWithDuration(t, sx, sy);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} sx
   * @param {Number} sy
   * @return {Boolean}
   */
  initWithDuration(t, sx, sy) {
    var ret = false;
    if (super.initWithDuration(t)) {
      this._endSkewX = sx;
      this._endSkewY = sy;
      ret = true;
    }
    return ret;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.SkewTo}
   */
  clone() {
    var action = new SkewTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endSkewX, this._endSkewY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    this._startSkewX = target.skewX % 180;
    this._deltaX = this._endSkewX - this._startSkewX;
    if (this._deltaX > 180) this._deltaX -= 360;
    if (this._deltaX < -180) this._deltaX += 360;

    this._startSkewY = target.skewY % 360;
    this._deltaY = this._endSkewY - this._startSkewY;
    if (this._deltaY > 180) this._deltaY -= 360;
    if (this._deltaY < -180) this._deltaY += 360;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    this.target.skewX = this._startSkewX + this._deltaX * dt;
    this.target.skewY = this._startSkewY + this._deltaY * dt;
  }
};

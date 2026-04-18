import { SkewTo } from './skew-to.js';

/**
 * Skews a cc.Node object by skewX and skewY degrees.
 * Relative to its attribute modification.
 * @class
 * @extends cc.SkewTo
 * @param {Number} t time in seconds
 * @param {Number} sx  skew in degrees for X axis
 * @param {Number} sy  skew in degrees for Y axis
 */
export class SkewBy extends SkewTo {
  /** @lends cc.SkewBy# */

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t time in seconds
   * @param {Number} sx  skew in degrees for X axis
   * @param {Number} sy  skew in degrees for Y axis
   */
  constructor(t, sx, sy) {
    super();
    sy !== undefined && this.initWithDuration(t, sx, sy);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} deltaSkewX  skew in degrees for X axis
   * @param {Number} deltaSkewY  skew in degrees for Y axis
   * @return {Boolean}
   */
  initWithDuration(t, deltaSkewX, deltaSkewY) {
    var ret = false;
    if (super.initWithDuration(t, deltaSkewX, deltaSkewY)) {
      this._skewX = deltaSkewX;
      this._skewY = deltaSkewY;
      ret = true;
    }
    return ret;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.SkewBy}
   */
  clone() {
    var action = new SkewBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._skewX, this._skewY);
    return action;
  }

  /**
   * Start the action width target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._deltaX = this._skewX;
    this._deltaY = this._skewY;
    this._endSkewX = this._startSkewX + this._deltaX;
    this._endSkewY = this._startSkewY + this._deltaY;
  }

  /**
   * Returns a reversed action.
   * @return {cc.SkewBy}
   */
  reverse() {
    var action = new SkewBy(this._duration, -this._skewX, -this._skewY);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

import { BezierBy } from './bezier-by.js';

/** An action that moves the target with a cubic Bezier curve to a destination point.
 * @class
 * @extends cc.BezierBy
 * @param {Number} t
 * @param {Array} c array of points
 * @example
 * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
 * var bezierTo = new cc.BezierTo(2, bezier);
 */
export class BezierTo extends BezierBy {
  /** @lends cc.BezierTo# */
  _toConfig;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t
   * @param {Array} c array of points
   * var bezierTo = new BezierTo(2, bezier);
   */
  constructor(t, c) {
    super();
    this._toConfig = [];
    c && this.initWithDuration(t, c);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Array} c Array of points
   * @return {Boolean}
   */
  initWithDuration(t, c) {
    if (super.initWithDuration(t)) {
      this._toConfig = c;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.BezierTo}
   */
  clone() {
    var action = new BezierTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toConfig);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._config[0] = cc.pSub(this._toConfig[0], this._startPosition);
    this._config[1] = cc.pSub(this._toConfig[1], this._startPosition);
    this._config[2] = cc.pSub(this._toConfig[2], this._startPosition);
  }
};

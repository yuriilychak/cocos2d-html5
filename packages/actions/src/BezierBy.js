import { ActionInterval } from './ActionInterval.js';
import { bezierAt } from './utils.js';

/** An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} t time in seconds
 * @param {Array} c Array of points
 * @example
 * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
 * var bezierForward = new cc.BezierBy(3, bezier);
 */
export class BezierBy extends ActionInterval {
  /** @lends cc.BezierBy# */
  _config = null;
  _startPosition = null;
  _previousPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t time in seconds
   * @param {Array} c Array of points
   */
  constructor(t, c) {
    super();
    this._config = [];
    this._startPosition = cc.p(0, 0);
    this._previousPosition = cc.p(0, 0);

    c && this.initWithDuration(t, c);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Array} c Array of points
   * @return {Boolean}
   */
  initWithDuration(t, c = []) {
    if (super.initWithDuration(t)) {
      this._config = c;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.BezierBy}
   */
  clone() {
    var action = new BezierBy();
    this._cloneDecoration(action);
    var newConfigs = [];
    for (var i = 0; i < this._config.length; i++) {
      var selConf = this._config[i];
      newConfigs.push(cc.p(selConf.x, selConf.y));
    }
    action.initWithDuration(this._duration, newConfigs);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    var locPosX = target.getPositionX();
    var locPosY = target.getPositionY();
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      var locConfig = this._config;
      var xa = 0;
      var xb = locConfig[0].x;
      var xc = locConfig[1].x;
      var xd = locConfig[2].x;

      var ya = 0;
      var yb = locConfig[0].y;
      var yc = locConfig[1].y;
      var yd = locConfig[2].y;

      var x = bezierAt(xa, xb, xc, xd, dt);
      var y = bezierAt(ya, yb, yc, yd, dt);

      var locStartPosition = this._startPosition;
      if (cc.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.getPositionX();
        var targetY = this.target.getPositionY();
        var locPreviousPosition = this._previousPosition;

        locStartPosition.x =
          locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y =
          locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  }

  /**
   * Returns a reversed action.
   * @return {cc.BezierBy}
   */
  reverse() {
    var locConfig = this._config;
    var r = [
      cc.pAdd(locConfig[1], cc.pNeg(locConfig[2])),
      cc.pAdd(locConfig[0], cc.pNeg(locConfig[2])),
      cc.pNeg(locConfig[2])
    ];
    var action = new BezierBy(this._duration, r);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

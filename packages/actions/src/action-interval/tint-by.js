import ActionInterval from './action-interval';

/**  Tints a cc.Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @example
 * var action = new cc.TintBy(2, -127, -255, -127);
 */
export default class TintBy extends ActionInterval {
  /** @lends cc.TintBy# */
  _deltaR = 0;
  _deltaG = 0;
  _deltaB = 0;

  _fromR = 0;
  _fromG = 0;
  _fromB = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration  duration in seconds
   * @param {Number} deltaRed
   * @param {Number} deltaGreen
   * @param {Number} deltaBlue
   */
  constructor(duration, deltaRed, deltaGreen, deltaBlue) {
    super();
    deltaBlue !== undefined &&
      this.initWithDuration(duration, deltaRed, deltaGreen, deltaBlue);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} deltaRed 0-255
   * @param {Number} deltaGreen 0-255
   * @param {Number} deltaBlue 0-255
   * @return {Boolean}
   */
  initWithDuration(duration, deltaRed, deltaGreen, deltaBlue) {
    if (super.initWithDuration(duration)) {
      this._deltaR = deltaRed;
      this._deltaG = deltaGreen;
      this._deltaB = deltaBlue;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.TintBy}
   */
  clone() {
    var action = new TintBy();
    this._cloneDecoration(action);
    action.initWithDuration(
      this._duration,
      this._deltaR,
      this._deltaG,
      this._deltaB
    );
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    var color = target.color;
    this._fromR = color.r;
    this._fromG = color.g;
    this._fromB = color.b;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);

    this.target.color = cc.color(
      this._fromR + this._deltaR * dt,
      this._fromG + this._deltaG * dt,
      this._fromB + this._deltaB * dt
    );
  }

  /**
   * Returns a reversed action.
   * @return {cc.TintBy}
   */
  reverse() {
    var action = new TintBy(
      this._duration,
      -this._deltaR,
      -this._deltaG,
      -this._deltaB
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

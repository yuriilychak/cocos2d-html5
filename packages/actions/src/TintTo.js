import { ActionInterval } from './ActionInterval.js';

/** Tints a cc.Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @example
 * var action = new cc.TintTo(2, 255, 0, 255);
 */
export class TintTo extends ActionInterval {
  /** @lends cc.TintTo# */
  _to = null;
  _from = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Number} red 0-255
   * @param {Number} green  0-255
   * @param {Number} blue 0-255
   */
  constructor(duration, red, green, blue) {
    super();
    this._to = cc.color(0, 0, 0);
    this._from = cc.color(0, 0, 0);

    blue !== undefined && this.initWithDuration(duration, red, green, blue);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} red 0-255
   * @param {Number} green 0-255
   * @param {Number} blue 0-255
   * @return {Boolean}
   */
  initWithDuration(duration, red, green, blue) {
    if (super.initWithDuration(duration)) {
      this._to = cc.color(red, green, blue);
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.TintTo}
   */
  clone() {
    var action = new TintTo();
    this._cloneDecoration(action);
    var locTo = this._to;
    action.initWithDuration(this._duration, locTo.r, locTo.g, locTo.b);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    this._from = this.target.color;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    var locFrom = this._from,
      locTo = this._to;
    if (locFrom) {
      this.target.setColor(
        cc.color(
          locFrom.r + (locTo.r - locFrom.r) * dt,
          locFrom.g + (locTo.g - locFrom.g) * dt,
          locFrom.b + (locTo.b - locFrom.b) * dt
        )
      );
    }
  }
};

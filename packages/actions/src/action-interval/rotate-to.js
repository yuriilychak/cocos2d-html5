import ActionInterval from "./action-interval";
import { log } from "@aspect/core";

/**
 * Rotates a Node object to a certain angle by modifying it's.
 * rotation attribute. <br/>
 * The direction will be decided by the shortest angle.
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngleX deltaAngleX in degrees.
 * @param {Number} [deltaAngleY] deltaAngleY in degrees.
 * @example
 * var rotateTo = new RotateTo(2, 61.0);
 */
export default class RotateTo extends ActionInterval {
  _dstAngleX = 0;
  _startAngleX = 0;
  _diffAngleX = 0;

  _dstAngleY = 0;
  _startAngleY = 0;
  _diffAngleY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates a RotateTo action with x and y rotation angles.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngleX deltaAngleX in degrees.
   * @param {Number} [deltaAngleY] deltaAngleY in degrees.
   */
  constructor(duration, deltaAngleX, deltaAngleY) {
    super();

    deltaAngleX !== undefined &&
      this.initWithDuration(duration, deltaAngleX, deltaAngleY);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} deltaAngleX
   * @param {Number} deltaAngleY
   * @return {Boolean}
   */
  initWithDuration(duration, deltaAngleX, deltaAngleY) {
    if (super.initWithDuration(duration)) {
      this._dstAngleX = deltaAngleX || 0;
      this._dstAngleY =
        deltaAngleY !== undefined ? deltaAngleY : this._dstAngleX;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {RotateTo}
   */
  clone() {
    var action = new RotateTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._dstAngleX, this._dstAngleY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    // Calculate X
    var locStartAngleX = target.rotationX % 360.0;
    var locDiffAngleX = this._dstAngleX - locStartAngleX;
    if (locDiffAngleX > 180) locDiffAngleX -= 360;
    if (locDiffAngleX < -180) locDiffAngleX += 360;
    this._startAngleX = locStartAngleX;
    this._diffAngleX = locDiffAngleX;

    // Calculate Y  It's duplicated from calculating X since the rotation wrap should be the same
    this._startAngleY = target.rotationY % 360.0;
    var locDiffAngleY = this._dstAngleY - this._startAngleY;
    if (locDiffAngleY > 180) locDiffAngleY -= 360;
    if (locDiffAngleY < -180) locDiffAngleY += 360;
    this._diffAngleY = locDiffAngleY;
  }

  /**
   * RotateTo reverse not implemented.
   * Will be overridden.
   * @returns {Action}
   */
  reverse() {
    log("RotateTo.reverse(): it should be overridden in subclass.");
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      this.target.rotationX = this._startAngleX + this._diffAngleX * dt;
      this.target.rotationY = this._startAngleY + this._diffAngleY * dt;
    }
  }
}

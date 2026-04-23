import ActionInterval from "./action-interval";

/**
 * Rotates a Node object clockwise a number of degrees by modifying it's rotation attribute.
 * Relative to its properties to modify.
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @example
 * var actionBy = new RotateBy(2, 360);
 */
export default class RotateBy extends ActionInterval {
  _angleX = 0;
  _startAngleX = 0;
  _angleY = 0;
  _startAngleY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngleX deltaAngleX in degrees
   * @param {Number} [deltaAngleY] deltaAngleY in degrees
   */
  constructor(duration, deltaAngleX, deltaAngleY) {
    super();

    deltaAngleX !== undefined &&
      this.initWithDuration(duration, deltaAngleX, deltaAngleY);
  }

  /**
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngleX deltaAngleX in degrees
   * @param {Number} [deltaAngleY=] deltaAngleY in degrees
   * @return {Boolean}
   */
  initWithDuration(duration, deltaAngleX, deltaAngleY) {
    if (super.initWithDuration(duration)) {
      this._angleX = deltaAngleX || 0;
      this._angleY = deltaAngleY || this._angleX;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {RotateBy}
   */
  clone() {
    var action = new RotateBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._angleX, this._angleY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._startAngleX = target.rotationX;
    this._startAngleY = target.rotationY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      this.target.rotationX = this._startAngleX + this._angleX * dt;
      this.target.rotationY = this._startAngleY + this._angleY * dt;
    }
  }

  /**
   * Returns a reversed action.
   * @return {RotateBy}
   */
  reverse() {
    var action = new RotateBy(this._duration, -this._angleX, -this._angleY);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
}

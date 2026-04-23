import ActionInstant from "./action-instant";

/**
 * Flips the sprite horizontally.
 * @param {Boolean} flip Indicate whether the target should be flipped or not
 *
 * @example
 * var flipXAction = new FlipX(true);
 */
export default class FlipX extends ActionInstant {
  _flippedX = false;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create a FlipX action to flip or unflip the target.
   * @param {Boolean} flip Indicate whether the target should be flipped or not
   */
  constructor(flip) {
    super();
    this._flippedX = false;
    flip !== undefined && this.initWithFlipX(flip);
  }

  /**
   * initializes the action with a set flipX.
   * @param {Boolean} flip
   * @return {Boolean}
   */
  initWithFlipX(flip) {
    this._flippedX = flip;
    return true;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    this.target.flippedX = this._flippedX;
  }

  /**
   * returns a reversed action.
   * @return {FlipX}
   */
  reverse() {
    return new FlipX(!this._flippedX);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {FiniteTimeAction}
   */
  clone() {
    const action = new FlipX();
    action.initWithFlipX(this._flippedX);
    return action;
  }
}

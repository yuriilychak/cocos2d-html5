import ActionInstant from './action-instant';

/**
 * Flips the sprite vertically
 * @param {Boolean} flip
 * @example
 * var flipYAction = new cc.FlipY(true);
 */
export default class FlipY extends ActionInstant {
  _flippedY = false;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create a FlipY action to flip or unflip the target.
   *
   * @param {Boolean} flip
   */
  constructor(flip) {
    super();
    this._flippedY = false;

    flip !== undefined && this.initWithFlipY(flip);
  }

  /**
   * initializes the action with a set flipY.
   * @param {Boolean} flip
   * @return {Boolean}
   */
  initWithFlipY(flip) {
    this._flippedY = flip;
    return true;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    this.target.flippedY = this._flippedY;
  }

  /**
   * returns a reversed action.
   * @return {cc.FlipY}
   */
  reverse() {
    return new FlipY(!this._flippedY);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.FlipY}
   */
  clone() {
    const action = new FlipY();
    action.initWithFlipY(this._flippedY);
    return action;
  }
};

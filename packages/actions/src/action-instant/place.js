import { ActionInstant } from './action-instant.js';

/**
 * Places the node in a certain position
 * @class
 * @extends cc.ActionInstant
 * @param {cc.Point|Number} pos
 * @param {Number} [y]
 * @example
 * var placeAction = new cc.Place(cc.p(200, 200));
 * var placeAction = new cc.Place(200, 200);
 */
export class Place extends ActionInstant {
  /** @lends cc.Place# */
  _x = 0;
  _y = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates a Place action with a position.
   * @param {cc.Point|Number} pos
   * @param {Number} [y]
   */
  constructor(pos, y) {
    super();
    this._x = 0;
    this._y = 0;

    if (pos !== undefined) {
      if (pos.x !== undefined) {
        y = pos.y;
        pos = pos.x;
      }
      this.initWithPosition(pos, y);
    }
  }

  /**
   * Initializes a Place action with a position
   * @param {number} x
   * @param {number} y
   * @return {Boolean}
   */
  initWithPosition(x, y) {
    this._x = x;
    this._y = y;
    return true;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    this.target.setPosition(this._x, this._y);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.Place}
   */
  clone() {
    const action = new Place();
    action.initWithPosition(this._x, this._y);
    return action;
  }
};

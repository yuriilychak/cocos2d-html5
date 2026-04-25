import MoveBy from "./move-by";
import { Point } from "@aspect/core";

/**
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying it's position attribute. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * @param {Number} duration duration in seconds
 * @param {Point|Number} position
 * @param {Number} y
 * @example
 * var actionTo = new MoveTo(2, p(80, 80));
 */
export default class MoveTo extends MoveBy {
  _endPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   * @param {Point|Number} position
   * @param {Number} y
   */
  constructor(duration, position, y) {
    super();
    this._endPosition = new Point(0, 0);

    position !== undefined && this.initWithDuration(duration, position, y);
  }

  /**
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Point} position
   * @param {Number} y
   * @return {Boolean}
   */
  initWithDuration(duration, position, y) {
    if (super.initWithDuration(duration, position, y)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {MoveTo}
   */
  clone() {
    var action = new MoveTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endPosition);
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._positionDelta.x = this._endPosition.x - target.getPositionX();
    this._positionDelta.y = this._endPosition.y - target.getPositionY();
  }
}

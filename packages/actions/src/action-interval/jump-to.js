import JumpBy from "./jump-by";
import { Point } from "@aspect/core";

/**
 * Moves a Node object to a parabolic position simulating a jump movement by modifying it's position attribute. <br />
 * Jump to the specified location.
 * @param {Number} duration
 * @param {Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionTo = new JumpTo(2, p(300, 0), 50, 4);
 * var actionTo = new JumpTo(2, 300, 0, 50, 4);
 */
export default class JumpTo extends JumpBy {
  _endPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   */
  constructor(duration, position, y, height, jumps) {
    super();
    this._endPosition = new Point(0, 0);

    height !== undefined &&
      this.initWithDuration(duration, position, y, height, jumps);
  }
  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionTo.initWithDuration(2, p(300, 0), 50, 4);
   * actionTo.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration(duration, position, y, height, jumps) {
    if (
      JumpBy.prototype.initWithDuration.call(
        this,
        duration,
        position,
        y,
        height,
        jumps
      )
    ) {
      if (jumps === undefined) {
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
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._delta.x = this._endPosition.x - this._startPosition.x;
    this._delta.y = this._endPosition.y - this._startPosition.y;
  }

  /**
   * returns a new clone of the action
   * @returns {JumpTo}
   */
  clone() {
    var action = new JumpTo();
    this._cloneDecoration(action);
    action.initWithDuration(
      this._duration,
      this._endPosition,
      this._height,
      this._jumps
    );
    return action;
  }
}

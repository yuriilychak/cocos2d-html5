import { JumpBy } from './jump-by.js';

/**
 * Moves a cc.Node object to a parabolic position simulating a jump movement by modifying it's position attribute. <br />
 * Jump to the specified location.
 * @class
 * @extends cc.JumpBy
 * @param {Number} duration
 * @param {cc.Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionTo = new cc.JumpTo(2, cc.p(300, 0), 50, 4);
 * var actionTo = new cc.JumpTo(2, 300, 0, 50, 4);
 */
export class JumpTo extends JumpBy {
  /** @lends cc.JumpTo# */
  _endPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {cc.Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   */
  constructor(duration, position, y, height, jumps) {
    super();
    this._endPosition = cc.p(0, 0);

    height !== undefined &&
      this.initWithDuration(duration, position, y, height, jumps);
  }
  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {cc.Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionTo.initWithDuration(2, cc.p(300, 0), 50, 4);
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
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._delta.x = this._endPosition.x - this._startPosition.x;
    this._delta.y = this._endPosition.y - this._startPosition.y;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.JumpTo}
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
};

import ActionInterval from './action-interval';

/**
 * Moves a cc.Node object simulating a parabolic jump movement by modifying it's position attribute.
 * Relative to its movement.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {cc.Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionBy = new cc.JumpBy(2, cc.p(300, 0), 50, 4);
 * var actionBy = new cc.JumpBy(2, 300, 0, 50, 4);
 */
export default class JumpBy extends ActionInterval {
  /** @lends cc.JumpBy# */
  _startPosition = null;
  _delta = null;
  _height = 0;
  _jumps = 0;
  _previousPosition = null;

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
    this._startPosition = cc.p(0, 0);
    this._previousPosition = cc.p(0, 0);
    this._delta = cc.p(0, 0);

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
   * actionBy.initWithDuration(2, cc.p(300, 0), 50, 4);
   * actionBy.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration(duration, position, y, height, jumps) {
    if (super.initWithDuration(duration)) {
      if (jumps === undefined) {
        jumps = height;
        height = y;
        y = position.y;
        position = position.x;
      }
      this._delta.x = position;
      this._delta.y = y;
      this._height = height;
      this._jumps = jumps;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.JumpBy}
   */
  clone() {
    var action = new JumpBy();
    this._cloneDecoration(action);
    action.initWithDuration(
      this._duration,
      this._delta,
      this._height,
      this._jumps
    );
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    var locPosX = target.getPositionX();
    var locPosY = target.getPositionY();
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      var frac = (dt * this._jumps) % 1.0;
      var y = this._height * 4 * frac * (1 - frac);
      y += this._delta.y * dt;

      var x = this._delta.x * dt;
      var locStartPosition = this._startPosition;
      if (cc.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.getPositionX();
        var targetY = this.target.getPositionY();
        var locPreviousPosition = this._previousPosition;

        locStartPosition.x =
          locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y =
          locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  }

  /**
   * Returns a reversed action.
   * @return {cc.JumpBy}
   */
  reverse() {
    var action = new JumpBy(
      this._duration,
      cc.p(-this._delta.x, -this._delta.y),
      this._height,
      this._jumps
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

import { ActionInterval } from './action-interval.js';

/**
 * <p>
 *     Moves a CCNode object x,y pixels by modifying it's position attribute.                                  <br/>
 *     x and y are relative to the position of the object.                                                     <br/>
 *     Several CCMoveBy actions can be concurrently called, and the resulting                                  <br/>
 *     movement will be the sum of individual movements.
 * </p>
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration duration in seconds
 * @param {cc.Point|Number} deltaPos
 * @param {Number} [deltaY]
 * @example
 * var actionBy = cc.moveBy(2, cc.p(windowSize.width - 40, windowSize.height - 40));
 */
export class MoveBy extends ActionInterval {
  /** @lends cc.MoveBy# */
  _positionDelta = null;
  _startPosition = null;
  _previousPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   * @param {cc.Point|Number} deltaPos
   * @param {Number} [deltaY]
   */
  constructor(duration, deltaPos, deltaY) {
    super();

    this._positionDelta = cc.p(0, 0);
    this._startPosition = cc.p(0, 0);
    this._previousPosition = cc.p(0, 0);

    deltaPos !== undefined && this.initWithDuration(duration, deltaPos, deltaY);
  }

  /**
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {cc.Point} position
   * @param {Number} [y]
   * @return {Boolean}
   */
  initWithDuration(duration, position, y) {
    if (super.initWithDuration(duration)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._positionDelta.x = position;
      this._positionDelta.y = y;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.MoveBy}
   */
  clone() {
    var action = new MoveBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._positionDelta);
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
      var x = this._positionDelta.x * dt;
      var y = this._positionDelta.y * dt;
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
   * MoveTo reverse is not implemented
   * @return {cc.MoveBy}
   */
  reverse() {
    var action = new MoveBy(
      this._duration,
      cc.p(-this._positionDelta.x, -this._positionDelta.y)
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

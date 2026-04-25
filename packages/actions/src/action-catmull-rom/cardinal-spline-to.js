import ActionInterval from "../action-interval/action-interval";
import {
  cardinalSplineAt,
  getControlPointAt,
  cloneControlPoints,
  reverseControlPoints
} from "../action/utils";
import { Point, ENABLE_STACKABLE_ACTIONS } from "@aspect/core";

/**
 * Cardinal Spline path. {@link http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline}
 * Absolute coordinates.
 *
 * @param {Number} duration
 * @param {Array} points array of control points
 * @param {Number} tension
 *
 * @example
 * //create a CardinalSplineTo
 * var action1 = cardinalSplineTo(3, array, 0);
 */
export default class CardinalSplineTo extends ActionInterval {
  /** Array of control points */
  _points = null;
  _deltaT = 0;
  _tension = 0;
  _previousPosition = null;
  _accumulatedDiff = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates an action with a Cardinal Spline array of points and tension.
   * @param {Number} duration
   * @param {Array} points array of control points
   * @param {Number} tension
   */
  constructor(duration, points, tension) {
    super();

    this._points = [];
    tension !== undefined && this.initWithDuration(duration, points, tension);
  }

  /**
   * initializes the action with a duration and an array of points
   *
   * @param {Number} duration
   * @param {Array} points array of control points
   * @param {Number} tension
   *
   * @return {Boolean}
   */
  initWithDuration(duration, points, tension) {
    if (!points || points.length === 0)
      throw new Error(
        "Invalid configuration. It must at least have one control point"
      );

    if (super.initWithDuration(duration)) {
      this.setPoints(points);
      this._tension = tension;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   *
   * @returns {CardinalSplineTo}
   */
  clone() {
    const action = new CardinalSplineTo();
    action.initWithDuration(
      this._duration,
      cloneControlPoints(this._points),
      this._tension
    );
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    // Issue #1441 from cocos2d-iphone
    this._deltaT = 1 / (this._points.length - 1);
    this._previousPosition = new Point(
      this.target.getPositionX(),
      this.target.getPositionY()
    );
    this._accumulatedDiff = new Point(0, 0);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    let p, lt;
    const ps = this._points;
    // eg.
    // p..p..p..p..p..p..p
    // 1..2..3..4..5..6..7
    // want p to be 1, 2, 3, 4, 5, 6
    if (dt === 1) {
      p = ps.length - 1;
      lt = 1;
    } else {
      const locDT = this._deltaT;
      p = 0 | (dt / locDT);
      lt = (dt - locDT * p) / locDT;
    }

    const newPos = cardinalSplineAt(
      getControlPointAt(ps, p - 1),
      getControlPointAt(ps, p - 0),
      getControlPointAt(ps, p + 1),
      getControlPointAt(ps, p + 2),
      this._tension,
      lt
    );

    if (ENABLE_STACKABLE_ACTIONS) {
      let tempX, tempY;
      tempX = this.target.getPositionX() - this._previousPosition.x;
      tempY = this.target.getPositionY() - this._previousPosition.y;
      if (tempX !== 0 || tempY !== 0) {
        const locAccDiff = this._accumulatedDiff;
        tempX = locAccDiff.x + tempX;
        tempY = locAccDiff.y + tempY;
        locAccDiff.x = tempX;
        locAccDiff.y = tempY;
        newPos.x += tempX;
        newPos.y += tempY;
      }
    }
    this.updatePosition(newPos);
  }

  /**
   * reverse a new CardinalSplineTo. <br />
   * Along the track of movement in the opposite.
   *
   * @return {CardinalSplineTo}
   */
  reverse() {
    const reversePoints = reverseControlPoints(this._points);
    return new CardinalSplineTo(this._duration, reversePoints, this._tension);
  }

  /**
   * update position of target
   *
   * @param {Point} newPos
   */
  updatePosition(newPos) {
    this.target.setPosition(newPos);
    this._previousPosition = newPos;
  }

  /**
   * Points getter
   *
   * @return {Array}
   */
  getPoints() {
    return this._points;
  }

  /**
   * Points setter
   *
   * @param {Array} points
   */
  setPoints(points) {
    this._points = points;
  }
}

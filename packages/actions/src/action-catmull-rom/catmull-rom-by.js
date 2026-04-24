import CardinalSplineBy from "./cardinal-spline-by";
import CardinalSplineTo from "./cardinal-spline-to";
import { cloneControlPoints } from "../action/utils";

/**
 * An action that moves the target with a CatmullRom curve by a certain distance.  <br/>
 * A Catmull Rom is a Cardinal Spline with a tension of 0.5.<br/>
 * http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline
 * Relative coordinates.
 *
 * @param {Number} dt
 * @param {Array} points
 *
 * @example
 * var action1 = catmullRomBy(3, array);
 */
export default class CatmullRomBy extends CardinalSplineBy {
  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates an action with a Cardinal Spline array of points and tension.
   * @param {Number} dt
   * @param {Array} points
   */
  constructor(dt, points) {
    super();
    points && this.initWithDuration(dt, points);
  }

  /**
   * initializes the action with a duration and an array of points
   *
   * @function
   * @param {Number} dt
   * @param {Array} points
   */
  initWithDuration(dt, points) {
    return CardinalSplineTo.prototype.initWithDuration.call(
      this,
      dt,
      points,
      0.5
    );
  }

  /**
   * returns a new clone of the action
   * @returns {CatmullRomBy}
   */
  clone() {
    const action = new CatmullRomBy();
    action.initWithDuration(this._duration, cloneControlPoints(this._points));
    return action;
  }
}

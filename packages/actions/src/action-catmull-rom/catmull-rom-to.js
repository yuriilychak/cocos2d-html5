import CardinalSplineTo from './cardinal-spline-to';
import { cloneControlPoints } from '../action/utils';

/**
 * An action that moves the target with a CatmullRom curve to a destination point.<br/>
 * A Catmull Rom is a Cardinal Spline with a tension of 0.5.  <br/>
 * {@link http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline}
 * Absolute coordinates.
 *
 * @param {Number} dt
 * @param {Array} points
 *
 * @example
 * var action1 = cc.catmullRomTo(3, array);
 */
export default class CatmullRomTo extends CardinalSplineTo {

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * creates an action with a Cardinal Spline array of points and tension.
   * @param {Number} dt
   * @param {Array} points
   */
  constructor(dt, points) {
    super();
    points && this.initWithDuration(dt, points);
  }

  /**
   * Initializes the action with a duration and an array of points
   *
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
   * @returns {cc.CatmullRomTo}
   */
  clone() {
    const action = new CatmullRomTo();
    action.initWithDuration(
      this._duration,
      cloneControlPoints(this._points)
    );
    return action;
  }
};

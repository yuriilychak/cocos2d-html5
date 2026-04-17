import { ActionEase } from './ActionEase.js';

/**
 * cc.EaseBezierAction action. <br />
 * Manually set a 4 order Bessel curve. <br />
 * According to the set point, calculate the trajectory.
 * @class
 * @extends cc.ActionEase
 * @param {cc.Action} action
 * @example
 * action.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));
 */
export class EaseBezierAction extends ActionEase {
  /** @lends cc.EaseBezierAction# */

  _p0 = null;
  _p1 = null;
  _p2 = null;
  _p3 = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Initialization requires the application of Bessel curve of action.
   * @param {cc.Action} action
   */
  constructor(action) {
    super(action);
  }

  _updateTime(a, b, c, d, t) {
    return (
      Math.pow(1 - t, 3) * a +
      3 * t * Math.pow(1 - t, 2) * b +
      3 * Math.pow(t, 2) * (1 - t) * c +
      Math.pow(t, 3) * d
    );
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var t = this._updateTime(this._p0, this._p1, this._p2, this._p3, dt);
    this._inner.update(t);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBezierAction}
   */
  clone() {
    var action = new EaseBezierAction();
    action.initWithAction(this._inner.clone());
    action.setBezierParamer(this._p0, this._p1, this._p2, this._p3);
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBezierAction}
   */
  reverse() {
    var action = new EaseBezierAction(this._inner.reverse());
    action.setBezierParamer(this._p3, this._p2, this._p1, this._p0);
    return action;
  }

  /**
   * Set of 4 reference point
   * @param p0
   * @param p1
   * @param p2
   * @param p3
   */
  setBezierParamer(p0, p1, p2, p3) {
    this._p0 = p0 || 0;
    this._p1 = p1 || 0;
    this._p2 = p2 || 0;
    this._p3 = p3 || 0;
  }
};

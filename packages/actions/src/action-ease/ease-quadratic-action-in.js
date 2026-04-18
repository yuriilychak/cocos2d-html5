import ActionEase from './action-ease';

/**
 * cc.EaseQuadraticActionIn action. <br />
 * Reference easeInQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuadraticActionIn());
 */
export default class EaseQuadraticActionIn extends ActionEase {
  /** @lends cc.EaseQuadraticActionIn# */

  _updateTime(time) {
    return Math.pow(time, 2);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(this._updateTime(dt));
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseQuadraticActionIn}
   */
  clone() {
    var action = new EaseQuadraticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuadraticActionIn}
   */
  reverse() {
    return new EaseQuadraticActionIn(this._inner.reverse());
  }
};

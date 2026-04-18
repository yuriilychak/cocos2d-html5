import ActionEase from './action-ease';

/**
 * cc.EaseQuadraticActionIn action. <br />
 * Reference easeOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuadraticActionOut());
 */
export default class EaseQuadraticActionOut extends ActionEase {
  /** @lends cc.EaseQuadraticActionOut# */

  _updateTime(time) {
    return -time * (time - 2);
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
   * @returns {cc.EaseQuadraticActionOut}
   */
  clone() {
    var action = new EaseQuadraticActionOut();
    action.initWithAction();
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuadraticActionOut}
   */
  reverse() {
    return new EaseQuadraticActionOut(this._inner.reverse());
  }
};

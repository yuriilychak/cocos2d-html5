import ActionEase from './action-ease';

/**
 * cc.EaseCubicActionIn action. <br />
 * Reference easeInCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCubicActionIn());
 */
export default class EaseCubicActionIn extends ActionEase {
  /** @lends cc.EaseCubicActionIn# */
  _updateTime(time) {
    return time * time * time;
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
   * @returns {cc.EaseCubicActionIn}
   */
  clone() {
    var action = new EaseCubicActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCubicActionIn}
   */
  reverse() {
    return new EaseCubicActionIn(this._inner.reverse());
  }
};

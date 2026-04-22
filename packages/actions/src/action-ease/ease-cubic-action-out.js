import ActionEase from './action-ease';

/**
 * cc.EaseCubicActionOut action. <br />
 * Reference easeOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(cc.easeCubicActionOut());
 */
export default class EaseCubicActionOut extends ActionEase {
  _updateTime(time) {
    time -= 1;
    return time * time * time + 1;
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
   * @returns {cc.EaseCubicActionOut}
   */
  clone() {
    var action = new EaseCubicActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCubicActionOut}
   */
  reverse() {
    return new EaseCubicActionOut(this._inner.reverse());
  }
};

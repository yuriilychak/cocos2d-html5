import ActionEase from "./action-ease";

/**
 * EaseCubicActionInOut action. <br />
 * Reference easeInOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(easeCubicActionInOut());
 */
export default class EaseCubicActionInOut extends ActionEase {
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return 0.5 * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time + 2);
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
   * @returns {EaseCubicActionInOut}
   */
  clone() {
    var action = new EaseCubicActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseCubicActionInOut}
   */
  reverse() {
    return new EaseCubicActionInOut(this._inner.reverse());
  }
}

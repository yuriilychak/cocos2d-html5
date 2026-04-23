import ActionEase from "./action-ease";

/**
 * EaseCircleActionOut action. <br />
 * Reference easeOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(easeCircleActionOut());
 */
export default class EaseCircleActionOut extends ActionEase {
  _updateTime(time) {
    time = time - 1;
    return Math.sqrt(1 - time * time);
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
   * @returns {EaseCircleActionOut}
   */
  clone() {
    var action = new EaseCircleActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {EaseCircleActionOut}
   */
  reverse() {
    return new EaseCircleActionOut(this._inner.reverse());
  }
}

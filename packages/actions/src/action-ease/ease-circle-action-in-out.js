import ActionEase from './action-ease';

/**
 * cc.EaseCircleActionInOut action. <br />
 * Reference easeInOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCircleActionInOut());
 */
export default class EaseCircleActionInOut extends ActionEase {
  /** @lends cc.EaseCircleActionInOut# */
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return -0.5 * (Math.sqrt(1 - time * time) - 1);
    time -= 2;
    return 0.5 * (Math.sqrt(1 - time * time) + 1);
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
   * @returns {cc.EaseCircleActionInOut}
   */
  clone() {
    var action = new EaseCircleActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCircleActionInOut}
   */
  reverse() {
    return new EaseCircleActionInOut(this._inner.reverse());
  }
};

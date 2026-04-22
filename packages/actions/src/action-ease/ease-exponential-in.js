import ActionEase from './action-ease';

/**
 * cc.Ease Exponential In. Slow to Fast. <br />
 * Reference easeInExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @example
 * action.easing(cc.easeExponentialIn());
 */
export default class EaseExponentialIn extends ActionEase {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(dt === 0 ? 0 : Math.pow(2, 10 * (dt - 1)));
  }

  /**
   * Create a cc.EaseExponentialOut action. Opposite with the original motion trajectory.
   * @return {cc.EaseExponentialOut}
   */
  reverse() {
    return new cc.EaseExponentialOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseExponentialIn}
   */
  clone() {
    var action = new EaseExponentialIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

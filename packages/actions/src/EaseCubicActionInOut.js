import { ActionEase } from './ActionEase.js';

/**
 * cc.EaseCubicActionInOut action. <br />
 * Reference easeInOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCubicActionInOut());
 */
export class EaseCubicActionInOut extends ActionEase {
  /** @lends cc.EaseCubicActionInOut# */
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
   * @returns {cc.EaseCubicActionInOut}
   */
  clone() {
    var action = new EaseCubicActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCubicActionInOut}
   */
  reverse() {
    return new EaseCubicActionInOut(this._inner.reverse());
  }
};

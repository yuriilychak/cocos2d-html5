import { ActionEase } from './action-ease.js';

/**
 * cc.EaseCubicActionOut action. <br />
 * Reference easeOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCubicActionOut());
 */
export class EaseCubicActionOut extends ActionEase {
  /** @lends cc.EaseCubicActionOut# */
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

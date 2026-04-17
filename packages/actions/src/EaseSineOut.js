import { ActionEase } from './ActionEase.js';

/**
 * Ease Sine Out. <br />
 * Reference easeOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeSineOut());
 */
export class EaseSineOut extends ActionEase {
  /** @lends cc.EaseSineOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt = dt === 0 || dt === 1 ? dt : Math.sin((dt * Math.PI) / 2);
    this._inner.update(dt);
  }

  /**
   * Create a cc.EaseSineIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseSineIn}
   */
  reverse() {
    return new cc.EaseSineIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseSineOut}
   */
  clone() {
    var action = new EaseSineOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

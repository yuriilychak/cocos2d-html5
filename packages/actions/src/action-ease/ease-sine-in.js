import ActionEase from './action-ease';

/**
 * Ease Sine In. <br />
 * Reference easeInSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeSineIn());
 */
export default class EaseSineIn extends ActionEase {
  /** @lends cc.EaseSineIn# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt = dt === 0 || dt === 1 ? dt : -1 * Math.cos((dt * Math.PI) / 2) + 1;
    this._inner.update(dt);
  }

  /**
   * Create a cc.EaseSineOut action. Opposite with the original motion trajectory.
   * @return {cc.EaseSineOut}
   */
  reverse() {
    return new cc.EaseSineOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseSineIn}
   */
  clone() {
    var action = new EaseSineIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

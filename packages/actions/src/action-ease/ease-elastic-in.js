import { EaseElastic } from './ease-elastic.js';

/**
 * Ease Elastic In action. <br />
 * Reference easeInElastic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseElastic
 *
 * @example
 * action.easing(cc.easeElasticIn(period));
 */
export class EaseElasticIn extends EaseElastic {
  /** @lends cc.EaseElasticIn# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    let newT = 0;
    if (dt === 0 || dt === 1) {
      newT = dt;
    } else {
      const s = this._period / 4;
      dt = dt - 1;
      newT =
        -Math.pow(2, 10 * dt) *
        Math.sin(((dt - s) * Math.PI * 2) / this._period);
    }
    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseElasticOut}
   */
  reverse() {
    return new cc.EaseElasticOut(this._inner.reverse(), this._period);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseElasticIn}
   */
  clone() {
    var action = new EaseElasticIn();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

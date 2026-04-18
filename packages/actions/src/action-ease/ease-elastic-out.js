import { EaseElastic } from './ease-elastic.js';

/**
 * Ease Elastic Out action. <br />
 * Reference easeOutElastic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseElastic
 *
 * @example
 * action.easing(cc.easeElasticOut(period));
 */
export class EaseElasticOut extends EaseElastic {
  /** @lends cc.EaseElasticOut# */
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
      newT =
        Math.pow(2, -10 * dt) *
          Math.sin(((dt - s) * Math.PI * 2) / this._period) +
        1;
    }

    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseElasticIn}
   */
  reverse() {
    return new cc.EaseElasticIn(this._inner.reverse(), this._period);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseElasticOut}
   */
  clone() {
    var action = new EaseElasticOut();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

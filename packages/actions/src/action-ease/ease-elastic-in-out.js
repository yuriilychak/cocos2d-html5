import { EaseElastic } from './ease-elastic.js';

/**
 * Ease Elastic InOut action. <br />
 * Reference easeInOutElastic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseElastic
 *
 * @example
 * action.easing(cc.easeElasticInOut(period));
 */
export class EaseElasticInOut extends EaseElastic {
  /** @lends cc.EaseElasticInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    let newT = 0;
    let locPeriod = this._period;
    if (dt === 0 || dt === 1) {
      newT = dt;
    } else {
      dt = dt * 2;
      if (!locPeriod) locPeriod = this._period = 0.3 * 1.5;

      const s = locPeriod / 4;
      dt = dt - 1;
      if (dt < 0)
        newT =
          -0.5 *
          Math.pow(2, 10 * dt) *
          Math.sin(((dt - s) * Math.PI * 2) / locPeriod);
      else
        newT =
          Math.pow(2, -10 * dt) *
            Math.sin(((dt - s) * Math.PI * 2) / locPeriod) *
            0.5 +
          1;
    }
    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseElasticInOut}
   */
  reverse() {
    return new EaseElasticInOut(this._inner.reverse(), this._period);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseElasticInOut}
   */
  clone() {
    var action = new EaseElasticInOut();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

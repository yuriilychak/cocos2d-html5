import ActionEase from './action-ease';

/**
 * cc.EaseBounce abstract class.
 *
 */
export default class EaseBounce extends ActionEase {
  /**
   * @param {Number} time1
   * @return {Number}
   */
  bounceTime(time1) {
    if (time1 < 1 / 2.75) {
      return 7.5625 * time1 * time1;
    } else if (time1 < 2 / 2.75) {
      time1 -= 1.5 / 2.75;
      return 7.5625 * time1 * time1 + 0.75;
    } else if (time1 < 2.5 / 2.75) {
      time1 -= 2.25 / 2.75;
      return 7.5625 * time1 * time1 + 0.9375;
    }

    time1 -= 2.625 / 2.75;
    return 7.5625 * time1 * time1 + 0.984375;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBounce}
   */
  clone() {
    var action = new EaseBounce();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounce}
   */
  reverse() {
    return new EaseBounce(this._inner.reverse());
  }
};

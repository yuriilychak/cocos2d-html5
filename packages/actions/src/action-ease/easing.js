import { bounceTime } from '../action/utils.js';
import { EaseCircleActionIn } from './ease-circle-action-in.js';
import { EaseCircleActionInOut } from './ease-circle-action-in-out.js';
import { EaseCircleActionOut } from './ease-circle-action-out.js';
import { EaseCubicActionIn } from './ease-cubic-action-in.js';
import { EaseCubicActionInOut } from './ease-cubic-action-in-out.js';
import { EaseCubicActionOut } from './ease-cubic-action-out.js';
import { EaseQuadraticActionIn } from './ease-quadratic-action-in.js';
import { EaseQuadraticActionInOut } from './ease-quadratic-action-in-out.js';
import { EaseQuadraticActionOut } from './ease-quadratic-action-out.js';
import { EaseQuarticActionIn } from './ease-quartic-action-in.js';
import { EaseQuarticActionInOut } from './ease-quartic-action-in-out.js';
import { EaseQuarticActionOut } from './ease-quartic-action-out.js';
import { EaseQuinticActionIn } from './ease-quintic-action-in.js';
import { EaseQuinticActionInOut } from './ease-quintic-action-in-out.js';
import { EaseQuinticActionOut } from './ease-quintic-action-out.js';

// ─── Singleton Ease Objects ────────────────────────

export const _easeExponentialInObj = {
  easing: function (dt) {
    return dt === 0 ? 0 : Math.pow(2, 10 * (dt - 1));
  },
  reverse: function () {
    return _easeExponentialOutObj;
  }
};

export const _easeExponentialOutObj = {
  easing: function (dt) {
    return dt === 1 ? 1 : -Math.pow(2, -10 * dt) + 1;
  },
  reverse: function () {
    return _easeExponentialInObj;
  }
};

export const _easeExponentialInOutObj = {
  easing: function (dt) {
    if (dt !== 1 && dt !== 0) {
      dt *= 2;
      if (dt < 1) return 0.5 * Math.pow(2, 10 * (dt - 1));
      else return 0.5 * (-Math.pow(2, -10 * (dt - 1)) + 2);
    }
    return dt;
  },
  reverse: function () {
    return _easeExponentialInOutObj;
  }
};

export const _easeSineInObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1 ? dt : -1 * Math.cos((dt * Math.PI) / 2) + 1;
  },
  reverse: function () {
    return _easeSineOutObj;
  }
};

export const _easeSineOutObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1 ? dt : Math.sin((dt * Math.PI) / 2);
  },
  reverse: function () {
    return _easeSineInObj;
  }
};

export const _easeSineInOutObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1 ? dt : -0.5 * (Math.cos(Math.PI * dt) - 1);
  },
  reverse: function () {
    return _easeSineInOutObj;
  }
};

export const _easeElasticInObj = {
  easing: function (dt) {
    if (dt === 0 || dt === 1) return dt;
    dt = dt - 1;
    return (
      -Math.pow(2, 10 * dt) * Math.sin(((dt - 0.3 / 4) * Math.PI * 2) / 0.3)
    );
  },
  reverse: function () {
    return _easeElasticOutObj;
  }
};

export const _easeElasticOutObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1
      ? dt
      : Math.pow(2, -10 * dt) * Math.sin(((dt - 0.3 / 4) * Math.PI * 2) / 0.3) +
          1;
  },
  reverse: function () {
    return _easeElasticInObj;
  }
};

export const _easeBounceInObj = {
  easing: function (dt) {
    return 1 - cc._bounceTime(1 - dt);
  },
  reverse: function () {
    return _easeBounceOutObj;
  }
};

export const _easeBounceOutObj = {
  easing: function (dt) {
    return cc._bounceTime(dt);
  },
  reverse: function () {
    return _easeBounceInObj;
  }
};

export const _easeBounceInOutObj = {
  easing: function (time1) {
    var newT;
    if (time1 < 0.5) {
      time1 = time1 * 2;
      newT = (1 - cc._bounceTime(1 - time1)) * 0.5;
    } else {
      newT = cc._bounceTime(time1 * 2 - 1) * 0.5 + 0.5;
    }
    return newT;
  },
  reverse: function () {
    return _easeBounceInOutObj;
  }
};

export const _easeBackInObj = {
  easing: function (time1) {
    var overshoot = 1.70158;
    return time1 === 0 || time1 === 1
      ? time1
      : time1 * time1 * ((overshoot + 1) * time1 - overshoot);
  },
  reverse: function () {
    return _easeBackOutObj;
  }
};

export const _easeBackOutObj = {
  easing: function (time1) {
    var overshoot = 1.70158;
    time1 = time1 - 1;
    return time1 * time1 * ((overshoot + 1) * time1 + overshoot) + 1;
  },
  reverse: function () {
    return _easeBackInObj;
  }
};

export const _easeBackInOutObj = {
  easing: function (time1) {
    var overshoot = 1.70158 * 1.525;
    time1 = time1 * 2;
    if (time1 < 1) {
      return (time1 * time1 * ((overshoot + 1) * time1 - overshoot)) / 2;
    } else {
      time1 = time1 - 2;
      return (time1 * time1 * ((overshoot + 1) * time1 + overshoot)) / 2 + 1;
    }
  },
  reverse: function () {
    return _easeBackInOutObj;
  }
};

export const _easeQuadraticActionIn = {
  easing: EaseQuadraticActionIn.prototype._updateTime,
  reverse: function () {
    return _easeQuadraticActionIn;
  }
};

export const _easeQuadraticActionOut = {
  easing: EaseQuadraticActionOut.prototype._updateTime,
  reverse: function () {
    return _easeQuadraticActionOut;
  }
};

export const _easeQuadraticActionInOut = {
  easing: EaseQuadraticActionInOut.prototype._updateTime,
  reverse: function () {
    return _easeQuadraticActionInOut;
  }
};

export const _easeQuarticActionIn = {
  easing: EaseQuarticActionIn.prototype._updateTime,
  reverse: function () {
    return _easeQuarticActionIn;
  }
};

export const _easeQuarticActionOut = {
  easing: EaseQuarticActionOut.prototype._updateTime,
  reverse: function () {
    return _easeQuarticActionOut;
  }
};

export const _easeQuarticActionInOut = {
  easing: EaseQuarticActionInOut.prototype._updateTime,
  reverse: function () {
    return _easeQuarticActionInOut;
  }
};

export const _easeQuinticActionIn = {
  easing: EaseQuinticActionIn.prototype._updateTime,
  reverse: function () {
    return _easeQuinticActionIn;
  }
};

export const _easeQuinticActionOut = {
  easing: EaseQuinticActionOut.prototype._updateTime,
  reverse: function () {
    return _easeQuinticActionOut;
  }
};

export const _easeQuinticActionInOut = {
  easing: EaseQuinticActionInOut.prototype._updateTime,
  reverse: function () {
    return _easeQuinticActionInOut;
  }
};

export const _easeCircleActionIn = {
  easing: EaseCircleActionIn.prototype._updateTime,
  reverse: function () {
    return _easeCircleActionIn;
  }
};

export const _easeCircleActionOut = {
  easing: EaseCircleActionOut.prototype._updateTime,
  reverse: function () {
    return _easeCircleActionOut;
  }
};

export const _easeCircleActionInOut = {
  easing: EaseCircleActionInOut.prototype._updateTime,
  reverse: function () {
    return _easeCircleActionInOut;
  }
};

export const _easeCubicActionIn = {
  easing: EaseCubicActionIn.prototype._updateTime,
  reverse: function () {
    return _easeCubicActionIn;
  }
};

export const _easeCubicActionOut = {
  easing: EaseCubicActionOut.prototype._updateTime,
  reverse: function () {
    return _easeCubicActionOut;
  }
};

export const _easeCubicActionInOut = {
  easing: EaseCubicActionInOut.prototype._updateTime,
  reverse: function () {
    return _easeCubicActionInOut;
  }
};

// ─── Ease Factory Functions ──────────────────────

/**
 * Creates the action easing object with the rate parameter. <br />
 * From slow to fast.
 *
 * @function
 * @param {Number} rate
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeIn(3.0));
 */
export function easeIn(rate) {
  return {
    _rate: rate,
    easing: function (dt) {
      return Math.pow(dt, this._rate);
    },
    reverse: function () {
      return easeIn(1 / this._rate);
    }
  };
}

/**
 * Creates the action easing object with the rate parameter. <br />
 * From fast to slow.
 *
 * @function
 * @param {Number} rate
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeOut(3.0));
 */
export function easeOut(rate) {
  return {
    _rate: rate,
    easing: function (dt) {
      return Math.pow(dt, 1 / this._rate);
    },
    reverse: function () {
      return easeOut(1 / this._rate);
    }
  };
}

/**
 * Creates the action easing object with the rate parameter. <br />
 * Slow to fast then to slow.
 * @function
 * @param {Number} rate
 * @return {Object}
 *
 * @example
 * //The new usage
 * action.easing(cc.easeInOut(3.0));
 */
export function easeInOut(rate) {
  return {
    _rate: rate,
    easing: function (dt) {
      dt *= 2;
      if (dt < 1) return 0.5 * Math.pow(dt, this._rate);
      else return 1.0 - 0.5 * Math.pow(2 - dt, this._rate);
    },
    reverse: function () {
      return easeInOut(this._rate);
    }
  };
}

/**
 * Creates the action easing object with the rate parameter. <br />
 * Reference easeInExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeExponentialIn());
 */
export function easeExponentialIn() {
  return _easeExponentialInObj;
}

/**
 * creates the action easing object. <br />
 * Reference easeOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeExponentialOut());
 */
export function easeExponentialOut() {
  return _easeExponentialOutObj;
}

/**
 * creates an EaseExponentialInOut action easing object. <br />
 * Reference easeInOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeExponentialInOut());
 */
export function easeExponentialInOut() {
  return _easeExponentialInOutObj;
}

/**
 * creates an EaseSineIn action. <br />
 * Reference easeInSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeSineIn());
 */
export function easeSineIn() {
  return _easeSineInObj;
}

/**
 * Creates an EaseSineOut action easing object. <br />
 * Reference easeOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeSineOut());
 */
export function easeSineOut() {
  return _easeSineOutObj;
}

/**
 * creates the action easing object. <br />
 * Reference easeInOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeSineInOut());
 */
export function easeSineInOut() {
  return _easeSineInOutObj;
}

/**
 * Creates the action easing obejct with the period in radians (default is 0.3). <br />
 * Reference easeInElastic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @param {Number} [period=0.3]
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeElasticIn(3.0));
 */
export function easeElasticIn(period) {
  if (period && period !== 0.3) {
    return {
      _period: period,
      easing: function (dt) {
        if (dt === 0 || dt === 1) return dt;
        dt = dt - 1;
        return (
          -Math.pow(2, 10 * dt) *
          Math.sin(((dt - this._period / 4) * Math.PI * 2) / this._period)
        );
      },
      reverse: function () {
        return easeElasticOut(this._period);
      }
    };
  }
  return _easeElasticInObj;
}

/**
 * Creates the action easing object with the period in radians (default is 0.3). <br />
 * Reference easeOutElastic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @param {Number} [period=0.3]
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeElasticOut(3.0));
 */
export function easeElasticOut(period) {
  if (period && period !== 0.3) {
    return {
      _period: period,
      easing: function (dt) {
        return dt === 0 || dt === 1
          ? dt
          : Math.pow(2, -10 * dt) *
              Math.sin(((dt - this._period / 4) * Math.PI * 2) / this._period) +
              1;
      },
      reverse: function () {
        return easeElasticIn(this._period);
      }
    };
  }
  return _easeElasticOutObj;
}

/**
 * Creates the action easing object with the period in radians (default is 0.3). <br />
 * Reference easeInOutElastic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @param {Number} [period=0.3]
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeElasticInOut(3.0));
 */
export function easeElasticInOut(period) {
  period = period || 0.3;
  return {
    _period: period,
    easing: function (dt) {
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
      return newT;
    },
    reverse: function () {
      return easeElasticInOut(this._period);
    }
  };
}

/**
 * Creates the action easing object. <br />
 * Eased bounce effect at the beginning.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceIn());
 */
export function easeBounceIn() {
  return _easeBounceInObj;
}

/**
 * Creates the action easing object. <br />
 * Eased bounce effect at the ending.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceOut());
 */
export function easeBounceOut() {
  return _easeBounceOutObj;
}

/**
 * Creates the action easing object. <br />
 * Eased bounce effect at the beginning and ending.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceInOut());
 */
export function easeBounceInOut() {
  return _easeBounceInOutObj;
}

/**
 * Creates the action easing object. <br />
 * In the opposite direction to move slowly, and then accelerated to the right direction.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackIn());
 */
export function easeBackIn() {
  return _easeBackInObj;
}

/**
 * Creates the action easing object. <br />
 * Fast moving more than the finish, and then slowly back to the finish.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackOut());
 */
export function easeBackOut() {
  return _easeBackOutObj;
}

/**
 * Creates the action easing object. <br />
 * Beginning of cc.EaseBackIn. Ending of cc.EaseBackOut.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackInOut());
 */
export function easeBackInOut() {
  return _easeBackInOutObj;
}

/**
 * Creates the action easing object. <br />
 * Into the 4 reference point. <br />
 * To calculate the motion curve.
 * @param {Number} p0 The first bezier parameter
 * @param {Number} p1 The second bezier parameter
 * @param {Number} p2 The third bezier parameter
 * @param {Number} p3 The fourth bezier parameter
 * @returns {Object}
 * @example
 * // example
 * action.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));
 */
export function easeBezierAction(p0, p1, p2, p3) {
  return {
    easing: function (time) {
      return EaseBezierAction.prototype._updateTime(p0, p1, p2, p3, time);
    },
    reverse: function () {
      return easeBezierAction(p3, p2, p1, p0);
    }
  };
}

/**
 * Creates the action easing object. <br />
 * Reference easeInQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionIn());
 */
export function easeQuadraticActionIn() {
  return _easeQuadraticActionIn;
}

/**
 * Creates the action easing object. <br />
 * Reference easeOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionOut());
 */
export function easeQuadraticActionOut() {
  return _easeQuadraticActionOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionInOut());
 */
export function easeQuadraticActionInOut() {
  return _easeQuadraticActionInOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeIntQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * action.easing(cc.easeQuarticActionIn());
 */
export function easeQuarticActionIn() {
  return _easeQuarticActionIn;
}

/**
 * Creates the action easing object. <br />
 * Reference easeOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.QuarticActionOut());
 */
export function easeQuarticActionOut() {
  return _easeQuarticActionOut;
}

/**
 * Creates the action easing object.  <br />
 * Reference easeInOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 */
export function easeQuarticActionInOut() {
  return _easeQuarticActionInOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuinticActionIn());
 */
export function easeQuinticActionIn() {
  return _easeQuinticActionIn;
}

/**
 * Creates the action easing object. <br />
 * Reference easeOutQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionOut());
 */
export function easeQuinticActionOut() {
  return _easeQuinticActionOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInOutQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuinticActionInOut());
 */
export function easeQuinticActionInOut() {
  return _easeQuinticActionInOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCircleActionIn());
 */
export function easeCircleActionIn() {
  return _easeCircleActionIn;
}

/**
 * Creates the action easing object. <br />
 * Reference easeOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @exampple
 * //example
 * actioneasing(cc.easeCircleActionOut());
 */
export function easeCircleActionOut() {
  return _easeCircleActionOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCircleActionInOut());
 */
export function easeCircleActionInOut() {
  return _easeCircleActionInOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCubicActionIn());
 */
export function easeCubicActionIn() {
  return _easeCubicActionIn;
}

/**
 * Creates the action easing object. <br />
 * Reference easeOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCubicActionOut());
 */
export function easeCubicActionOut() {
  return _easeCubicActionOut;
}

/**
 * Creates the action easing object. <br />
 * Reference easeInOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 */
export function easeCubicActionInOut() {
  return _easeCubicActionInOut;
}


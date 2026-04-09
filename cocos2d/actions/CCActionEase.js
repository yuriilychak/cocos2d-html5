/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Base class for Easing actions
 * @class
 * @extends cc.ActionInterval
 * @param {cc.ActionInterval} action
 *
 * @example
 * var moveEase = new cc.ActionEase(action);
 */
cc.ActionEase = class ActionEase extends cc.ActionInterval {
  /** @lends cc.ActionEase# */
  _inner = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * creates the action of ActionEase.
   * @param {cc.ActionInterval} action
   */
  constructor(action) {
    super();
    action && this.initWithAction(action);
  }

  /**
   * initializes the action
   *
   * @param {cc.ActionInterval} action
   * @return {Boolean}
   */
  initWithAction(action) {
    if (!action)
      throw new Error("cc.ActionEase.initWithAction(): action must be non nil");

    if (this.initWithDuration(action.getDuration())) {
      this._inner = action;
      return true;
    }
    return false;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.ActionEase}
   */
  clone() {
    const action = new cc.ActionEase();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._inner.startWithTarget(this.target);
  }

  /**
   * Stop the action.
   */
  stop() {
    this._inner.stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(dt);
  }

  /**
   * Create new action to original operation effect opposite. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @return {cc.ActionEase}
   */
  reverse() {
    return new cc.ActionEase(this._inner.reverse());
  }

  /**
   * Get inner Action.
   *
   * @return {cc.ActionInterval}
   */
  getInnerAction() {
    return this._inner;
  }
};

/**
 * creates the action of ActionEase
 *
 * @param {cc.ActionInterval} action
 * @return {cc.ActionEase}
 * @example
 * // example
 * var moveEase = cc.actionEase(action);
 */
cc.actionEase = (action) => new cc.ActionEase(action);

/**
 * Base class for Easing actions with rate parameters
 *
 * @class
 * @extends cc.ActionEase
 * @param {cc.ActionInterval} action
 * @param {Number} rate
 *
 * @example
 * var moveEaseRateAction = cc.easeRateAction(action, 3.0);
 */
cc.EaseRateAction = class EaseRateAction extends cc.ActionEase {
  /** @lends cc.EaseRateAction# */
  _rate = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates the action with the inner action and the rate parameter.
   * @param {cc.ActionInterval} action
   * @param {Number} rate
   */
  constructor(action, rate) {
    super();

    rate !== undefined && this.initWithAction(action, rate);
  }

  /**
   * set rate value for the actions
   * @param {Number} rate
   */
  setRate(rate) {
    this._rate = rate;
  }

  /** get rate value for the actions
   * @return {Number}
   */
  getRate() {
    return this._rate;
  }

  /**
   * Initializes the action with the inner action and the rate parameter
   * @param {cc.ActionInterval} action
   * @param {Number} rate
   * @return {Boolean}
   */
  initWithAction(action, rate) {
    if (super.initWithAction(action)) {
      this._rate = rate;
      return true;
    }
    return false;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseRateAction}
   */
  clone() {
    const action = new cc.EaseRateAction();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }

  /**
   * Create new action to original operation effect opposite. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   * @return {cc.EaseRateAction}
   */
  reverse() {
    return new cc.EaseRateAction(this._inner.reverse(), 1 / this._rate);
  }
};

/**
 * Creates the action with the inner action and the rate parameter.
 *
 * @param {cc.ActionInterval} action
 * @param {Number} rate
 * @return {cc.EaseRateAction}
 * @example
 * // example
 * var moveEaseRateAction = cc.easeRateAction(action, 3.0);
 */
cc.easeRateAction = (action, rate) => new cc.EaseRateAction(action, rate);

/**
 * cc.EaseIn action with a rate. From slow to fast.
 *
 * @class
 * @extends cc.EaseRateAction
 *
 * @example
 * action.easing(cc.easeIn(3.0));
 */
cc.EaseIn = class EaseIn extends cc.EaseRateAction {
  /** @lends cc.EaseIn# */

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(Math.pow(dt, this._rate));
  }

  /**
   * Create a cc.easeIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseIn}
   */
  reverse() {
    return new cc.EaseIn(this._inner.reverse(), 1 / this._rate);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseIn}
   */
  clone() {
    var action = new cc.EaseIn();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }
};

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
cc.easeIn = function (rate) {
  return {
    _rate: rate,
    easing: function (dt) {
      return Math.pow(dt, this._rate);
    },
    reverse: function () {
      return cc.easeIn(1 / this._rate);
    }
  };
};

/**
 * cc.EaseOut action with a rate. From fast to slow.
 *
 * @class
 * @extends cc.EaseRateAction
 *
 * @example
 * action.easing(cc.easeOut(3.0));
 */
cc.EaseOut = class EaseOut extends cc.EaseRateAction {
  /** @lends cc.EaseOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(Math.pow(dt, 1 / this._rate));
  }

  /**
   * Create a cc.easeIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseOut}
   */
  reverse() {
    return new cc.EaseOut(this._inner.reverse(), 1 / this._rate);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseOut}
   */
  clone() {
    var action = new cc.EaseOut();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }
};

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
cc.easeOut = function (rate) {
  return {
    _rate: rate,
    easing: function (dt) {
      return Math.pow(dt, 1 / this._rate);
    },
    reverse: function () {
      return cc.easeOut(1 / this._rate);
    }
  };
};

/**
 * cc.EaseInOut action with a rate. <br />
 * Slow to fast then to slow.
 * @class
 * @extends cc.EaseRateAction
 *
 * @example
 * action.easing(cc.easeInOut(3.0));
 */
cc.EaseInOut = class EaseInOut extends cc.EaseRateAction {
  /** @lends cc.EaseInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt *= 2;
    if (dt < 1) this._inner.update(0.5 * Math.pow(dt, this._rate));
    else this._inner.update(1.0 - 0.5 * Math.pow(2 - dt, this._rate));
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseInOut}
   */
  clone() {
    var action = new cc.EaseInOut();
    action.initWithAction(this._inner.clone(), this._rate);
    return action;
  }

  /**
   * Create a cc.EaseInOut action. Opposite with the original motion trajectory.
   * @return {cc.EaseInOut}
   */
  reverse() {
    return new cc.EaseInOut(this._inner.reverse(), this._rate);
  }
};

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
cc.easeInOut = function (rate) {
  return {
    _rate: rate,
    easing: function (dt) {
      dt *= 2;
      if (dt < 1) return 0.5 * Math.pow(dt, this._rate);
      else return 1.0 - 0.5 * Math.pow(2 - dt, this._rate);
    },
    reverse: function () {
      return cc.easeInOut(this._rate);
    }
  };
};

/**
 * cc.Ease Exponential In. Slow to Fast. <br />
 * Reference easeInExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeExponentialIn());
 */
cc.EaseExponentialIn = class EaseExponentialIn extends cc.ActionEase {
  /** @lends cc.EaseExponentialIn# */
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
    var action = new cc.EaseExponentialIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeExponentialInObj = {
  easing: function (dt) {
    return dt === 0 ? 0 : Math.pow(2, 10 * (dt - 1));
  },
  reverse: function () {
    return cc._easeExponentialOutObj;
  }
};

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
cc.easeExponentialIn = function () {
  return cc._easeExponentialInObj;
};

/**
 * Ease Exponential Out. <br />
 * Reference easeOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeExponentialOut());
 */
cc.EaseExponentialOut = class EaseExponentialOut extends cc.ActionEase {
  /** @lends cc.EaseExponentialOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this._inner.update(dt === 1 ? 1 : -Math.pow(2, -10 * dt) + 1);
  }

  /**
   * Create a cc.EaseExponentialIn action. Opposite with the original motion trajectory.
   * @return {cc.EaseExponentialIn}
   */
  reverse() {
    return new cc.EaseExponentialIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseExponentialOut}
   */
  clone() {
    var action = new cc.EaseExponentialOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeExponentialOutObj = {
  easing: function (dt) {
    return dt === 1 ? 1 : -Math.pow(2, -10 * dt) + 1;
  },
  reverse: function () {
    return cc._easeExponentialInObj;
  }
};

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
cc.easeExponentialOut = function () {
  return cc._easeExponentialOutObj;
};

/**
 * Ease Exponential InOut. <br />
 * Reference easeInOutExpo: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 *
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeExponentialInOut());
 */
cc.EaseExponentialInOut = class EaseExponentialInOut extends cc.ActionEase {
  /** @lends cc.EaseExponentialInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    if (dt !== 1 && dt !== 0) {
      dt *= 2;
      if (dt < 1) dt = 0.5 * Math.pow(2, 10 * (dt - 1));
      else dt = 0.5 * (-Math.pow(2, -10 * (dt - 1)) + 2);
    }
    this._inner.update(dt);
  }

  /**
   * Create a cc.EaseExponentialInOut action. Opposite with the original motion trajectory.
   * @return {cc.EaseExponentialInOut}
   */
  reverse() {
    return new cc.EaseExponentialInOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseExponentialInOut}
   */
  clone() {
    var action = new cc.EaseExponentialInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeExponentialInOutObj = {
  easing: function (dt) {
    if (dt !== 1 && dt !== 0) {
      dt *= 2;
      if (dt < 1) return 0.5 * Math.pow(2, 10 * (dt - 1));
      else return 0.5 * (-Math.pow(2, -10 * (dt - 1)) + 2);
    }
    return dt;
  },
  reverse: function () {
    return cc._easeExponentialInOutObj;
  }
};

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
cc.easeExponentialInOut = function () {
  return cc._easeExponentialInOutObj;
};

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
cc.EaseSineIn = class EaseSineIn extends cc.ActionEase {
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
    var action = new cc.EaseSineIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeSineInObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1 ? dt : -1 * Math.cos((dt * Math.PI) / 2) + 1;
  },
  reverse: function () {
    return cc._easeSineOutObj;
  }
};
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
cc.easeSineIn = function () {
  return cc._easeSineInObj;
};

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
cc.EaseSineOut = class EaseSineOut extends cc.ActionEase {
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
    var action = new cc.EaseSineOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeSineOutObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1 ? dt : Math.sin((dt * Math.PI) / 2);
  },
  reverse: function () {
    return cc._easeSineInObj;
  }
};

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
cc.easeSineOut = function () {
  return cc._easeSineOutObj;
};

/**
 * Ease Sine InOut. <br />
 * Reference easeInOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeSineInOut());
 */
cc.EaseSineInOut = class EaseSineInOut extends cc.ActionEase {
  /** @lends cc.EaseSineInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    dt = dt === 0 || dt === 1 ? dt : -0.5 * (Math.cos(Math.PI * dt) - 1);
    this._inner.update(dt);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseSineInOut}
   */
  clone() {
    var action = new cc.EaseSineInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a cc.EaseSineInOut action. Opposite with the original motion trajectory.
   * @return {cc.EaseSineInOut}
   */
  reverse() {
    return new cc.EaseSineInOut(this._inner.reverse());
  }
};

cc._easeSineInOutObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1 ? dt : -0.5 * (Math.cos(Math.PI * dt) - 1);
  },
  reverse: function () {
    return cc._easeSineInOutObj;
  }
};

/**
 * creates the action easing object. <br />
 * Reference easeInOutSine: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeSineInOut());
 */
cc.easeSineInOut = function () {
  return cc._easeSineInOutObj;
};

/**
 * Ease Elastic abstract class.
 * @class
 * @extends cc.ActionEase
 * @param {cc.ActionInterval} action
 * @param {Number} [period=0.3]
 */
cc.EaseElastic = class EaseElastic extends cc.ActionEase {
  /** @lends cc.EaseElastic# */
  _period = 0.3;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates the action with the inner action and the period in radians (default is 0.3).
   * @param {cc.ActionInterval} action
   * @param {Number} [period=0.3]
   */
  constructor(action, period) {
    super();

    action && this.initWithAction(action, period);
  }

  /**
   * get period of the wave in radians. default is 0.3
   * @return {Number}
   */
  getPeriod() {
    return this._period;
  }

  /**
   * set period of the wave in radians.
   * @param {Number} period
   */
  setPeriod(period) {
    this._period = period;
  }

  /**
   * Initializes the action with the inner action and the period in radians (default is 0.3)
   * @param {cc.ActionInterval} action
   * @param {Number} [period=0.3]
   * @return {Boolean}
   */
  initWithAction(action, period) {
    super.initWithAction(action);
    this._period = period == null ? 0.3 : period;
    return true;
  }

  /**
   * Create a action. Opposite with the original motion trajectory. <br />
   * Will be overwrite.
   * @return {?cc.Action}
   */
  reverse() {
    cc.log("cc.EaseElastic.reverse(): it should be overridden in subclass.");
    return null;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseElastic}
   */
  clone() {
    const action = new cc.EaseElastic();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

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
cc.EaseElasticIn = class EaseElasticIn extends cc.EaseElastic {
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
    var action = new cc.EaseElasticIn();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

//default ease elastic in object (period = 0.3)
cc._easeElasticInObj = {
  easing: function (dt) {
    if (dt === 0 || dt === 1) return dt;
    dt = dt - 1;
    return (
      -Math.pow(2, 10 * dt) * Math.sin(((dt - 0.3 / 4) * Math.PI * 2) / 0.3)
    );
  },
  reverse: function () {
    return cc._easeElasticOutObj;
  }
};

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
cc.easeElasticIn = function (period) {
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
        return cc.easeElasticOut(this._period);
      }
    };
  }
  return cc._easeElasticInObj;
};

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
cc.EaseElasticOut = class EaseElasticOut extends cc.EaseElastic {
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
    var action = new cc.EaseElasticOut();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

//default ease elastic out object (period = 0.3)
cc._easeElasticOutObj = {
  easing: function (dt) {
    return dt === 0 || dt === 1
      ? dt
      : Math.pow(2, -10 * dt) * Math.sin(((dt - 0.3 / 4) * Math.PI * 2) / 0.3) +
          1;
  },
  reverse: function () {
    return cc._easeElasticInObj;
  }
};
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
cc.easeElasticOut = function (period) {
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
        return cc.easeElasticIn(this._period);
      }
    };
  }
  return cc._easeElasticOutObj;
};

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
cc.EaseElasticInOut = class EaseElasticInOut extends cc.EaseElastic {
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
    return new cc.EaseElasticInOut(this._inner.reverse(), this._period);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseElasticInOut}
   */
  clone() {
    var action = new cc.EaseElasticInOut();
    action.initWithAction(this._inner.clone(), this._period);
    return action;
  }
};

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
cc.easeElasticInOut = function (period) {
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
      return cc.easeElasticInOut(this._period);
    }
  };
};

/**
 * cc.EaseBounce abstract class.
 *
 * @class
 * @extends cc.ActionEase
 */
cc.EaseBounce = class EaseBounce extends cc.ActionEase {
  /** @lends cc.EaseBounce# */
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
    var action = new cc.EaseBounce();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounce}
   */
  reverse() {
    return new cc.EaseBounce(this._inner.reverse());
  }
};

/**
 * cc.EaseBounceIn action. <br />
 * Eased bounce effect at the beginning.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseBounce
 *
 * @example
 * action.easing(cc.easeBounceIn());
 */
cc.EaseBounceIn = class EaseBounceIn extends cc.EaseBounce {
  /** @lends cc.EaseBounceIn# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var newT = 1 - this.bounceTime(1 - dt);
    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounceOut}
   */
  reverse() {
    return new cc.EaseBounceOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBounceIn}
   */
  clone() {
    var action = new cc.EaseBounceIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._bounceTime = function (time1) {
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
};

cc._easeBounceInObj = {
  easing: function (dt) {
    return 1 - cc._bounceTime(1 - dt);
  },
  reverse: function () {
    return cc._easeBounceOutObj;
  }
};

/**
 * Creates the action easing object. <br />
 * Eased bounce effect at the beginning.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceIn());
 */
cc.easeBounceIn = function () {
  return cc._easeBounceInObj;
};

/**
 * cc.EaseBounceOut action. <br />
 * Eased bounce effect at the ending.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseBounce
 * @example
 * action.easing(cc.easeBounceOut());
 */
cc.EaseBounceOut = class EaseBounceOut extends cc.EaseBounce {
  /** @lends cc.EaseBounceOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var newT = this.bounceTime(dt);
    this._inner.update(newT);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounceIn}
   */
  reverse() {
    return new cc.EaseBounceIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBounceOut}
   */
  clone() {
    var action = new cc.EaseBounceOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeBounceOutObj = {
  easing: function (dt) {
    return cc._bounceTime(dt);
  },
  reverse: function () {
    return cc._easeBounceInObj;
  }
};

/**
 * Creates the action easing object. <br />
 * Eased bounce effect at the ending.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceOut());
 */
cc.easeBounceOut = function () {
  return cc._easeBounceOutObj;
};

/**
 * cc.EaseBounceInOut action. <br />
 * Eased bounce effect at the beginning and ending.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.EaseBounce
 * @example
 * action.easing(cc.easeBounceInOut());
 */
cc.EaseBounceInOut = class EaseBounceInOut extends cc.EaseBounce {
  /** @lends cc.EaseBounceInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var newT = 0;
    if (dt < 0.5) {
      dt = dt * 2;
      newT = (1 - this.bounceTime(1 - dt)) * 0.5;
    } else {
      newT = this.bounceTime(dt * 2 - 1) * 0.5 + 0.5;
    }
    this._inner.update(newT);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBounceInOut}
   */
  clone() {
    var action = new cc.EaseBounceInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBounceInOut}
   */
  reverse() {
    return new cc.EaseBounceInOut(this._inner.reverse());
  }
};

cc._easeBounceInOutObj = {
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
    return cc._easeBounceInOutObj;
  }
};

/**
 * Creates the action easing object. <br />
 * Eased bounce effect at the beginning and ending.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceInOut());
 */
cc.easeBounceInOut = function () {
  return cc._easeBounceInOutObj;
};

/**
 * cc.EaseBackIn action. <br />
 * In the opposite direction to move slowly, and then accelerated to the right direction.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeBackIn());
 */
cc.EaseBackIn = class EaseBackIn extends cc.ActionEase {
  /** @lends cc.EaseBackIn# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var overshoot = 1.70158;
    dt =
      dt === 0 || dt === 1 ? dt : dt * dt * ((overshoot + 1) * dt - overshoot);
    this._inner.update(dt);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBackOut}
   */
  reverse() {
    return new cc.EaseBackOut(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBackIn}
   */
  clone() {
    var action = new cc.EaseBackIn();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeBackInObj = {
  easing: function (time1) {
    var overshoot = 1.70158;
    return time1 === 0 || time1 === 1
      ? time1
      : time1 * time1 * ((overshoot + 1) * time1 - overshoot);
  },
  reverse: function () {
    return cc._easeBackOutObj;
  }
};

/**
 * Creates the action easing object. <br />
 * In the opposite direction to move slowly, and then accelerated to the right direction.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackIn());
 */
cc.easeBackIn = function () {
  return cc._easeBackInObj;
};

/**
 * cc.EaseBackOut action. <br />
 * Fast moving more than the finish, and then slowly back to the finish.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeBackOut());
 */
cc.EaseBackOut = class EaseBackOut extends cc.ActionEase {
  /** @lends cc.EaseBackOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var overshoot = 1.70158;
    dt = dt - 1;
    this._inner.update(dt * dt * ((overshoot + 1) * dt + overshoot) + 1);
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBackIn}
   */
  reverse() {
    return new cc.EaseBackIn(this._inner.reverse());
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBackOut}
   */
  clone() {
    var action = new cc.EaseBackOut();
    action.initWithAction(this._inner.clone());
    return action;
  }
};

cc._easeBackOutObj = {
  easing: function (time1) {
    var overshoot = 1.70158;
    time1 = time1 - 1;
    return time1 * time1 * ((overshoot + 1) * time1 + overshoot) + 1;
  },
  reverse: function () {
    return cc._easeBackInObj;
  }
};

/**
 * Creates the action easing object. <br />
 * Fast moving more than the finish, and then slowly back to the finish.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackOut());
 */
cc.easeBackOut = function () {
  return cc._easeBackOutObj;
};

/**
 * cc.EaseBackInOut action. <br />
 * Beginning of cc.EaseBackIn. Ending of cc.EaseBackOut.
 * @warning This action doesn't use a bijective function. Actions like Sequence might have an unexpected result when used with this action.
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeBackInOut());
 */
cc.EaseBackInOut = class EaseBackInOut extends cc.ActionEase {
  /** @lends cc.EaseBackInOut# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var overshoot = 1.70158 * 1.525;
    dt = dt * 2;
    if (dt < 1) {
      this._inner.update((dt * dt * ((overshoot + 1) * dt - overshoot)) / 2);
    } else {
      dt = dt - 2;
      this._inner.update(
        (dt * dt * ((overshoot + 1) * dt + overshoot)) / 2 + 1
      );
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBackInOut}
   */
  clone() {
    var action = new cc.EaseBackInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBackInOut}
   */
  reverse() {
    return new cc.EaseBackInOut(this._inner.reverse());
  }
};

cc._easeBackInOutObj = {
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
    return cc._easeBackInOutObj;
  }
};

/**
 * Creates the action easing object. <br />
 * Beginning of cc.EaseBackIn. Ending of cc.EaseBackOut.
 * @function
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackInOut());
 */
cc.easeBackInOut = function () {
  return cc._easeBackInOutObj;
};

/**
 * cc.EaseBezierAction action. <br />
 * Manually set a 4 order Bessel curve. <br />
 * According to the set point, calculate the trajectory.
 * @class
 * @extends cc.ActionEase
 * @param {cc.Action} action
 * @example
 * action.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));
 */
cc.EaseBezierAction = class EaseBezierAction extends cc.ActionEase {
  /** @lends cc.EaseBezierAction# */

  _p0 = null;
  _p1 = null;
  _p2 = null;
  _p3 = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Initialization requires the application of Bessel curve of action.
   * @param {cc.Action} action
   */
  constructor(action) {
    super(action);
  }

  _updateTime(a, b, c, d, t) {
    return (
      Math.pow(1 - t, 3) * a +
      3 * t * Math.pow(1 - t, 2) * b +
      3 * Math.pow(t, 2) * (1 - t) * c +
      Math.pow(t, 3) * d
    );
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    var t = this._updateTime(this._p0, this._p1, this._p2, this._p3, dt);
    this._inner.update(t);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.EaseBezierAction}
   */
  clone() {
    var action = new cc.EaseBezierAction();
    action.initWithAction(this._inner.clone());
    action.setBezierParamer(this._p0, this._p1, this._p2, this._p3);
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseBezierAction}
   */
  reverse() {
    var action = new cc.EaseBezierAction(this._inner.reverse());
    action.setBezierParamer(this._p3, this._p2, this._p1, this._p0);
    return action;
  }

  /**
   * Set of 4 reference point
   * @param p0
   * @param p1
   * @param p2
   * @param p3
   */
  setBezierParamer(p0, p1, p2, p3) {
    this._p0 = p0 || 0;
    this._p1 = p1 || 0;
    this._p2 = p2 || 0;
    this._p3 = p3 || 0;
  }
};

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
cc.easeBezierAction = function (p0, p1, p2, p3) {
  return {
    easing: function (time) {
      return cc.EaseBezierAction.prototype._updateTime(p0, p1, p2, p3, time);
    },
    reverse: function () {
      return cc.easeBezierAction(p3, p2, p1, p0);
    }
  };
};

/**
 * cc.EaseQuadraticActionIn action. <br />
 * Reference easeInQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuadraticActionIn());
 */
cc.EaseQuadraticActionIn = class EaseQuadraticActionIn extends cc.ActionEase {
  /** @lends cc.EaseQuadraticActionIn# */

  _updateTime(time) {
    return Math.pow(time, 2);
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
   * @returns {cc.EaseQuadraticActionIn}
   */
  clone() {
    var action = new cc.EaseQuadraticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuadraticActionIn}
   */
  reverse() {
    return new cc.EaseQuadraticActionIn(this._inner.reverse());
  }
};

cc._easeQuadraticActionIn = {
  easing: cc.EaseQuadraticActionIn.prototype._updateTime,
  reverse: function () {
    return cc._easeQuadraticActionIn;
  }
};

/**
 * Creates the action easing object. <br />
 * Reference easeInQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionIn());
 */
cc.easeQuadraticActionIn = function () {
  return cc._easeQuadraticActionIn;
};

/**
 * cc.EaseQuadraticActionIn action. <br />
 * Reference easeOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuadraticActionOut());
 */
cc.EaseQuadraticActionOut = class EaseQuadraticActionOut extends cc.ActionEase {
  /** @lends cc.EaseQuadraticActionOut# */

  _updateTime(time) {
    return -time * (time - 2);
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
   * @returns {cc.EaseQuadraticActionOut}
   */
  clone() {
    var action = new cc.EaseQuadraticActionOut();
    action.initWithAction();
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuadraticActionOut}
   */
  reverse() {
    return new cc.EaseQuadraticActionOut(this._inner.reverse());
  }
};

cc._easeQuadraticActionOut = {
  easing: cc.EaseQuadraticActionOut.prototype._updateTime,
  reverse: function () {
    return cc._easeQuadraticActionOut;
  }
};
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
cc.easeQuadraticActionOut = function () {
  return cc._easeQuadraticActionOut;
};

/**
 * cc.EaseQuadraticActionInOut action. <br />
 * Reference easeInOutQuad: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuadraticActionInOut());
 */
cc.EaseQuadraticActionInOut = class EaseQuadraticActionInOut extends (
  cc.ActionEase
) {
  /** @lends cc.EaseQuadraticActionInOut# */
  _updateTime(time) {
    var resultTime = time;
    time *= 2;
    if (time < 1) {
      resultTime = time * time * 0.5;
    } else {
      --time;
      resultTime = -0.5 * (time * (time - 2) - 1);
    }
    return resultTime;
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
   * @returns {cc.EaseQuadraticActionInOut}
   */
  clone() {
    var action = new cc.EaseQuadraticActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuadraticActionInOut}
   */
  reverse() {
    return new cc.EaseQuadraticActionInOut(this._inner.reverse());
  }
};

cc._easeQuadraticActionInOut = {
  easing: cc.EaseQuadraticActionInOut.prototype._updateTime,
  reverse: function () {
    return cc._easeQuadraticActionInOut;
  }
};

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
cc.easeQuadraticActionInOut = function () {
  return cc._easeQuadraticActionInOut;
};

/**
 * cc.EaseQuarticActionIn action. <br />
 * Reference easeInQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuarticActionIn());
 */
cc.EaseQuarticActionIn = class EaseQuarticActionIn extends cc.ActionEase {
  /** @lends cc.EaseQuarticActionIn# */
  _updateTime(time) {
    return time * time * time * time;
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
   * @returns {cc.EaseQuarticActionIn}
   */
  clone() {
    var action = new cc.EaseQuarticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuarticActionIn}
   */
  reverse() {
    return new cc.EaseQuarticActionIn(this._inner.reverse());
  }
};

cc._easeQuarticActionIn = {
  easing: cc.EaseQuarticActionIn.prototype._updateTime,
  reverse: function () {
    return cc._easeQuarticActionIn;
  }
};
/**
 * Creates the action easing object. <br />
 * Reference easeIntQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 * @example
 * action.easing(cc.easeQuarticActionIn());
 */
cc.easeQuarticActionIn = function () {
  return cc._easeQuarticActionIn;
};

/**
 * cc.EaseQuarticActionOut action. <br />
 * Reference easeOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.EaseQuarticActionOut());
 */
cc.EaseQuarticActionOut = class EaseQuarticActionOut extends cc.ActionEase {
  /** @lends cc.EaseQuarticActionOut# */
  _updateTime(time) {
    time -= 1;
    return -(time * time * time * time - 1);
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
   * @returns {cc.EaseQuarticActionOut}
   */
  clone() {
    var action = new cc.EaseQuarticActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuarticActionOut}
   */
  reverse() {
    return new cc.EaseQuarticActionOut(this._inner.reverse());
  }
};

cc._easeQuarticActionOut = {
  easing: cc.EaseQuarticActionOut.prototype._updateTime,
  reverse: function () {
    return cc._easeQuarticActionOut;
  }
};

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
cc.easeQuarticActionOut = function () {
  return cc._easeQuarticActionOut;
};

/**
 * cc.EaseQuarticActionInOut action. <br />
 * Reference easeInOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 * @example
 * action.easing(cc.easeQuarticActionInOut());
 */
cc.EaseQuarticActionInOut = class EaseQuarticActionInOut extends cc.ActionEase {
  /** @lends cc.EaseQuarticActionInOut# */
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return 0.5 * time * time * time * time;
    time -= 2;
    return -0.5 * (time * time * time * time - 2);
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
   * @returns {cc.EaseQuarticActionInOut}
   */
  clone() {
    var action = new cc.EaseQuarticActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuarticActionInOut}
   */
  reverse() {
    return new cc.EaseQuarticActionInOut(this._inner.reverse());
  }
};

cc._easeQuarticActionInOut = {
  easing: cc.EaseQuarticActionInOut.prototype._updateTime,
  reverse: function () {
    return cc._easeQuarticActionInOut;
  }
};
/**
 * Creates the action easing object.  <br />
 * Reference easeInOutQuart: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 */
cc.easeQuarticActionInOut = function () {
  return cc._easeQuarticActionInOut;
};

/**
 * cc.EaseQuinticActionIn action. <br />
 * Reference easeInQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeQuinticActionIn());
 */
cc.EaseQuinticActionIn = class EaseQuinticActionIn extends cc.ActionEase {
  /** @lends cc.EaseQuinticActionIn# */
  _updateTime(time) {
    return time * time * time * time * time;
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
   * @returns {cc.EaseQuinticActionIn}
   */
  clone() {
    var action = new cc.EaseQuinticActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuinticActionIn}
   */
  reverse() {
    return new cc.EaseQuinticActionIn(this._inner.reverse());
  }
};

cc._easeQuinticActionIn = {
  easing: cc.EaseQuinticActionIn.prototype._updateTime,
  reverse: function () {
    return cc._easeQuinticActionIn;
  }
};

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
cc.easeQuinticActionIn = function () {
  return cc._easeQuinticActionIn;
};

/**
 * cc.EaseQuinticActionOut action. <br />
 * Reference easeQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeQuadraticActionOut());
 */
cc.EaseQuinticActionOut = class EaseQuinticActionOut extends cc.ActionEase {
  /** @lends cc.EaseQuinticActionOut# */
  _updateTime(time) {
    time -= 1;
    return time * time * time * time * time + 1;
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
   * @returns {cc.EaseQuinticActionOut}
   */
  clone() {
    var action = new cc.EaseQuinticActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuinticActionOut}
   */
  reverse() {
    return new cc.EaseQuinticActionOut(this._inner.reverse());
  }
};

cc._easeQuinticActionOut = {
  easing: cc.EaseQuinticActionOut.prototype._updateTime,
  reverse: function () {
    return cc._easeQuinticActionOut;
  }
};

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
cc.easeQuinticActionOut = function () {
  return cc._easeQuinticActionOut;
};

/**
 * cc.EaseQuinticActionInOut action. <br />
 * Reference easeInOutQuint: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeQuinticActionInOut());
 */
cc.EaseQuinticActionInOut = class EaseQuinticActionInOut extends cc.ActionEase {
  /** @lends cc.EaseQuinticActionInOut# */
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return 0.5 * time * time * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time * time * time + 2);
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
   * @returns {cc.EaseQuinticActionInOut}
   */
  clone() {
    var action = new cc.EaseQuinticActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseQuinticActionInOut}
   */
  reverse() {
    return new cc.EaseQuinticActionInOut(this._inner.reverse());
  }
};

cc._easeQuinticActionInOut = {
  easing: cc.EaseQuinticActionInOut.prototype._updateTime,
  reverse: function () {
    return cc._easeQuinticActionInOut;
  }
};

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
cc.easeQuinticActionInOut = function () {
  return cc._easeQuinticActionInOut;
};

/**
 * cc.EaseCircleActionIn action. <br />
 * Reference easeInCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCircleActionIn());
 */
cc.EaseCircleActionIn = class EaseCircleActionIn extends cc.ActionEase {
  /** @lends cc.EaseCircleActionIn# */
  _updateTime(time) {
    return -1 * (Math.sqrt(1 - time * time) - 1);
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
   * @returns {cc.EaseCircleActionIn}
   */
  clone() {
    var action = new cc.EaseCircleActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCircleActionIn}
   */
  reverse() {
    return new cc.EaseCircleActionIn(this._inner.reverse());
  }
};

cc._easeCircleActionIn = {
  easing: cc.EaseCircleActionIn.prototype._updateTime,
  reverse: function () {
    return cc._easeCircleActionIn;
  }
};

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
cc.easeCircleActionIn = function () {
  return cc._easeCircleActionIn;
};

/**
 * cc.EaseCircleActionOut action. <br />
 * Reference easeOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCircleActionOut());
 */
cc.EaseCircleActionOut = class EaseCircleActionOut extends cc.ActionEase {
  /** @lends cc.EaseCircleActionOut# */
  _updateTime(time) {
    time = time - 1;
    return Math.sqrt(1 - time * time);
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
   * @returns {cc.EaseCircleActionOut}
   */
  clone() {
    var action = new cc.EaseCircleActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCircleActionOut}
   */
  reverse() {
    return new cc.EaseCircleActionOut(this._inner.reverse());
  }
};

cc._easeCircleActionOut = {
  easing: cc.EaseCircleActionOut.prototype._updateTime,
  reverse: function () {
    return cc._easeCircleActionOut;
  }
};

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
cc.easeCircleActionOut = function () {
  return cc._easeCircleActionOut;
};

/**
 * cc.EaseCircleActionInOut action. <br />
 * Reference easeInOutCirc: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCircleActionInOut());
 */
cc.EaseCircleActionInOut = class EaseCircleActionInOut extends cc.ActionEase {
  /** @lends cc.EaseCircleActionInOut# */
  _updateTime(time) {
    time = time * 2;
    if (time < 1) return -0.5 * (Math.sqrt(1 - time * time) - 1);
    time -= 2;
    return 0.5 * (Math.sqrt(1 - time * time) + 1);
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
   * @returns {cc.EaseCircleActionInOut}
   */
  clone() {
    var action = new cc.EaseCircleActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCircleActionInOut}
   */
  reverse() {
    return new cc.EaseCircleActionInOut(this._inner.reverse());
  }
};

cc._easeCircleActionInOut = {
  easing: cc.EaseCircleActionInOut.prototype._updateTime,
  reverse: function () {
    return cc._easeCircleActionInOut;
  }
};

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
cc.easeCircleActionInOut = function () {
  return cc._easeCircleActionInOut;
};

/**
 * cc.EaseCubicActionIn action. <br />
 * Reference easeInCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @class
 * @extends cc.ActionEase
 *
 * @example
 * action.easing(cc.easeCubicActionIn());
 */
cc.EaseCubicActionIn = class EaseCubicActionIn extends cc.ActionEase {
  /** @lends cc.EaseCubicActionIn# */
  _updateTime(time) {
    return time * time * time;
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
   * @returns {cc.EaseCubicActionIn}
   */
  clone() {
    var action = new cc.EaseCubicActionIn();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCubicActionIn}
   */
  reverse() {
    return new cc.EaseCubicActionIn(this._inner.reverse());
  }
};

cc._easeCubicActionIn = {
  easing: cc.EaseCubicActionIn.prototype._updateTime,
  reverse: function () {
    return cc._easeCubicActionIn;
  }
};

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
cc.easeCubicActionIn = function () {
  return cc._easeCubicActionIn;
};

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
cc.EaseCubicActionOut = class EaseCubicActionOut extends cc.ActionEase {
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
    var action = new cc.EaseCubicActionOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCubicActionOut}
   */
  reverse() {
    return new cc.EaseCubicActionOut(this._inner.reverse());
  }
};

cc._easeCubicActionOut = {
  easing: cc.EaseCubicActionOut.prototype._updateTime,
  reverse: function () {
    return cc._easeCubicActionOut;
  }
};

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
cc.easeCubicActionOut = function () {
  return cc._easeCubicActionOut;
};

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
cc.EaseCubicActionInOut = class EaseCubicActionInOut extends cc.ActionEase {
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
    var action = new cc.EaseCubicActionInOut();
    action.initWithAction(this._inner.clone());
    return action;
  }

  /**
   * Create a action. Opposite with the original motion trajectory.
   * @return {cc.EaseCubicActionInOut}
   */
  reverse() {
    return new cc.EaseCubicActionInOut(this._inner.reverse());
  }
};

cc._easeCubicActionInOut = {
  easing: cc.EaseCubicActionInOut.prototype._updateTime,
  reverse: function () {
    return cc._easeCubicActionInOut;
  }
};

/**
 * Creates the action easing object. <br />
 * Reference easeInOutCubic: <br />
 * {@link http://www.zhihu.com/question/21981571/answer/19925418}
 * @function
 * @returns {Object}
 */
cc.easeCubicActionInOut = function () {
  return cc._easeCubicActionInOut;
};

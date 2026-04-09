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
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 *
 * @class
 * @extends cc.FiniteTimeAction
 * @param {Number} d duration in seconds
 * @example
 * var actionInterval = new cc.ActionInterval(3);
 */
cc.ActionInterval = class ActionInterval extends cc.FiniteTimeAction {
  /** @lends cc.ActionInterval# */
  _elapsed = 0;
  _firstTick = false;
  _easeList = null;
  _timesForRepeat = 1;
  _repeatForever = false;
  _repeatMethod = false; //Compatible with repeat class, Discard after can be deleted

  _speed = 1;
  _speedMethod = false; //Compatible with speed class, Discard after can be deleted

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} d duration in seconds
   */
  constructor(d) {
    super();
    this._speed = 1;
    this._timesForRepeat = 1;
    this._repeatForever = false;
    this.MAX_VALUE = 2;
    this._repeatMethod = false; //Compatible with repeat class, Discard after can be deleted
    this._speedMethod = false; //Compatible with repeat class, Discard after can be deleted
    d !== undefined && this.initWithDuration(d);
  }

  /**
   * How many seconds had elapsed since the actions started to run.
   * @return {Number}
   */
  getElapsed() {
    return this._elapsed;
  }

  /**
   * Initializes the action.
   * @param {Number} d duration in seconds
   * @return {Boolean}
   */
  initWithDuration(d) {
    this._duration = d === 0 ? cc.FLT_EPSILON : d;
    // prevent division by 0
    // This comparison could be in step:, but it might decrease the performance
    // by 3% in heavy based action games.
    this._elapsed = 0;
    this._firstTick = true;
    return true;
  }

  /**
   * Returns true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return this._elapsed >= this._duration;
  }

  /**
   * Some additional parameters of cloning.
   * @param {cc.Action} action
   * @private
   */
  _cloneDecoration(action) {
    action._repeatForever = this._repeatForever;
    action._speed = this._speed;
    action._timesForRepeat = this._timesForRepeat;
    action._easeList = this._easeList;
    action._speedMethod = this._speedMethod;
    action._repeatMethod = this._repeatMethod;
  }

  _reverseEaseList(action) {
    if (this._easeList) {
      action._easeList = [];
      for (var i = 0; i < this._easeList.length; i++) {
        action._easeList.push(this._easeList[i].reverse());
      }
    }
  }

  /**
   * Returns a new clone of the action.
   * @returns {cc.ActionInterval}
   */
  clone() {
    var action = new cc.ActionInterval(this._duration);
    this._cloneDecoration(action);
    return action;
  }

  /**
   * Implementation of ease motion.
   *
   * @example
   * //example
   * action.easing(cc.easeIn(3.0));
   * @param {Object} easeObj
   * @returns {cc.ActionInterval}
   */
  easing(easeObj) {
    if (this._easeList) this._easeList.length = 0;
    else this._easeList = [];
    for (var i = 0; i < arguments.length; i++)
      this._easeList.push(arguments[i]);
    return this;
  }

  _computeEaseTime(dt) {
    var locList = this._easeList;
    if (!locList || locList.length === 0) return dt;
    for (var i = 0, n = locList.length; i < n; i++) dt = locList[i].easing(dt);
    return dt;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    if (this._firstTick) {
      this._firstTick = false;
      this._elapsed = 0;
    } else this._elapsed += dt;

    //this.update((1 > (this._elapsed / this._duration)) ? this._elapsed / this._duration : 1);
    //this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, cc.FLT_EPSILON))));
    var t =
      this._elapsed /
      (this._duration > 0.0000001192092896
        ? this._duration
        : 0.0000001192092896);
    t = 1 > t ? t : 1;
    this.update(t > 0 ? t : 0);

    //Compatible with repeat class, Discard after can be deleted (this._repeatMethod)
    if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
      if (!this._repeatForever) {
        this._timesForRepeat--;
      }
      //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
      this.startWithTarget(this.target);
      // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);
      this.step(this._elapsed - this._duration);
    }
  }

  /**
   * Start this action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._elapsed = 0;
    this._firstTick = true;
  }

  /**
   * returns a reversed action. <br />
   * Will be overwrite.
   *
   * @return {?cc.Action}
   */
  reverse() {
    cc.log("cc.IntervalAction: reverse not implemented.");
    return null;
  }

  /**
   * Set amplitude rate.
   * @warning It should be overridden in subclass.
   * @param {Number} amp
   */
  setAmplitudeRate(amp) {
    // Abstract class needs implementation
    cc.log(
      "cc.ActionInterval.setAmplitudeRate(): it should be overridden in subclass."
    );
  }

  /**
   * Get amplitude rate.
   * @warning It should be overridden in subclass.
   * @return {Number} 0
   */
  getAmplitudeRate() {
    // Abstract class needs implementation
    cc.log(
      "cc.ActionInterval.getAmplitudeRate(): it should be overridden in subclass."
    );
    return 0;
  }

  /**
   * Changes the speed of an action, making it take longer (speed>1)
   * or less (speed<1) time. <br/>
   * Useful to simulate 'slow motion' or 'fast forward' effect.
   *
   * @param speed
   * @returns {cc.Action}
   */
  speed(speed) {
    if (speed <= 0) {
      cc.log("The speed parameter error");
      return this;
    }

    this._speedMethod = true; //Compatible with repeat class, Discard after can be deleted
    this._speed *= speed;
    return this;
  }

  /**
   * Get this action speed.
   * @return {Number}
   */
  getSpeed() {
    return this._speed;
  }

  /**
   * Set this action speed.
   * @param {Number} speed
   * @returns {cc.ActionInterval}
   */
  setSpeed(speed) {
    this._speed = speed;
    return this;
  }

  /**
   * Repeats an action a number of times.
   * To repeat an action forever use the CCRepeatForever action.
   * @param times
   * @returns {cc.ActionInterval}
   */
  repeat(times) {
    times = Math.round(times);
    if (isNaN(times) || times < 1) {
      cc.log("The repeat parameter error");
      return this;
    }
    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted
    this._timesForRepeat *= times;
    return this;
  }

  /**
   * Repeats an action for ever.  <br/>
   * To repeat the an action for a limited number of times use the Repeat action. <br/>
   * @returns {cc.ActionInterval}
   */
  repeatForever() {
    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted
    this._timesForRepeat = this.MAX_VALUE;
    this._repeatForever = true;
    return this;
  }
};

/**
 * An interval action is an action that takes place within a certain period of time.
 * @function
 * @param {Number} d duration in seconds
 * @return {cc.ActionInterval}
 * @example
 * // example
 * var actionInterval = cc.actionInterval(3);
 */
cc.actionInterval = (d) => new cc.ActionInterval(d);

/**
 * Runs actions sequentially, one after another.
 * @class
 * @extends cc.ActionInterval
 * @param {Array|cc.FiniteTimeAction} tempArray
 * @example
 * // create sequence with actions
 * var seq = new cc.Sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = new cc.Sequence(actArray);
 */
cc.Sequence = class Sequence extends cc.ActionInterval {
  /** @lends cc.Sequence# */
  _actions = null;
  _split = null;
  _last = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create an array of sequenceable actions.
   * @param {Array|cc.FiniteTimeAction} tempArray
   */
  constructor(tempArray) {
    super();
    this._actions = [];

    var paramArray = tempArray instanceof Array ? tempArray : arguments;
    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null)
      cc.log("parameters should not be ending with null in Javascript");

    if (last >= 0) {
      var prev = paramArray[0],
        action1;
      for (var i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = cc.Sequence._actionOneTwo(action1, paramArray[i]);
        }
      }
      this.initWithTwoActions(prev, paramArray[last]);
    }
  }

  /**
   * Initializes the action <br/>
   * @param {cc.FiniteTimeAction} actionOne
   * @param {cc.FiniteTimeAction} actionTwo
   * @return {Boolean}
   */
  initWithTwoActions(actionOne, actionTwo) {
    if (!actionOne || !actionTwo)
      throw new Error(
        "cc.Sequence.initWithTwoActions(): arguments must all be non nil"
      );

    var d = actionOne._duration + actionTwo._duration;
    this.initWithDuration(d);

    this._actions[0] = actionOne;
    this._actions[1] = actionTwo;
    return true;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.Sequence}
   */
  clone() {
    var action = new cc.Sequence();
    this._cloneDecoration(action);
    action.initWithTwoActions(
      this._actions[0].clone(),
      this._actions[1].clone()
    );
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._split = this._actions[0]._duration / this._duration;
    this._last = -1;
  }

  /**
   * stop the action.
   */
  stop() {
    // Issue #1305
    if (this._last !== -1) this._actions[this._last].stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    var new_t,
      found = 0;
    var locSplit = this._split,
      locActions = this._actions,
      locLast = this._last,
      actionFound;

    dt = this._computeEaseTime(dt);
    if (dt < locSplit) {
      // action[0]
      new_t = locSplit !== 0 ? dt / locSplit : 1;

      if (found === 0 && locLast === 1) {
        // Reverse mode ?
        // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
        // since it will require a hack to know if an action is on reverse mode or not.
        // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
        locActions[1].update(0);
        locActions[1].stop();
      }
    } else {
      // action[1]
      found = 1;
      new_t = locSplit === 1 ? 1 : (dt - locSplit) / (1 - locSplit);

      if (locLast === -1) {
        // action[0] was skipped, execute it.
        locActions[0].startWithTarget(this.target);
        locActions[0].update(1);
        locActions[0].stop();
      }
      if (!locLast) {
        // switching to action 1. stop action 0.
        locActions[0].update(1);
        locActions[0].stop();
      }
    }

    actionFound = locActions[found];
    // Last action found and it is done.
    if (locLast === found && actionFound.isDone()) return;

    // Last action found and it is done
    if (locLast !== found) actionFound.startWithTarget(this.target);

    new_t = new_t * actionFound._timesForRepeat;
    actionFound.update(new_t > 1 ? new_t % 1 : new_t);
    this._last = found;
  }

  /**
   * Returns a reversed action.
   * @return {cc.Sequence}
   */
  reverse() {
    var action = cc.Sequence._actionOneTwo(
      this._actions[1].reverse(),
      this._actions[0].reverse()
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/** helper constructor to create an array of sequenceable actions
 * @function
 * @param {Array|cc.FiniteTimeAction} tempArray
 * @return {cc.Sequence}
 * @example
 * // example
 * // create sequence with actions
 * var seq = cc.sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = cc.sequence(actArray);
 * todo: It should be use new
 */
cc.sequence = function (/*Multiple Arguments*/ tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;
  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null)
    cc.log("parameters should not be ending with null in Javascript");

  var result, current, i, repeat;
  while (paramArray && paramArray.length > 0) {
    current = Array.prototype.shift.call(paramArray);
    repeat = current._timesForRepeat || 1;
    current._repeatMethod = false;
    current._timesForRepeat = 1;

    i = 0;
    if (!result) {
      result = current;
      i = 1;
    }

    for (i; i < repeat; i++) {
      result = cc.Sequence._actionOneTwo(result, current);
    }
  }

  return result;
};

/** creates the action
 * @param {cc.FiniteTimeAction} actionOne
 * @param {cc.FiniteTimeAction} actionTwo
 * @return {cc.Sequence}
 * @private
 */
cc.Sequence._actionOneTwo = function (actionOne, actionTwo) {
  var sequence = new cc.Sequence();
  sequence.initWithTwoActions(actionOne, actionTwo);
  return sequence;
};

/**
 * Repeats an action a number of times.
 * To repeat an action forever use the CCRepeatForever action.
 * @class
 * @extends cc.ActionInterval
 * @param {cc.FiniteTimeAction} action
 * @param {Number} times
 * @example
 * var rep = new cc.Repeat(cc.sequence(jump2, jump1), 5);
 */
cc.Repeat = class Repeat extends cc.ActionInterval {
  /** @lends cc.Repeat# */
  _times = 0;
  _total = 0;
  _nextDt = 0;
  _actionInstant = false;
  _innerAction = null; //CCFiniteTimeAction

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30).
   * @param {cc.FiniteTimeAction} action
   * @param {Number} times
   */
  constructor(action, times) {
    super();

    times !== undefined && this.initWithAction(action, times);
  }

  /**
   * @param {cc.FiniteTimeAction} action
   * @param {Number} times
   * @return {Boolean}
   */
  initWithAction(action, times) {
    var duration = action._duration * times;

    if (this.initWithDuration(duration)) {
      this._times = times;
      this._innerAction = action;
      if (action instanceof cc.ActionInstant) {
        this._actionInstant = true;
        this._times -= 1;
      }
      this._total = 0;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.Repeat}
   */
  clone() {
    var action = new cc.Repeat();
    this._cloneDecoration(action);
    action.initWithAction(this._innerAction.clone(), this._times);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    this._total = 0;
    this._nextDt = this._innerAction._duration / this._duration;
    super.startWithTarget(target);
    this._innerAction.startWithTarget(target);
  }

  /**
   * stop the action
   */
  stop() {
    this._innerAction.stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    var locInnerAction = this._innerAction;
    var locDuration = this._duration;
    var locTimes = this._times;
    var locNextDt = this._nextDt;

    if (dt >= locNextDt) {
      while (dt > locNextDt && this._total < locTimes) {
        locInnerAction.update(1);
        this._total++;
        locInnerAction.stop();
        locInnerAction.startWithTarget(this.target);
        locNextDt += locInnerAction._duration / locDuration;
        this._nextDt = locNextDt;
      }

      // fix for issue #1288, incorrect end value of repeat
      if (dt >= 1.0 && this._total < locTimes) this._total++;

      // don't set a instant action back or update it, it has no use because it has no duration
      if (!this._actionInstant) {
        if (this._total === locTimes) {
          locInnerAction.update(1);
          locInnerAction.stop();
        } else {
          // issue #390 prevent jerk, use right update
          locInnerAction.update(
            dt - (locNextDt - locInnerAction._duration / locDuration)
          );
        }
      }
    } else {
      locInnerAction.update((dt * locTimes) % 1.0);
    }
  }

  /**
   * Return true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return this._total === this._times;
  }

  /**
   * returns a reversed action.
   * @return {cc.Repeat}
   */
  reverse() {
    var action = new cc.Repeat(this._innerAction.reverse(), this._times);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * Set inner Action.
   * @param {cc.FiniteTimeAction} action
   */
  setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  }

  /**
   * Get inner Action.
   * @return {cc.FiniteTimeAction}
   */
  getInnerAction() {
    return this._innerAction;
  }
};

/**
 * Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
 * @function
 * @param {cc.FiniteTimeAction} action
 * @param {Number} times
 * @return {cc.Repeat}
 * @example
 * // example
 * var rep = cc.repeat(cc.sequence(jump2, jump1), 5);
 */
cc.repeat = function (action, times) {
  return new cc.Repeat(action, times);
};

/**  Repeats an action for ever.  <br/>
 * To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class
 * @extends cc.ActionInterval
 * @param {cc.FiniteTimeAction} action
 * @example
 * var rep = new cc.RepeatForever(cc.sequence(jump2, jump1), 5);
 */
cc.RepeatForever = class RepeatForever extends cc.ActionInterval {
  /** @lends cc.RepeatForever# */
  _innerAction = null; //CCActionInterval

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create a acton which repeat forever.
   * @param {cc.FiniteTimeAction} action
   */
  constructor(action) {
    super();
    this._innerAction = null;

    action && this.initWithAction(action);
  }

  /**
   * @param {cc.ActionInterval} action
   * @return {Boolean}
   */
  initWithAction(action) {
    if (!action)
      throw new Error(
        "cc.RepeatForever.initWithAction(): action must be non null"
      );

    this._innerAction = action;
    return true;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.RepeatForever}
   */
  clone() {
    var action = new cc.RepeatForever();
    this._cloneDecoration(action);
    action.initWithAction(this._innerAction.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._innerAction.startWithTarget(target);
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   * @param dt delta time in seconds
   */
  step(dt) {
    var locInnerAction = this._innerAction;
    locInnerAction.step(dt);
    if (locInnerAction.isDone()) {
      //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
      locInnerAction.startWithTarget(this.target);
      // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);
      locInnerAction.step(
        locInnerAction.getElapsed() - locInnerAction._duration
      );
    }
  }

  /**
   * Return true if the action has finished.
   * @return {Boolean}
   */
  isDone() {
    return false;
  }

  /**
   * Returns a reversed action.
   * @return {cc.RepeatForever}
   */
  reverse() {
    var action = new cc.RepeatForever(this._innerAction.reverse());
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * Set inner action.
   * @param {cc.ActionInterval} action
   */
  setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  }

  /**
   * Get inner action.
   * @return {cc.ActionInterval}
   */
  getInnerAction() {
    return this._innerAction;
  }
};

/**
 * Create a acton which repeat forever
 * @function
 * @param {cc.FiniteTimeAction} action
 * @return {cc.RepeatForever}
 * @example
 * // example
 * var repeat = cc.repeatForever(cc.rotateBy(1.0, 360));
 */
cc.repeatForever = (action) => new cc.RepeatForever(action);

/** Spawn a new action immediately
 * @class
 * @extends cc.ActionInterval
 */
cc.Spawn = class Spawn extends cc.ActionInterval {
  /** @lends cc.Spawn# */
  _one = null;
  _two = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Array|cc.FiniteTimeAction} tempArray
   */
  constructor(tempArray) {
    super();
    this._one = null;
    this._two = null;

    var i, paramArray, last;
    if (tempArray instanceof Array) {
      paramArray = tempArray;
    } else {
      paramArray = new Array(arguments.length);
      for (i = 0; i < arguments.length; ++i) {
        paramArray[i] = arguments[i];
      }
    }
    last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null)
      cc.log("parameters should not be ending with null in Javascript");

    if (last >= 0) {
      var prev = paramArray[0],
        action1;
      for (i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = cc.Spawn._actionOneTwo(action1, paramArray[i]);
        }
      }
      this.initWithTwoActions(prev, paramArray[last]);
    }
  }

  /** initializes the Spawn action with the 2 actions to spawn
   * @param {cc.FiniteTimeAction} action1
   * @param {cc.FiniteTimeAction} action2
   * @return {Boolean}
   */
  initWithTwoActions(action1, action2) {
    if (!action1 || !action2)
      throw new Error(
        "cc.Spawn.initWithTwoActions(): arguments must all be non null"
      );

    var ret = false;

    var d1 = action1._duration;
    var d2 = action2._duration;

    if (this.initWithDuration(Math.max(d1, d2))) {
      this._one = action1;
      this._two = action2;

      if (d1 > d2) {
        this._two = cc.Sequence._actionOneTwo(action2, cc.delayTime(d1 - d2));
      } else if (d1 < d2) {
        this._one = cc.Sequence._actionOneTwo(action1, cc.delayTime(d2 - d1));
      }

      ret = true;
    }
    return ret;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.Spawn}
   */
  clone() {
    var action = new cc.Spawn();
    this._cloneDecoration(action);
    action.initWithTwoActions(this._one.clone(), this._two.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._one.startWithTarget(target);
    this._two.startWithTarget(target);
  }

  /**
   * Stop the action
   */
  stop() {
    this._one.stop();
    this._two.stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._one) this._one.update(dt);
    if (this._two) this._two.update(dt);
  }

  /**
   * Returns a reversed action.
   * @return {cc.Spawn}
   */
  reverse() {
    var action = cc.Spawn._actionOneTwo(
      this._one.reverse(),
      this._two.reverse()
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * Create a spawn action which runs several actions in parallel.
 * @function
 * @param {Array|cc.FiniteTimeAction}tempArray
 * @return {cc.Spawn}
 * @example
 * // example
 * var action = cc.spawn(cc.jumpBy(2, cc.p(300, 0), 50, 4), cc.rotateBy(2, 720));
 * todo:It should be the direct use new
 */
cc.spawn = function (/*Multiple Arguments*/ tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;
  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null)
    cc.log("parameters should not be ending with null in Javascript");

  var prev = paramArray[0];
  for (var i = 1; i < paramArray.length; i++) {
    if (paramArray[i] != null)
      prev = cc.Spawn._actionOneTwo(prev, paramArray[i]);
  }
  return prev;
};

/**
 * @param {cc.FiniteTimeAction} action1
 * @param {cc.FiniteTimeAction} action2
 * @return {cc.Spawn}
 * @private
 */
cc.Spawn._actionOneTwo = function (action1, action2) {
  var pSpawn = new cc.Spawn();
  pSpawn.initWithTwoActions(action1, action2);
  return pSpawn;
};

/**
 * Rotates a cc.Node object to a certain angle by modifying it's.
 * rotation attribute. <br/>
 * The direction will be decided by the shortest angle.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngleX deltaAngleX in degrees.
 * @param {Number} [deltaAngleY] deltaAngleY in degrees.
 * @example
 * var rotateTo = new cc.RotateTo(2, 61.0);
 */
cc.RotateTo = class RotateTo extends cc.ActionInterval {
  /** @lends cc.RotateTo# */
  _dstAngleX = 0;
  _startAngleX = 0;
  _diffAngleX = 0;

  _dstAngleY = 0;
  _startAngleY = 0;
  _diffAngleY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates a RotateTo action with x and y rotation angles.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngleX deltaAngleX in degrees.
   * @param {Number} [deltaAngleY] deltaAngleY in degrees.
   */
  constructor(duration, deltaAngleX, deltaAngleY) {
    super();

    deltaAngleX !== undefined &&
      this.initWithDuration(duration, deltaAngleX, deltaAngleY);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} deltaAngleX
   * @param {Number} deltaAngleY
   * @return {Boolean}
   */
  initWithDuration(duration, deltaAngleX, deltaAngleY) {
    if (super.initWithDuration(duration)) {
      this._dstAngleX = deltaAngleX || 0;
      this._dstAngleY =
        deltaAngleY !== undefined ? deltaAngleY : this._dstAngleX;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.RotateTo}
   */
  clone() {
    var action = new cc.RotateTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._dstAngleX, this._dstAngleY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    // Calculate X
    var locStartAngleX = target.rotationX % 360.0;
    var locDiffAngleX = this._dstAngleX - locStartAngleX;
    if (locDiffAngleX > 180) locDiffAngleX -= 360;
    if (locDiffAngleX < -180) locDiffAngleX += 360;
    this._startAngleX = locStartAngleX;
    this._diffAngleX = locDiffAngleX;

    // Calculate Y  It's duplicated from calculating X since the rotation wrap should be the same
    this._startAngleY = target.rotationY % 360.0;
    var locDiffAngleY = this._dstAngleY - this._startAngleY;
    if (locDiffAngleY > 180) locDiffAngleY -= 360;
    if (locDiffAngleY < -180) locDiffAngleY += 360;
    this._diffAngleY = locDiffAngleY;
  }

  /**
   * RotateTo reverse not implemented.
   * Will be overridden.
   * @returns {cc.Action}
   */
  reverse() {
    cc.log("cc.RotateTo.reverse(): it should be overridden in subclass.");
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      this.target.rotationX = this._startAngleX + this._diffAngleX * dt;
      this.target.rotationY = this._startAngleY + this._diffAngleY * dt;
    }
  }
};

/**
 * Creates a RotateTo action with separate rotation angles.
 * To specify the angle of rotation.
 * @function
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngleX deltaAngleX in degrees.
 * @param {Number} [deltaAngleY] deltaAngleY in degrees.
 * @return {cc.RotateTo}
 * @example
 * // example
 * var rotateTo = cc.rotateTo(2, 61.0);
 */
cc.rotateTo = (duration, deltaAngleX, deltaAngleY) =>
  new cc.RotateTo(duration, deltaAngleX, deltaAngleY);

/**
 * Rotates a cc.Node object clockwise a number of degrees by modifying it's rotation attribute.
 * Relative to its properties to modify.
 * @class
 * @extends  cc.ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @example
 * var actionBy = new cc.RotateBy(2, 360);
 */
cc.RotateBy = class RotateBy extends cc.ActionInterval {
  /** @lends cc.RotateBy# */
  _angleX = 0;
  _startAngleX = 0;
  _angleY = 0;
  _startAngleY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngleX deltaAngleX in degrees
   * @param {Number} [deltaAngleY] deltaAngleY in degrees
   */
  constructor(duration, deltaAngleX, deltaAngleY) {
    super();

    deltaAngleX !== undefined &&
      this.initWithDuration(duration, deltaAngleX, deltaAngleY);
  }

  /**
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngleX deltaAngleX in degrees
   * @param {Number} [deltaAngleY=] deltaAngleY in degrees
   * @return {Boolean}
   */
  initWithDuration(duration, deltaAngleX, deltaAngleY) {
    if (super.initWithDuration(duration)) {
      this._angleX = deltaAngleX || 0;
      this._angleY = deltaAngleY || this._angleX;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.RotateBy}
   */
  clone() {
    var action = new cc.RotateBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._angleX, this._angleY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._startAngleX = target.rotationX;
    this._startAngleY = target.rotationY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      this.target.rotationX = this._startAngleX + this._angleX * dt;
      this.target.rotationY = this._startAngleY + this._angleY * dt;
    }
  }

  /**
   * Returns a reversed action.
   * @return {cc.RotateBy}
   */
  reverse() {
    var action = new cc.RotateBy(this._duration, -this._angleX, -this._angleY);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * Rotates a cc.Node object clockwise a number of degrees by modifying it's rotation attribute.
 * Relative to its properties to modify.
 * @function
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @return {cc.RotateBy}
 * @example
 * // example
 * var actionBy = cc.rotateBy(2, 360);
 */
cc.rotateBy = (duration, deltaAngleX, deltaAngleY) =>
  new cc.RotateBy(duration, deltaAngleX, deltaAngleY);

/**
 * <p>
 *     Moves a CCNode object x,y pixels by modifying it's position attribute.                                  <br/>
 *     x and y are relative to the position of the object.                                                     <br/>
 *     Several CCMoveBy actions can be concurrently called, and the resulting                                  <br/>
 *     movement will be the sum of individual movements.
 * </p>
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration duration in seconds
 * @param {cc.Point|Number} deltaPos
 * @param {Number} [deltaY]
 * @example
 * var actionBy = cc.moveBy(2, cc.p(windowSize.width - 40, windowSize.height - 40));
 */
cc.MoveBy = class MoveBy extends cc.ActionInterval {
  /** @lends cc.MoveBy# */
  _positionDelta = null;
  _startPosition = null;
  _previousPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   * @param {cc.Point|Number} deltaPos
   * @param {Number} [deltaY]
   */
  constructor(duration, deltaPos, deltaY) {
    super();

    this._positionDelta = cc.p(0, 0);
    this._startPosition = cc.p(0, 0);
    this._previousPosition = cc.p(0, 0);

    deltaPos !== undefined && this.initWithDuration(duration, deltaPos, deltaY);
  }

  /**
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {cc.Point} position
   * @param {Number} [y]
   * @return {Boolean}
   */
  initWithDuration(duration, position, y) {
    if (super.initWithDuration(duration)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._positionDelta.x = position;
      this._positionDelta.y = y;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.MoveBy}
   */
  clone() {
    var action = new cc.MoveBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._positionDelta);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    var locPosX = target.getPositionX();
    var locPosY = target.getPositionY();
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      var x = this._positionDelta.x * dt;
      var y = this._positionDelta.y * dt;
      var locStartPosition = this._startPosition;
      if (cc.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.getPositionX();
        var targetY = this.target.getPositionY();
        var locPreviousPosition = this._previousPosition;

        locStartPosition.x =
          locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y =
          locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  }

  /**
   * MoveTo reverse is not implemented
   * @return {cc.MoveBy}
   */
  reverse() {
    var action = new cc.MoveBy(
      this._duration,
      cc.p(-this._positionDelta.x, -this._positionDelta.y)
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * Create the action.
 * Relative to its coordinate moves a certain distance.
 * @function
 * @param {Number} duration duration in seconds
 * @param {cc.Point|Number} deltaPos
 * @param {Number} deltaY
 * @return {cc.MoveBy}
 * @example
 * // example
 * var actionBy = cc.moveBy(2, cc.p(windowSize.width - 40, windowSize.height - 40));
 */
cc.moveBy = (duration, deltaPos, deltaY) =>
  new cc.MoveBy(duration, deltaPos, deltaY);

/**
 * Moves a CCNode object to the position x,y. x and y are absolute coordinates by modifying it's position attribute. <br/>
 * Several CCMoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * @class
 * @extends cc.MoveBy
 * @param {Number} duration duration in seconds
 * @param {cc.Point|Number} position
 * @param {Number} y
 * @example
 * var actionTo = new cc.MoveTo(2, cc.p(80, 80));
 */
cc.MoveTo = class MoveTo extends cc.MoveBy {
  /** @lends cc.MoveTo# */
  _endPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   * @param {cc.Point|Number} position
   * @param {Number} y
   */
  constructor(duration, position, y) {
    super();
    this._endPosition = cc.p(0, 0);

    position !== undefined && this.initWithDuration(duration, position, y);
  }

  /**
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {cc.Point} position
   * @param {Number} y
   * @return {Boolean}
   */
  initWithDuration(duration, position, y) {
    if (super.initWithDuration(duration, position, y)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.MoveTo}
   */
  clone() {
    var action = new cc.MoveTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endPosition);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._positionDelta.x = this._endPosition.x - target.getPositionX();
    this._positionDelta.y = this._endPosition.y - target.getPositionY();
  }
};

/**
 * Create new action.
 * Moving to the specified coordinates.
 * @function
 * @param {Number} duration duration in seconds
 * @param {cc.Point|Number} position
 * @param {Number} y
 * @return {cc.MoveTo}
 * @example
 * // example
 * var actionTo = cc.moveTo(2, cc.p(80, 80));
 */
cc.moveTo = (duration, position, y) => new cc.MoveTo(duration, position, y);

/**
 * Skews a cc.Node object to given angles by modifying it's skewX and skewY attributes
 * @class
 * @extends cc.ActionInterval
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @example
 * var actionTo = new cc.SkewTo(2, 37.2, -37.2);
 */
cc.SkewTo = class SkewTo extends cc.ActionInterval {
  /** @lends cc.SkewTo# */
  _skewX = 0;
  _skewY = 0;
  _startSkewX = 0;
  _startSkewY = 0;
  _endSkewX = 0;
  _endSkewY = 0;
  _deltaX = 0;
  _deltaY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t time in seconds
   * @param {Number} sx
   * @param {Number} sy
   */
  constructor(t, sx, sy) {
    super();

    sy !== undefined && this.initWithDuration(t, sx, sy);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} sx
   * @param {Number} sy
   * @return {Boolean}
   */
  initWithDuration(t, sx, sy) {
    var ret = false;
    if (super.initWithDuration(t)) {
      this._endSkewX = sx;
      this._endSkewY = sy;
      ret = true;
    }
    return ret;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.SkewTo}
   */
  clone() {
    var action = new cc.SkewTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endSkewX, this._endSkewY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    this._startSkewX = target.skewX % 180;
    this._deltaX = this._endSkewX - this._startSkewX;
    if (this._deltaX > 180) this._deltaX -= 360;
    if (this._deltaX < -180) this._deltaX += 360;

    this._startSkewY = target.skewY % 360;
    this._deltaY = this._endSkewY - this._startSkewY;
    if (this._deltaY > 180) this._deltaY -= 360;
    if (this._deltaY < -180) this._deltaY += 360;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    this.target.skewX = this._startSkewX + this._deltaX * dt;
    this.target.skewY = this._startSkewY + this._deltaY * dt;
  }
};
/**
 * Create new action.
 * Skews a cc.Node object to given angles by modifying it's skewX and skewY attributes.
 * Changes to the specified value.
 * @function
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @return {cc.SkewTo}
 * @example
 * // example
 * var actionTo = cc.skewTo(2, 37.2, -37.2);
 */
cc.skewTo = (t, sx, sy) => new cc.SkewTo(t, sx, sy);

/**
 * Skews a cc.Node object by skewX and skewY degrees.
 * Relative to its attribute modification.
 * @class
 * @extends cc.SkewTo
 * @param {Number} t time in seconds
 * @param {Number} sx  skew in degrees for X axis
 * @param {Number} sy  skew in degrees for Y axis
 */
cc.SkewBy = class SkewBy extends cc.SkewTo {
  /** @lends cc.SkewBy# */

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t time in seconds
   * @param {Number} sx  skew in degrees for X axis
   * @param {Number} sy  skew in degrees for Y axis
   */
  constructor(t, sx, sy) {
    super();
    sy !== undefined && this.initWithDuration(t, sx, sy);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} deltaSkewX  skew in degrees for X axis
   * @param {Number} deltaSkewY  skew in degrees for Y axis
   * @return {Boolean}
   */
  initWithDuration(t, deltaSkewX, deltaSkewY) {
    var ret = false;
    if (super.initWithDuration(t, deltaSkewX, deltaSkewY)) {
      this._skewX = deltaSkewX;
      this._skewY = deltaSkewY;
      ret = true;
    }
    return ret;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.SkewBy}
   */
  clone() {
    var action = new cc.SkewBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._skewX, this._skewY);
    return action;
  }

  /**
   * Start the action width target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._deltaX = this._skewX;
    this._deltaY = this._skewY;
    this._endSkewX = this._startSkewX + this._deltaX;
    this._endSkewY = this._startSkewY + this._deltaY;
  }

  /**
   * Returns a reversed action.
   * @return {cc.SkewBy}
   */
  reverse() {
    var action = new cc.SkewBy(this._duration, -this._skewX, -this._skewY);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * Skews a cc.Node object by skewX and skewY degrees. <br />
 * Relative to its attribute modification.
 * @function
 * @param {Number} t time in seconds
 * @param {Number} sx sx skew in degrees for X axis
 * @param {Number} sy sy skew in degrees for Y axis
 * @return {cc.SkewBy}
 * @example
 * // example
 * var actionBy = cc.skewBy(2, 0, -90);
 */
cc.skewBy = (t, sx, sy) => new cc.SkewBy(t, sx, sy);

/**
 * Moves a cc.Node object simulating a parabolic jump movement by modifying it's position attribute.
 * Relative to its movement.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {cc.Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionBy = new cc.JumpBy(2, cc.p(300, 0), 50, 4);
 * var actionBy = new cc.JumpBy(2, 300, 0, 50, 4);
 */
cc.JumpBy = class JumpBy extends cc.ActionInterval {
  /** @lends cc.JumpBy# */
  _startPosition = null;
  _delta = null;
  _height = 0;
  _jumps = 0;
  _previousPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {cc.Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   */
  constructor(duration, position, y, height, jumps) {
    super();
    this._startPosition = cc.p(0, 0);
    this._previousPosition = cc.p(0, 0);
    this._delta = cc.p(0, 0);

    height !== undefined &&
      this.initWithDuration(duration, position, y, height, jumps);
  }
  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {cc.Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionBy.initWithDuration(2, cc.p(300, 0), 50, 4);
   * actionBy.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration(duration, position, y, height, jumps) {
    if (super.initWithDuration(duration)) {
      if (jumps === undefined) {
        jumps = height;
        height = y;
        y = position.y;
        position = position.x;
      }
      this._delta.x = position;
      this._delta.y = y;
      this._height = height;
      this._jumps = jumps;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.JumpBy}
   */
  clone() {
    var action = new cc.JumpBy();
    this._cloneDecoration(action);
    action.initWithDuration(
      this._duration,
      this._delta,
      this._height,
      this._jumps
    );
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    var locPosX = target.getPositionX();
    var locPosY = target.getPositionY();
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      var frac = (dt * this._jumps) % 1.0;
      var y = this._height * 4 * frac * (1 - frac);
      y += this._delta.y * dt;

      var x = this._delta.x * dt;
      var locStartPosition = this._startPosition;
      if (cc.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.getPositionX();
        var targetY = this.target.getPositionY();
        var locPreviousPosition = this._previousPosition;

        locStartPosition.x =
          locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y =
          locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  }

  /**
   * Returns a reversed action.
   * @return {cc.JumpBy}
   */
  reverse() {
    var action = new cc.JumpBy(
      this._duration,
      cc.p(-this._delta.x, -this._delta.y),
      this._height,
      this._jumps
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * Moves a cc.Node object simulating a parabolic jump movement by modifying it's position attribute.
 * Relative to its movement.
 * @function
 * @param {Number} duration
 * @param {cc.Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @return {cc.JumpBy}
 * @example
 * // example
 * var actionBy = cc.jumpBy(2, cc.p(300, 0), 50, 4);
 * var actionBy = cc.jumpBy(2, 300, 0, 50, 4);
 */
cc.jumpBy = (duration, position, y, height, jumps) =>
  new cc.JumpBy(duration, position, y, height, jumps);

/**
 * Moves a cc.Node object to a parabolic position simulating a jump movement by modifying it's position attribute. <br />
 * Jump to the specified location.
 * @class
 * @extends cc.JumpBy
 * @param {Number} duration
 * @param {cc.Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionTo = new cc.JumpTo(2, cc.p(300, 0), 50, 4);
 * var actionTo = new cc.JumpTo(2, 300, 0, 50, 4);
 */
cc.JumpTo = class JumpTo extends cc.JumpBy {
  /** @lends cc.JumpTo# */
  _endPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {cc.Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   */
  constructor(duration, position, y, height, jumps) {
    super();
    this._endPosition = cc.p(0, 0);

    height !== undefined &&
      this.initWithDuration(duration, position, y, height, jumps);
  }
  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {cc.Point|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionTo.initWithDuration(2, cc.p(300, 0), 50, 4);
   * actionTo.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration(duration, position, y, height, jumps) {
    if (
      cc.JumpBy.prototype.initWithDuration.call(
        this,
        duration,
        position,
        y,
        height,
        jumps
      )
    ) {
      if (jumps === undefined) {
        y = position.y;
        position = position.x;
      }
      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }
    return false;
  }
  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._delta.x = this._endPosition.x - this._startPosition.x;
    this._delta.y = this._endPosition.y - this._startPosition.y;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.JumpTo}
   */
  clone() {
    var action = new cc.JumpTo();
    this._cloneDecoration(action);
    action.initWithDuration(
      this._duration,
      this._endPosition,
      this._height,
      this._jumps
    );
    return action;
  }
};

/**
 * Moves a cc.Node object to a parabolic position simulating a jump movement by modifying it's position attribute. <br />
 * Jump to the specified location.
 * @function
 * @param {Number} duration
 * @param {cc.Point|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @return {cc.JumpTo}
 * @example
 * // example
 * var actionTo = cc.jumpTo(2, cc.p(300, 300), 50, 4);
 * var actionTo = cc.jumpTo(2, 300, 300, 50, 4);
 */
cc.jumpTo = (duration, position, y, height, jumps) =>
  new cc.JumpTo(duration, position, y, height, jumps);

/**
 * @function
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} t
 * @return {Number}
 */
cc.bezierAt = function (a, b, c, d, t) {
  return (
    Math.pow(1 - t, 3) * a +
    3 * t * Math.pow(1 - t, 2) * b +
    3 * Math.pow(t, 2) * (1 - t) * c +
    Math.pow(t, 3) * d
  );
};

/** An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} t time in seconds
 * @param {Array} c Array of points
 * @example
 * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
 * var bezierForward = new cc.BezierBy(3, bezier);
 */
cc.BezierBy = class BezierBy extends cc.ActionInterval {
  /** @lends cc.BezierBy# */
  _config = null;
  _startPosition = null;
  _previousPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t time in seconds
   * @param {Array} c Array of points
   */
  constructor(t, c) {
    super();
    this._config = [];
    this._startPosition = cc.p(0, 0);
    this._previousPosition = cc.p(0, 0);

    c && this.initWithDuration(t, c);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Array} c Array of points
   * @return {Boolean}
   */
  initWithDuration(t, c) {
    if (super.initWithDuration(t)) {
      this._config = c;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.BezierBy}
   */
  clone() {
    var action = new cc.BezierBy();
    this._cloneDecoration(action);
    var newConfigs = [];
    for (var i = 0; i < this._config.length; i++) {
      var selConf = this._config[i];
      newConfigs.push(cc.p(selConf.x, selConf.y));
    }
    action.initWithDuration(this._duration, newConfigs);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    var locPosX = target.getPositionX();
    var locPosY = target.getPositionY();
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      var locConfig = this._config;
      var xa = 0;
      var xb = locConfig[0].x;
      var xc = locConfig[1].x;
      var xd = locConfig[2].x;

      var ya = 0;
      var yb = locConfig[0].y;
      var yc = locConfig[1].y;
      var yd = locConfig[2].y;

      var x = cc.bezierAt(xa, xb, xc, xd, dt);
      var y = cc.bezierAt(ya, yb, yc, yd, dt);

      var locStartPosition = this._startPosition;
      if (cc.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.getPositionX();
        var targetY = this.target.getPositionY();
        var locPreviousPosition = this._previousPosition;

        locStartPosition.x =
          locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y =
          locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  }

  /**
   * Returns a reversed action.
   * @return {cc.BezierBy}
   */
  reverse() {
    var locConfig = this._config;
    var r = [
      cc.pAdd(locConfig[1], cc.pNeg(locConfig[2])),
      cc.pAdd(locConfig[0], cc.pNeg(locConfig[2])),
      cc.pNeg(locConfig[2])
    ];
    var action = new cc.BezierBy(this._duration, r);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @function
 * @param {Number} t time in seconds
 * @param {Array} c Array of points
 * @return {cc.BezierBy}
 * @example
 * // example
 * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
 * var bezierForward = cc.bezierBy(3, bezier);
 */
cc.bezierBy = (t, c) => new cc.BezierBy(t, c);

/** An action that moves the target with a cubic Bezier curve to a destination point.
 * @class
 * @extends cc.BezierBy
 * @param {Number} t
 * @param {Array} c array of points
 * @example
 * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
 * var bezierTo = new cc.BezierTo(2, bezier);
 */
cc.BezierTo = class BezierTo extends cc.BezierBy {
  /** @lends cc.BezierTo# */
  _toConfig = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} t
   * @param {Array} c array of points
   * var bezierTo = new cc.BezierTo(2, bezier);
   */
  constructor(t, c) {
    super();
    this._toConfig = [];
    c && this.initWithDuration(t, c);
  }

  /**
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Array} c Array of points
   * @return {Boolean}
   */
  initWithDuration(t, c) {
    if (super.initWithDuration(t)) {
      this._toConfig = c;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.BezierTo}
   */
  clone() {
    var action = new cc.BezierTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toConfig);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    var locStartPos = this._startPosition;
    var locToConfig = this._toConfig;
    var locConfig = this._config;

    locConfig[0] = cc.pSub(locToConfig[0], locStartPos);
    locConfig[1] = cc.pSub(locToConfig[1], locStartPos);
    locConfig[2] = cc.pSub(locToConfig[2], locStartPos);
  }
};
/**
 * An action that moves the target with a cubic Bezier curve to a destination point.
 * @function
 * @param {Number} t
 * @param {Array} c array of points
 * @return {cc.BezierTo}
 * @example
 * // example
 * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
 * var bezierTo = cc.bezierTo(2, bezier);
 */
cc.bezierTo = (t, c) => new cc.BezierTo(t, c);

/** Scales a cc.Node object to a zoom factor by modifying it's scale attribute.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = new cc.ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = new cc.ScaleTo(2, 0.5, 2);
 */
cc.ScaleTo = class ScaleTo extends cc.ActionInterval {
  /** @lends cc.ScaleTo# */
  _scaleX = 1;
  _scaleY = 1;
  _startScaleX = 1;
  _startScaleY = 1;
  _endScaleX = 0;
  _endScaleY = 0;
  _deltaX = 0;
  _deltaY = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Number} sx  scale parameter in X
   * @param {Number} [sy] scale parameter in Y, if Null equal to sx
   */
  constructor(duration, sx, sy) {
    super();
    sx !== undefined && this.initWithDuration(duration, sx, sy);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} sx
   * @param {Number} [sy=]
   * @return {Boolean}
   */
  initWithDuration(duration, sx, sy) {
    //function overload here
    if (super.initWithDuration(duration)) {
      this._endScaleX = sx;
      this._endScaleY = sy != null ? sy : sx;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.ScaleTo}
   */
  clone() {
    var action = new cc.ScaleTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._startScaleX = target.scaleX;
    this._startScaleY = target.scaleY;
    this._deltaX = this._endScaleX - this._startScaleX;
    this._deltaY = this._endScaleY - this._startScaleY;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target) {
      this.target.scaleX = this._startScaleX + this._deltaX * dt;
      this.target.scaleY = this._startScaleY + this._deltaY * dt;
    }
  }
};
/**
 * Scales a cc.Node object to a zoom factor by modifying it's scale attribute.
 * @function
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @return {cc.ScaleTo}
 * @example
 * // example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = cc.scaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = cc.scaleTo(2, 0.5, 2);
 */
cc.scaleTo = (duration, sx, sy) =>
  //function overload
  new cc.ScaleTo(duration, sx, sy);

/** Scales a cc.Node object a zoom factor by modifying it's scale attribute.
 * Relative to its changes.
 * @class
 * @extends cc.ScaleTo
 */
cc.ScaleBy = class ScaleBy extends cc.ScaleTo {
  /** @lends cc.ScaleBy# */
  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
    this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
  }

  /**
   * Returns a reversed action.
   * @return {cc.ScaleBy}
   */
  reverse() {
    var action = new cc.ScaleBy(
      this._duration,
      1 / this._endScaleX,
      1 / this._endScaleY
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.ScaleBy}
   */
  clone() {
    var action = new cc.ScaleBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  }
};
/**
 * Scales a cc.Node object a zoom factor by modifying it's scale attribute.
 * Relative to its changes.
 * @function
 * @param {Number} duration duration in seconds
 * @param {Number} sx sx  scale parameter in X
 * @param {Number|Null} [sy=] sy scale parameter in Y, if Null equal to sx
 * @return {cc.ScaleBy}
 * @example
 * // example without sy, it scales by 2 both in X and Y
 * var actionBy = cc.scaleBy(2, 2);
 *
 * //example with sy, it scales by 0.25 in X and 4.5 in Y
 * var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
 */
cc.scaleBy = (duration, sx, sy) => new cc.ScaleBy(duration, sx, sy);

/** Blinks a cc.Node object by modifying it's visible attribute
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks  blinks in times
 * @example
 * var action = new cc.Blink(2, 10);
 */
cc.Blink = class Blink extends cc.ActionInterval {
  /** @lends cc.Blink# */
  _times = 0;
  _originalState = false;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration  duration in seconds
   * @param {Number} blinks  blinks in times
   */
  constructor(duration, blinks) {
    super();
    blinks !== undefined && this.initWithDuration(duration, blinks);
  }

  /**
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} blinks blinks in times
   * @return {Boolean}
   */
  initWithDuration(duration, blinks) {
    if (super.initWithDuration(duration)) {
      this._times = blinks;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.Blink}
   */
  clone() {
    var action = new cc.Blink();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._times);
    return action;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this.target && !this.isDone()) {
      var slice = 1.0 / this._times;
      var m = dt % slice;
      this.target.visible = m > slice / 2;
    }
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._originalState = target.visible;
  }

  /**
   * stop the action
   */
  stop() {
    this.target.visible = this._originalState;
    super.stop();
  }

  /**
   * Returns a reversed action.
   * @return {cc.Blink}
   */
  reverse() {
    var action = new cc.Blink(this._duration, this._times);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};
/**
 * Blinks a cc.Node object by modifying it's visible attribute.
 * @function
 * @param {Number} duration  duration in seconds
 * @param blinks blinks in times
 * @return {cc.Blink}
 * @example
 * // example
 * var action = cc.blink(2, 10);
 */
cc.blink = (duration, blinks) => new cc.Blink(duration, blinks);

/** Fades an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @example
 * var action = new cc.FadeTo(1.0, 0);
 */
cc.FadeTo = class FadeTo extends cc.ActionInterval {
  /** @lends cc.FadeTo# */
  _toOpacity = 0;
  _fromOpacity = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Number} opacity 0-255, 0 is transparent
   */
  constructor(duration, opacity) {
    super();
    opacity !== undefined && this.initWithDuration(duration, opacity);
  }

  /**
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Number} opacity
   * @return {Boolean}
   */
  initWithDuration(duration, opacity) {
    if (super.initWithDuration(duration)) {
      this._toOpacity = opacity;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.FadeTo}
   */
  clone() {
    const action = new cc.FadeTo();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} time time in seconds
   */
  update(time) {
    time = this._computeEaseTime(time);
    const fromOpacity =
      this._fromOpacity !== undefined ? this._fromOpacity : 255;
    this.target.opacity = fromOpacity + (this._toOpacity - fromOpacity) * time;
  }

  /**
   * Start this action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._fromOpacity = target.opacity;
  }
};

/**
 * Fades an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @function
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @return {cc.FadeTo}
 * @example
 * // example
 * var action = cc.fadeTo(1.0, 0);
 */
cc.fadeTo = (duration, opacity) => new cc.FadeTo(duration, opacity);

/** Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.<br/>
 * The "reverse" of this action is FadeOut
 * @class
 * @extends cc.FadeTo
 * @param {Number} duration duration in seconds
 */
cc.FadeIn = class FadeIn extends cc.FadeTo {
  /** @lends cc.FadeIn# */
  _reverseAction = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   */
  constructor(duration = 0) {
    super();
    const actualDuration = duration == null ? 0 : duration;
    this.initWithDuration(actualDuration, 255);
  }

  /**
   * Returns a reversed action.
   * @return {cc.FadeOut}
   */
  reverse() {
    const action = new cc.FadeOut();
    action.initWithDuration(this._duration, 0);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.FadeIn}
   */
  clone() {
    const action = new cc.FadeIn();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    if (this._reverseAction) this._toOpacity = this._reverseAction._fromOpacity;
    super.startWithTarget(target);
  }
};

/**
 * Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.
 * @function
 * @param {Number} duration duration in seconds
 * @return {cc.FadeIn}
 * @example
 * //example
 * var action = cc.fadeIn(1.0);
 */
cc.fadeIn = (duration) => new cc.FadeIn(duration);

/** Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * The "reverse" of this action is FadeIn
 * @class
 * @extends cc.FadeTo
 * @param {Number} duration duration in seconds
 */
cc.FadeOut = class FadeOut extends cc.FadeTo {
  /** @lends cc.FadeOut# */

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   */
  constructor(duration = 0) {
    super();
    const actualDuration = duration == null ? 0 : duration;
    this.initWithDuration(actualDuration, 0);
  }

  /**
   * Returns a reversed action.
   * @return {cc.FadeIn}
   */
  reverse() {
    const action = new cc.FadeIn();
    action._reverseAction = this;
    action.initWithDuration(this._duration, 255);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.FadeOut}
   */
  clone() {
    const action = new cc.FadeOut();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }
};

/**
 * Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * @function
 * @param {Number} d  duration in seconds
 * @return {cc.FadeOut}
 * @example
 * // example
 * var action = cc.fadeOut(1.0);
 */
cc.fadeOut = (d) => new cc.FadeOut(d);

/** Tints a cc.Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @example
 * var action = new cc.TintTo(2, 255, 0, 255);
 */
cc.TintTo = class TintTo extends cc.ActionInterval {
  /** @lends cc.TintTo# */
  _to = null;
  _from = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {Number} red 0-255
   * @param {Number} green  0-255
   * @param {Number} blue 0-255
   */
  constructor(duration, red, green, blue) {
    super();
    this._to = cc.color(0, 0, 0);
    this._from = cc.color(0, 0, 0);

    blue !== undefined && this.initWithDuration(duration, red, green, blue);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} red 0-255
   * @param {Number} green 0-255
   * @param {Number} blue 0-255
   * @return {Boolean}
   */
  initWithDuration(duration, red, green, blue) {
    if (super.initWithDuration(duration)) {
      this._to = cc.color(red, green, blue);
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.TintTo}
   */
  clone() {
    var action = new cc.TintTo();
    this._cloneDecoration(action);
    var locTo = this._to;
    action.initWithDuration(this._duration, locTo.r, locTo.g, locTo.b);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    this._from = this.target.color;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    var locFrom = this._from,
      locTo = this._to;
    if (locFrom) {
      this.target.setColor(
        cc.color(
          locFrom.r + (locTo.r - locFrom.r) * dt,
          locFrom.g + (locTo.g - locFrom.g) * dt,
          locFrom.b + (locTo.b - locFrom.b) * dt
        )
      );
    }
  }
};

/**
 * Tints a cc.Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * @function
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @return {cc.TintTo}
 * @example
 * // example
 * var action = cc.tintTo(2, 255, 0, 255);
 */
cc.tintTo = (duration, red, green, blue) =>
  new cc.TintTo(duration, red, green, blue);

/**  Tints a cc.Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @example
 * var action = new cc.TintBy(2, -127, -255, -127);
 */
cc.TintBy = class TintBy extends cc.ActionInterval {
  /** @lends cc.TintBy# */
  _deltaR = 0;
  _deltaG = 0;
  _deltaB = 0;

  _fromR = 0;
  _fromG = 0;
  _fromB = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration  duration in seconds
   * @param {Number} deltaRed
   * @param {Number} deltaGreen
   * @param {Number} deltaBlue
   */
  constructor(duration, deltaRed, deltaGreen, deltaBlue) {
    super();
    deltaBlue !== undefined &&
      this.initWithDuration(duration, deltaRed, deltaGreen, deltaBlue);
  }

  /**
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} deltaRed 0-255
   * @param {Number} deltaGreen 0-255
   * @param {Number} deltaBlue 0-255
   * @return {Boolean}
   */
  initWithDuration(duration, deltaRed, deltaGreen, deltaBlue) {
    if (super.initWithDuration(duration)) {
      this._deltaR = deltaRed;
      this._deltaG = deltaGreen;
      this._deltaB = deltaBlue;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.TintBy}
   */
  clone() {
    var action = new cc.TintBy();
    this._cloneDecoration(action);
    action.initWithDuration(
      this._duration,
      this._deltaR,
      this._deltaG,
      this._deltaB
    );
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    var color = target.color;
    this._fromR = color.r;
    this._fromG = color.g;
    this._fromB = color.b;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);

    this.target.color = cc.color(
      this._fromR + this._deltaR * dt,
      this._fromG + this._deltaG * dt,
      this._fromB + this._deltaB * dt
    );
  }

  /**
   * Returns a reversed action.
   * @return {cc.TintBy}
   */
  reverse() {
    var action = new cc.TintBy(
      this._duration,
      -this._deltaR,
      -this._deltaG,
      -this._deltaB
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
};

/**
 * Tints a cc.Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @function
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @return {cc.TintBy}
 * @example
 * // example
 * var action = cc.tintBy(2, -127, -255, -127);
 */
cc.tintBy = (duration, deltaRed, deltaGreen, deltaBlue) =>
  new cc.TintBy(duration, deltaRed, deltaGreen, deltaBlue);

/** Delays the action a certain amount of seconds
 * @class
 * @extends cc.ActionInterval
 */
cc.DelayTime = class DelayTime extends cc.ActionInterval {
  /** @lends cc.DelayTime# */
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * Will be overwrite.
   * @param {Number} dt time in seconds
   */
  update(dt) {}

  /**
   * Returns a reversed action.
   * @return {cc.DelayTime}
   */
  reverse() {
    var action = new cc.DelayTime(this._duration);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.DelayTime}
   */
  clone() {
    var action = new cc.DelayTime();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration);
    return action;
  }
};

/**
 * Delays the action a certain amount of seconds
 * @function
 * @param {Number} d duration in seconds
 * @return {cc.DelayTime}
 * @example
 * // example
 * var delay = cc.delayTime(1);
 */
cc.delayTime = (d) => new cc.DelayTime(d);

/**
 * <p>
 * Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * </p>
 * @class
 * @extends cc.ActionInterval
 * @param {cc.FiniteTimeAction} action
 * @example
 *  var reverse = new cc.ReverseTime(this);
 */
cc.ReverseTime = class ReverseTime extends cc.ActionInterval {
  /** @lends cc.ReverseTime# */
  _other = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {cc.FiniteTimeAction} action
   */
  constructor(action) {
    super();
    this._other = null;

    action && this.initWithAction(action);
  }

  /**
   * @param {cc.FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithAction(action) {
    if (!action)
      throw new Error(
        "cc.ReverseTime.initWithAction(): action must be non null"
      );
    if (action === this._other)
      throw new Error(
        "cc.ReverseTime.initWithAction(): the action was already passed in."
      );
    if (super.initWithDuration(action._duration)) {
      // Don't leak if action is reused
      this._other = action;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.ReverseTime}
   */
  clone() {
    var action = new cc.ReverseTime();
    this._cloneDecoration(action);
    action.initWithAction(this._other.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._other.startWithTarget(target);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt time in seconds
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._other) this._other.update(1 - dt);
  }

  /**
   * Returns a reversed action.
   * @return {cc.ActionInterval}
   */
  reverse() {
    return this._other.clone();
  }

  /**
   * Stop the action
   */
  stop() {
    this._other.stop();
    super.stop();
  }
};

/**
 * Executes an action in reverse order, from time=duration to time=0.
 * @function
 * @param {cc.FiniteTimeAction} action
 * @return {cc.ReverseTime}
 * @example
 * // example
 *  var reverse = cc.reverseTime(this);
 */
cc.reverseTime = (action) => new cc.ReverseTime(action);

/**  Animates a sprite given the name of an Animation
 * @class
 * @extends cc.ActionInterval
 * @param {cc.Animation} animation
 * @example
 * // create the animation with animation
 * var anim = new cc.Animate(dance_grey);
 */
cc.Animate = class Animate extends cc.ActionInterval {
  /** @lends cc.Animate# */
  _animation = null;
  _nextFrame = 0;
  _origFrame = null;
  _executedLoops = 0;
  _splitTimes = null;
  _currFrameIndex = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * create the animate with animation.
   * @param {cc.Animation} animation
   */
  constructor(animation) {
    super();
    this._splitTimes = [];

    animation && this.initWithAnimation(animation);
  }

  /**
   * @return {cc.Animation}
   */
  getAnimation() {
    return this._animation;
  }

  /**
   * @param {cc.Animation} animation
   */
  setAnimation(animation) {
    this._animation = animation;
  }

  /**
   * Gets the index of sprite frame currently displayed.
   * @return {Number}
   */
  getCurrentFrameIndex() {
    return this._currFrameIndex;
  }

  /**
   * @param {cc.Animation} animation
   * @return {Boolean}
   */
  initWithAnimation(animation) {
    if (!animation)
      throw new Error(
        "cc.Animate.initWithAnimation(): animation must be non-NULL"
      );
    var singleDuration = animation.getDuration();
    if (this.initWithDuration(singleDuration * animation.getLoops())) {
      this._nextFrame = 0;
      this.setAnimation(animation);

      this._origFrame = null;
      this._executedLoops = 0;
      var locTimes = this._splitTimes;
      locTimes.length = 0;

      var accumUnitsOfTime = 0;
      var newUnitOfTimeValue = singleDuration / animation.getTotalDelayUnits();

      var frames = animation.getFrames();
      cc.arrayVerifyType(frames, cc.AnimationFrame);

      for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        var value = (accumUnitsOfTime * newUnitOfTimeValue) / singleDuration;
        accumUnitsOfTime += frame.getDelayUnits();
        locTimes.push(value);
      }
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.Animate}
   */
  clone() {
    var action = new cc.Animate();
    this._cloneDecoration(action);
    action.initWithAnimation(this._animation.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Sprite} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    if (this._animation.getRestoreOriginalFrame())
      this._origFrame = target.getSpriteFrame();
    this._nextFrame = 0;
    this._executedLoops = 0;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    // if t==1, ignore. Animation should finish with t==1
    if (dt < 1.0) {
      dt *= this._animation.getLoops();

      // new loop?  If so, reset frame counter
      var loopNumber = 0 | dt;
      if (loopNumber > this._executedLoops) {
        this._nextFrame = 0;
        this._executedLoops++;
      }

      // new t for animations
      dt = dt % 1.0;
    }

    var frames = this._animation.getFrames();
    var numberOfFrames = frames.length,
      locSplitTimes = this._splitTimes;
    for (var i = this._nextFrame; i < numberOfFrames; i++) {
      if (locSplitTimes[i] <= dt) {
        _currFrameIndex = i;
        this.target.setSpriteFrame(frames[_currFrameIndex].getSpriteFrame());
        this._nextFrame = i + 1;
      } else {
        // Issue 1438. Could be more than one frame per tick, due to low frame rate or frame delta < 1/FPS
        break;
      }
    }
  }

  /**
   * Returns a reversed action.
   * @return {cc.Animate}
   */
  reverse() {
    var locAnimation = this._animation;
    var oldArray = locAnimation.getFrames();
    var newArray = [];
    cc.arrayVerifyType(oldArray, cc.AnimationFrame);
    if (oldArray.length > 0) {
      for (var i = oldArray.length - 1; i >= 0; i--) {
        var element = oldArray[i];
        if (!element) break;
        newArray.push(element.clone());
      }
    }
    var newAnim = new cc.Animation(
      newArray,
      locAnimation.getDelayPerUnit(),
      locAnimation.getLoops()
    );
    newAnim.setRestoreOriginalFrame(locAnimation.getRestoreOriginalFrame());
    var action = new cc.Animate(newAnim);
    this._cloneDecoration(action);
    this._reverseEaseList(action);

    return action;
  }

  /**
   * stop the action
   */
  stop() {
    if (this._animation.getRestoreOriginalFrame() && this.target)
      this.target.setSpriteFrame(this._origFrame);
    super.stop();
  }
};

/**
 * create the animate with animation
 * @function
 * @param {cc.Animation} animation
 * @return {cc.Animate}
 * @example
 * // example
 * // create the animation with animation
 * var anim = cc.animate(dance_grey);
 */
cc.animate = (animation) => new cc.Animate(animation);

/**
 * <p>
 *     Overrides the target of an action so that it always runs on the target<br/>
 *     specified at action creation rather than the one specified by runAction.
 * </p>
 * @class
 * @extends cc.ActionInterval
 * @param {cc.Node} target
 * @param {cc.FiniteTimeAction} action
 */
cc.TargetedAction = class TargetedAction extends cc.ActionInterval {
  /** @lends cc.TargetedAction# */
  _action = null;
  _forcedTarget = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create an action with the specified action and forced target.
   * @param {cc.Node} target
   * @param {cc.FiniteTimeAction} action
   */
  constructor(target, action) {
    super();
    action && this.initWithTarget(target, action);
  }

  /**
   * Init an action with the specified action and forced target
   * @param {cc.Node} target
   * @param {cc.FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithTarget(target, action) {
    if (this.initWithDuration(action._duration)) {
      this._forcedTarget = target;
      this._action = action;
      return true;
    }
    return false;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.TargetedAction}
   */
  clone() {
    var action = new cc.TargetedAction();
    this._cloneDecoration(action);
    action.initWithTarget(this._forcedTarget, this._action.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._action.startWithTarget(this._forcedTarget);
  }

  /**
   * stop the action
   */
  stop() {
    this._action.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    this._action.update(dt);
  }

  /**
   * return the target that the action will be forced to run with
   * @return {cc.Node}
   */
  getForcedTarget() {
    return this._forcedTarget;
  }

  /**
   * set the target that the action will be forced to run with
   * @param {cc.Node} forcedTarget
   */
  setForcedTarget(forcedTarget) {
    if (this._forcedTarget !== forcedTarget) this._forcedTarget = forcedTarget;
  }
};

/**
 * Create an action with the specified action and forced target
 * @function
 * @param {cc.Node} target
 * @param {cc.FiniteTimeAction} action
 * @return {cc.TargetedAction}
 */
cc.targetedAction = (target, action) => new cc.TargetedAction(target, action);

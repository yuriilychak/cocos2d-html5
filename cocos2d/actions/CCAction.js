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

/** Default Action tag
 * @constant
 * @type {Number}
 * @default
 */
cc.ACTION_TAG_INVALID = -1;

/**
 * Base class for cc.Action objects.
 * @class
 *
 * @extends cc.Class
 *
 * @property {cc.Node}  target          - The target will be set with the 'startWithTarget' method. When the 'stop' method is called, target will be set to nil.
 * @property {cc.Node}  originalTarget  - The original target of the action.
 * @property {Number}   tag             - The tag of the action, can be used to find the action.
 */
cc.Action = class Action extends cc.NewClass {
  /** @lends cc.Action# */
  //***********variables*************
  originalTarget = null;
  target = null;
  tag = cc.ACTION_TAG_INVALID;

  //**************Public Functions***********

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   */
  constructor() {
    super();
    this.originalTarget = null;
    this.target = null;
    this.tag = cc.ACTION_TAG_INVALID;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.Action}
   */
  clone() {
    return new cc.Action();
  }

  /**
   * return true if the action has finished.
   *
   * @return {Boolean}
   */
  isDone() {
    return true;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    this.originalTarget = target;
    this.target = target;
  }

  /**
   * called after the action has finished. It will set the 'target' to nil. <br />
   * IMPORTANT: You should never call "action stop" manually. Instead, use: "target.stopAction(action);"
   */
  stop() {
    this.target = null;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    cc.log("[Action step]. override me");
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    cc.log("[Action update]. override me");
  }

  /**
   * get the target.
   *
   * @return {cc.Node}
   */
  getTarget() {
    return this.target;
  }

  /**
   * The action will modify the target properties.
   *
   * @param {cc.Node} target
   */
  setTarget(target) {
    this.target = target;
  }

  /**
   * get the original target.
   *
   * @return {cc.Node}
   */
  getOriginalTarget() {
    return this.originalTarget;
  }

  /**
   * Set the original target, since target can be nil. <br/>
   * Is the target that were used to run the action.  <br/>
   * Unless you are doing something complex, like cc.ActionManager, you should NOT call this method. <br/>
   * The target is 'assigned', it is not 'retained'. <br/>
   * @param {cc.Node} originalTarget
   */
  setOriginalTarget(originalTarget) {
    this.originalTarget = originalTarget;
  }

  /**
   * get tag number.
   * @return {Number}
   */
  getTag() {
    return this.tag;
  }

  /**
   * set tag number.
   * @param {Number} tag
   */
  setTag(tag) {
    this.tag = tag;
  }
};

/**
 * Allocates and initializes the action.
 *
 * @function cc.action
 * @static
 * @return {cc.Action}
 *
 * @example
 * // return {cc.Action}
 * var action = cc.action();
 */
cc.action = () => new cc.Action();

/**
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 * @class
 * @extends cc.Action
 */
cc.FiniteTimeAction = class FiniteTimeAction extends cc.Action {
  /** @lends cc.FiniteTimeAction# */
  // duration in seconds
  _duration = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   */
  constructor() {
    super();
    this._duration = 0;
  }

  /**
   * get duration of the action. (seconds)
   *
   * @return {Number}
   */
  getDuration() {
    return this._duration * (this._timesForRepeat || 1);
  }

  /**
   * set duration of the action. (seconds)
   *
   * @param {Number} duration
   */
  setDuration(duration) {
    this._duration = duration;
  }

  /**
   * Returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   *
   * @return {?cc.Action}
   */
  reverse() {
    cc.log("cocos2d: FiniteTimeAction#reverse: Implement me");
    return null;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.FiniteTimeAction}
   */
  clone() {
    return new cc.FiniteTimeAction();
  }
};

/**
 * Changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 *
 * @warning This action can't be Sequenceable because it is not an cc.IntervalAction
 * @class
 * @extends cc.Action
 * @param {cc.ActionInterval} action
 * @param {Number} speed
 */
cc.Speed = class Speed extends cc.Action {
  /** @lends cc.Speed# */
  _speed = 0.0;
  _innerAction = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {cc.ActionInterval} action
   * @param {Number} speed
   */
  constructor(action, speed) {
    super();
    this._speed = 0;
    this._innerAction = null;

    action && this.initWithAction(action, speed);
  }

  /**
   * Gets the current running speed. <br />
   * Will get a percentage number, compared to the original speed.
   *
   * @return {Number}
   */
  getSpeed() {
    return this._speed;
  }

  /**
   * alter the speed of the inner function in runtime.
   *
   * @param {Number} speed
   */
  setSpeed(speed) {
    this._speed = speed;
  }

  /**
   * initializes the action.
   *
   * @param {cc.ActionInterval} action
   * @param {Number} speed
   * @return {Boolean}
   */
  initWithAction(action, speed) {
    if (!action)
      throw new Error("cc.Speed.initWithAction(): action must be non nil");

    this._innerAction = action;
    this._speed = speed;
    return true;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @returns {cc.Speed}
   */
  clone() {
    var action = new cc.Speed();
    action.initWithAction(this._innerAction.clone(), this._speed);
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._innerAction.startWithTarget(target);
  }

  /**
   *  Stop the action.
   */
  stop() {
    this._innerAction.stop();
    super.stop();
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    this._innerAction.step(dt * this._speed);
  }

  /**
   * return true if the action has finished.
   *
   * @return {Boolean}
   */
  isDone() {
    return this._innerAction.isDone();
  }

  /**
   * returns a reversed action. <br />
   * For example: <br />
   * - The action will be x coordinates of 0 move to 100. <br />
   * - The reversed action will be x of 100 move to 0.
   * - Will be rewritten
   *
   * @return {cc.Speed}
   */
  reverse() {
    return new cc.Speed(this._innerAction.reverse(), this._speed);
  }

  /**
   * Set inner Action.
   * @param {cc.ActionInterval} action
   */
  setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  }

  /**
   * Get inner Action.
   *
   * @return {cc.ActionInterval}
   */
  getInnerAction() {
    return this._innerAction;
  }
};

/**
 * creates the speed action.
 *
 * @function cc.speed
 * @param {cc.ActionInterval} action
 * @param {Number} speed
 * @return {cc.Speed}
 */
cc.speed = (action, speed) => new cc.Speed(action, speed);

/**
 * cc.Follow is an action that "follows" a node.
 *
 * @example
 * //example
 * //Instead of using cc.Camera as a "follower", use this action instead.
 * layer.runAction(cc.follow(hero));
 *
 * @property {Number}  leftBoundary - world leftBoundary.
 * @property {Number}  rightBoundary - world rightBoundary.
 * @property {Number}  topBoundary - world topBoundary.
 * @property {Number}  bottomBoundary - world bottomBoundary.
 *
 * @param {cc.Node} followedNode
 * @param {cc.Rect} rect
 * @example
 * // creates the action with a set boundary
 * var sprite = new cc.Sprite("spriteFileName");
 * var followAction = new cc.Follow(sprite, cc.rect(0, 0, s.width * 2 - 100, s.height));
 * this.runAction(followAction);
 *
 * // creates the action with no boundary set
 * var sprite = new cc.Sprite("spriteFileName");
 * var followAction = new cc.Follow(sprite);
 * this.runAction(followAction);
 *
 * @class
 * @extends cc.Action
 */
cc.Follow = class Follow extends cc.Action {
  /** @lends cc.Follow# */
  // node to follow
  _followedNode = null;
  // whether camera should be limited to certain area
  _boundarySet = false;
  // if screen size is bigger than the boundary - update not needed
  _boundaryFullyCovered = false;
  // fast access to the screen dimensions
  _halfScreenSize = null;
  _fullScreenSize = null;
  _worldRect = null;

  leftBoundary = 0.0;
  rightBoundary = 0.0;
  topBoundary = 0.0;
  bottomBoundary = 0.0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * creates the action with a set boundary. <br/>
   * creates the action with no boundary set.
   * @param {cc.Node} followedNode
   * @param {cc.Rect} rect
   */
  constructor(followedNode, rect) {
    super();
    this._followedNode = null;
    this._boundarySet = false;

    this._boundaryFullyCovered = false;
    this._halfScreenSize = null;
    this._fullScreenSize = null;

    this.leftBoundary = 0.0;
    this.rightBoundary = 0.0;
    this.topBoundary = 0.0;
    this.bottomBoundary = 0.0;
    this._worldRect = cc.rect(0, 0, 0, 0);

    if (followedNode)
      rect
        ? this.initWithTarget(followedNode, rect)
        : this.initWithTarget(followedNode);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.Follow}
   */
  clone() {
    const action = new cc.Follow();
    const locRect = this._worldRect;
    const rect = new cc.Rect(
      locRect.x,
      locRect.y,
      locRect.width,
      locRect.height
    );
    action.initWithTarget(this._followedNode, rect);
    return action;
  }

  /**
   * Get whether camera should be limited to certain area.
   *
   * @return {Boolean}
   */
  isBoundarySet() {
    return this._boundarySet;
  }

  /**
   * alter behavior - turn on/off boundary.
   *
   * @param {Boolean} value
   */
  setBoudarySet(value) {
    this._boundarySet = value;
  }

  /**
   * initializes the action with a set boundary.
   *
   * @param {cc.Node} followedNode
   * @param {cc.Rect} [rect]
   * @return {Boolean}
   */
  initWithTarget(followedNode, rect) {
    if (!followedNode)
      throw new Error(
        "cc.Follow.initWithAction(): followedNode must be non nil"
      );

    rect = rect || cc.rect(0, 0, 0, 0);
    this._followedNode = followedNode;
    this._worldRect = rect;

    this._boundarySet = !cc._rectEqualToZero(rect);

    this._boundaryFullyCovered = false;

    const winSize = cc.director.getWinSize();
    this._fullScreenSize = cc.p(winSize.width, winSize.height);
    this._halfScreenSize = cc.pMult(this._fullScreenSize, 0.5);

    if (this._boundarySet) {
      this.leftBoundary = -(rect.x + rect.width - this._fullScreenSize.x);
      this.rightBoundary = -rect.x;
      this.topBoundary = -rect.y;
      this.bottomBoundary = -(rect.y + rect.height - this._fullScreenSize.y);

      if (this.rightBoundary < this.leftBoundary) {
        // screen width is larger than world's boundary width
        //set both in the middle of the world
        this.rightBoundary = this.leftBoundary =
          (this.leftBoundary + this.rightBoundary) / 2;
      }
      if (this.topBoundary < this.bottomBoundary) {
        // screen width is larger than world's boundary width
        //set both in the middle of the world
        this.topBoundary = this.bottomBoundary =
          (this.topBoundary + this.bottomBoundary) / 2;
      }

      if (
        this.topBoundary === this.bottomBoundary &&
        this.leftBoundary === this.rightBoundary
      )
        this._boundaryFullyCovered = true;
    }
    return true;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    let tempPosX = this._followedNode.x;
    let tempPosY = this._followedNode.y;
    tempPosX = this._halfScreenSize.x - tempPosX;
    tempPosY = this._halfScreenSize.y - tempPosY;

    //TODO Temporary treatment - The dirtyFlag symbol error
    this.target._renderCmd._dirtyFlag = 0;

    if (this._boundarySet) {
      // whole map fits inside a single screen, no need to modify the position - unless map boundaries are increased
      if (this._boundaryFullyCovered) return;

      this.target.setPosition(
        cc.clampf(tempPosX, this.leftBoundary, this.rightBoundary),
        cc.clampf(tempPosY, this.bottomBoundary, this.topBoundary)
      );
    } else {
      this.target.setPosition(tempPosX, tempPosY);
    }
  }

  /**
   * Return true if the action has finished.
   *
   * @return {Boolean}
   */
  isDone() {
    return !this._followedNode.running;
  }

  /**
   * Stop the action.
   */
  stop() {
    this.target = null;
    super.stop();
  }
};

/**
 * creates the action with a set boundary. <br/>
 * creates the action with no boundary set.
 *
 * @function
 * @param {cc.Node} followedNode
 * @param {cc.Rect} rect
 * @return {cc.Follow|Null} returns the cc.Follow object on success
 * @example
 * // example
 * // creates the action with a set boundary
 * var sprite = new cc.Sprite("spriteFileName");
 * var followAction = cc.follow(sprite, cc.rect(0, 0, s.width * 2 - 100, s.height));
 * this.runAction(followAction);
 *
 * // creates the action with no boundary set
 * var sprite = new cc.Sprite("spriteFileName");
 * var followAction = cc.follow(sprite);
 * this.runAction(followAction);
 */
cc.follow = function (followedNode, rect) {
  return new cc.Follow(followedNode, rect);
};

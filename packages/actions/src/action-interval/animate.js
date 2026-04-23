import ActionInterval from "./action-interval";

/**  Animates a sprite given the name of an Animation
 * @param {Animation} animation
 * @example
 * // create the animation with animation
 * var anim = new Animate(dance_grey);
 */
export default class Animate extends ActionInterval {
  _animation = null;
  _nextFrame = 0;
  _origFrame = null;
  _executedLoops = 0;
  _splitTimes = null;
  _currFrameIndex = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * create the animate with animation.
   * @param {Animation} animation
   */
  constructor(animation) {
    super();
    this._splitTimes = [];

    animation && this.initWithAnimation(animation);
  }

  /**
   * @return {Animation}
   */
  getAnimation() {
    return this._animation;
  }

  /**
   * @param {Animation} animation
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
   * @param {Animation} animation
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
   * @returns {Animate}
   */
  clone() {
    var action = new Animate();
    this._cloneDecoration(action);
    action.initWithAnimation(this._animation.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {Sprite} target
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
        this._currFrameIndex = i;
        this.target.setSpriteFrame(
          frames[this._currFrameIndex].getSpriteFrame()
        );
        this._nextFrame = i + 1;
      } else {
        // Issue 1438. Could be more than one frame per tick, due to low frame rate or frame delta < 1/FPS
        break;
      }
    }
  }

  /**
   * Returns a reversed action.
   * @return {Animate}
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
    var action = new Animate(newAnim);
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
}

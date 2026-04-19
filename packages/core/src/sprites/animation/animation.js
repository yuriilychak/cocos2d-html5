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

import { NewClass } from "../../platform/class";
import { AnimationFrame } from "./animation-frame";
import { Rect } from "../../cocoa/geometry/rect";

/**
 * <p>
 *     A cc.Animation object is used to perform animations on the cc.Sprite objects.<br/>
 *     <br/>
 *      The cc.Animation object contains cc.SpriteFrame objects, and a possible delay between the frames. <br/>
 *      You can animate a cc.Animation object by using the cc.Animate action.
 * </p>
 * @class
 * @extends cc.Class
 * @param {Array} frames
 * @param {Number} delay
 * @param {Number} [loops=1]
 *
 * @example
 * // 1. Creates an empty animation
 * var animation1 = new cc.Animation();
 *
 * // 2. Create an animation with sprite frames, delay and loops.
 * var spriteFrames = [];
 * var frame = cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png");
 * spriteFrames.push(frame);
 * var animation1 = new cc.Animation(spriteFrames);
 * var animation2 = new cc.Animation(spriteFrames, 0.2);
 * var animation2 = new cc.Animation(spriteFrames, 0.2, 2);
 *
 * // 3. Create an animation with animation frames, delay and loops.
 * var animationFrames = [];
 * var frame =  new cc.AnimationFrame();
 * animationFrames.push(frame);
 * var animation1 = new cc.Animation(animationFrames);
 * var animation2 = new cc.Animation(animationFrames, 0.2);
 * var animation3 = new cc.Animation(animationFrames, 0.2, 2);
 *
 * //create an animate with this animation
 * var action = cc.animate(animation1);
 *
 * //run animate
 * sprite.runAction(action);
 */
export class Animation extends NewClass {
  constructor(frames, delay, loops) {
    super();
    this._frames = null;
    this._loops = 0;
    this._restoreOriginalFrame = false;
    this._duration = 0;
    this._delayPerUnit = 0;
    this._totalDelayUnits = 0;
    this._frames = [];

    if (frames === undefined) {
      this.initWithSpriteFrames(null, 0);
    } else {
      var frame0 = frames[0];
      if (frame0) {
        if (frame0 instanceof cc.SpriteFrame) {
          //init with sprite frames , delay and loops.
          this.initWithSpriteFrames(frames, delay, loops);
        } else if (frame0 instanceof AnimationFrame) {
          //init with sprite frames , delay and loops.
          this.initWithAnimationFrames(frames, delay, loops);
        }
      }
    }
  }

  // attributes

  /**
   * Returns the array of animation frames
   * @return {Array}
   */
  getFrames() {
    return this._frames;
  }

  /**
   * Sets array of animation frames
   * @param {Array} frames
   */
  setFrames(frames) {
    this._frames = frames;
  }

  /**
   * Adds a frame to a cc.Animation, the frame will be added with one "delay unit".
   * @param {SpriteFrame} frame
   */
  addSpriteFrame(frame) {
    var animFrame = new AnimationFrame();

    animFrame.initWithSpriteFrame(frame, 1, null);
    this._frames.push(animFrame);
    // update duration
    this._totalDelayUnits++;
  }

  /**
   * Adds a frame with an image filename. Internally it will create a cc.SpriteFrame and it will add it. The frame will be added with one "delay unit".
   * @param {String} fileName
   */
  addSpriteFrameWithFile(fileName) {
    var texture = cc.textureCache.addImage(fileName);
    var rect = new Rect(0, 0, 0, 0);
    rect.width = texture.width;
    rect.height = texture.height;
    var frame = new cc.SpriteFrame(texture, rect);
    this.addSpriteFrame(frame);
  }

  /**
   * Adds a frame with a texture and a rect. Internally it will create a cc.SpriteFrame and it will add it. The frame will be added with one "delay unit".
   * @param {Texture2D} texture
   * @param {Rect} rect
   */
  addSpriteFrameWithTexture(texture, rect) {
    var pFrame = new cc.SpriteFrame(texture, rect);
    this.addSpriteFrame(pFrame);
  }

  /**
   * Initializes a cc.Animation with cc.AnimationFrame, do not call this method yourself, please pass parameters to constructor to initialize.
   * @param {Array} arrayOfAnimationFrames
   * @param {Number} delayPerUnit
   * @param {Number} [loops=1]
   */
  initWithAnimationFrames(arrayOfAnimationFrames, delayPerUnit, loops) {
    cc.arrayVerifyType(arrayOfAnimationFrames, AnimationFrame);

    this._delayPerUnit = delayPerUnit;
    this._loops = loops === undefined ? 1 : loops;
    this._totalDelayUnits = 0;

    var locFrames = this._frames;
    locFrames.length = 0;
    for (var i = 0; i < arrayOfAnimationFrames.length; i++) {
      var animFrame = arrayOfAnimationFrames[i];
      locFrames.push(animFrame);
      this._totalDelayUnits += animFrame.getDelayUnits();
    }

    return true;
  }

  /**
   * Clone the current animation
   * @return {Animation}
   */
  clone() {
    var animation = new Animation();
    animation.initWithAnimationFrames(
      this._copyFrames(),
      this._delayPerUnit,
      this._loops
    );
    animation.setRestoreOriginalFrame(this._restoreOriginalFrame);
    return animation;
  }

  /**
   * Clone the current animation
   * @return {Animation}
   */
  copyWithZone(pZone) {
    var pCopy = new Animation();
    pCopy.initWithAnimationFrames(
      this._copyFrames(),
      this._delayPerUnit,
      this._loops
    );
    pCopy.setRestoreOriginalFrame(this._restoreOriginalFrame);
    return pCopy;
  }

  _copyFrames() {
    var copyFrames = [];
    for (var i = 0; i < this._frames.length; i++)
      copyFrames.push(this._frames[i].clone());
    return copyFrames;
  }

  /**
   * Clone the current animation
   * @param pZone
   * @returns {Animation}
   */
  copy(pZone) {
    return this.copyWithZone(null);
  }

  /**
   * Returns how many times the animation is going to loop. 0 means animation is not animated. 1, animation is executed one time, ...
   * @return {Number}
   */
  getLoops() {
    return this._loops;
  }

  /**
   * Sets how many times the animation is going to loop. 0 means animation is not animated. 1, animation is executed one time, ...
   * @param {Number} value
   */
  setLoops(value) {
    this._loops = value;
  }

  /**
   * Sets whether or not it shall restore the original frame when the animation finishes
   * @param {Boolean} restOrigFrame
   */
  setRestoreOriginalFrame(restOrigFrame) {
    this._restoreOriginalFrame = restOrigFrame;
  }

  /**
   * Returns whether or not it shall restore the original frame when the animation finishes
   * @return {Boolean}
   */
  getRestoreOriginalFrame() {
    return this._restoreOriginalFrame;
  }

  /**
   * Returns duration in seconds of the whole animation. It is the result of totalDelayUnits * delayPerUnit
   * @return {Number}
   */
  getDuration() {
    return this._totalDelayUnits * this._delayPerUnit;
  }

  /**
   * Returns delay in seconds of the "delay unit"
   * @return {Number}
   */
  getDelayPerUnit() {
    return this._delayPerUnit;
  }

  /**
   * Sets delay in seconds of the "delay unit"
   * @param {Number} delayPerUnit
   */
  setDelayPerUnit(delayPerUnit) {
    this._delayPerUnit = delayPerUnit;
  }

  /**
   * Returns total delay units of the cc.Animation.
   * @return {Number}
   */
  getTotalDelayUnits() {
    return this._totalDelayUnits;
  }

  /**
   * Initializes a cc.Animation with frames and a delay between frames, do not call this method yourself, please pass parameters to constructor to initialize.
   * @param {Array} frames
   * @param {Number} delay
   * @param {Number} [loops=1]
   */
  initWithSpriteFrames(frames, delay, loops) {
    cc.arrayVerifyType(frames, cc.SpriteFrame);
    this._loops = loops === undefined ? 1 : loops;
    this._delayPerUnit = delay || 0;
    this._totalDelayUnits = 0;

    var locFrames = this._frames;
    locFrames.length = 0;
    if (frames) {
      for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        var animFrame = new AnimationFrame();
        animFrame.initWithSpriteFrame(frame, 1, null);
        locFrames.push(animFrame);
      }
      this._totalDelayUnits += frames.length;
    }
    return true;
  }
}

/****************************************************************************
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

import { BLEND_DST, BLEND_SRC, BlendFunc } from "@aspect/core";
import { BaseData } from "./base-data.js";

import { TweenType } from "../../animation/tween-function/constants.js";
/**
 * FrameData saved the frame data needed for armature animation in this Armature.
 *
 * @property {Number}                    duration                - the duration of frame
 * @property {Number}                    tweenEasing             - the easing type of frame
 * @property {Number}                    easingParamNumber       - the count of easing parameters.
 * @property {Object}                    easingParams            - the dictionary of easing parameters.
 * @property {Number}                    displayIndex            - the display renderer index.
 * @property {String}                    movement                - the movement name.
 * @property {String}                    event                   - the event name
 * @property {String}                    sound                   - the sound path.
 * @property {String}                    soundEffect             - the sound effect path.
 * @property {Object}                    blendFunc               - the blendFunc of frame.
 * @property {Number}                    frameID                 - the frame ID of frame
 * @property {Boolean}                   isTween                 - the flag which frame whether is tween.
 */
export class FrameData extends BaseData {
  /**
   * Construction of FrameData.
   */
  constructor() {
    super();
    this.duration = 1;
    this.tweenEasing = TweenType.LINEAR;
    this.easingParamNumber = 0;
    this.easingParams = [];
    this.displayIndex = 0;
    this.movement = "";
    this.event = "";
    this.sound = "";
    this.soundEffect = "";
    this.blendFunc = new BlendFunc(BLEND_SRC, BLEND_DST);
    this.frameID = 0;
    this.isTween = true;
  }

  /**
   * copy data
   * @function
   * @param frameData
   */
  copy(frameData) {
    super.copy(frameData);
    this.duration = frameData.duration;
    this.displayIndex = frameData.displayIndex;

    this.tweenEasing = frameData.tweenEasing;
    this.easingParamNumber = frameData.easingParamNumber;

    //            this.movement = frameData.movement;
    //            this.event = frameData.event;
    //            this.sound = frameData.sound;
    //            this.soundEffect = frameData.soundEffect;
    //            this.easingParams.length = 0;
    if (this.easingParamNumber !== 0) {
      this.easingParams.length = 0;
      for (var i = 0; i < this.easingParamNumber; i++) {
        this.easingParams[i] = frameData.easingParams[i];
      }
    }
    this.blendFunc = frameData.blendFunc;
    this.isTween = frameData.isTween;
  }
};


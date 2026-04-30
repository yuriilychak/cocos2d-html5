/****************************************************************************
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
 * Timeline Frame.
 * base class
 */
import { NewClass } from "@aspect/core";
import { _easeBackInObj, _easeBackInOutObj, _easeBackOutObj, _easeBounceInObj, _easeBounceInOutObj, _easeBounceOutObj, _easeCircleActionIn, _easeCircleActionInOut, _easeCircleActionOut, _easeCubicActionIn, _easeCubicActionInOut, _easeCubicActionOut, _easeExponentialInObj, _easeExponentialInOutObj, _easeExponentialOutObj, _easeQuadraticActionIn, _easeQuadraticActionInOut, _easeQuadraticActionOut, _easeQuinticActionIn, _easeQuinticActionInOut, _easeQuinticActionOut, _easeSineInObj, _easeSineInOutObj, _easeSineOutObj, easeElasticIn, easeElasticInOut, easeElasticOut } from "@aspect/actions";

export class Frame extends NewClass {
  constructor() {
    super();
    this._frameIndex = 0;
    this._tween = true;
    this._timeline = null;
    this._node = null;
    this._enterWhenPassed = false;
    this._easingParam = [];
  }

  _emitEvent() {
    if (this._timeline) {
      this._timeline.getActionTimeline()._emitFrameEvent(this);
    }
  }

  _cloneProperty(frame) {
    this._frameIndex = frame.getFrameIndex();
    this._tween = frame.isTween();
    this._tweenType = frame.getTweenType();
    this.setEasingParams(frame.getEasingParams());
  }

  /**
   * Set the frame index
   * @param {number} frameIndex
   */
  setFrameIndex(frameIndex) {
    this._frameIndex = frameIndex;
  }

  /**
   * Get the frame index
   * @returns {null}
   */
  getFrameIndex() {
    return this._frameIndex;
  }

  /**
   * Set timeline
   * @param timeline
   */
  setTimeline(timeline) {
    this._timeline = timeline;
  }

  /**
   * Get timeline
   * @param timeline
   * @returns {timeline}
   */
  getTimeline(timeline) {
    return this._timeline;
  }

  /**
   * Set Node
   * @param {Node} node
   */
  setNode(node) {
    this._node = node;
  }

  /**
   * gets the Node
   * @return node
   */
  getNode() {
    return this._node;
  }

  /**
   * set tween
   * @param tween
   */
  setTween(tween) {
    this._tween = tween;
  }

  /**
   * Gets the tween
   * @returns {boolean | null}
   */
  isTween() {
    return this._tween;
  }

  /**
   * the execution of the callback
   * @override
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    // = 0
  }

  /**
   * Each frame logic
   * @override
   * @param {number} percent
   */
  apply(percent) {
    if (!this._tween) return;
    if (
      this._tweenType !== ccs.FrameEaseType.TWEEN_EASING_MAX &&
      this._tweenType !== ccs.FrameEaseType.LINEAR
    )
      percent = this.tweenPercent(percent);
    this._onApply(percent);
  }

  _onApply(percent) {}

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @override
   * @return {Frame}
   */
  clone() {
    // = 0
  }

  tweenPercent(percent) {
    var func = ccs.Frame.tweenToMap[this._tweenType];
    if (func) return func(percent, this._easingParam);
    else return percent;
  }

  setEasingParams(easingParams) {
    if (easingParams) {
      this._easingParam.length = 0;
      for (var i = 0; i < easingParams.length; i++)
        this._easingParam[i] = easingParams[i];
    }
  }

  getEasingParams() {
    return this._easingParam;
  }

  setTweenType(tweenType) {
    this._tweenType = tweenType;
  }

  getTweenType() {
    return this._tweenType;
  }

  isEnterWhenPassed() {
    return this._enterWhenPassed;
  }
};

ccs.Frame = Frame;

ccs.Frame.tweenToMap = {
  "-1": function (time, easingParam) {
    if (easingParam) {
      var tt = 1 - time;
      return (
        easingParam[1] * tt * tt * tt +
        3 * easingParam[3] * time * tt * tt +
        3 * easingParam[5] * time * time * tt +
        easingParam[7] * time * time * time
      );
    }
    return time;
  },
  1: _easeSineInObj.easing, //Sine_EaseIn
  2: _easeSineOutObj.easing, //Sine_EaseOut
  3: _easeSineInOutObj.easing, //Sine_EaseInOut

  4: _easeQuadraticActionIn.easing, //Quad_EaseIn
  5: _easeQuadraticActionOut.easing, //Quad_EaseOut
  6: _easeQuadraticActionInOut.easing, //Quad_EaseInOut

  7: _easeCubicActionIn.easing, //Cubic_EaseIn
  8: _easeCubicActionOut.easing, //Cubic_EaseOut
  9: _easeCubicActionInOut.easing, //Cubic_EaseInOut

  10: _easeCubicActionIn.easing, //Cubic_EaseIn
  11: _easeCubicActionOut.easing, //Cubic_EaseOut
  12: _easeCubicActionInOut.easing, //Cubic_EaseInOut

  13: _easeQuinticActionIn.easing, //Quint_EaseIn
  14: _easeQuinticActionOut.easing, //Quint_EaseOut
  15: _easeQuinticActionInOut.easing, //Quint_EaseInOut

  16: _easeExponentialInObj.easing, //Expo_EaseIn
  17: _easeExponentialOutObj.easing, //Expo_EaseOut
  18: _easeExponentialInOutObj.easing, //Expo_EaseInOut

  19: _easeCircleActionIn.easing, //Circ_EaseIn
  20: _easeCircleActionOut.easing, //Circ_EaseOut
  21: _easeCircleActionInOut.easing, //Circ_EaseInOut

  22: function (time, easingParam) {
    var period = 0.3;
    easingParam != null && (period = easingParam[0]);
    return easeElasticIn(period).easing(time);
  }, //Elastic_EaesIn
  23: function (time, easingParam) {
    var period = 0.3;
    easingParam != null && (period = easingParam[0]);
    return easeElasticOut(period).easing(time);
  }, //Elastic_EaesOut
  24: function (time, easingParam) {
    var period = 0.3;
    easingParam != null && (period = easingParam[0]);
    return easeElasticInOut(period).easing(time);
  }, //Elastic_EaesInOut

  25: _easeBackInObj.easing, //Back_EaseIn
  26: _easeBackOutObj.easing, //Back_EaseOut
  27: _easeBackInOutObj.easing, //Back_EaseInOut

  28: _easeBounceInObj.easing, //Bounce_EaseIn
  29: _easeBounceOutObj.easing, //Bounce_EaseOut
  30: _easeBounceInOutObj.easing //Bounce_EaseInOut
};

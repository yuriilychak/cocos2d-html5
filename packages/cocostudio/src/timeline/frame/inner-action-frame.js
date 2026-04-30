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

import { log } from "@aspect/core";
import { Frame } from "./frame.js";

/**
 * Inner action frame
 * @extend Frame
 */
export class InnerActionFrame extends Frame {
  constructor() {
    super();

    this._endFrameIndex = 0;
    this._singleFrameIndex = 0;
    this._animationName = "";
    this._enterWithName = false;
    this._innerActionType = ccs.InnerActionType.LoopAction;
    this._startFrameIndex = 0;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    var innerActiontimeline = this._node.getActionByTag(this._node.getTag());
    if (!innerActiontimeline) return;
    if (ccs.InnerActionType.SingleFrame === this._innerActionType) {
      innerActiontimeline.gotoFrameAndPause(this._singleFrameIndex);
      return;
    }

    var innerStart = this._startFrameIndex;
    var innerEnd = this._endFrameIndex;
    if (this._enterWithName) {
      if (this._animationName === "-- ALL --") {
        innerStart = 0;
        innerEnd = innerActiontimeline.getDuration();
      } else if (
        innerActiontimeline.isAnimationInfoExists(this._animationName)
      ) {
        var info = innerActiontimeline.getAnimationInfo(this._animationName);
        innerStart = info.startIndex;
        innerEnd = info.endIndex;
      } else {
        log("Animation %s not exists!", this._animationName);
      }
    }

    var duration = this._timeline.getActionTimeline().getDuration();
    var odddiff = duration - this._frameIndex - innerEnd + innerStart;
    if (odddiff < 0) {
      innerEnd += odddiff;
    }

    if (ccs.InnerActionType.NoLoopAction === this._innerActionType) {
      innerActiontimeline.gotoFrameAndPlay(innerStart, innerEnd, false);
    } else if (ccs.InnerActionType.LoopAction === this._innerActionType) {
      innerActiontimeline.gotoFrameAndPlay(innerStart, innerEnd, true);
    }
  }

  setAnimationName(animationName) {
    this._animationName = animationName;
  }

  setSingleFrameIndex(frameIndex) {
    this._singleFrameIndex = frameIndex;
  }

  getSingleFrameIndex() {
    return this._startFrameIndex;
  }

  setEnterWithName(isEnterWithName) {
    this._enterWithName = isEnterWithName;
  }

  getEnterWithName() {
    return this._enterWithName;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {InnerActionFrame}
   */
  clone() {
    var frame = new ccs.InnerActionFrame();
    frame.setInnerActionType(this._innerActionType);
    frame.setStartFrameIndex(this._startFrameIndex);
    frame.setEnterWithName(this._enterWithName);
    frame.setAnimationName(this._animationName);
    frame.setSingleFrameIndex(this._singleFrameIndex);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the inner action type
   * @param {InnerActionType} type
   */
  setInnerActionType(type) {
    this._innerActionType = type;
  }

  /**
   * Gets the inner action type
   * @returns {InnerActionType}
   */
  getInnerActionType() {
    return this._innerActionType;
  }

  /**
   * Set the start frame index
   * @param {Number} frameIndex
   */
  setStartFrameIndex(frameIndex) {
    this._startFrameIndex = frameIndex;
  }

  /**
   * Get the start frame index
   * @returns {Number}
   */
  getStartFrameIndex() {
    return this._startFrameIndex;
  }
};

ccs.InnerActionFrame = InnerActionFrame;

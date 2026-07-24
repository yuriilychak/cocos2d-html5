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

import { SkewFrame } from "./skew-frame.js";


/**
 * Rotation skew frame
 * @extend SkewFrame
 */
export class RotationSkewFrame extends SkewFrame {

  constructor(skew = null) {
    super(skew);
  }
  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.rotationX = this.skewX;
    this._node.rotationY = this.skewY;

    if (this._tween) {
      this._betweenSkewX = nextFrame.skewX - this.skewX;
      this._betweenSkewY = nextFrame.skewY - this.skewY;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (this._node && (this._betweenSkewX !== 0 || this._betweenSkewY !== 0)) {
      this._node.rotationX = this.skewX + percent * this._betweenSkewX;
      this._node.rotationY = this.skewY + percent * this._betweenSkewY;
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {RotationSkewFrame}
   */
  clone() {
    var frame = new RotationSkewFrame(this.skew);

    frame._cloneProperty(this);

    return frame;
  }
};


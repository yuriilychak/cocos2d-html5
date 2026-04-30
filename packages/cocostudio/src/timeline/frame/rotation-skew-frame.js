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
  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.setRotationX(this._skewX);
    this._node.setRotationY(this._skewY);

    if (this._tween) {
      this._betweenSkewX = nextFrame._skewX - this._skewX;
      this._betweenSkewY = nextFrame._skewY - this._skewY;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (this._node && (this._betweenSkewX !== 0 || this._betweenSkewY !== 0)) {
      var skewx = this._skewX + percent * this._betweenSkewX;
      var skewy = this._skewY + percent * this._betweenSkewY;

      this._node.setRotationX(skewx);
      this._node.setRotationY(skewy);
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {RotationSkewFrame}
   */
  clone() {
    var frame = new ccs.RotationSkewFrame();
    frame.setSkewX(this._skewX);
    frame.setSkewY(this._skewY);

    frame._cloneProperty(this);

    return frame;
  }
};

ccs.RotationSkewFrame = RotationSkewFrame;

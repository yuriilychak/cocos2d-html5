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

import { Frame } from "./frame.js";

/**
 * Skew frame
 * @extend Frame
 */
export class SkewFrame extends Frame {
  constructor() {
    super();
    this._skewX = 0;
    this._skewY = 0;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.setSkewX(this._skewX);
    this._node.setSkewY(this._skewY);

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
    if (this._betweenSkewX !== 0 || this._betweenSkewY !== 0) {
      var skewx = this._skewX + percent * this._betweenSkewX;
      var skewy = this._skewY + percent * this._betweenSkewY;

      this._node.setSkewX(skewx);
      this._node.setSkewY(skewy);
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {SkewFrame}
   */
  clone() {
    var frame = new ccs.SkewFrame();
    frame.setSkewX(this._skewX);
    frame.setSkewY(this._skewY);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the skew x
   * @param {Number} skewx
   */
  setSkewX(skewx) {
    this._skewX = skewx;
  }

  /**
   * Gets the skew x
   * @returns {Number}
   */
  getSkewX() {
    return this._skewX;
  }

  /**
   * Set the skew y
   * @param {Number} skewy
   */
  setSkewY(skewy) {
    this._skewY = skewy;
  }

  /**
   * Gets the skew y
   * @returns {Number}
   */
  getSkewY() {
    return this._skewY;
  }
};

ccs.SkewFrame = SkewFrame;

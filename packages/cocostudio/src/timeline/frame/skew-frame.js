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
    this._node.skewX = this._skewX;
    this._node.skewY = this._skewY;

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
      this._node.skewX = this._skewX + percent * this._betweenSkewX;
      this._node.skewY = this._skewY + percent * this._betweenSkewY;
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {SkewFrame}
   */
  clone() {
    var frame = new SkewFrame();
    frame.skewX = this._skewX;
    frame.skewY = this._skewY;

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the skew x
   * @param {Number} skewx
   */
  set skewX(skewx) {
    this._skewX = skewx;
  }

  /**
   * Gets the skew x
   * @returns {Number}
   */
  get skewX() {
    return this._skewX;
  }

  /**
   * Set the skew y
   * @param {Number} skewy
   */
  set skewY(skewy) {
    this._skewY = skewy;
  }

  /**
   * Gets the skew y
   * @returns {Number}
   */
  get skewY() {
    return this._skewY;
  }
};


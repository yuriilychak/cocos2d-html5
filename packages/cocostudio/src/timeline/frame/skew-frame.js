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

import { Point } from "@aspect/core";
import { Frame } from "./frame.js";


/**
 * Skew frame
 * @extend Frame
 */
export class SkewFrame extends Frame {
  #skew = new Point();

  constructor(skew = null) {
    super();

    if(skew !== null) {
      this.#skew.set(skew);
    }
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.skewX = this.#skew.x;
    this._node.skewY = this.#skew.y;

    if (this._tween) {
      this._betweenSkewX = nextFrame.skewX - this.#skew.x;
      this._betweenSkewY = nextFrame.skewY - this.#skew.y;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (this._betweenSkewX !== 0 || this._betweenSkewY !== 0) {
      this._node.skewX = this.#skew.x + percent * this._betweenSkewX;
      this._node.skewY = this.#skew.y + percent * this._betweenSkewY;
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {SkewFrame}
   */
  clone() {
    var frame = new SkewFrame(this.#skew);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the skew x
   * @param {Number} skewx
   */
  set skewX(skewx) {
    this.#skew.x = skewx;
  }

  /**
   * Gets the skew x
   * @returns {Number}
   */
  get skewX() {
    return this.#skew.x;
  }

  /**
   * Set the skew y
   * @param {Number} skewy
   */
  set skewY(skewy) {
    this.#skew.y = skewy;
  }

  /**
   * Gets the skew y
   * @returns {Number}
   */
  get skewY() {
    return this.#skew.y;
  }

  get skew() {
    return this.#skew.clone();
  }

  set skew(value) {
    this.#skew.set(value);
  }
};


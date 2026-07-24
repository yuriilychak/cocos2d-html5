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
 * Scale frame
 * @xtend Frame
 */
export class ScaleFrame extends Frame {
  #scale = new Point();

  constructor(scaleX = 1, scaleY = scaleX) {
    super();
    this.#scale.set(scaleX, scaleY);
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.scaleX = this.#scale.x;
    this._node.scaleY = this.#scale.y;

    if (this._tween) {
      this._betweenScaleX = nextFrame.scaleX - this.#scale.x;
      this._betweenScaleY = nextFrame.scaleY - this.#scale.y;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (
      this._node &&
      (this._betweenScaleX !== 0 || this._betweenScaleY !== 0)
    ) {
      this._node.scaleX = this.#scale.x + this._betweenScaleX * percent;
      this._node.scaleY = this.#scale.y + this._betweenScaleY * percent;
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {ScaleFrame}
   */
  clone() {
    var frame = new ScaleFrame(this.#scale.x, this.#scale.y);

    frame._cloneProperty(this);

    return frame;
  }

  get scale() {
    return this.#scale.x;
  }

  /**
   * Set the scale
   * @param {Number} scale
   */
  set scale(scale) {
    this.#scale.x = scale;
    this.#scale.y = scale;
  }

  /**
   * Set the scale x
   * @param {Number} scaleX
   */
  set scaleX(scaleX) {
    this.#scale.x = scaleX;
  }

  /**
   * Gets the scale x
   * @returns {Number}
   */
  get scaleX() {
    return this.#scale.x;
  }

  /**
   * Set the scale y
   * @param {Number} scaleY
   */
  set scaleY(scaleY) {
    this.#scale.y = scaleY;
  }

  /**
   * Gets the scale y
   * @returns {Number}
   */
  get scaleY() {
    return this.#scale.y;
  }
};


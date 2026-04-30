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
 * Scale frame
 * @xtend Frame
 */
export class ScaleFrame extends Frame {
  constructor() {
    super();
    this._scaleX = 1;
    this._scaleY = 1;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.setScaleX(this._scaleX);
    this._node.setScaleY(this._scaleY);

    if (this._tween) {
      this._betweenScaleX = nextFrame._scaleX - this._scaleX;
      this._betweenScaleY = nextFrame._scaleY - this._scaleY;
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
      var scaleX = this._scaleX + this._betweenScaleX * percent;
      var scaleY = this._scaleY + this._betweenScaleY * percent;

      this._node.setScaleX(scaleX);
      this._node.setScaleY(scaleY);
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {ScaleFrame}
   */
  clone() {
    var frame = new ccs.ScaleFrame();
    frame.setScaleX(this._scaleX);
    frame.setScaleY(this._scaleY);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the scale
   * @param {Number} scale
   */
  setScale(scale) {
    this._scaleX = scale;
    this._scaleY = scale;
  }

  /**
   * Set the scale x
   * @param {Number} scaleX
   */
  setScaleX(scaleX) {
    this._scaleX = scaleX;
  }

  /**
   * Gets the scale x
   * @returns {Number}
   */
  getScaleX() {
    return this._scaleX;
  }

  /**
   * Set the scale y
   * @param {Number} scaleY
   */
  setScaleY(scaleY) {
    this._scaleY = scaleY;
  }

  /**
   * Gets the scale y
   * @returns {Number}
   */
  getScaleY() {
    return this._scaleY;
  }
};

ccs.ScaleFrame = ScaleFrame;

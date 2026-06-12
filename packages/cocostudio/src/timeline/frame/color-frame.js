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

import { Color } from "@aspect/core";
import { Frame } from "./frame.js";


/**
 * Color frame
 * @extend Frame
 */
export class ColorFrame extends Frame {
  constructor() {
    super();
    this._color = new Color(255, 255, 255);
  }

  /**
   * the execution of the callback
   * @param {ColorFrame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.color = this._color;
    if (this._tween) {
      var color = nextFrame._color;
      this._betweenRed = color.r - this._color.r;
      this._betweenGreen = color.g - this._color.g;
      this._betweenBlue = color.b - this._color.b;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (
      this._node &&
      this._tween &&
      (this._betweenAlpha !== 0 ||
        this._betweenRed !== 0 ||
        this._betweenGreen !== 0 ||
        this._betweenBlue !== 0)
    ) {
      var color = new Color(255, 255, 255);
      color.r = this._color.r + this._betweenRed * percent;
      color.g = this._color.g + this._betweenGreen * percent;
      color.b = this._color.b + this._betweenBlue * percent;

      this._node.color = color;
      if (this._alpha !== null) {
        var alpha = this._alpha + this._betweenAlpha * percent;
        this._node.opacity = alpha;
      }
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {ColorFrame}
   */
  clone() {
    var frame = new ColorFrame();
    frame.colro = this._color;
    frame._cloneProperty(this);
    return frame;
  }

  /**
   * Set the color
   * @param {color} color
   */
  set color(color) {
    this._color = color;
  }

  /**
   * Gets the color
   * @returns {color}
   */
  get color() {
    return this._color;
  }
};


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
 * Position frame
 * @extend Frame
 */
export class PositionFrame extends Frame {
  constructor() {
    super();
    this._position = new Point(0, 0);
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;

    this._node.setPosition(this._position);

    if (this._tween) {
      this._betweenX = nextFrame._position.x - this._position.x;
      this._betweenY = nextFrame._position.y - this._position.y;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (this._node && (this._betweenX !== 0 || this._betweenY !== 0)) {
      var p = new Point(0, 0);
      p.x = this._position.x + this._betweenX * percent;
      p.y = this._position.y + this._betweenY * percent;

      this._node.setPosition(p);
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {PositionFrame}
   */
  clone() {
    var frame = new PositionFrame();
    frame.setPosition(this._position);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the position
   * @param {p} position
   */
  setPosition(position) {
    this._position = position;
  }

  /**
   * gets the position
   * @returns {p}
   */
  getPosition() {
    return this._position;
  }

  /**
   * Set the position x
   * @param {Number} x
   */
  setX(x) {
    this._position.x = x;
  }

  /**
   * Gets the position x
   * @returns {Number}
   */
  getX() {
    return this._position.x;
  }

  /**
   * Set the position y
   * @param {Number} y
   */
  setY(y) {
    this._position.y = y;
  }

  /**
   * Gets the position y
   * @returns {Number}
   */
  getY() {
    return this._position.y;
  }
};

ccs.PositionFrame = PositionFrame;

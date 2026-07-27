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
  #position = new Point();

  get x() {
    return this.#position.x;
  }

  set x(value) {
    this.#position.x = value;
  }

  get y() {
    return this.#position.y;
  }

  set y(value) {
    this.#position.y = value;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;

    this._node.position = this.#position;

    if (this._tween) {
      this._betweenX = nextFrame.x - this.#position.x;
      this._betweenY = nextFrame.y - this.#position.y;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (this._node && (this._betweenX !== 0 || this._betweenY !== 0)) {
      var p = new Point();
      p.x = this.#position.x + this._betweenX * percent;
      p.y = this.#position.y + this._betweenY * percent;

      this._node.position = p;
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {PositionFrame}
   */
  clone() {
    var frame = new PositionFrame();
    frame.setPosition(this.#position);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the position
   * @param {p} position
   */
  setPosition(position) {
    this.#position = position;
  }

  /**
   * gets the position
   * @returns {p}
   */
  getPosition() {
    return this.#position;
  }

  /**
   * Set the position x
   * @param {Number} x
   */
  setX(x) {
    this.#position.x = x;
  }

  /**
   * Gets the position x
   * @returns {Number}
   */
  getX() {
    return this.#position.x;
  }

  /**
   * Set the position y
   * @param {Number} y
   */
  setY(y) {
    this.#position.y = y;
  }

  /**
   * Gets the position y
   * @returns {Number}
   */
  getY() {
    return this.#position.y;
  }
}

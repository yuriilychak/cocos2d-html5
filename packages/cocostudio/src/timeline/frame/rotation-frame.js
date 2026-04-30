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
 * Rotation Frame
 * @extend Frame
 */
export class RotationFrame extends Frame {
  constructor() {
    super();
    this._rotation = 0;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.setRotation(this._rotation);

    if (this._tween) {
      this._betwennRotation = nextFrame._rotation - this._rotation;
    }
  }

  /**
   * Each frame logic
   * @param {number} percent
   */
  _onApply(percent) {
    if (this._betwennRotation !== 0) {
      var rotation = this._rotation + percent * this._betwennRotation;
      this._node.setRotation(rotation);
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {RotationFrame}
   */
  clone() {
    var frame = new RotationFrame();
    frame.setRotation(this._rotation);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the rotation
   * @param {Number} rotation
   */
  setRotation(rotation) {
    this._rotation = rotation;
  }

  /**
   * Gets the rotation
   * @returns {Number}
   */
  getRotation() {
    return this._rotation;
  }
};

ccs.RotationFrame = RotationFrame;

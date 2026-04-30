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
 * Alpha frame
 * @extend Frame
 */
export class AlphaFrame extends Frame {
  constructor() {
    super();
    this._alpha = 255;
  }

  onEnter(nextFrame) {
    if (!this._node) return;
    this._node.setOpacity(this._alpha);
    if (this._tween) {
      this._betweenAlpha = nextFrame._alpha - this._alpha;
    }
  }

  _onApply(percent) {
    if (!this._node) return;
    var alpha = this._alpha + this._betweenAlpha * percent;
    this._node.setOpacity(alpha);
  }

  /**
   * Set the alpha
   * @param {Number} alpha
   */
  setAlpha(alpha) {
    this._alpha = alpha;
  }

  /**
   * Gets the alpha
   * @returns {Number}
   */
  getAlpha() {
    return this._alpha;
  }

  clone() {
    var frame = new ccs.AlphaFrame();
    frame.setAlpha(this._alpha);
    frame._cloneProperty(this);
    return frame;
  }
};

ccs.AlphaFrame = AlphaFrame;

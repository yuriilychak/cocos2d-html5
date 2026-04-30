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
 * Visible frame
 * To control the display state
 * @extend Frame
 */
export class VisibleFrame extends Frame {
  constructor() {
    super();
    this._visible = true;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (this._node) this._node.setVisible(this._visible);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {VisibleFrame}
   */
  clone() {
    var frame = new VisibleFrame();
    frame.setVisible(this._visible);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set display state
   * @param {Boolean} visible
   */
  setVisible(visible) {
    this._visible = visible;
  }

  /**
   * Get the display state
   * @returns {Boolean}
   */
  isVisible() {
    return this._visible;
  }
};


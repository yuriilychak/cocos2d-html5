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

export class BlendFuncFrame extends Frame {
  constructor() {
    super();
    this._blendFunc = null;
  }

  onEnter(nextFrame, currentFrameIndex) {
    if (this._node && this._blendFunc) this._node.setBlendFunc(this._blendFunc);
  }

  clone() {
    var frame = new ccs.BlendFuncFrame();
    frame.setBlendFunc(this._blendFunc);
    frame._cloneProperty(this);
    return frame;
  }

  setBlendFunc(blendFunc) {
    if (blendFunc && blendFunc.src && blendFunc.dst)
      this._blendFunc = blendFunc;
  }

  getBlendFunc() {
    return this._blendFunc;
  }
};

ccs.BlendFuncFrame = BlendFuncFrame;

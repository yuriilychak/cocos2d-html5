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

import { SpriteFrameCache } from "@aspect/core";
import { Frame } from "./frame.js";

/**
 * Texture frame
 * @extend Frame
 */
export class TextureFrame extends Frame {
  constructor() {
    super();

    this._textureName = "";
  }

  /**
   * Set the node element to draw texture
   * @param {Node} node
   */
  setNode(node) {
    super.setNode(node);
    this._sprite = node;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    if (this._sprite) {
      var spriteBlendFunc = this._sprite.getBlendFunc();
      var spriteFrame = SpriteFrameCache.getInstance()._spriteFrames[this._textureName];
      if (spriteFrame != null) this._sprite.setSpriteFrame(spriteFrame);
      else this._sprite.setTexture(this._textureName);

      if (this._sprite.getBlendFunc() !== spriteBlendFunc)
        this._sprite.setBlendFunc(spriteBlendFunc);
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {TextureFrame}
   */
  clone() {
    var frame = new ccs.TextureFrame();
    frame.setTextureName(this._textureName);
    frame._cloneProperty(this);
    return frame;
  }

  /**
   * Set the texture name
   * @param {string} textureName
   */
  setTextureName(textureName) {
    this._textureName = textureName;
  }

  /**
   * Gets the Texture name
   * @returns {null}
   */
  getTextureName() {
    return this._textureName;
  }
};

ccs.TextureFrame = TextureFrame;

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
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

//------------------------------------------------------------------
//
// Chipmunk + Sprite + Batch
//
//------------------------------------------------------------------
import { ChipmunkSprite } from "./chipmunk-sprite";
import { s_pathGrossini } from "../resources";
import { Sprite } from "@aspect/core";

export class ChipmunkSpriteBatchTest extends ChipmunkSprite {
  constructor() {
    super();
    // base(this);

    // batch node
    this.batch = new cc.SpriteBatchNode(s_pathGrossini, 50);
    this.addChild(this.batch);

    this.addSprite = function (pos) {
      var sprite = this.createPhysicsSprite(pos);
      var child = new Sprite(s_pathGrossini);
      child.attr({
        scale: 0.4,
        anchorX: 0,
        anchorY: 0,
        x: sprite.width / 2,
        y: sprite.height / 2
      });
      sprite.addChild(child);
      this.batch.addChild(sprite);
    };

    this._title = "Chipmunk SpriteBatch Test";
    this._subtitle = "Chipmunk + cocos2d sprite batch tests. Tap screen.";
  }

  title() {
    return "Chipmunk SpriteBatch Test";
  }
}

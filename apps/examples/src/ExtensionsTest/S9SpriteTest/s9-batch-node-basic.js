/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013      Surith Thekkiam

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

// S9BatchNodeBasic
import { S9SpriteTestDemo } from "./s9-sprite-test-demo";
import { winSize } from "../../constants";
import { Point, Rect } from "@aspect/core";

export class S9BatchNodeBasic extends S9SpriteTestDemo {
  constructor() {
    super();

    this._title = "Scale9Sprite created empty and updated from SpriteBatchNode";

    this._subtitle = "updateWithBatchNode(); capInsets=full size";

    var x = winSize.width / 2;
    var y = 0 + winSize.height / 2;

    cc.log("S9BatchNodeBasic ...");

    var batchNode = new cc.SpriteBatchNode("Images/blocks9.png");
    cc.log("batchNode created with : " + "Images/blocks9.png");

    var blocks = new cc.Scale9Sprite();
    cc.log("... created");

    blocks.updateWithBatchNode(
      batchNode,
      new Rect(0, 0, 96, 96),
      false,
      new Rect(0, 0, 96, 96)
    );
    cc.log("... updateWithBatchNode");

    blocks.x = x;
    blocks.y = y;
    cc.log("... setPosition");

    this.addChild(blocks);
    cc.log("this..addChild");

    cc.log("... S9BatchNodeBasic done.");

    var moveBy = new cc.MoveBy(1, new Point(80, 80));
    var moveByBack = moveBy.reverse();
    blocks.runAction(cc.sequence(moveBy, moveByBack));
  }
}

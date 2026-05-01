/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas } from "../resources";
import { Color, Rect } from "@aspect/core";

export class SpriteBatchBug1217 extends SpriteTestDemo {
  constructor() {
    //----start53----ctor
    super();

    this._title = "SpriteBatch - Bug 1217";

    this._subtitle = "Adding big family to spritebatch. You shall see 3 heads";

    this.testDuration = 2.1;

    this.pixel1 = { 0: 51, 1: 0, 2: 0, 3: 255 };

    this.pixel2 = { 0: 0, 1: 0, 2: 0, 3: 255 };

    this.pixel3 = { 0: 0, 1: 0, 2: 51, 3: 255 };
    var bn = new cc.SpriteBatchNode(s_grossini_dance_atlas, 15);

    var s1 = new cc.Sprite(bn.texture, new Rect(0, 0, 57, 57));
    var s2 = new cc.Sprite(bn.texture, new Rect(0, 0, 57, 57));
    var s3 = new cc.Sprite(bn.texture, new Rect(0, 0, 57, 57));

    s1.color = new Color(255, 0, 0);
    s2.color = new Color(0, 255, 0);
    s3.color = new Color(0, 0, 255);

    s1.x = 20;

    s1.y = 200;
    s2.x = 100;
    s2.y = 0;
    s3.x = 100;
    s3.y = 0;

    bn.x = 0;

    bn.y = 0;

    //!!!!!
    s1.addChild(s2);
    s2.addChild(s3);
    bn.addChild(s1);

    this.addChild(bn);
    //----end53----
  }
  // Automation
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes", pixel3: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(20, 174, 3, 3);
    var ret2 = this.readPixels(90, 145, 3, 3);
    var ret3 = this.readPixels(163, 116, 3, 3);
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
      pixel3: this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}

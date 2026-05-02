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

import { TAG_SPRITE1, TAG_SPRITE2 } from "./cocos-node-test-constants";
import { TestNodeDemo } from "./test-node-demo";
import { s_pathSister1, s_pathSister2 } from "../resources";
import { winSize } from "../constants";
import { RotateBy, Sequence } from "@aspect/actions";
import { Sprite } from "@aspect/core";

export class CCNodeTest5 extends TestNodeDemo {
  constructor() {
    //----start2----ctor
    super();

    this.testDuration = 2.5;

    this.testSP1 = null;

    this.testSP2 = null;

    this.pixel1 = { 0: 0, 1: 0, 2: 0, 3: 255 };

    this.pixel2 = { 0: 51, 1: 0, 2: 0, 3: 255 };
    var sp1 = new Sprite(s_pathSister1);
    var sp2 = new Sprite(s_pathSister2);
    sp1.x = 150;
    sp1.y = winSize.height / 2;
    sp2.x = winSize.width - 150;
    sp2.y = winSize.height / 2;

    var rot = new RotateBy(2, 360);
    var rot_back = rot.reverse();
    var forever = new Sequence(rot, rot_back).repeatForever();
    var forever2 = forever.clone();
    forever.tag = 101;
    forever2.tag = 102;

    this.addChild(sp1, 0, TAG_SPRITE1);
    this.addChild(sp2, 0, TAG_SPRITE2);

    sp1.runAction(forever);
    sp2.runAction(forever2);

    this.schedule(this.onAddAndRemove, 2.0);
    //----end2----
  }
  onAddAndRemove(dt) {
    //----start2----onAddAndRemove
    var sp1 = this.getChildByTag(TAG_SPRITE1);
    var sp2 = this.getChildByTag(TAG_SPRITE2);

    this.removeChild(sp1, false);
    this.removeChild(sp2, true);

    this.testSP1 = this.getChildByTag(TAG_SPRITE1);
    this.testSP2 = this.getChildByTag(TAG_SPRITE2);

    this.addChild(sp1, 0, TAG_SPRITE1);
    this.addChild(sp2, 0, TAG_SPRITE2);
    //----end2----
  }
  title() {
    return "remove and cleanup";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { sp1: null, sp2: null, pixel1: "yes", pixel2: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(134, 164, 5, 5);
    var ret2 = this.readPixels(
      winSize.width - 148,
      winSize.height / 2 + 51,
      5,
      5
    );
    var ret = {
      sp1: this.testSP1,
      sp2: this.testSP2,
      pixel1: this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, true, 3) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}

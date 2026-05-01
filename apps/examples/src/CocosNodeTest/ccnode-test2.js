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

import { TestNodeDemo } from "./test-node-demo";
import { s_pathSister1, s_pathSister2 } from "../resources";
import { winSize } from "../constants";
import { DelayTime, RotateBy, ScaleBy, sequence } from "@aspect/actions";
import { Sprite } from "@aspect/core";

export class CCNodeTest2 extends TestNodeDemo {
  constructor() {
    super();
    this.testDuration = 4.1;
    this.pixel1 = { 0: 255, 1: 230, 2: 204, 3: 255 };
    this.pixel2 = { 0: 204, 1: 153, 2: 102, 3: 255 };
  }

  onEnter() {
    //----start0----onEnter
    super.onEnter();

    var sp1 = new Sprite(s_pathSister1);
    var sp2 = new Sprite(s_pathSister2);
    var sp3 = new Sprite(s_pathSister1);
    var sp4 = new Sprite(s_pathSister2);

    sp1.x = winSize.width / 4;
    sp1.y = winSize.height / 2;
    sp2.x = (winSize.width / 4) * 3;
    sp2.y = winSize.height / 2;
    this.addChild(sp1);
    this.addChild(sp2);

    sp3.scale = 0.25;
    sp4.scale = 0.25;

    sp1.addChild(sp3);
    sp2.addChild(sp4);

    var a1 = new RotateBy(2, 360);
    var a2 = new ScaleBy(2, 2);
    var delay = new DelayTime(0.2);

    var action1 = sequence(a1, a2, delay, a2.reverse()).repeatForever();
    var action2 = cc
      .sequence(a1.clone(), a2.clone(), delay.clone(), a2.reverse())
      .repeatForever();

    sp2.anchorX = 0;
    sp2.anchorY = 0;

    sp1.runAction(action1);
    sp2.runAction(action2);
    //----end0----
  }
  title() {
    return "anchorPoint and children";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(
      winSize.width / 4 - 54,
      winSize.height / 2 - 146,
      5,
      5
    );
    var ret2 = this.readPixels(
      (winSize.width / 4) * 3 + 93,
      winSize.height / 2 + 113,
      5,
      5
    );
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel1, true, 5) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, true, 5) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}

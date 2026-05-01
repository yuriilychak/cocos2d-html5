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

//------------------------------------------------------------------
//
// Issue1305_2
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { s_pathGrossini } from "../resources";
import { director } from "../constants";
import { Point } from "@aspect/core";

export class Issue1305_2 extends ActionsDemo {
  onEnter() {
    //----start40----onEnter
    super.onEnter();
    this.centerSprites(0);

    var spr = new cc.Sprite(s_pathGrossini);
    spr.x = 200;
    spr.y = 200;
    this.addChild(spr);

    var act1 = new cc.MoveBy(2, new Point(0, 100));

    var act2 = new cc.CallFunc(this.onLog1);
    var act3 = new cc.MoveBy(2, new Point(0, -100));
    var act4 = new cc.CallFunc(this.onLog2, this);
    var act5 = new cc.MoveBy(2, new Point(100, -100));
    var act6 = new cc.CallFunc(this.onLog3.bind(this));
    var act7 = new cc.MoveBy(2, new Point(-100, 0));
    var act8 = new cc.CallFunc(this.onLog4, this);

    var actF = new cc.Sequence(act1, act2, act3, act4, act5, act6, act7, act8);

    //    [spr runAction:actF];
    director.getActionManager().addAction(actF, spr, false);
    //----end40----
  }
  onLog1() {
    cc.log("1st block");
  }
  onLog2() {
    cc.log("2nd block");
  }
  onLog3() {
    cc.log("3rd block");
  }
  onLog4() {
    cc.log("4th block");
  }
  title() {
    return "Issue 1305 #2";
  }
  subtitle() {
    return "See console. You should only see one message for each block";
  }
}

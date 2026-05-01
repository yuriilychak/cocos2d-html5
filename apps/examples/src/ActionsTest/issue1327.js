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
// Issue1327
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { s_pathGrossini } from "../resources";
import { CallFunc, RotateBy, Sequence } from "@aspect/actions";
import { Sprite, log } from "@aspect/core";

export class Issue1327 extends ActionsDemo {
  onEnter() {
    //----start43----onEnter
    super.onEnter();
    this.centerSprites(0);

    var spr = new Sprite(s_pathGrossini);
    spr.x = 100;
    spr.y = 100;
    this.addChild(spr);

    var act1 = new CallFunc(this.onLogSprRotation);
    var act2 = new RotateBy(0.25, 45);
    var act3 = new CallFunc(this.onLogSprRotation, this);
    var act4 = new RotateBy(0.25, 45);
    var act5 = new CallFunc(this.onLogSprRotation.bind(this));
    var act6 = new RotateBy(0.25, 45);
    var act7 = new CallFunc(this.onLogSprRotation);
    var act8 = new RotateBy(0.25, 45);
    var act9 = new CallFunc(this.onLogSprRotation);

    var actF = new Sequence(
      act1,
      act2,
      act3,
      act4,
      act5,
      act6,
      act7,
      act8,
      act9
    );
    spr.runAction(actF);
    //----end43----
  }
  onLogSprRotation(pSender) {
    log(pSender.rotation);
  }
  title() {
    return "Issue 1327";
  }
  subtitle() {
    return "See console: You should see: 0, 45, 90, 135, 180";
  }
}

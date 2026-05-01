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
// Issue1288
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { s_pathGrossini } from "../resources";
import { Point } from "@aspect/core";
import { MoveBy, Sequence } from "@aspect/actions";

export class Issue1288 extends ActionsDemo {
  onEnter() {
    //----start41----onEnter
    super.onEnter();
    this.centerSprites(0);

    var spr = new cc.Sprite(s_pathGrossini);
    spr.x = 100;
    spr.y = 100;
    this.addChild(spr);

    var act1 = new MoveBy(0.5, new Point(100, 0));
    var act2 = act1.reverse();
    var act3 = new Sequence(act1, act2);
    var act4 = act3.repeat(2);

    spr.runAction(act4);
    //----end41----
  }
  title() {
    return "Issue 1288";
  }
  subtitle() {
    return "Sprite should end at the position where it started.";
  }
}

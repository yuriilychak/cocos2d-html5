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
// ActionTargetedCopy
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { Point } from "@aspect/core";

export class ActionTargetedCopy extends ActionsDemo {
  onEnter() {
    //----start32----onEnter
    super.onEnter();
    this.centerSprites(2);

    var jump1 = new cc.JumpBy(2, new Point(0, 0), 100, 3);
    var jump2 = jump1.clone();

    var t1 = new cc.TargetedAction(this._kathia, jump2);
    var t_copy = t1.clone();

    var seq = cc.sequence(jump1, t_copy);

    this._tamara.runAction(seq);
    //----end32----
  }
  title() {
    return "Action that runs on another target. Useful for sequences";
  }
  subtitle() {
    return "Testing copy on TargetedAction";
  }
}

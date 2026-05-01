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
// ActionDelayTime
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";
import { Point } from "@aspect/core";

export class ActionDelayTime extends ActionsDemo {
  constructor() {
    super();
    this._code = "a = new cc.DelayTime( time );";
    this.testDuration = 2.9;
  }

  onEnter() {
    //----start20----onEnter
    super.onEnter();
    this.alignSpritesLeft(1);

    var move = new cc.MoveBy(1, new Point(150, 0));
    var action = new cc.Sequence(move, new cc.DelayTime(2), move.clone());

    this._grossini.runAction(action);
    //----end20----
  }
  title() {
    return "DelayTime: m + delay + m";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [{ x: 210, y: winSize.height / 2 }];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(new Point(this._grossini.x, this._grossini.y));
    return JSON.stringify(ret);
  }
}

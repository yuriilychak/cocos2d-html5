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
// ActionReverse
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";

export class ActionReverse extends ActionsDemo {
  constructor() {
    super();
    this._code = "a = action.reverse();";
    this.testDuration = 4.4;
  }

  onEnter() {
    //----start19----onEnter
    super.onEnter();
    this.alignSpritesLeft(1);

    var jump = new cc.JumpBy(2, new cc.Point(300, 0), 50, 4);
    var delay = new cc.DelayTime(0.25);
    var action = cc.sequence(jump, delay, jump.reverse());

    this._grossini.runAction(action);
    //----end19----
  }
  title() {
    return "Reverse Jump action";
  }

  //
  // Automation
  //
  setupAutomation() {
    this.scheduleOnce(this.checkControl1, 2.1);
  }
  checkControl1(dt) {
    this.control1 = new cc.Point(this._grossini.x, this._grossini.y);
  }
  getExpectedResult() {
    var ret = [
      { x: 360, y: winSize.height / 2 },
      { x: 60, y: winSize.height / 2 }
    ];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(this.control1);
    ret.push(new cc.Point(this._grossini.x, this._grossini.y));
    return JSON.stringify(ret);
  }
}

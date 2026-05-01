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
//	ActionCallFunc1
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { director } from "../constants";
import { Point } from "@aspect/core";

export class ActionCallFunc1 extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 5.05;
  }

  get _code() {
    return (
      "a = new cc.CallFunc( this.callback );\n" +
      "a = new cc.CallFunc( this.callback, this, optional_arg );"
    );
  }

  onEnter() {
    //----start25----onEnter
    super.onEnter();
    this.centerSprites(3);

    // Testing different ways to pass "this"
    var action = cc.sequence(
      new cc.MoveBy(2, new Point(200, 0)),
      new cc.CallFunc(this.onCallback1.bind(this)) // 'this' is bound to the callback function using "bind"
    );

    var action2 = cc.sequence(
      new cc.ScaleBy(2, 2),
      new cc.FadeOut(2),
      new cc.CallFunc(this.onCallback2, this) // 'this' is passed as 2nd argument.
    );

    var action3 = cc.sequence(
      new cc.RotateBy(3, 360),
      new cc.FadeOut(2),
      new cc.CallFunc(this.onCallback3, this, "Hi!") // If you want to pass a optional value, like "Hi!", then you should pass 'this' too
    );

    this._grossini.runAction(action);
    this._tamara.runAction(action2);
    this._kathia.runAction(action3);
    //----end25----
  }
  onCallback1(nodeExecutingAction, value) {
    var s = director.getWinSize();
    var label = new cc.LabelTTF("callback 1 called", "Marker Felt", 16);
    label.x = (s.width / 4) * 1;
    label.y = s.height / 2;
    this.addChild(label);
    this.control1 = true;
  }
  onCallback2(nodeExecutingAction, value) {
    var s = director.getWinSize();
    var label = new cc.LabelTTF("callback 2 called", "Marker Felt", 16);
    label.x = (s.width / 4) * 2;
    label.y = s.height / 2;

    this.addChild(label);
    this.control2 = true;
  }
  onCallback3(nodeExecutingAction, value) {
    var s = director.getWinSize();
    var label = new cc.LabelTTF(
      "callback 3 called:" + value,
      "Marker Felt",
      16
    );
    label.x = (s.width / 4) * 3;
    label.y = s.height / 2;
    this.addChild(label);
    this.control3 = true;
  }
  title() {
    return "Callbacks: CallFunc and friends";
  }
  //
  // Automation
  //
  setupAutomation() {
    this.control1 = this.control2 = this.control3 = false;
  }
  getExpectedResult() {
    var ret = [true, true, true];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(this.control1);
    ret.push(this.control2);
    ret.push(this.control3);
    return JSON.stringify(ret);
  }
}

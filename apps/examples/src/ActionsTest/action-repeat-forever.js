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
// ActionRepeatForever
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";

export class ActionRepeatForever extends ActionsDemo {
  constructor() {
    super();
    this._code = "a = action.repeatForever();";
    this.testDuration = 3.5;
  }

  onEnter() {
    //----start22----onEnter
    super.onEnter();
    this.centerSprites(1);
    var action = new cc.Sequence(
      new cc.DelayTime(1),
      new cc.CallFunc(this.repeatForever)
    ); // not passing 'this' since it is not used by the callback func

    this._grossini.runAction(action);
    //----end22----
  }
  repeatForever(sender) {
    sender.runAction(
      cc
        .sequence(
          new cc.RotateBy(2, 90).easing(cc.easeElasticInOut(0.5)),
          new cc.RotateBy(0.5, 90)
        )
        .repeatForever()
    );
    cc.sys.garbageCollect();
  }
  title() {
    return "cc.CallFunc + cc.RepeatForever";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [true];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    var r = this._grossini.rotation;
    var expected = 900;
    var error = 15;
    ret.push(r < expected + error && r > expected - error);
    return JSON.stringify(ret);
  }
}

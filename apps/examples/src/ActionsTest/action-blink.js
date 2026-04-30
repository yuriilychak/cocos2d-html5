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
// ActionBlink
//
//------------------------------------------------------------------
export class ActionBlink extends ActionsDemo {
    constructor() {
        super();
        this._code = "a = new cc.Blink( time, #_of_blinks );";
        this.testDuration = 2.1;
    }


  onEnter() {
    //----start13----onEnter
    super.onEnter();
    this.centerSprites(2);

    var action1 = new cc.Blink(2, 10);
    var action2 = new cc.Blink(2, 5);

    this._tamara.runAction(action1);
    this._kathia.runAction(action2);
    //----end13----
  }
  title() {
    return "cc.blink";
  }
  //
  // Automation
  //
  setupAutomation() {
    this.scheduleOnce(this.checkControl1, 0.1);
  }
  checkControl1(dt) {
    this.control1 = this._kathia.visible;
  }
  getExpectedResult() {
    var ret = [false, true, true];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(this.control1);
    ret.push(this._tamara.visible);
    ret.push(this._kathia.visible);
    return JSON.stringify(ret);
  }

}

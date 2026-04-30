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
// ActionRotateToRepeat
//
//------------------------------------------------------------------
export class ActionRotateToRepeat extends ActionsDemo {
    constructor() {
        super();
        this._code = "a = action_to_repeat.repeat(#_of_times);";
        this.testDuration = 4.5;
    }


  onEnter() {
    //----start23----onEnter
    super.onEnter();
    this.centerSprites(2);

    var act1 = new cc.RotateTo(0.5, 90);
    var act2 = new cc.RotateTo(0.5, 0);
    var seq = cc.sequence(act1, act2);
    var seq2 = seq.clone();

    this._tamara.runAction(seq.repeatForever());
    this._kathia.runAction(seq2.repeat(4));
    //----end23----
  }
  title() {
    return "Repeat/RepeatForever + RotateTo";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [0, true];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(this._kathia.rotation);
    var r = this._tamara.rotation;
    var expected = 90;
    var error = 15;
    ret.push(r < expected + error && r > expected - error);
    return JSON.stringify(ret);
  }

}

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
// ActionFade
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo.js";

export class ActionFade extends ActionsDemo {
    constructor() {
        super();
        this._code = "a = new cc.FadeIn( time );\n" + "a = new cc.FadeOut( time );";
        this.testDuration = 1.1;
    }


  onEnter() {
    //----start14----onEnter
    super.onEnter();
    this.centerSprites(2);
    var delay = new cc.DelayTime(0.25);
    this._tamara.opacity = 0;
    var action1 = new cc.FadeIn(1.0);
    var action1Back = action1.reverse();

    var action2 = new cc.FadeOut(1.0);
    var action2Back = action2.reverse();

    this._tamara.runAction(cc.sequence(action1, delay, action1Back));
    this._kathia.runAction(cc.sequence(action2, delay.clone(), action2Back));
    //----end14----
  }
  title() {
    return "cc.fadeIn / cc.fadeOut";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [255, 0];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(this._tamara.opacity);
    ret.push(this._kathia.opacity);
    return JSON.stringify(ret);
  }

}

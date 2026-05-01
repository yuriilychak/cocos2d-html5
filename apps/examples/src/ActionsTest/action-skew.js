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
//	ActionSkew
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";

export class ActionSkew extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 2.1;
  }

  get _code() {
    return (
      "a = new cc.SkewBy( time, skew );\n" +
      "a = new cc.SkewTo( time, skewX, skewY );"
    );
  }

  onEnter() {
    //----start5----onEnter
    super.onEnter();
    this.centerSprites(3);
    var actionTo = new cc.SkewTo(2, 37.2, -37.2);
    var actionToBack = new cc.SkewTo(2, 0, 0);
    var actionBy = new cc.SkewBy(2, 0, -90);
    var actionBy2 = new cc.SkewBy(2, 45.0, 45.0);

    var delay = new cc.DelayTime(0.25);

    this._tamara.runAction(new cc.Sequence(actionTo, delay, actionToBack));
    this._grossini.runAction(
      new cc.Sequence(actionBy, delay.clone(), actionBy.reverse())
    );
    this._kathia.runAction(
      new cc.Sequence(actionBy2, delay.clone(), actionBy2.reverse())
    );
    //----end5----
  }
  title() {
    return "cc.skewTo / cc.skewBy";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = ["37.20", "-37.20", 0, 0, 45, 45];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this._tamara.skewX.toFixed(2));
    ret.push(this._tamara.skewY.toFixed(2));

    ret.push(this._grossini.skewX);
    ret.push(this._grossini.skewY);

    ret.push(this._kathia.skewX);
    ret.push(this._kathia.skewY);

    return JSON.stringify(ret);
  }
}

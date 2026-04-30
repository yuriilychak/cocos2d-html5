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
//  ActionRotate
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo.js";

export class ActionRotate extends ActionsDemo {
    constructor() {
        super();
        this.testDuration = 2.1;
    }

      get _code() { 
        return "a = new cc.RotateBy( time, degrees );\n" + "a = new cc.RotateTo( time, degrees );";
      }

  onEnter() {
    //----start3----onEnter
    super.onEnter();
    this.centerSprites(3);
    var actionTo = new cc.RotateTo(2, 45);
    var actionTo2 = new cc.RotateTo(2, -45);
    var actionTo0 = new cc.RotateTo(2, 0);
    this._tamara.runAction(
      cc.sequence(actionTo, new cc.DelayTime(0.25), actionTo0)
    );

    var actionBy = new cc.RotateBy(2, 360);
    var actionByBack = actionBy.reverse();
    this._grossini.runAction(
      cc.sequence(actionBy, new cc.DelayTime(0.25), actionByBack)
    );

    this._kathia.runAction(
      cc.sequence(actionTo2, new cc.DelayTime(0.25), actionTo0.clone())
    );

    //----end3----
  }
  title() {
    return "cc.rotateTo / cc.rotateBy";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [45, 360, -45];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this._tamara.rotation);
    ret.push(this._grossini.rotation);
    ret.push(this._kathia.rotation);

    return JSON.stringify(ret);
  }

}

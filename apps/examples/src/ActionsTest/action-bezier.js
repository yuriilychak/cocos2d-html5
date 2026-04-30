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
// ActionBezier
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo.js";
import { director, winSize } from "../tests-main-constants.js";

export class ActionBezier extends ActionsDemo {
    constructor() {
        super();
        this.testDuration = 2.1;
    }

  onEnter() {
    //----start8----onEnter

    super.onEnter();
    var s = director.getWinSize();

    //
    // startPosition can be any coordinate, but since the movement
    // is relative to the Bezier curve, make it (0,0)
    //

    this.centerSprites(3);

    // sprite 1

    var delay = new cc.DelayTime(0.25);

    // 3 and only 3 control points should be used for Bezier actions.
    var controlPoints = [new cc.Point(0, 374), new cc.Point(300, -374), new cc.Point(300, 100)];

    var bezierForward = new cc.BezierBy(2, controlPoints);
    var rep = cc
      .sequence(bezierForward, delay, bezierForward.reverse(), delay.clone())
      .repeatForever();

    // sprite 2
    this._tamara.x = 80;
    this._tamara.y = 160;

    // 3 and only 3 control points should be used for Bezier actions.
    var controlPoints2 = [
      new cc.Point(100, s.height / 2),
      new cc.Point(200, -s.height / 2),
      new cc.Point(240, 160)
    ];
    var bezierTo1 = new cc.BezierTo(2, controlPoints2);

    // // sprite 3
    var controlPoints3 = controlPoints2.slice();
    this._kathia.x = 400;
    this._kathia.y = 160;
    var bezierTo2 = new cc.BezierTo(2, controlPoints3);

    this._grossini.runAction(rep);
    this._tamara.runAction(bezierTo1);
    this._kathia.runAction(bezierTo2);
    //----end8----
  }
  title() {
    return "cc.bezierBy / cc.bezierTo";
  }
  //
  // Automation
  //
  setupAutomation() {
    this.scheduleOnce(this.checkControl1, 0.66667);
    this.scheduleOnce(this.checkControl2, 1.33333);
  }
  checkControl1(dt) {
    this.control1 = new cc.Point(this._grossini.x, this._grossini.y);
  }
  verifyControl1(dt) {
    var x = Math.abs(this.control1.x - 77 - winSize.width / 2);
    var y = Math.abs(this.control1.y - 87 - winSize.height / 2);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }
  checkControl2(dt) {
    this.control2 = new cc.Point(this._grossini.x, this._grossini.y);
  }
  verifyControl2(dt) {
    var x = Math.abs(this.control2.x - 222 - winSize.width / 2);
    var y = Math.abs(this.control2.y + 53 - winSize.height / 2);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }

  getExpectedResult() {
    var ret = [
      true,
      true,
      { x: winSize.width / 2 + 300, y: winSize.height / 2 + 100 }
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this.verifyControl1());
    ret.push(this.verifyControl2());
    ret.push(new cc.Point(this._grossini.x, this._grossini.y));

    return JSON.stringify(ret);
  }

}

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
// ActionCardinalSpline
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo.js";
import { winSize } from "../tests-main-constants.js";

export class ActionCardinalSpline extends ActionsDemo {

      get _code() { 
        return " a = cc.cadinalSplineBy( time, array_of_points, tension );\n" +
        " a = cc.cadinalSplineTo( time, array_of_points, tension );";
      }

  constructor() {
    super();


      this._array = null;


      this._drawNode1 = null;


      this._drawNode2 = null;


      this.testDuration = 2.1;
    this._array = [];

    //add draw node
    var winSize = cc.director.getWinSize();
    this._drawNode1 = new cc.DrawNode();
    this.addChild(this._drawNode1);
    this._drawNode1.x = 50;
    this._drawNode1.y = 50;
    this._drawNode1.setDrawColor(new cc.Color(255, 255, 255, 255));

    this._drawNode2 = new cc.DrawNode();
    this.addChild(this._drawNode2);
    this._drawNode2.x = winSize.width * 0.5;
    this._drawNode2.y = 50;
    this._drawNode2.setDrawColor(new cc.Color(255, 255, 255, 255));
  }

  onEnter() {
    //----start11----onEnter
    super.onEnter();
    var winSize = cc.director.getWinSize();
    this.centerSprites(2);

    var delay = new cc.DelayTime(0.25);

    var array = [
      new cc.Point(0, 0),
      new cc.Point(winSize.width / 2 - 30, 0),
      new cc.Point(winSize.width / 2 - 30, winSize.height - 80),
      new cc.Point(0, winSize.height - 80),
      new cc.Point(0, 0)
    ];

    //
    // sprite 1 (By)
    //
    // Spline with no tension (tension==0)
    //
    var action1 = new cc.CardinalSplineBy(2, array, 0);
    var reverse1 = action1.reverse();
    var seq = cc.sequence(action1, delay, reverse1, delay.clone());

    this._tamara.x = 50;
    this._tamara.y = 50;
    this._tamara.runAction(seq);

    //
    // sprite 2 (By)
    //
    // Spline with high tension (tension==1)
    //
    var action2 = new cc.CardinalSplineBy(2, array, 1);
    var reverse2 = action2.reverse();
    var seq2 = cc.sequence(action2, delay.clone(), reverse2, delay.clone());

    this._kathia.x = winSize.width / 2;
    this._kathia.y = 50;
    this._kathia.runAction(seq2);

    this._drawNode1.drawCardinalSpline(array, 0, 100, 1);
    this._drawNode2.drawCardinalSpline(array, 1, 100, 1);
    //----end11----
  }

  subtitle() {
    return "Cardinal Spline paths. Testing different tensions for one array";
  }
  title() {
    return "CardinalSplineBy / CardinalSplineAt";
  }
  //
  // Automation
  //
  setupAutomation() {
    this.scheduleOnce(this.checkControl1, 0.5);
    this.scheduleOnce(this.checkControl2, 1.0);
    this.scheduleOnce(this.checkControl3, 1.5);
  }
  checkControl1(dt) {
    this.control1 = new cc.Point(this._tamara.x, this._tamara.y);
  }
  verifyControl1(dt) {
    var x = Math.abs(50 + winSize.width / 2 - 30 - this.control1.x);
    var y = Math.abs(50 - this.control1.y);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }
  checkControl2(dt) {
    this.control2 = new cc.Point(this._tamara.x, this._tamara.y);
  }
  verifyControl2(dt) {
    var x = Math.abs(50 + winSize.width / 2 - 30 - this.control2.x);
    var y = Math.abs(50 + winSize.height - 80 - this.control2.y);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }
  checkControl3(dt) {
    this.control3 = new cc.Point(this._tamara.x, this._tamara.y);
  }
  verifyControl3(dt) {
    var x = Math.abs(50 - this.control3.x);
    var y = Math.abs(50 + winSize.height - 80 - this.control3.y);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }

  getExpectedResult() {
    var ret = [true, true, true, { x: 50, y: 50 }];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this.verifyControl1());
    ret.push(this.verifyControl2());
    ret.push(this.verifyControl3());
    ret.push(new cc.Point(this._tamara.x, this._tamara.y));

    return JSON.stringify(ret);
  }

}

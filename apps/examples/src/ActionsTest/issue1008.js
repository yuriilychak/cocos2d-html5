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
// Issue1008
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { Point, log } from "@aspect/core";
import { BezierTo, CallFunc, DelayTime, Sequence } from "@aspect/actions";

export class Issue1008 extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 3.1;
  }

  onEnter() {
    //----start10----onEnter
    super.onEnter();

    this.centerSprites(1);

    // sprite 1

    this._grossini.x = 428;
    this._grossini.y = 279;

    // 3 and only 3 control points should be used for Bezier actions.
    var controlPoints1 = [
      new Point(428, 279),
      new Point(100, 100),
      new Point(100, 100)
    ];
    var controlPoints2 = [
      new Point(100, 100),
      new Point(428, 279),
      new Point(428, 279)
    ];

    var bz1 = new BezierTo(1.5, controlPoints1);
    var bz2 = new BezierTo(1.5, controlPoints2);
    var trace = new CallFunc(this.onTrace, this);
    var delay = new DelayTime(0.25);

    var rep = new Sequence(bz1, bz2, trace, delay).repeatForever();
    this._grossini.runAction(rep);

    //----end10----

    //this._grossini.runAction(new Sequence(bz1, bz2, trace,delay));
  }
  onTrace(sender) {
    var pos = new Point(sender.x, sender.y);
    log("Position x: " + pos.x + " y:" + pos.y);
    if (Math.round(pos.x) != 428 || Math.round(pos.y) != 279)
      this.log("Error: Issue 1008 is still open");

    this.tracePos = pos;
  }
  title() {
    return "Issue 1008";
  }
  subtitle() {
    return "bezierTo + Repeat. See console";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { x: 428, y: 279 };
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    return JSON.stringify(this.tracePos);
  }
}

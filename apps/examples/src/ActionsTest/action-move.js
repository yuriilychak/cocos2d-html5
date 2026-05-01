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
//	ActionMove
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { director, winSize } from "../constants";
import { Point } from "@aspect/core";

export class ActionMove extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 2.1;
  }

  get _code() {
    return (
      "a =new cc.MoveBy( time, new Point(x,y) );\n" +
      "a = new cc.MoveTo( time, new Point(x,y) );"
    );
  }

  onEnter() {
    //----start1----onEnter
    super.onEnter();

    this.centerSprites(3);
    var s = director.getWinSize();

    var actionTo = new cc.MoveTo(2, new Point(s.width - 40, s.height - 40));

    var actionBy = new cc.MoveBy(1, new Point(80, 80));
    var actionByBack = actionBy.reverse();

    this._tamara.runAction(actionTo);
    this._grossini.runAction(cc.sequence(actionBy, actionByBack));
    this._kathia.runAction(new cc.MoveTo(1, new Point(40, 40)));
    //----end1----
  }
  title() {
    return "cc.moveTo / cc.moveBy";
  }

  //
  // Automation
  //
  getExpectedResult() {
    var ret = [
      { x: winSize.width - 40, y: winSize.height - 40 },
      { x: winSize.width / 2, y: winSize.height / 2 },
      { x: 40, y: 40 }
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(new Point(this._tamara.x, this._tamara.y));
    ret.push(new Point(this._grossini.x, this._grossini.y));
    ret.push(new Point(this._kathia.x, this._kathia.y));

    return JSON.stringify(ret);
  }
}

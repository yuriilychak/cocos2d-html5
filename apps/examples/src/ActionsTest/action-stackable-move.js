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
// ActionStackableMove
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo.js";
import { winSize } from "../tests-main-constants.js";

export class ActionStackableMove extends ActionsDemo {
    constructor() {
        super();
        this.testDuration = 0.2;
    }

  onEnter() {
    //----start33----onEnter
    super.onEnter();
    this.centerSprites(1);

    this._grossini.x = 40;
    this._grossini.y = winSize.height / 2;

    // shake
    var move = new cc.MoveBy(0.2, new cc.Point(0, 50));
    var move_back = move.reverse();
    var delay = new cc.DelayTime(0.25);
    var move_seq = cc.sequence(move, move_back);
    var move_rep = move_seq.repeatForever();
    this._grossini.runAction(move_rep);

    // move
    var action = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
    var back = action.reverse();
    var seq = cc.sequence(action, back);
    var repeat = seq.repeatForever();
    this._grossini.runAction(repeat);
    //----end33----
  }
  title() {
    return "Stackable actions: MoveBy + MoveBy";
  }
  subtitle() {
    return "Grossini shall move up and down while moving horizontally";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [true, true];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    var x = this._grossini.x,
      y = this._grossini.y;
    var error = 10;
    var expected_x = 40 + (0.2 * (winSize.width - 80)) / 2;
    var expected_y = winSize.height / 2 + 50;
    var ret_x = x < expected_x + error && x > expected_x - error;
    var ret_y = y < expected_y + error && y > expected_y - error;
    ret.push(ret_x);
    ret.push(ret_y);
    return JSON.stringify(ret);
  }

}

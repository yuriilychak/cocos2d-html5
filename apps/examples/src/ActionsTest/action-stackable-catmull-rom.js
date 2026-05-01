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
// ActionStackableCatmullRom
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";

export class ActionStackableCatmullRom extends ActionsDemo {
  onEnter() {
    //----start36----onEnter
    super.onEnter();
    this.centerSprites(1);

    this._grossini.x = 40;
    this._grossini.y = 40;

    // shake
    var move = new cc.MoveBy(0.05, new cc.Point(8, 8));
    var move_back = move.reverse();
    var move_seq = cc.sequence(move, move_back);
    var move_rep = move_seq.repeatForever();
    this._grossini.runAction(move_rep);

    // CatmullRom
    var array = [
      new cc.Point(0, 0),
      new cc.Point(80, 80),
      new cc.Point(winSize.width - 80, 80),
      new cc.Point(winSize.width - 80, winSize.height - 80),
      new cc.Point(80, winSize.height - 80),
      new cc.Point(80, 80),
      new cc.Point(winSize.width / 2, winSize.height / 2)
    ];

    var action1 = new cc.CatmullRomBy(6, array);
    var reverse1 = action1.reverse();
    var seq1 = cc.sequence(action1, reverse1);
    var repeat = seq1.repeatForever();
    this._grossini.runAction(repeat);
    //----end36----
  }
  title() {
    return "Stackable actions: MoveBy + CatmullRomBy";
  }
  subtitle() {
    return "Grossini shall shake while he moves along a CatmullRom path";
  }
}

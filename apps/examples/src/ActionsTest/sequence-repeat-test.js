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

import { ActionsDemo } from "./actions-demo";
import { Point } from "@aspect/core";

export class SequenceRepeatTest extends ActionsDemo {
  onEnter() {
    //----start47----onEnter
    super.onEnter();
    this.centerSprites(2);

    this._kathia.runAction(
      new cc.Repeat(new cc.Sequence(new cc.Blink(2, 3), new cc.DelayTime(2)), 3)
    );

    var move = new cc.MoveBy(1, new Point(50, 0));
    var move_back = move.reverse();
    var move_seq = new cc.Sequence(
      move,
      new cc.DelayTime(1),
      move_back,
      new cc.DelayTime(1)
    );
    this._tamara.runAction(move_seq.repeat(3));
    //----end47----
  }

  title() {
    return "Sequence.repeat()";
  }

  subtitle() {
    return "Tests sequence.repeat function.";
  }
}

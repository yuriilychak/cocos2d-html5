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
// ActionFollow
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { director } from "../constants";
import { Point, Rect } from "@aspect/core";

export class ActionFollow extends ActionsDemo {
  onEnter() {
    //----start30----onEnter
    super.onEnter();
    this.centerSprites(1);
    var s = director.getWinSize();

    this._grossini.x = -(s.width / 2);
    this._grossini.y = s.height / 2;
    var move = new cc.MoveBy(2, new Point(s.width * 3, 0));
    var move_back = move.reverse();
    var seq = new cc.Sequence(move, move_back);

    var rep = seq.repeatForever();

    this._grossini.runAction(rep);

    this.runAction(
      new cc.Follow(this._grossini, new Rect(0, 0, s.width * 2 - 100, s.height))
    );
    //----end30----
  }
  subtitle() {
    return "Follow action";
  }
}

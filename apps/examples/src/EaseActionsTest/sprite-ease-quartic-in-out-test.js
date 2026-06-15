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

//
// SpriteEaseQuarticInOut
//
import { EaseSpriteDemo } from "./ease-sprite-demo";
import { winSize } from "../constants";
import { Point } from "@aspect/core";
import {
  DelayTime,
  MoveBy,
  easeQuarticActionInOut,
  Sequence
} from "@aspect/actions";

export class SpriteEaseQuarticInOutTest extends EaseSpriteDemo {
  onEnter() {
    super.onEnter();
    //----start18----onEnter

    var move = new MoveBy(3, new Point(winSize.width - 130, 0));
    var move_back = move.reverse();

    var move_ease = move.clone().easing(easeQuarticActionInOut());
    var move_ease_back = move_ease.reverse();

    var delay = new DelayTime(0.25);

    var seq1 = new Sequence(move, delay, move_back, delay.clone());
    var seq2 = new Sequence(
      move_ease,
      delay.clone(),
      move_ease_back,
      delay.clone()
    );

    this.positionForTwo();

    this._grossini.runAction(seq1.repeatForever());
    this._tamara.runAction(seq2.repeatForever());

    //----end18----
  }
  title() {
    return "SpriteEaseQuarticInOut action";
  }
}

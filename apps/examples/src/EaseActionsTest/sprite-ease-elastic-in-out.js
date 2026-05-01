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
// SpriteEaseElasticInOut
//
//------------------------------------------------------------------
import { EaseSpriteDemo } from "./ease-sprite-demo";
import { winSize } from "../constants";

export class SpriteEaseElasticInOut extends EaseSpriteDemo {
  onEnter() {
    //----start7----onEnter
    super.onEnter();

    var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));

    var move_ease_inout1 = move.clone().easing(cc.easeElasticInOut(0.3));
    var move_ease_inout_back1 = move_ease_inout1.reverse();

    var move_ease_inout2 = move.clone().easing(cc.easeElasticInOut(0.45));
    var move_ease_inout_back2 = move_ease_inout2.reverse();

    var move_ease_inout3 = move.clone().easing(cc.easeElasticInOut(0.6));
    var move_ease_inout_back3 = move_ease_inout3.reverse();

    var delay = new cc.DelayTime(0.1);

    var seq1 = cc.sequence(
      move_ease_inout1,
      delay,
      move_ease_inout_back1,
      delay.clone()
    );
    var seq2 = cc.sequence(
      move_ease_inout2,
      delay.clone(),
      move_ease_inout_back2,
      delay.clone()
    );
    var seq3 = cc.sequence(
      move_ease_inout3,
      delay.clone(),
      move_ease_inout_back3,
      delay.clone()
    );

    this._tamara.runAction(seq1.repeatForever());
    this._kathia.runAction(seq2.repeatForever());
    this._grossini.runAction(seq3.repeatForever());
    //----end7----
  }
  title() {
    return "EaseElasticInOut action";
  }
}

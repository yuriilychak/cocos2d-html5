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

import { EffectAdvanceTextLayer } from "./effect-advance-text-layer";
import { EffectsAdvancedTest } from "./effects-advanced-test-constants";
import { Lens3DTarget } from "./lens3-dtarget";
import { Point, Size } from "@aspect/core";

export class Effect4 extends EffectAdvanceTextLayer {
  title() {
    return "Jumpy Lens3D";
  }

  onEnter() {
    super.onEnter();

    var bgNodeGrid = this.getChildByTag(EffectsAdvancedTest.TAG_BACKGROUND);
    var lens = cc.lens3D(10, new Size(32, 24), new Point(100, 180), 150);
    var move = new cc.JumpBy(5, new Point(380, 0), 100, 4);
    var move_back = move.reverse();
    var seq = cc.sequence(move, move_back);

    /* In cocos2d-iphone, the type of action's target is 'id', so it supports using the instance of 'CCLens3D' as its target.
         While in cocos2d-x, the target of action only supports CCNode or its subclass,
         so we make an encapsulation for CCLens3D to achieve that.
         */
    var director = cc.director;
    var target = Lens3DTarget.create(lens);

    // Please make sure the target been added to its parent.
    this.addChild(target);

    director.getActionManager().addAction(seq, target, false);
    bgNodeGrid.runAction(
      cc.sequence(
        lens,
        new cc.CallFunc(function (sender) {
          sender.removeChild(target, true);
        })
      )
    );
  }
}

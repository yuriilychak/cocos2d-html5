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
import { Point, Size } from "@aspect/core";
import { MoveBy, sequence } from "@aspect/actions";

export class Effect3 extends EffectAdvanceTextLayer {
  title() {
    return "Effects on 2 sprites";
  }

  onEnter() {
    super.onEnter();

    var bg = this.getChildByTag(EffectsAdvancedTest.TAG_BACKGROUND);
    var target1 = this.rootNode.getChildByTag(EffectsAdvancedTest.TAG_SPRITE1);
    var target2 = this.rootNode.getChildByTag(EffectsAdvancedTest.TAG_SPRITE2);

    var waves = cc.waves(5, new Size(15, 10), 5, 20, true, false);
    var shaky = cc.shaky3D(5, new Size(15, 10), 4, false);

    target1.runAction(waves.repeatForever());
    target2.runAction(shaky.repeatForever());

    // moving background. Testing issue #244
    var move = new MoveBy(3, new Point(200, 0));
    bg.runAction(sequence(move, move.reverse()).repeatForever());
  }
}

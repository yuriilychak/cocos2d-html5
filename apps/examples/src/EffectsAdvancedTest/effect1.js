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
import { Director, Point, Size } from "@aspect/core";
import { DelayTime, sequence } from "@aspect/actions";
import { Lens3D, ReuseGrid, Waves3D } from "@aspect/actions3d";

export class Effect1 extends EffectAdvanceTextLayer {
  title() {
    return "Lens + Waves3d";
  }

  onEnter() {
    super.onEnter();

    var target = this.getChildByTag(EffectsAdvancedTest.TAG_BACKGROUND);

    // To reuse a grid the grid size and the grid type must be the same.
    // in this case:
    //     Lens3D is Grid3D and it's size is (15,10)
    //     Waves3D is Grid3D and it's size is (15,10)
    var size = Director.getInstance().getWinSize();
    var lens = new Lens3D(
      0.0,
      new Size(15, 10),
      new Point(size.width / 2, size.height / 2),
      240
    );
    var waves = new Waves3D(10, new Size(15, 10), 18, 15);

    var reuse = new ReuseGrid(1);
    var delay = new DelayTime(8);

    target.runAction(sequence(lens, delay, reuse, waves));
  }
}

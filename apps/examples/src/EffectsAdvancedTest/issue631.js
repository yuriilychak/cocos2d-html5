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
import { s_pathFog, s_pathGrossini } from "../resources";

export class Issue631 extends EffectAdvanceTextLayer {
  title() {
    return "Testing Opacity";
  }

  subtitle() {
    return "Effect image should be 100% opaque. Testing issue #631";
  }

  onEnter() {
    super.onEnter();

    var effect = cc.sequence(
      new cc.DelayTime(2.0),
      cc.shaky3D(5.0, new cc.Size(5, 5), 16, false)
    );

    // cleanup
    var bg = this.getChildByTag(EffectsAdvancedTest.TAG_BACKGROUND);
    this.removeChild(bg, true);

    // background
    var layer = new cc.LayerColor(new cc.Color(255, 0, 0, 255));
    this.addChild(layer, -10);
    var sprite = new cc.Sprite(s_pathGrossini);
    sprite.x = 50;
    sprite.y = 80;
    layer.addChild(sprite, 10);

    // foreground
    var layer2 = new cc.LayerColor(new cc.Color(0, 255, 0, 255));
    var fog = new cc.Sprite(s_pathFog);

    fog.setBlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
    var nodeGrid = new cc.NodeGrid();
    layer2.addChild(fog, 1);
    nodeGrid.addChild(layer2);
    this.addChild(nodeGrid, 1);

    nodeGrid.runAction(effect.repeatForever());
  }
}

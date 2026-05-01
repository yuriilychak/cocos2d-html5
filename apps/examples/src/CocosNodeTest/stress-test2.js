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

import { TAG_SPRITE1 } from "./cocos-node-test-constants";
import { TestNodeDemo } from "./test-node-demo";
import { s_fire, s_pathSister1 } from "../resources";
import { winSize } from "../constants";
import { Point } from "@aspect/core";

export class StressTest2 extends TestNodeDemo {
    constructor() {
        //----start5----ctor
        super();

        var sublayer = new cc.Layer();

        var sp1 = new cc.Sprite(s_pathSister1);
        sp1.x = 80;
        sp1.y = winSize.height / 2;

        var move = new cc.MoveBy(3, new Point(350, 0));
        var move_ease_inout3 = move.clone().easing(cc.easeInOut(2.0));
        var move_ease_inout_back3 = move_ease_inout3.reverse();
        var seq3 = cc.sequence(move_ease_inout3, move_ease_inout_back3);
        sp1.runAction(seq3.repeatForever());
        sublayer.addChild(sp1, 1);

        var fire = new cc.ParticleFire();
        fire.texture = cc.textureCache.addImage(s_fire);
        fire.x = 80;
        fire.y = winSize.height / 2 - 50;

        var copy_seq3 = seq3.clone();

        fire.runAction(copy_seq3.repeatForever());
        sublayer.addChild(fire, 2);

        this.schedule(this.shouldNotLeak, 6.0);

        this.addChild(sublayer, 0, TAG_SPRITE1);
        //----end5----
    }
    shouldNotLeak(dt) {
        //----start5----shouleNotLeak
        this.unschedule(this.shouldNotLeak);
        var sublayer = this.getChildByTag(TAG_SPRITE1);
        sublayer.removeAllChildren();
        //----end5----
    }
    title() {
        return "stress test #2: no leaks";
    }

}

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

import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossiniPlist, s_grossini_gray, s_grossini_grayPlist } from "../resources";
import { winSize } from "../constants";

export class SpriteSkewNegativeScaleChildren extends SpriteTestDemo {

    constructor() {
        //----start50----ctor
        super();


        this._title = "Sprite + children + skew";


        this._subtitle = "Sprite skew + negative scale with children";


        this.testDuration = 6;


        this.pixel1 = {"0":51, "1":0, "2":51, "3":255};


        this.pixel2 = {"0":0, "1":0, "2":0, "3":255};

        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(s_grossiniPlist);
        cache.addSpriteFrames(s_grossini_grayPlist, s_grossini_gray);

        var parent = new cc.Node();
        this.addChild(parent);

        for (var i = 0; i < 2; i++) {
            var sprite = new cc.Sprite("#grossini_dance_01.png");
            sprite.x = winSize.width / 4 * (i + 1);
            sprite.y = winSize.height / 2;

            // Skew
            var skewX = new cc.SkewBy(2, 45, 0);
            var skewX_back = skewX.reverse();
            var skewY = new cc.SkewBy(2, 0, 45);
            var skewY_back = skewY.reverse();

            if (i === 1)
                sprite.scale = -1.0;

            var seq_skew = cc.sequence(skewX, skewX_back, skewY, skewY_back);
            sprite.runAction(seq_skew.repeatForever());

            var child1 = new cc.Sprite("#grossini_dance_01.png");
            child1.x = sprite.width / 2.0;
            child1.y = sprite.height / 2.0;

            sprite.addChild(child1);
            child1.scale = 0.8;
            parent.addChild(sprite, i);
        }
        //----end50----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 4 + 21, winSize.height / 2 + 22, 5, 5);
        var ret2 = this.readPixels(winSize.width / 4 + 11, winSize.height / 2 + 14, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":!this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

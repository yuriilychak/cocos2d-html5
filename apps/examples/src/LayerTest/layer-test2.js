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
// LayerTest2
//
//------------------------------------------------------------------
import { LAYERTEST2_LAYER1_TAG, LAYERTEST2_LAYER2_TAG } from "./layer-test-constants.js";
import { LayerTest } from "./layer-test.js";
import { autoTestEnabled, director } from "../tests-main-constants.js";

export class LayerTest2 extends LayerTest {
    constructor() {
        super();
        this.testDuration = 2.1;
        this.tintTest = {"r": 0, "g": 128, "b": 60};
    }


    onEnter() {
        //----start1----onEnter
        super.onEnter();

        var s = director.getWinSize();
        var layer1 = new cc.LayerColor(new cc.Color(255, 255, 0, 80), 100, 300);
        layer1.x = s.width / 3;
        layer1.y = s.height / 2;
        layer1.ignoreAnchorPointForPosition(false);
        this.addChild(layer1, 1, LAYERTEST2_LAYER1_TAG);

        var layer2 = new cc.LayerColor(new cc.Color(0, 0, 255, 255), 100, 300);
        layer2.x = (s.width / 3) * 2;
        layer2.y = s.height / 2;
        layer2.ignoreAnchorPointForPosition(false);
        this.addChild(layer2, 2, LAYERTEST2_LAYER2_TAG);

        var actionTint = new cc.TintBy(2, -255, -127, 0);
        var actionTintBack = actionTint.reverse();

        var actionFade = new cc.FadeOut(2.0);
        var actionFadeBack = actionFade.reverse();

        if (autoTestEnabled) {
            var seq1 = cc.sequence(actionTint, new cc.DelayTime(0.25), actionTintBack);
            var seq2 = cc.sequence(actionFade, new cc.DelayTime(0.25), actionFadeBack);
        } else {
            var seq1 = cc.sequence(actionTint, actionTintBack);
            var seq2 = cc.sequence(actionFade, actionFadeBack);
        }

        layer1.runAction(seq1);
        layer2.runAction(seq2);
        //----end1----
    }
    title() {
        return "ColorLayer: fade and tint";
    }

    //
    // Automation
    //

    getExpectedResult() {
        var ret = {"tint": "yes", "opacity": 0};
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var abs = function (a) {
            return (a > 0) ? a : a * -1;
        };

        var inColorRange = function (pix1, pix2) {
            // Color on iOS comes as 0,128,128 and on web as 0,128,0
            if (abs(pix1.r - pix2.r) < 50 && abs(pix1.g - pix2.g) < 50 &&
                abs(pix1.b - pix2.b) < 90) {
                return true;
            }
            return false;
        };
        var s = director.getWinSize();
        var tint = this.getChildByTag(LAYERTEST2_LAYER1_TAG).color;
        var op = this.getChildByTag(LAYERTEST2_LAYER2_TAG).opacity;
        var ret = {"tint": inColorRange(tint, this.tintTest) ? "yes" : "no",
            "opacity": op};

        return JSON.stringify(ret);
    }

}

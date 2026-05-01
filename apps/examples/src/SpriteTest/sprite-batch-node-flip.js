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
// SpriteBatchNodeFlip
//
//------------------------------------------------------------------
import { TAG_SPRITE1, TAG_SPRITE2, TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas } from "../resources";
import { winSize } from "../constants";
import { Rect } from "@aspect/core";

export class SpriteBatchNodeFlip extends SpriteTestDemo {

    constructor() {
        //----start23----ctor
        super();


        this._title = "SpriteBatchNode Flip X & Y";


        this.testDuration = 1.5;


        this.pixel = {"0":255, "1":204, "2":153, "3":255};


        this.pixel1 = null;


        this.pixel2 = null;


        this.pixel3 = null;


        this.pixel4 = null;
        var batch = new cc.SpriteBatchNode(s_grossini_dance_atlas, 10);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        var sprite1 = new cc.Sprite(batch.texture, new Rect(85, 121, 85, 121));
        sprite1.x = winSize.width / 2 - 100;
        sprite1.y = winSize.height / 2;
        batch.addChild(sprite1, 0, TAG_SPRITE1);

        var sprite2 = new cc.Sprite(batch.texture, new Rect(85, 121, 85, 121));
        sprite2.x = winSize.width / 2 + 100;
        sprite2.y = winSize.height / 2;
        batch.addChild(sprite2, 0, TAG_SPRITE2);

        this.schedule(this.onFlipSprites, 1);
        //----end23----
    }
    onFlipSprites(dt) {
        //----start23----onFlipSprites
        var batch = this.getChildByTag(TAG_SPRITE_BATCH_NODE);
        var sprite1 = batch.getChildByTag(TAG_SPRITE1);
        var sprite2 = batch.getChildByTag(TAG_SPRITE2);

        sprite1.flippedX = !sprite1.flippedX;
        sprite2.flippedY = !sprite2.flippedY;
        //----end23----
    }
    //
    // Automation
    //
    setupAutomation() {
        this.scheduleOnce(this.getBeforePixel, 0.5);
    }
    getBeforePixel() {
        this.pixel1 = this.readPixels(winSize.width / 2 - 131, winSize.height / 2 - 11, 5, 5);
        this.pixel2 = this.readPixels(winSize.width / 2 + 100, winSize.height / 2 + 44, 5, 5);
    }
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes", "pixel4":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        this.pixel3 = this.readPixels(winSize.width / 2 - 69, winSize.height / 2 - 11, 5, 5);
        this.pixel4 = this.readPixels(winSize.width / 2 + 100, winSize.height / 2 - 44, 5, 5);
        var ret = {"pixel1":this.containsPixel(this.pixel1, this.pixel) ? "yes" : "no",
            "pixel2":this.containsPixel(this.pixel2, this.pixel) ? "yes" : "no",
            "pixel3":this.containsPixel(this.pixel3, this.pixel) ? "yes" : "no",
            "pixel4":this.containsPixel(this.pixel4, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

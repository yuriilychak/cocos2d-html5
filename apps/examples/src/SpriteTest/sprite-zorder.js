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
// SpriteZOrder
//
//------------------------------------------------------------------
import { TAG_SPRITE1 } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas } from "../resources";
import { winSize } from "../constants";

export class SpriteZOrder extends SpriteTestDemo {
    constructor() {
        //----start13----ctor
        super();

        this._dir = 0;

        this._title = "Sprite: Z order";

        this.testDuration = 4.2;

        this.pixel = {"0":255, "1":0, "2":0, "3":255};
        this._dir = 1;

        var sprite;
        var step = winSize.width / 11;
        for (var i = 0; i < 5; i++) {
            sprite = new cc.Sprite(s_grossini_dance_atlas, new cc.Rect(85 * 0, 121 * 1, 85, 121));
            sprite.x = (i + 1) * step;
            sprite.y = winSize.height / 2;
            this.addChild(sprite, i);
        }

        for (i = 5; i < 10; i++) {
            sprite = new cc.Sprite(s_grossini_dance_atlas, new cc.Rect(85 * 1, 121 * 0, 85, 121));
            sprite.x = (i + 1) * step;
            sprite.y = winSize.height / 2;
            this.addChild(sprite, 14 - i);
        }

        sprite = new cc.Sprite(s_grossini_dance_atlas, new cc.Rect(85 * 3, 121 * 0, 85, 121));
        this.addChild(sprite, -1, TAG_SPRITE1);
        sprite.x = winSize.width / 2;
        sprite.y = winSize.height / 2 - 20;
        sprite.scaleX = 10;
        sprite.color = cc.Color.RED;

        this.schedule(this.reorderSprite, 1);
        //----end13----
    }
    reorderSprite(dt) {
        //----start13----reorderSprite
        var sprite = this.getChildByTag(TAG_SPRITE1);
        var z = sprite.zIndex;
        if (z < -1)
            this._dir = 1;
        if (z > 10)
            this._dir = -1;
        z += this._dir * 3;
        this.reorderChild(sprite, z);
        //----end13----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var step = winSize.width / 11;
        var ret1 = this.readPixels((6 + 1) * step, winSize.height / 2 + 10, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

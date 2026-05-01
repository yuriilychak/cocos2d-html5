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
// SpriteBatchNodeChildrenZ
//
//------------------------------------------------------------------
import { TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini, s_grossiniPlist } from "../resources";
import { winSize } from "../constants";
import { Sprite, SpriteFrameCache } from "@aspect/core";

export class SpriteBatchNodeChildrenZ extends SpriteTestDemo {


    constructor() {
        //----start30----ctor
        super();



        this._title = "SpriteBatchNode Children Z";



        this.testDuration = 1;



        this.pixel1 = {"0":51, "1":0, "2":51, "3":255};



        this.pixel2 = {"0":51, "1":0, "2":51, "3":255};



        this.pixel3 = {"0":255, "1":204, "2":153, "3":255};
        // parents
        var batch;
        var sprite1, sprite2, sprite3;
        SpriteFrameCache.getInstance().addSpriteFrames(s_grossiniPlist);

        // test 1
        batch = new cc.SpriteBatchNode(s_grossini, 50);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        sprite1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = winSize.width / 3;
        sprite1.y = winSize.height / 2;

        sprite2 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        sprite3 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        batch.addChild(sprite1);
        sprite1.addChild(sprite2, 2);
        sprite1.addChild(sprite3, -2);

        // test 2
        batch = new cc.SpriteBatchNode(s_grossini, 50);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        sprite1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = 2 * winSize.width / 3;
        sprite1.y = winSize.height / 2;

        sprite2 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        sprite3 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        batch.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, 2);

        // test 3
        batch = new cc.SpriteBatchNode(s_grossini, 50);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        sprite1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = winSize.width / 2 - 90;
        sprite1.y = winSize.height / 4;

        sprite2 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = winSize.width / 2 - 60;
        sprite2.y = winSize.height / 4;

        sprite3 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = winSize.width / 2 - 30;
        sprite3.y = winSize.height / 4;

        batch.addChild(sprite1, 10);
        batch.addChild(sprite2, -10);
        batch.addChild(sprite3, -5);

        // test 4
        batch = new cc.SpriteBatchNode(s_grossini, 50);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        sprite1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = winSize.width / 2 + 30;
        sprite1.y = winSize.height / 4;

        sprite2 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = winSize.width / 2 + 60;
        sprite2.y = winSize.height / 4;

        sprite3 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = winSize.width / 2 + 90;
        sprite3.y = winSize.height / 4;

        batch.addChild(sprite1, -10);
        batch.addChild(sprite2, -5);
        batch.addChild(sprite3, -2);
        //----end30----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(2 * winSize.width / 3 - 20, winSize.height / 2, 5, 5);
        var ret2 = this.readPixels(winSize.width / 3 - 20, winSize.height / 2 + 115, 5, 5);
        var ret3 = this.readPixels(winSize.width / 2 + 30, winSize.height / 4 - 10, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1) ? "yes" : "no",
            "pixel2":!this.containsPixel(ret2, this.pixel2) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel3) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

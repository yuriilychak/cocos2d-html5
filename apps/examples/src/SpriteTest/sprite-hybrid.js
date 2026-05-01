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
// SpriteHybrid
//
//------------------------------------------------------------------
import { TAG_NODE, TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini, s_grossiniPlist } from "../resources";
import { winSize } from "../constants";
import { RotateBy } from "@aspect/actions";

export class SpriteHybrid extends SpriteTestDemo {

    constructor() {
        //----start28----ctor
        super();


        this._usingSpriteBatchNode = false;


        this._title = "Hybrid.Sprite* sprite Test";


        this.testDuration = 2.5;


        this.pixel = {"0":51, "1":0, "2":51, "3":255};


        this.firstPixel1 = false;


        this.firstPixel2 = false;
        // parents
        var parent1 = new cc.Node();
        var parent2 = new cc.SpriteBatchNode(s_grossini, 50);

        this.addChild(parent1, 0, TAG_NODE);
        this.addChild(parent2, 0, TAG_SPRITE_BATCH_NODE);

        // IMPORTANT:
        // The sprite frames will be cached AND RETAINED, and they won't be released unless you call
        cc.spriteFrameCache.addSpriteFrames(s_grossiniPlist);

        // create 250 sprites
        // only show 80% of them
        for (var i = 1; i <= 250; i++) {
            var spriteIdx = Math.round(Math.random() * 14);
            if (spriteIdx === 0)
                spriteIdx = 1;
            var str = "grossini_dance_" + (spriteIdx < 10 ? ("0" + spriteIdx) : spriteIdx) + ".png";

            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            var sprite = new cc.Sprite(frame);
            parent1.addChild(sprite, i, i);

            var x = -1000;
            var y = -1000;
            if (Math.random() < 0.2) {
                x = Math.random() * winSize.width;
                y = Math.random() * winSize.height;
            }
            sprite.x = x;
            sprite.y = y;

            var action = new RotateBy(4, 360);
            sprite.runAction(action.repeatForever());
        }

        this._usingSpriteBatchNode = false;

        this.schedule(this.reparentSprite, 2);
        //----end28----
    }
    onExit() {
        //----start28----onExit
        super.onExit();
        cc.spriteFrameCache.removeSpriteFramesFromFile(s_grossiniPlist);
        //----end28----
    }
    reparentSprite() {
        //----start28----reparentSprite
        var p1 = this.getChildByTag(TAG_NODE);
        var p2 = this.getChildByTag(TAG_SPRITE_BATCH_NODE);

        var retArray = [];
        var node;

        if (this._usingSpriteBatchNode) {
            var tempNode = p2;
            p2 = p1;
            p1 = tempNode;
        }
        ////----UXLog("New parent is: %x", p2);

        var children = p1.children;
        for (var i = 0; i < children.length; i++) {
            node = children[i];
            if (!node)
                break;

            retArray.push(node);
        }

        p1.removeAllChildren(false);
        for (i = 0; i < retArray.length; i++) {
            node = retArray[i];
            if (!node)
                break;

            p2.addChild(node, i, i);
        }

        this._usingSpriteBatchNode = !this._usingSpriteBatchNode;
        //----end28----
    }
    //
    // Automation
    //
    setupAutomation() {
        this.scheduleOnce(this.addTestSprite, 1);
        this.scheduleOnce(this.checkFirstPixel, 1.5);
    }
    addTestSprite() {
        var p = this.getChildByTag(TAG_NODE);
        var frame = cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png");
        var sprite1 = new cc.Sprite(frame);
        p.addChild(sprite1, 1000);
        sprite1.x = winSize.width / 4;
        sprite1.y = winSize.height / 2;
        var sprite2 = new cc.Sprite(frame);
        p.addChild(sprite2, 1000);
        sprite2.x = winSize.width / 2;
        sprite2.y = winSize.height / 2;
    }
    checkFirstPixel() {
        var ret1 = this.readPixels(winSize.width / 4, winSize.height / 2, 5, 5);
        var ret2 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
        this.firstPixel1 = this.containsPixel(ret1, this.pixel);
        this.firstPixel2 = this.containsPixel(ret2, this.pixel);
    }
    getExpectedResult() {
        var ret = {"firstPixel1":true, "firstPixel2":true, "secondPixel1":true, "pixel2":true};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var pixel1 = this.readPixels(winSize.width / 4, winSize.height / 2, 5, 5);
        var pixel2 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
        var secondPixel1 = this.containsPixel(pixel1, this.pixel);
        var secondPixel2 = this.containsPixel(pixel2, this.pixel);
        var ret = {"firstPixel1":this.firstPixel1, "firstPixel2":this.firstPixel2, "secondPixel1":secondPixel1, "pixel2":secondPixel2};
        return JSON.stringify(ret);
    }

}

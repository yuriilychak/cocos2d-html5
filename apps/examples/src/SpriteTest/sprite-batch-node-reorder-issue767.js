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
// SpriteBatchNodeReorderIssue767
//
//------------------------------------------------------------------
import { TAG_SPRITE1, TAG_SPRITE2, TAG_SPRITE_LEFT, TAG_SPRITE_RIGHT } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_ghosts, s_ghostsPlist } from "../resources";
import { winSize } from "../constants";
import { Sprite, SpriteFrameCache } from "@aspect/core";

export class SpriteBatchNodeReorderIssue767 extends SpriteTestDemo {

    constructor() {
        //----start18----ctor
        super();


        this._title = "SpriteBatchNode: reorder issue #767";


        this._subtitle = "Should not crash";


        this.testDuration = 1.5;


        this.pixel1 = {"0":255, "1":204, "2":153, "3":255};


        this.pixel2 = {"0":255, "1":255, "2":255, "3":255};


        this.curPixel1 = null;


        this.curPixel2 = null;

        SpriteFrameCache.getInstance().addSpriteFrames(s_ghostsPlist, s_ghosts);
        //
        // SpriteBatchNode: 3 levels of children
        //
        var aParent = new cc.SpriteBatchNode(s_ghosts);
        this.addChild(aParent, 0, TAG_SPRITE1);

        // parent
        var l1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("father.gif"));
        l1.x = winSize.width / 2;
        l1.y = winSize.height / 2;
        aParent.addChild(l1, 0, TAG_SPRITE2);
        var l1W = l1.width, l1H = l1.height;

        // child left
        var l2a = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("sister1.gif"));
        l2a.x = -25 + l1W / 2;
        l2a.y = 0 + l1H / 2;
        l1.addChild(l2a, -1, TAG_SPRITE_LEFT);
        var l2aW = l2a.width, l2aH = l2a.height;


        // child right
        var l2b = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("sister2.gif"));
        l2b.x = 25 + l1W / 2;
        l2b.y = 0 + l1H / 2;
        l1.addChild(l2b, 1, TAG_SPRITE_RIGHT);
        var l2bW = l2b.width, l2bH = l2b.height;


        // child left bottom
        var l3a1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("child1.gif"));
        l3a1.scale = 0.65;
        l3a1.x = 0 + l2aW / 2;
        l3a1.y = -50 + l2aH / 2;
        l2a.addChild(l3a1, -1);

        // child left top
        var l3a2 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("child1.gif"));
        l3a2.scale = 0.65;
        l3a2.x = 0 + l2aW / 2;
        l3a2.y = +50 + l2aH / 2;
        l2a.addChild(l3a2, 1);

        // child right bottom
        var l3b1 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("child1.gif"));
        l3b1.scale = 0.65;
        l3b1.x = 0 + l2bW / 2;
        l3b1.y = -50 + l2bH / 2;
        l2b.addChild(l3b1, -1);

        // child right top
        var l3b2 = new Sprite(SpriteFrameCache.getInstance().getSpriteFrame("child1.gif"));
        l3b2.scale = 0.65;
        l3b2.x = 0 + l2bW / 2;
        l3b2.y = +50 + l2bH / 2;
        l2b.addChild(l3b2, 1);

        this.schedule(this.reorderSprites, 1);
        //----end18----
    }
    reorderSprites(dt) {
        //----start18----reorderSprites
        var spritebatch = this.getChildByTag(TAG_SPRITE1);
        var father = spritebatch.getChildByTag(TAG_SPRITE2);
        var left = father.getChildByTag(TAG_SPRITE_LEFT);
        var right = father.getChildByTag(TAG_SPRITE_RIGHT);

        var newZLeft = 1;

        if (left.zIndex === 1)
            newZLeft = -1;

        father.reorderChild(left, newZLeft);
        father.reorderChild(right, -newZLeft);
        //----end18----
    }
    //
    // Automation
    //
    setupAutomation() {
        var fun = function(){
            this.curPixel1 = this.readPixels(winSize.width / 2 + 11, winSize.height / 2 - 11, 2, 2);
        }
        this.scheduleOnce(fun, 0.5);
    }
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        this.curPixel2 = this.readPixels(winSize.width / 2 + 11, winSize.height / 2 - 11, 2, 2);
        var ret = {"pixel1":this.containsPixel(this.curPixel1, this.pixel1) ? "yes" : "no",
            "pixel2":this.containsPixel(this.curPixel2, this.pixel2) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

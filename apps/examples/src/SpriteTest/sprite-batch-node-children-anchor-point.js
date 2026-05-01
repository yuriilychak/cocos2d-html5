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
// SpriteBatchNodeChildrenAnchorPoint
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini, s_grossiniPlist, s_pathR1 } from "../resources";
import { winSize } from "../constants";

export class SpriteBatchNodeChildrenAnchorPoint extends SpriteTestDemo {


    constructor() {
        //----start34----ctor
        super();



        this._title = "SpriteBatchNode: children + anchor";



        this.testDuration = 1;



        this.pixel = {"0":255, "1":204, "2":153, "3":255};

        cc.spriteFrameCache.addSpriteFrames(s_grossiniPlist);
        //
        // SpriteBatchNode
        //
        // parents
        var aParent = new cc.SpriteBatchNode(s_grossini, 50);
        this.addChild(aParent, 0);

        // anchor (0,0)
        var sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_08.png"));
        sprite1.x = winSize.width / 4;
        sprite1.y = winSize.height / 2;
        sprite1.anchorX = 0;
        sprite1.anchorY = 0;

        var sprite2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        var sprite3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        var sprite4 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_04.png"));
        sprite4.x = 0;
        sprite4.y = 0;
        sprite4.scale = 0.5;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, -2);
        sprite1.addChild(sprite4, 3);

        var point = new cc.Sprite(s_pathR1);
        point.scale = 0.25;
	    point.x = sprite1.x;
	    point.y = sprite1.y;
        this.addChild(point, 10);

        // anchor (0.5, 0.5)
        sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_08.png"));
        sprite1.x = winSize.width / 2;
        sprite1.y = winSize.height / 2;
        sprite1.anchorX = 0.5;
        sprite1.anchorY = 0.5;

        sprite2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        sprite3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        sprite4 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_04.png"));
        sprite4.x = 0;
        sprite4.y = 0;
        sprite4.scale = 0.5;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, -2);
        sprite1.addChild(sprite4, 3);

        point = new cc.Sprite(s_pathR1);
        point.scale = 0.25;
        point.x = sprite1.x;
	    point.y = sprite1.y;
        this.addChild(point, 10);


        // anchor (1,1)
        sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_08.png"));
        sprite1.x = winSize.width / 2 + winSize.width / 4;
        sprite1.y = winSize.height / 2;
        sprite1.anchorX = 1;
        sprite1.anchorY = 1;

        sprite2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        sprite3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        sprite4 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_04.png"));
        sprite4.x = 0;
        sprite4.y = 0;
        sprite4.scale = 0.5;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, -2);
        sprite1.addChild(sprite4, 3);

        point = new cc.Sprite(s_pathR1);
        point.scale = 0.25;
        point.x = sprite1.x;
	    point.y = sprite1.y;
        this.addChild(point, 10);
        //----end34----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(3 * winSize.width / 4 - 87, winSize.height / 2 - 99, 5, 5);
        var ret2 = this.readPixels(2 * winSize.width / 4 - 59, winSize.height / 2 - 66, 5, 5);
        var ret3 = this.readPixels(winSize.width / 4 - 15, winSize.height / 2 - 6, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel) ? "yes" : "no", "pixel2":this.containsPixel(ret2, this.pixel) ? "yes" : "no", "pixel3":this.containsPixel(ret3, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

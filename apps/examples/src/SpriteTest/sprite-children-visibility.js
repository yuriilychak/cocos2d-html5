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
// SpriteChildrenVisibility
//
//------------------------------------------------------------------
export class SpriteChildrenVisibility extends SpriteTestDemo {

    constructor() {
        //----start31----ctor
        super();


        this._title = "Sprite & SpriteBatchNode Visibility";


        this.testDuration = 1.7;


        this.pixel1 = {"0":0, "1":0, "2":0, "3":255};


        this.pixel2 = {"0":255, "1":204, "2":153, "3":255};


        this.visible1 = null;


        this.visible2 = null;

        cc.spriteFrameCache.addSpriteFrames(s_grossiniPlist);
        //
        // SpriteBatchNode
        //
        // parents
        var aParent = new cc.SpriteBatchNode(s_grossini, 50);
        aParent.x = winSize.width / 3;
        aParent.y = winSize.height / 2;
        this.addChild(aParent, 0);

        var sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = 0;
        sprite1.y = 0;

        var sprite2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        var sprite3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, 2);

        sprite1.runAction(new cc.Blink(5, 10));

        //
        // Sprite
        //
        aParent = new cc.Node();
        aParent.x = 2 * winSize.width / 3;
        aParent.y = winSize.height / 2;
        this.addChild(aParent, 0);

        sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = 0;
        sprite1.y = 0;

        sprite2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        sprite3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, 2);

        sprite1.runAction(new cc.Blink(5, 10));
        //----end31----
    }
    //
    // Automation
    //
    setupAutomation() {
        this.scheduleOnce(this.getSpriteVisible, 1.2);
    }
    getSpriteVisible() {
        var ret1 = this.readPixels(winSize.width / 3, winSize.height / 2 + 38, 5, 5);
        var ret2 = this.readPixels(2 * winSize.width / 3, winSize.height / 2 + 38, 5, 5);
        this.visible1 = this.containsPixel(ret1, this.pixel1) ? "true" : "false";
        this.visible2 = this.containsPixel(ret2, this.pixel1) ? "true" : "false";
    }
    getExpectedResult() {
        var ret = {"visible1":"true", "visible2":"true", "visible3":"false", "visible4":"false"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 3, winSize.height / 2 + 38, 5, 5);
        var ret2 = this.readPixels(2 * winSize.width / 3, winSize.height / 2 + 38, 5, 5);
        this.visible3 = this.containsPixel(ret1, this.pixel2) ? "true" : "false";
        this.visible4 = this.containsPixel(ret2, this.pixel2) ? "true" : "false";
        var ret = {"visible1":this.visible1, "visible2":this.visible2, "visible3":this.visible3, "visible4":this.visible4};
        return JSON.stringify(ret);
    }

}

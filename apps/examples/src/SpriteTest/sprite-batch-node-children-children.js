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
// SpriteBatchNodeChildrenChildren
//
//------------------------------------------------------------------
export class SpriteBatchNodeChildrenChildren extends SpriteTestDemo {


    constructor() {
        //----start37----ctor
        super();



        this._title = "SpriteBatchNode multiple levels of children";



        this.testDuration = 4;



        this.pixel = {"0":153, "1":204, "2":153, "3":255};

        cc.spriteFrameCache.addSpriteFrames(s_ghostsPlist);

        var rot = new cc.RotateBy(10, 360);
        var seq = rot.repeatForever();

        var rot_back = rot.reverse();
        var rot_back_fe = rot_back.repeatForever();

        //
        // SpriteBatchNode: 3 levels of children
        //
        var aParent = new cc.SpriteBatchNode(s_ghosts);
        if ("opengl" in cc.sys.capabilities && cc.rendererConfig.isWebGL)
            aParent.texture.generateMipmap();
        this.addChild(aParent);

        // parent
        var l1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("father.gif"));
        l1.x = winSize.width / 2;
        l1.y = winSize.height / 2;
        l1.runAction(seq.clone());
        aParent.addChild(l1);
        var l1W = l1.width, l1H = l1.height;

        // child left
        var l2a = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sister1.gif"));
        l2a.x = -50 + l1W / 2;
        l2a.y = 0 + l1H / 2;
        l2a.runAction(rot_back_fe.clone());
        l1.addChild(l2a);
        var l2aW = l2a.width, l2aH = l2a.height;


        // child right
        var l2b = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sister2.gif"));
        l2b.x = 50 + l1W / 2;
        l2b.y = 0 + l1H / 2;
        l2b.runAction(rot_back_fe.clone());
        l1.addChild(l2b);
        var l2bW = l2b.width, l2bH = l2b.height;


        // child left bottom
        var l3a1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("child1.gif"));
        l3a1.scale = 0.45;
        l3a1.x = 0 + l2aW / 2;
        l3a1.y = -100 + l2aH / 2;
        l2a.addChild(l3a1);

        // child left top
        var l3a2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("child1.gif"));
        l3a2.scale = 0.45;
        l3a2.x = 0 + l2aW / 2;
        l3a2.y = +100 + l2aH / 2;
        l2a.addChild(l3a2);

        // child right bottom
        var l3b1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("child1.gif"));
        l3b1.scale = 0.45;
        l3b1.setFlippedY(true);
        l3b1.x = 0 + l2bW / 2;
        l3b1.y = -100 + l2bH / 2;
        l2b.addChild(l3b1);

        // child right top
        var l3b2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("child1.gif"));
        l3b2.scale = 0.45;
        l3b2.setFlippedY(true);
        l3b2.x = 0 + l2bW / 2;
        l3b2.y = +100 + l2bH / 2;
        l2b.addChild(l3b2);
        //----end37----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes", "pixel4":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2 + 42, winSize.height / 2 + 145, 5, 5);
        var ret2 = this.readPixels(winSize.width / 2 - 39, winSize.height / 2 + 55, 5, 5);
        var ret3 = this.readPixels(winSize.width / 2 - 39, winSize.height / 2 - 146, 5, 5);
        var ret4 = this.readPixels(winSize.width / 2 + 42, winSize.height / 2 - 56, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel) ? "yes" : "no",
            "pixel4":this.containsPixel(ret4, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

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
// SpriteBatchNodeChildrenScale
//
//------------------------------------------------------------------
export class SpriteBatchNodeChildrenScale extends SpriteTestDemo {


    constructor() {
        //----start35----ctor
        super();



        this._title = "Sprite/BatchNode + child + scale + rot";



        this.testDuration = 2.5;



        this.pixel1 = {"0":56, "1":116, "2":142, "3":255};



        this.pixel2 = {"0":0, "1":0, "2":0, "3":255};
        spriteFrameCache.addSpriteFrames(s_grossini_familyPlist);

        var rot = new RotateBy(10, 360);
        var seq = rot.repeatForever();

        //
        // Children + Scale using Sprite
        // Test 1
        //
        var aParent = new Node();
        var sprite1 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister1.png"));
        sprite1.x = winSize.width / 4;
        sprite1.y = winSize.height / 4;
        sprite1.scaleX = 0.5;
        sprite1.scaleY = 2.0;
        sprite1.runAction(seq);


        var sprite2 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister2.png"));
        sprite2.x = 50;
        sprite2.y = 0;

        this.addChild(aParent);
        aParent.addChild(sprite1);
        sprite1.addChild(sprite2);

        rot = new RotateBy(10, 360);
        seq = rot.repeatForever();
        //
        // Children + Scale using SpriteBatchNode
        // Test 2
        //
        aParent = new SpriteBatchNode(s_grossini_family);
        sprite1 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister1.png"));
        sprite1.x = 3 * winSize.width / 4;
        sprite1.y = winSize.height / 4;
        sprite1.scaleX = 0.5;
        sprite1.scaleY = 2.0;
        sprite1.runAction(seq);

        sprite2 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister2.png"));
        sprite2.x = 50;
        sprite2.y = 0;

        this.addChild(aParent);
        aParent.addChild(sprite1);
        sprite1.addChild(sprite2);

        rot = new RotateBy(10, 360);
        seq = rot.repeatForever();
        //
        // Children + Scale using Sprite
        // Test 3
        //
        aParent = new Node();
        sprite1 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister1.png"));
        sprite1.x = winSize.width / 4;
        sprite1.y = 2 * winSize.height / 3;
        sprite1.scaleX = 1.5;
        sprite1.scaleY = 0.5;
        sprite1.runAction(seq);

        sprite2 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister2.png"));
        sprite2.x = 50;
        sprite2.y = 0;

        this.addChild(aParent);
        aParent.addChild(sprite1);
        sprite1.addChild(sprite2);

        rot = new RotateBy(10, 360);
        seq = rot.repeatForever();
        //
        // Children + Scale using Sprite
        // Test 4
        //
        aParent = new SpriteBatchNode(s_grossini_family);
        sprite1 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister1.png"));
        sprite1.x = 3 * winSize.width / 4;
        sprite1.y = 2 * winSize.height / 3;
        sprite1.scaleX = 1.5;
        sprite1.scaleY = 0.5;
        sprite1.runAction(seq);

        sprite2 = new Sprite(spriteFrameCache.getSpriteFrame("grossinis_sister2.png"));
        sprite2.x = 50;
        sprite2.y = 0;

        this.addChild(aParent);
        aParent.addChild(sprite1);
        sprite1.addChild(sprite2);
        //----end35----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes", "pixel4":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 4 - 31, 2 * winSize.height / 3 + 16, 5, 5);
        var ret2 = this.readPixels(winSize.width / 4 - 38, 2 * winSize.height / 3 + 16, 3, 3);
        var ret3 = this.readPixels(3 * winSize.width / 4 - 31, 2 * winSize.height / 3 + 16, 5, 5);
        var ret4 = this.readPixels(3 * winSize.width / 4 - 38, 2 * winSize.height / 3 + 16, 3, 3);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel1) ? "yes" : "no",
            "pixel4":this.containsPixel(ret4, this.pixel2) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

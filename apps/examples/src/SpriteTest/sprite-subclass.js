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

export class SpriteSubclass extends SpriteTestDemo {

    constructor() {
        //----start39----ctor
        super();


        this._title = "Sprite subclass";


        this._subtitle = "Testing initWithTexture:rect method";


        this.testDuration = 1;


        this.pixel1 = {"0":249, "1":30, "2":20, "3":255};


        this.pixel2 = {"0":255, "1":204, "2":153, "3":255};

        cc.spriteFrameCache.addSpriteFrames(s_ghostsPlist);
		var aParent = new cc.SpriteBatchNode(s_ghosts);

		// MySprite1
		var sprite = new MySprite1("#father.gif");
		sprite.x = winSize.width / 4;
		sprite.y = winSize.height / 2;
		aParent.addChild(sprite);
		this.addChild(aParent);

        // MySprite2
        var sprite2 = new MySprite2(s_pathGrossini);
        this.addChild(sprite2);
        sprite2.x = winSize.width / 4 * 3;
        sprite2.y = winSize.height / 2;
        //----end39----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 4, winSize.height / 2 - 15, 5, 5);
        var ret2 = this.readPixels(winSize.width / 4 * 3, winSize.height / 2 + 44, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1) ? "yes" : "no", "pixel2":this.containsPixel(ret2, this.pixel2) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

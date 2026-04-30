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
// SpriteFrameTest
//
//------------------------------------------------------------------
export class SpriteFrameTest extends SpriteTestDemo {
    constructor() {
        super();
        this._sprite1 = null;
        this._sprite2 = null;
        this._counter = 0;
        this._title = "Sprite vs. SpriteBatchNode animation";
        this._subtitle = "Testing issue #792";
        this.testDuration = 3.1;
        this.pixel1 = {"0":255, "1":204, "2":153, "3":255};
        this.pixel2 = {"0":255, "1":204, "2":153, "3":255};
    }


    onEnter() {
        //----start2----onEnter
        super.onEnter();
        // IMPORTANT:
        // The sprite frames will be cached AND RETAINED, and they won't be released unless you call
        //     spriteFrameCache.removeUnusedSpriteFrames);
        spriteFrameCache.addSpriteFrames(s_grossiniPlist);
        spriteFrameCache.addSpriteFrames(s_grossini_grayPlist, s_grossini_gray);
        spriteFrameCache.addSpriteFrames(s_grossini_bluePlist, s_grossini_blue);

        //
        // Animation using Sprite BatchNode
        //
        this._sprite1 = new Sprite("#grossini_dance_01.png");
        this._sprite1.x = winSize.width / 2 - 80;
        this._sprite1.y = winSize.height / 2;

        var spritebatch = new SpriteBatchNode(s_grossini);
        spritebatch.addChild(this._sprite1);
        this.addChild(spritebatch);

        var animFrames = [];
        var str = "";
        var frame;
        for (var i = 1; i < 15; i++) {
            str = "grossini_dance_" + (i < 10 ? ("0" + i) : i) + ".png";
            frame = spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new Animation(animFrames, 0.3);
        this._sprite1.runAction(new Animate(animation).repeatForever());

        // to test issue #732, uncomment the following line
        this._sprite1.flippedX = false;
        this._sprite1.flippedY = false;

        //
        // Animation using standard Sprite
        //
        this._sprite2 = new Sprite("#grossini_dance_01.png");
        this._sprite2.x = winSize.width / 2 + 80;
        this._sprite2.y = winSize.height / 2;
        this.addChild(this._sprite2);

        var moreFrames = [];
        for (i = 1; i < 15; i++) {
            str = "grossini_dance_gray_" + (i < 10 ? ("0" + i) : i) + ".png";
            frame = spriteFrameCache.getSpriteFrame(str);
            moreFrames.push(frame);
        }

        for (i = 1; i < 5; i++) {
            str = "grossini_blue_0" + i + ".png";
            frame = spriteFrameCache.getSpriteFrame(str);
            moreFrames.push(frame);
        }

        // append frames from another batch
        moreFrames = moreFrames.concat(animFrames);
        var animMixed = new Animation(moreFrames, 0.3);

        this._sprite2.runAction(new Animate(animMixed).repeatForever());

        // to test issue #732, uncomment the following line
        this._sprite2.flippedX = false;
        this._sprite2.flippedY = false;

        this.schedule(this.onStartIn05Secs, 0.5);
        this._counter = 0;
        //----end2----
    }
    onExit() {
        //----start2----onExit
        super.onExit();
        spriteFrameCache.removeSpriteFramesFromFile(s_grossiniPlist);
        spriteFrameCache.removeSpriteFramesFromFile(s_grossini_grayPlist);
        spriteFrameCache.removeSpriteFramesFromFile(s_grossini_bluePlist);
        //----end2----
    }
    onStartIn05Secs() {
        //----start2----onStartIn05Secs
        this.unschedule(this.onStartIn05Secs);
        this.schedule(this.onFlipSprites, 1.0);
        //----end2----
    }
    onFlipSprites(dt) {
        //----start2----onFlipSprites
        this._counter++;

        var fx = false;
        var fy = false;
        var i = this._counter % 4;

        switch (i) {
            case 0:
                fx = false;
                fy = false;
                break;
            case 1:
                fx = true;
                fy = false;
                break;
            case 2:
                fx = false;
                fy = true;
                break;
            case 3:
                fx = true;
                fy = true;
                break;
        }

        this._sprite1.flippedX = fx;
        this._sprite1.flippedY = fy;
        this._sprite2.flippedX = fx;
        this._sprite2.flippedY = fy;
        //----end2----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2 - 50, winSize.height / 2 + 8, 5, 5);
        var ret2 = this.readPixels(winSize.width / 2 - 80, winSize.height / 2 - 42, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

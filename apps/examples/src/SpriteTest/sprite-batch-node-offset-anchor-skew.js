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

//
// SpriteBatchNodeOffsetAnchorSkew
//
export class SpriteBatchNodeOffsetAnchorSkew extends SpriteTestDemo {


    constructor() {
        //----start42----ctor
        super();



        this._title = "SpriteBatchNode offset + anchor + skew";



        this.testDuration = 2;



        this.pixel = {"0":255, "1":204, "2":153, "3":255};
        cc.spriteFrameCache.addSpriteFrames(s_grossiniPlist);
        cc.spriteFrameCache.addSpriteFrames(s_grossini_grayPlist, s_grossini_gray);

        var spritebatch = new cc.SpriteBatchNode(s_grossini);
        this.addChild(spritebatch);

        for (var i = 0; i < 3; i++) {
            //
            // Animation using Sprite batch
            //
            var sprite = new cc.Sprite("#grossini_dance_01.png");
            sprite.x = winSize.width / 4 * (i + 1);
            sprite.y = winSize.height / 2;

            var point = new cc.Sprite(s_pathR1);
            point.scale = 0.25;
	        point.x = sprite.x;
	        point.y = sprite.y;
            this.addChild(point, 200);

            switch (i) {
                case 0:
                    sprite.anchorX = 0;
                    sprite.anchorY = 0;
                    break;
                case 1:
                    sprite.anchorX = 0.5;
                    sprite.anchorY = 0.5;
                    break;
                case 2:
                    sprite.anchorX = 1;
                    sprite.anchorY = 1;
                    break;
            }

	        point.x = sprite.x;
	        point.y = sprite.y;

            var animFrames = [];
            var tmp = "";
            for (var j = 1; j <= 14; j++) {
                tmp = "grossini_dance_" + (j < 10 ? ("0" + j) : j) + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(tmp);
                animFrames.push(frame);
            }

            var animation = new cc.Animation(animFrames, 0.3);
            sprite.runAction(new cc.Animate(animation).repeatForever());

            animFrames = null;

            var skewX = new cc.SkewBy(2, 45, 0);
            var skewX_back = skewX.reverse();
            var skewY = new cc.SkewBy(2, 0, 45);
            var skewY_back = skewY.reverse();

            var seq_skew = cc.sequence(skewX, skewX_back, skewY, skewY_back);
            sprite.runAction(seq_skew.repeatForever());

            spritebatch.addChild(sprite, i);
        }
        //----end42----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 4 + 142, winSize.height / 2 + 98, 5, 5);
        var ret2 = this.readPixels(winSize.width / 4 * 2 + 50, winSize.height / 2 + 43, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

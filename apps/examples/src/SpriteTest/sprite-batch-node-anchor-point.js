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
// SpriteBatchNodeAnchorPoint
//
//------------------------------------------------------------------
export class SpriteBatchNodeAnchorPoint extends SpriteTestDemo {

    constructor() {
        //----start5----ctor
        super();


        this._title = "SpriteBatchNode: anchor point";


        this.testDuration = 0.15;


        this.pixel = {"0":255, "1":204, "2":153, "3":255};
        // small capacity. Testing resizing.
        // Don't use capacity=1 in your real game. It is expensive to resize the capacity
        var batch = new SpriteBatchNode(s_grossini_dance_atlas, 1);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        for (var i = 0; i < 3; i++) {
            var rotate = new RotateBy(10, 360);
            var action = rotate.repeatForever();
            var sprite = new Sprite(batch.texture, new Rect(85 * i, 121, 85, 121));
            sprite.x = winSize.width / 4 * (i + 1);
            sprite.y = winSize.height / 2;

            var point = new Sprite(s_pathR1);
            point.scale = 0.25;
            point.x = sprite.x;
            point.y = sprite.y;
            this.addChild(point, 1);

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
            sprite.runAction(action);
            batch.addChild(sprite, i);
        }
        //----end5----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 4 + 45, winSize.height / 2 + 104, 5, 5);
        var ret2 = this.readPixels(winSize.width / 4 * 2 - 3, winSize.height / 2 + 44, 5, 5);
        var ret3 = this.readPixels(winSize.width / 4 * 3 - 44, winSize.height / 2 - 16, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel) ? "yes" : "no", "pixel2":this.containsPixel(ret2, this.pixel) ? "yes" : "no", "pixel3":this.containsPixel(ret3, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

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

export class TextureRotatedSpriteFrame extends SpriteTestDemo {


    constructor() {
        //----start57----ctor
        super();



        this._title = "Sub Sprite (rotated source)";



        this._subtitle = "createWithSpriteFrameName(); sub sprite";



        this.pixel1 = {"0":255, "1":204, "2":153, "3":255};



        this.pixel2 = {"0":51, "1":0, "2":51, "3":255};

        cc.spriteFrameCache.addSpriteFrames(s_s9s_blocks9_plist);

        var block = new cc.Sprite('#blocks9r.png');

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        block.setTextureRect(new cc.Rect(32, 32, 32, 32), true, new cc.Rect(32, 32, 32, 32));

        block.x = x;

        block.y = y;
        this.addChild(block);
        //----end57----
    }
    // Automation
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2 - 14, winSize.height / 2 - 8, 5, 5);
        var ret2 = this.readPixels(winSize.width / 2 + 12, winSize.height / 2, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, true, 5) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, true, 5) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

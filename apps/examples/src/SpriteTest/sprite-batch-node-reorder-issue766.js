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
// SpriteBatchNodeReorderIssue766
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo.js";
import { s_piece } from "../tests_resources.js";

export class SpriteBatchNodeReorderIssue766 extends SpriteTestDemo {


    constructor() {
        //----start17----ctor
        super();



        this._batchNode = null;



        this._sprite1 = null;



        this._sprite2 = null;



        this._sprite3 = null;



        this._title = "SpriteBatchNode: reorder issue #766";



        this._subtitle = "In 2 seconds 1 sprite will be reordered";



        this.testDuration = 2.2;



        this.pixel1 = {"0":0, "1":0, "2":0, "3":255};



        this.pixel2 = {"0":255, "1":255, "2":255, "3":255};
        this._batchNode = new cc.SpriteBatchNode(s_piece, 15);
        this.addChild(this._batchNode, 1, 0);

        this._sprite1 = this.makeSpriteZ(2);
        this._sprite1.x = 200;
        this._sprite1.y = 160;

        this._sprite2 = this.makeSpriteZ(3);
        this._sprite2.x = 264;
        this._sprite2.y = 160;

        this._sprite3 = this.makeSpriteZ(4);
        this._sprite3.x = 328;
        this._sprite3.y = 160;

        this.schedule(this.reorderSprite, 2);
        //----end17----
    }
    reorderSprite(dt) {
        //----start17----reorderSprite
        this.unschedule(this.reorderSprite);

        this._batchNode.reorderChild(this._sprite1, 4);
        //----end17----
    }
    makeSpriteZ(aZ) {
        //----start17----makeSpriteZ
        var sprite = new cc.Sprite(this._batchNode.texture, new cc.Rect(128, 0, 64, 64));
        this._batchNode.addChild(sprite, aZ + 1, 0);

        //children
        var spriteShadow = new cc.Sprite(this._batchNode.texture, new cc.Rect(0, 0, 64, 64));
        spriteShadow.opacity = 128;
        sprite.addChild(spriteShadow, aZ, 3);

        var spriteTop = new cc.Sprite(this._batchNode.texture, new cc.Rect(64, 0, 64, 64));
        sprite.addChild(spriteTop, aZ + 2, 3);

        return sprite;
        //----end17----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(213, 159, 5, 5);
        var ret2 = this.readPixels(211, 108, 5, 5);
        var ret = {"pixel1":!this.containsPixel(ret1, this.pixel1) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

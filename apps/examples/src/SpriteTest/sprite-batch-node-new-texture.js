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
// SpriteBatchNodeNewTexture
//
//------------------------------------------------------------------
import { TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas, s_grossini_dance_atlas_mono } from "../resources";
import { winSize } from "../constants";

export class SpriteBatchNodeNewTexture extends SpriteTestDemo {

    constructor() {
        //----start27----ctor
        super();


        this._texture1 = null;


        this._texture2 = null;


        this._title = "SpriteBatchNode new texture (tap)";


        this.testDuration = 1;


        this.pixel = {"0":51, "1":0, "2":51, "3":255};
        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded:function (touches, event) {
                    event.getCurrentTarget().onChangeTexture();
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
           cc.eventManager.addListener({
               event: cc.EventListener.MOUSE,
               onMouseUp: function(event){
                   event.getCurrentTarget().onChangeTexture();
               }
           }, this);

        var batch = new cc.SpriteBatchNode(s_grossini_dance_atlas, 50);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        this._texture1 = batch.texture;
        this._texture2 = cc.textureCache.addImage(s_grossini_dance_atlas_mono);

        for (var i = 0; i < 30; i++) {
            this.addNewSprite();
        }
        //----end27----
    }
    addNewSprite() {
        //----start27----addNewSprite
        var s = winSize;

        var p = new cc.Point(Math.random() * winSize.width, Math.random() * winSize.height);

        var batch = this.getChildByTag(TAG_SPRITE_BATCH_NODE);

        var idx = 0 | (Math.random() * 14);
        var x = (idx % 5) * 85;
        var y = (0 | (idx / 5)) * 121;

        var sprite = new cc.Sprite(batch.texture, new cc.Rect(x, y, 85, 121));
        batch.addChild(sprite);

        sprite.x = p.x;

        sprite.y = p.y;

        var action;
        var random = Math.random();

        if (random < 0.20)
            action = new cc.ScaleBy(3, 2);
        else if (random < 0.40)
            action = new cc.RotateBy(3, 360);
        else if (random < 0.60)
            action = new cc.Blink(1, 3);
        //else if (random < 0.8)
        //    action = new cc.TintBy(2, 0, -255, -255);
        else
            action = new cc.FadeOut(2);
        var action_back = action.reverse();
        var seq = cc.sequence(action, action_back);

        sprite.runAction(seq.repeatForever());
        //----end27----
    }
    onChangeTexture() {
        //----start27----onChangeTexture
        var batch = this.getChildByTag(TAG_SPRITE_BATCH_NODE);

        if (batch.texture == this._texture1)
            batch.texture = this._texture2;
        else
            batch.texture = this._texture1;
        //----end27----
    }

    //
    // Automation
    //
    setupAutomation() {
        this.scheduleOnce(this.addTestSprite, 0.5);
    }
    addTestSprite() {
        var node = this.getChildByTag(TAG_SPRITE_BATCH_NODE);
        var sprite = new cc.Sprite(this._texture1, new cc.Rect(0, 0, 85, 121));
        sprite.x = winSize.width / 2;
        sprite.y = winSize.height / 2;
        node.addChild(sprite);
    }
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

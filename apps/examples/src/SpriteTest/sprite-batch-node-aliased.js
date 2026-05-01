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
// SpriteBatchNodeAliased
//
//------------------------------------------------------------------
import { TAG_SPRITE1, TAG_SPRITE2, TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas } from "../resources";
import { winSize } from "../constants";
import { LabelTTF, Rect } from "@aspect/core";
import { ScaleBy, sequence } from "@aspect/actions";

export class SpriteBatchNodeAliased extends SpriteTestDemo {

    constructor() {
        //----start25----ctor
        super();


        this._title = "SpriteBatchNode Aliased";


        this._subtitle = "You should see pixelated sprites";
        var batch = new cc.SpriteBatchNode(s_grossini_dance_atlas, 10);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        var sprite1 = new cc.Sprite(batch.texture, new Rect(85, 121, 85, 121));
        sprite1.x = winSize.width / 2 - 100;
        sprite1.y = winSize.height / 2;
        batch.addChild(sprite1, 0, TAG_SPRITE1);

        var sprite2 = new cc.Sprite(batch.texture, new Rect(85, 121, 85, 121));
        sprite2.x = winSize.width / 2 + 100;
        sprite2.y = winSize.height / 2;
        batch.addChild(sprite2, 0, TAG_SPRITE2);

        var scale = new ScaleBy(2, 5);
        var scale_back = scale.reverse();
        var seq = sequence(scale, scale_back);
        var repeat = seq.repeatForever();

        var scale2 = new ScaleBy(2, 5);
        var scale_back2 = scale2.reverse();
        var seq2 = sequence(scale2, scale_back2);
        var repeat2 = seq2.repeatForever();

        sprite1.runAction(repeat);
        sprite2.runAction(repeat2);
        //----end25----
    }
    onEnter() {
        //----start25----onEnter
        super.onEnter();
        //
        // IMPORTANT:
        // This change will affect every sprite that uses the same texture
        // So sprite1 and sprite2 will be affected by this change
        //
        if (!cc.sys.isNative && !("opengl" in cc.sys.capabilities && cc.rendererConfig.isWebGL)) {
            var label = new LabelTTF("Not supported on HTML5-canvas", "Times New Roman", 30);
            this.addChild(label);
            label.x = winSize.width / 2;
            label.y = winSize.height / 2;
        } else {
            var sprite = this.getChildByTag(TAG_SPRITE_BATCH_NODE);
            sprite.texture.setAliasTexParameters();
        }
        //----end25----

    }
    onExit() {
        //----start25----onExit
        if (cc.sys.isNative || ("opengl" in cc.sys.capabilities && cc.rendererConfig.isWebGL)) {
            var sprite = this.getChildByTag(TAG_SPRITE_BATCH_NODE);
            sprite.texture.setAntiAliasTexParameters();
        }
        super.onExit();
        //----end25----
    }

}

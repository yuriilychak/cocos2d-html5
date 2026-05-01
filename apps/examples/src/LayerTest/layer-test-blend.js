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
// LayerTestBlend
//
//------------------------------------------------------------------
import { LayerTest } from "./layer-test";
import { s_pathSister1, s_pathSister2 } from "../resources";
import { winSize } from "../constants";

export class LayerTestBlend extends LayerTest {

    constructor() {
        //----start2----ctor
        super();


        this._blend = true;
        var layer1 = new cc.LayerColor(new cc.Color(255, 255, 255, 80));

        var sister1 = new cc.Sprite(s_pathSister1);
        var sister2 = new cc.Sprite(s_pathSister2);

        this.addChild(sister1);
        this.addChild(sister2);
        this.addChild(layer1, 100, cc.TAG_LAYER);

        sister1.x = winSize.width/3;

        sister1.y = winSize.height / 2;
        sister2.x = winSize.width/3 * 2;
        sister2.y = winSize.height / 2;

        if (!cc.sys.isNative && !("opengl" in cc.sys.capabilities)) {
            var label = new cc.LabelTTF("Not supported on HTML5-canvas", "Times New Roman", 30);
            this.addChild(label);
            label.x = winSize.width / 2;
            label.y = winSize.height / 2;
        }

        this.schedule(this.onNewBlend, 1.0);
        this._blend = true;
        //----end2----
    }
    onNewBlend(dt) {
        //----start2----onNewBlend
        var layer = this.getChildByTag(cc.TAG_LAYER);

        var src;
        var dst;

        if (this._blend) {
            src = cc.SRC_ALPHA;
            dst = cc.ONE_MINUS_SRC_ALPHA;
        } else {
            src = cc.ONE_MINUS_DST_COLOR;
            dst = cc.ZERO;
        }
        layer.setBlendFunc( src, dst );
        this._blend = ! this._blend;
        //----end2----
    }
    title() {
        return "ColorLayer: blend";
    }

}

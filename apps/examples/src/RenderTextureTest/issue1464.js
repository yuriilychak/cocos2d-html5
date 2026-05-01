/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
// Issue1464
//
//------------------------------------------------------------------
import { RenderTextureBaseLayer } from "./render-texture-base-layer";
import { s_grossini } from "../resources";
import { winSize } from "../constants";
import { LabelTTF, Sprite, Sys } from "@aspect/core";
import { DelayTime, FadeOut, sequence } from "@aspect/actions";

export class Issue1464 extends RenderTextureBaseLayer {

    constructor() {
        super();


        this._brush = null;


        this._target = null;


        this._lastLocation = null;


        this._counter = 0;


        this.testDuration = 2.1;

        var sprite = new Sprite(s_grossini);

        // create a render texture
        var rend = new cc.RenderTexture( winSize.width/2, winSize.height/2 );
        rend.x = winSize.width/2;
        rend.y = winSize.height/2 ;
        this.addChild( rend, 1 );

        sprite.x = winSize.width/4;

        sprite.y = winSize.height/4;
        rend.begin();
        sprite.visit();
        rend.end();

        var fadeout = new FadeOut(2);
        var fadein = fadeout.reverse();
        var delay = new DelayTime(0.25);
        var seq = sequence(fadeout, delay, fadein, delay.clone());
        var fe = seq.repeatForever();
        rend.getSprite().runAction(fe);

        if (!Sys.getInstance().isNative && !("opengl" in Sys.getInstance().capabilities)) {
            var label = new LabelTTF("Not support Actions on HTML5-canvas", "Times New Roman", 30);
            label.x = winSize.width / 2;
            label.y = winSize.height / 2 + 50;
            this.addChild(label, 100);
        }
    }

    title() {
        return "Issue 1464";
    }

    subtitle() {
        return "Sprites should fade in / out correctly";
    }

    //
    // Automation
    //

    getExpectedResult() {
        // blue, red, blue
        var ret = {"0":0,"1":0,"2":0,"3":255,"4":0,"5":0,"6":0,"7":255,"8":0,"9":0,"10":0,"11":255,"12":0,"13":0,"14":0,"15":255,"16":0,"17":0,"18":0,"19":255,"20":0,"21":0,"22":0,"23":255,"24":0,"25":0,"26":0,"27":255,"28":0,"29":0,"30":0,"31":255,"32":0,"33":0,"34":0,"35":255,"36":0,"37":0,"38":0,"39":255,"40":0,"41":0,"42":0,"43":255,"44":0,"45":0,"46":0,"47":255,"48":0,"49":0,"50":0,"51":255,"52":0,"53":0,"54":0,"55":255,"56":0,"57":0,"58":0,"59":255,"60":0,"61":0,"62":0,"63":255};
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = this.readPixels(winSize.width/2-2, winSize.height/2-2,  4, 4);
        return JSON.stringify(ret);
    }

}

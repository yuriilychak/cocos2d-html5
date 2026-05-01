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
// BMFontTintTest
//
//------------------------------------------------------------------
import { AtlasDemo } from "./atlas-demo";
import { s_resprefix } from "../resources";
import { director } from "../constants";
import { Color } from "@aspect/core";

export class BMFontTintTest extends AtlasDemo {
    constructor() {
        //----start7----ctor
        super();

        this.pixel1 = {"0":0,"1":0,"2":255,"3":255};

        this.pixel2 = {"0":255,"1":0,"2":0,"3":255};

        this.pixel3 = {"0":0,"1":255,"2":0,"3":255};
        var s = director.getWinSize();

        var label = null;
        label = new cc.LabelBMFont("Blue", s_resprefix + "fonts/bitmapFontTest5.fnt");
        label.color = new Color(0, 0, 255);
        this.addChild(label);
        label.x = s.width / 2;
        label.y = s.height / 4;
        label.anchorX = 0.5;
        label.anchorY = 0.5;

        label = new cc.LabelBMFont("Red", s_resprefix + "fonts/bitmapFontTest5.fnt");
        this.addChild(label);
        label.x = s.width / 2;
        label.y = 2 * s.height / 4;
        label.anchorX = 0.5;
        label.anchorY = 0.5;
        label.color = new Color(255, 0, 0);

        label = new cc.LabelBMFont("G", s_resprefix + "fonts/bitmapFontTest5.fnt");
        this.addChild(label);
        label.x = s.width / 2;
        label.y = 3 * s.height / 4;
        label.anchorX = 0.5;
        label.anchorY = 0.5;
        label.color = new Color(0, 255, 0);
        label.setString("Green");
        //----end7----
    }
    title() {
        return "cc.LabelBMFont BMFontTintTest";
    }
    subtitle() {
        return "Testing color";
    }

    //
    // Automation
    //

    getExpectedResult() {
        var ret = {"left": "yes", "center": "yes", "right": "yes"};
        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret1 =  this.readPixels(s.width/2, s.height/4, 50, 50);
        var ret2 =  this.readPixels(s.width/2, 2 * s.height/4, 50, 50);
        var ret3 =  this.readPixels(s.width/2, 3 * s.height/4, 50, 50);
        var ret = {"left": this.containsPixel(ret1, this.pixel1, true, 100) ? "yes" : "no",
                   "center": this.containsPixel(ret2, this.pixel2, true, 100) ? "yes" : "no",
                   "right": this.containsPixel(ret3, this.pixel3, true, 100) ? "yes" : "no"}
        return JSON.stringify(ret);
    }

}

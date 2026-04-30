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
// BMFontOffsetTest
//
//------------------------------------------------------------------
import { AtlasDemo } from "./atlas-demo.js";
import { s_resprefix } from "../tests_resources.js";
import { director } from "../tests-main-constants.js";

export class BMFontOffsetTest extends AtlasDemo {
    constructor() {
        //----start6----ctor
        super();

        this.pixel = {"0":150,"1":150,"2":150,"3":255};
        var s = director.getWinSize();

        var label = null;
        label = new cc.LabelBMFont("FaFeFiFoFu", s_resprefix + "fonts/bitmapFontTest5.fnt");
        this.addChild(label);
        label.x = s.width / 2;
        label.y = s.height / 2 + 50;
        label.anchorX = 0.5;
        label.anchorY = 0.5;

        label = new cc.LabelBMFont("fafefifofu", s_resprefix + "fonts/bitmapFontTest5.fnt");
        this.addChild(label);
        label.x = s.width / 2;
        label.y = s.height / 2;
        label.anchorX = 0.5;
        label.anchorY = 0.5;

        label = new cc.LabelBMFont("aeiou", s_resprefix + "fonts/bitmapFontTest5.fnt");
        this.addChild(label);
        label.x = s.width / 2;
        label.y = s.height / 2 - 50;
        label.anchorX = 0.5;
        label.anchorY = 0.5;
        //----end6----
    }
    title() {
        return "cc.LabelBMFont";
    }
    subtitle() {
        return "Rendering should be OK. Testing offset";
    }

    //
    // Automation
    //

    getExpectedResult() {
	var ret =  {"top": "yes", "center": "yes", "bottom": "yes"};

        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret1 =  this.readPixels(s.width/2, s.height/2-50, 50, 50);
        var ret2 =  this.readPixels(s.width/2, s.height/2, 50, 50);
        var ret3 =  this.readPixels(s.width/2, s.height/2+50, 50, 50);
        var ret = {"top": this.containsPixel(ret1, this.pixel, true, 140) ? "yes" : "no",
                   "center": this.containsPixel(ret2, this.pixel, true, 140) ? "yes" : "no",
                   "bottom": this.containsPixel(ret3, this.pixel, true, 140) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

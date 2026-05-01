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
// BMFontMultiLineTest
//
//------------------------------------------------------------------
import { AtlasDemo } from "./atlas-demo";
import { TAG_BITMAP_ATLAS1, TAG_BITMAP_ATLAS2, TAG_BITMAP_ATLAS3 } from "./label-test-constants";
import { s_resprefix } from "../resources";
import { director } from "../constants";
import { LabelBMFont } from "@aspect/labels";

export class BMFontMultiLineTest extends AtlasDemo {
    constructor() {
        //----start9----ctor
        super();

        this.pixel = {"0": 255, "1": 186, "2": 33, "3": 255};

        // Left
        var label1 = new LabelBMFont("Multi line\nLeft", s_resprefix + "fonts/bitmapFontTest3.fnt");
        label1.anchorX = 0;
        label1.anchorY = 0;
        this.addChild(label1, 0, TAG_BITMAP_ATLAS1);
        cc.log("content size:" + label1.width + "," + label1.height);


        // Center
        var label2 = new LabelBMFont("Multi line\nCenter", s_resprefix + "fonts/bitmapFontTest3.fnt");
        label2.anchorX = 0.5;
        label2.anchorY = 0.5;
        this.addChild(label2, 0, TAG_BITMAP_ATLAS2);
        cc.log("content size:" + label2.width + "," + label2.height);

        // right
        var label3 = new LabelBMFont("Multi line\nRight\nThree lines Three", s_resprefix + "fonts/bitmapFontTest3.fnt");
        label3.anchorX = 1;
        label3.anchorY = 1;
        this.addChild(label3, 0, TAG_BITMAP_ATLAS3);
        cc.log("content size:" + label3.width + "," + label3.height);

        var s = director.getWinSize();
        label1.x = 0;
        label1.y = 0;
        label2.x = s.width / 2;
        label2.y = s.height / 2;
        label3.x = s.width;
        label3.y = s.height;
        //----end9----
    }
    title() {
        return "LabelBMFont BMFontMultiLineTest";
    }
    subtitle() {
        return "Multiline + anchor point";
    }

    // Automation


    getExpectedResult() {

        // var ret = [{"0":0,"1":0,"2":226,"3":255},{"0":47,"1":0,"2":0,"3":255},{"0":0,"1":47,"2":0,"3":255}];
        var s = director.getWinSize();
        var ret = {"left": "yes", "center": "yes", "right": "yes"};
        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret1 =  this.readPixels(0, 0, 100, 100);
        var ret2 =  this.readPixels(s.width/2, s.height/2, 100, 100);
        var ret3 =  this.readPixels(s.width - 100, s.height - 100, 100, 100);


        var ret = {"left": this.containsPixel(ret1, this.pixel) ? "yes" : "no",
                   "center": this.containsPixel(ret2, this.pixel) ? "yes" : "no",
                   "right": this.containsPixel(ret3, this.pixel) ? "yes" : "no"}
        return JSON.stringify(ret);
    }

}

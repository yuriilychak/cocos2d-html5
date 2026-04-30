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
// LabelsEmpty
//
//------------------------------------------------------------------
import { AtlasDemo } from "./atlas-demo.js";
import { TAG_BITMAP_ATLAS1, TAG_BITMAP_ATLAS2, TAG_BITMAP_ATLAS3 } from "./label-test-constants.js";
import { s_resprefix } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class LabelsEmpty extends AtlasDemo {
    constructor() {
        //----start25----ctor
        super();

        this.setEmpty = null;


        // cc.LabelBMFont
        var label1 = new cc.LabelBMFont("", s_resprefix + "fonts/bitmapFontTest3.fnt");
        this.addChild(label1, 0, TAG_BITMAP_ATLAS1);
        label1.x = winSize.width / 2;
        label1.y = winSize.height - 100;

        // cc.LabelTTF
        var label2 = new cc.LabelTTF("", "Arial", 24);
        this.addChild(label2, 0, TAG_BITMAP_ATLAS2);
        label2.x = winSize.width / 2;
        label2.y = winSize.height / 2;

        // cc.LabelAtlas
        var label3 = new cc.LabelAtlas("", s_resprefix + "fonts/tuffy_bold_italic-charmap.png", 48, 64, ' ');
        this.addChild(label3, 0, TAG_BITMAP_ATLAS3);
        label3.x = winSize.width / 2;
        label3.y = 0 + 100;

        this.schedule(this.onUpdateStrings, 1.0);

        this.setEmpty = false;
        //----end25----
    }
    onUpdateStrings(dt) {
        //----start25----onUpdateStrings
        var label1 = this.getChildByTag(TAG_BITMAP_ATLAS1);
        var label2 = this.getChildByTag(TAG_BITMAP_ATLAS2);
        var label3 = this.getChildByTag(TAG_BITMAP_ATLAS3);

        if (!this.setEmpty) {
            label1.setString("not empty");
            label2.setString("not empty");
            label3.setString("hi");

            this.setEmpty = true;
        }
        else {
            label1.setString("");
            label2.setString("");
            label3.setString("");

            this.setEmpty = false;
        }
        //----end25----
    }
    title() {
        return "Testing empty labels";
    }
    subtitle() {
        return "3 empty labels: LabelAtlas, LabelTTF and LabelBMFont";
    }

}

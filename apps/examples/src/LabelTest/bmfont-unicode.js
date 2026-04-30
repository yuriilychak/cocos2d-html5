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

/// BMFontUnicode
import { AtlasDemo } from "./atlas-demo.js";
import { s_resprefix } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class BMFontUnicode extends AtlasDemo {
    constructor() {
        //----start13----ctor
        super();
        var chinese = "美好的一天";
        var japanese = "良い一日を";
        var spanish = "Buen día";

        var label1 = new cc.LabelBMFont(spanish, s_resprefix + "fonts/arial-unicode-26.fnt", 200, cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(label1);
        label1.x = winSize.width / 2;
        label1.y = winSize.height / 4;

        var label2 = new cc.LabelBMFont(chinese, s_resprefix + "fonts/arial-unicode-26.fnt");
        this.addChild(label2);
        label2.x = winSize.width / 2;
        label2.y = winSize.height / 2.2;

        var label3 = new cc.LabelBMFont(japanese, s_resprefix + "fonts/arial-unicode-26.fnt");
        this.addChild(label3);
        label3.x = winSize.width / 2;
        label3.y = winSize.height / 1.5;
        //----end13----
    }
    title() {
        return "cc.LabelBMFont with Unicode support";
    }
    subtitle() {
        return "You should see 3 different labels: In Spanish, Chinese and Korean";
    }

}

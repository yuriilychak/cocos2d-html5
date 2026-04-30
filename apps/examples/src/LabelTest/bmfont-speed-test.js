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
// BMFontSpeedTest
//
//------------------------------------------------------------------
import { AtlasDemo } from "./atlas-demo.js";
import { s_resprefix } from "../tests_resources.js";
import { director } from "../tests-main-constants.js";

export class BMFontSpeedTest extends AtlasDemo {
    constructor() {
        //----start8----ctor
        super();
        // Upper Label
        for (var i = 0; i < 100; i++) {
            var str = "-" + i + "-";
            var label = new cc.LabelBMFont(str, s_resprefix + "fonts/bitmapFontTest.fnt");
            this.addChild(label);

            var s = director.getWinSize();

            var p = new cc.Point(Math.random() * s.width, Math.random() * s.height);
            label.setPosition(p);
            label.anchorX = 0.5;
            label.anchorY = 0.5;
        }
        //----end8----
    }
    title() {
        return "cc.LabelBMFont";
    }
    subtitle() {
        return "Creating several cc.LabelBMFont with the same .fnt file should be fast";
    }

}

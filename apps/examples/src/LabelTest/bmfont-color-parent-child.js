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

import { AtlasDemo } from "./atlas-demo.js";
import { s_resprefix } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class BMFontColorParentChild extends AtlasDemo {
    constructor() {
        //----start15----ctor
        super();

        this.label = new cc.LabelBMFont("YRGB", s_resprefix + "fonts/konqa32.fnt");
        this.addChild(this.label);
        this.label.x = winSize.width / 2;
        this.label.y = winSize.height / 2;
        this.label.color = cc.Color.YELLOW;

        // R
        var letter = this.label.getChildByTag(1);
        letter.color = cc.Color.RED;

        // G
        letter = this.label.getChildByTag(2);
        letter.color = cc.Color.GREEN;

        // B
        letter = this.label.getChildByTag(3);
        letter.color = cc.Color.BLUE;

        this.scheduleUpdate();

        this.accum = 0;
        //----end15----
    }

    update(dt){
        //----start15----update
        this.accum += dt;

        this.label.setString("YRGB " + parseInt(this.accum,10).toString() );
        //----end15----
    }

    title() {
        return "cc.LabelBMFont color parent / child";
    }
    subtitle() {
        return "Yellow Red Green Blue and numbers in Yellow";
    }

    //
    // Automation
    //
    getExpectedResult() {
        // yellow, red, green, blue, yellow
        var ret = [{"r":255,"g":255,"b":0},{"r":255,"g":0,"b":0},{"r":0,"g":255,"b":0},{"r":0,"g":0,"b":255},{"r":255,"g":255,"b":0}];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = [];
        for( var i=0; i<5; i++) {
            var ch = this.label.getChildByTag(i).getDisplayedColor();
            ret.push(ch);
        }

        return JSON.stringify(ret);
    }

}

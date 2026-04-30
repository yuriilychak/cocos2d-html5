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
// BMFontGlyphDesignerTest
//
//------------------------------------------------------------------
export class BMFontGlyphDesignerTest extends AtlasDemo {
    constructor() {
        //----start17----ctor
        super();

        this.pixel = {"0": 240, "1": 201, "2": 108, "3": 255};
        var s = director.getWinSize();

        var layer = new cc.LayerColor(new cc.Color(128, 128, 128, 255));
        this.addChild(layer, -10);

        // cc.LabelBMFont
        var label1 = new cc.LabelBMFont("Testing Glyph Designer", s_resprefix + "fonts/futura-48.fnt");
        this.addChild(label1);
        label1.x = s.width / 2;
        label1.y = s.height / 2;
        //----end17----
    }
    title() {
        return "Testing Glyph Designer";
    }
    subtitle() {
        return "You should see a font with shadows and outline";
    }

    //
    // Automation
    //


    getExpectedResult() {

        // var ret = [{"0":0,"1":0,"2":226,"3":255},{"0":47,"1":0,"2":0,"3":255},{"0":0,"1":47,"2":0,"3":255}];
        var s = director.getWinSize();
        var ret = {"center": "yes"};
        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret2 =  this.readPixels(s.width/2, s.height/2, 100, 100);

        var ret = {"center": this.containsPixel(ret2, this.pixel) ? "yes" : "no"};

        return JSON.stringify(ret);
    }

}

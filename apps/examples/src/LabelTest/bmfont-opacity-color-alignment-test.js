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
// BMFontOpacityColorAlignmentTest
//
//------------------------------------------------------------------
export class BMFontOpacityColorAlignmentTest extends AtlasDemo {
    constructor() {
        //----start3----ctor
        super();

        this.time = 0;

        this.testDuration = 1.1;
        var col = new LayerColor(new Color(128, 128, 128, 255));
        this.addChild(col, -10);

        var label1 = new LabelBMFont("Test", s_resprefix + "fonts/bitmapFontTest2.fnt");

        // testing anchors
        label1.anchorX = 0;
        label1.anchorY = 0;
        this.addChild(label1, 0, TAG_BITMAP_ATLAS1);
        var fade = new FadeOut(1.0);
        var fade_in = fade.reverse();
        var seq = sequence(fade, new DelayTime(0.25), fade_in);
        var repeat = seq.repeatForever();
        label1.runAction(repeat);

        // VERY IMPORTANT
        // color and opacity work OK because bitmapFontAltas2 loads a BMP image (not a PNG image)
        // If you want to use both opacity and color, it is recommended to use NON premultiplied images like BMP images
        // Of course, you can also tell XCode not to compress PNG images, but I think it doesn't work as expected
        var label2 = new LabelBMFont("Test", s_resprefix + "fonts/bitmapFontTest2.fnt");
        // testing anchors
        label2.anchorX = 0.5;
        label2.anchorY = 0.5;
        label2.color = Color.RED;
        this.addChild(label2, 0, TAG_BITMAP_ATLAS2);
        label2.runAction(repeat.clone());

        var label3 = new LabelBMFont("Test", s_resprefix + "fonts/bitmapFontTest2.fnt");
        // testing anchors
        label3.anchorX = 1;
        label3.anchorY = 1;
        this.addChild(label3, 0, TAG_BITMAP_ATLAS3);

        var s = director.getWinSize();
        label1.x = 0;
        label1.y = 0;
        label2.x = s.width / 2;
        label2.y = s.height / 2;
        label3.x = s.width;
        label3.y = s.height;

        this.schedule(this.step);
        //----end3----
    }
    step(dt) {
        //----start3----step
        this.time += dt;
        //var string;
        var string = this.time.toFixed(2) + "Test j";

        var label1 = this.getChildByTag(TAG_BITMAP_ATLAS1);
        label1.setString(string);

        var label2 = this.getChildByTag(TAG_BITMAP_ATLAS2);
        label2.setString(string);

        var label3 = this.getChildByTag(TAG_BITMAP_ATLAS3);
        label3.setString(string);
        //----end3----
    }

    title() {
        return "LabelBMFont";
    }
    subtitle() {
        return "Testing alignment. Testing opacity + tint";
    }


    //
    // Automation
    //
    getExpectedResult() {
        // yellow, red, green, blue, yellow
        var ret = [0,{"r":255,"g":255,"b":255},0,{"r":255,"g":0,"b":0}];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = [];
        var tags = [TAG_BITMAP_ATLAS1, TAG_BITMAP_ATLAS2];

        for( var i in tags ) {
            var t = tags[i];
            ret.push( this.getChildByTag(t).opacity );
            ret.push( this.getChildByTag(t).color );
        }
        return JSON.stringify(ret);
    }

}

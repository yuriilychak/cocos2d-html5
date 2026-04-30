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
// LabelAtlasOpacityTest
//
//------------------------------------------------------------------
export class LabelAtlasOpacityTest extends AtlasDemo {
    constructor() {
        //----start0----ctor
        super();

        this.time = null;
        this.time = 0;

        var label1 = new LabelAtlas("123 Test", s_resprefix + "fonts/tuffy_bold_italic-charmap.plist");
        this.addChild(label1, 0, TAG_LABEL_SPRITE1);
        label1.x = 10;
        label1.y = 100;
        label1.opacity = 200;

        var label2 = new LabelAtlas("0123456789", s_resprefix + "fonts/tuffy_bold_italic-charmap.plist");
        this.addChild(label2, 0, TAG_LABEL_SPRITE12);
        label2.x = 10;
        label2.y = 200;
        label2.opacity = 32;

        this.schedule(this.step);
        //----end0----
    }
    step(dt) {
        //----start0----step
        this.time += dt;

        var label1 = this.getChildByTag(TAG_LABEL_SPRITE1);
        var string1 = this.time.toFixed(2) + " Test";
        label1.setString(string1);

        var label2 = this.getChildByTag(TAG_LABEL_SPRITE12);
        var string2 = parseInt(this.time, 10).toString();
        label2.setString(string2);
        //----end0----
    }
    title() {
        return "LabelAtlas Opacity";
    }
    subtitle() {
        return "Updating label should be fast";
    }

    //
    // Automation
    //
    getExpectedResult() {
        // yellow, red, green, blue, yellow
        var ret = [200,32];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = [];
        var tags = [TAG_LABEL_SPRITE1, TAG_LABEL_SPRITE12];

        for( var i in tags ) {
            var t = tags[i];
            ret.push( this.getChildByTag(t).opacity );
        }
        return JSON.stringify(ret);
    }

}

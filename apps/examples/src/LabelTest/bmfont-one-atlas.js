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

/// BMFontOneAtlas
export class BMFontOneAtlas extends AtlasDemo {
    constructor() {
        //----start12----ctor
        super();
        var s = director.getWinSize();

        var label1 = new cc.LabelBMFont("This is Helvetica", s_resprefix + "fonts/helvetica-32.fnt", cc.LabelAutomaticWidth, cc.TEXT_ALIGNMENT_LEFT, new cc.Point(0, 0));
        this.addChild(label1);
        label1.x = s.width / 2;
        label1.y = s.height * 2 / 3;

        var label2 = new cc.LabelBMFont("And this is Geneva", s_resprefix + "fonts/geneva-32.fnt", cc.LabelAutomaticWidth, cc.TEXT_ALIGNMENT_LEFT, new cc.Point(0, 128));
        this.addChild(label2);
        label2.x = s.width / 2;
        label2.y = s.height / 3;
        //----end12----
    }

    title() {
        return "cc.LabelBMFont with one texture";
    }

    subtitle() {
        return "Using 2 .fnt definitions that share the same texture atlas.";
    }

}

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

export class LabelTTFChinese extends AtlasDemo {
    constructor() {
        //----start21----ctor
        super();
        var size = director.getWinSize();
        var fontname = (sys.os === sys.OS_WP8 ) ? "fonts/arialuni.ttf" : (sys.os == sys.OS_WINRT) ? "DengXian" : "Microsoft Yahei";
        var label = new LabelTTF("中国", fontname, 30);
        label.x = size.width / 2;
        label.y = size.height / 3 * 2;
        this.addChild(label);

        // Test UTF8 string from native to jsval.
        var label2 = new LabelTTF("string from native:"+label.getString(), fontname, 30);
        label2.x = size.width / 2;
        label2.y = size.height / 3;
        this.addChild(label2);
        //----end21----
    }
    title() {
        return "Testing LabelTTF with Chinese character";
    }

}

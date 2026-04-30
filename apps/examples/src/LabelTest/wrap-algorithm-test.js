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

export class WrapAlgorithmTest extends AtlasDemo {
    constructor(){
        super();
        var self = this;

        var normalText = [
            "这里是中文测试例",
            "测试带有符号，换行",
            "测试中带有符号，换行",
            "",
            "Here is the English test",
            "aaaaaaaaaaaaaaaaa",
            "test test test aaa, tt",
            "test test test aa, tt",
            "こは日本語テスト",
            "符号のテストに，ついて"
        ];

        normalText.forEach(function(text, i){
            var LabelTTF = new cc.LabelTTF();
            LabelTTF.setString(text);
            LabelTTF.setPosition(30 + 150 * (i/4|0), 300 - (i%4) * 60);
            LabelTTF.setAnchorPoint(0,1);
            LabelTTF.boundingWidth = 120;
            LabelTTF.boundingHeight = 0;
            LabelTTF.enableStroke(new cc.Color(0, 0, 0, 1), 3.0);
            if (cc.sys.os === cc.sys.OS_WP8)
                LabelTTF.setFontName("fonts/arialuni.ttf");
            else if(cc.sys.os === cc.sys.OS_WINRT)
                LabelTTF.setFontName("DengXian");
            self.addChild(LabelTTF);
        });

        //Extreme test
        var extremeText = [
            "测",
            "\n",
            "\r\n",
            "、",
            ",",
            "W",
            "7"
        ];

        extremeText.forEach(function(text, i){
            var LabelTTF = new cc.LabelTTF();
            LabelTTF.setString(text);
            LabelTTF.setPosition(480 + i * 25, 300);
            LabelTTF.setAnchorPoint(0,1);
            LabelTTF.boundingWidth = 13;
            LabelTTF.boundingHeight = 0;
            LabelTTF.enableStroke(new cc.Color(0, 0, 0, 1), 3.0);
            if (cc.sys.os === cc.sys.OS_WP8)
                LabelTTF.setFontName("fonts/arialuni.ttf");
            else if(cc.sys.os === cc.sys.OS_WINRT)
                LabelTTF.setFontName("DengXian");
            self.addChild(LabelTTF);
        });

        //Combinatorial testing
        var combinatorialText = [
            "中英混排English",
            "中日混排テスト",
            "日本語テストEnglish"
        ];

        combinatorialText.forEach(function(text, i){
            var LabelTTF = new cc.LabelTTF();
            LabelTTF.setString(text);
            LabelTTF.setPosition(480 + 100 * (i/3|0), 240 - (i%3) * 60);
            LabelTTF.setAnchorPoint(0,1);
            LabelTTF.boundingWidth = 90;
            LabelTTF.boundingHeight = 0;
            LabelTTF.enableStroke(new cc.Color(0, 0, 0, 1), 3.0);
            if (cc.sys.os === cc.sys.OS_WP8)
                LabelTTF.setFontName("fonts/arialuni.ttf");
            else if(cc.sys.os === cc.sys.OS_WINRT)
                LabelTTF.setFontName("DengXian");
            self.addChild(LabelTTF);
        });

    }
    title(){
        return "Wrap algorithm test";
    }
    subtitle(){
        return "Wrap effect under various circumstances";
    }
    onEnter(){
        super.onEnter();
        cc.SPRITE_DEBUG_DRAW = 1;
    }
    onExit(){
        super.onExit();
        cc.SPRITE_DEBUG_DRAW = 0;
    }

}

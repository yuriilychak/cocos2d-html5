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

import { SpriteTestDemo } from "./sprite-test-demo";
import { s_tcc_issue_1, s_tcc_issue_1_plist, s_tcc_issue_2, s_tcc_issue_2_plist } from "../resources";
import { winSize } from "../constants";
import { Color } from "@aspect/core";

export class TextureColorCacheIssue2 extends SpriteTestDemo {


    constructor() {
        //----start56----ctor
        super();



        this._title = "Texture Color Cache Issue Test #2";



        this._subtitle = "You should see two different sprites magenta and yellow";



        this.pixel1 = {"0":255, "1":204, "2":0, "3":255};



        this.pixel2 = {"0":255, "1":0, "2":153, "3":255};

        cc.spriteFrameCache.addSpriteFrames(s_tcc_issue_1_plist, s_tcc_issue_1);
        cc.spriteFrameCache.addSpriteFrames(s_tcc_issue_2_plist, s_tcc_issue_2);

        var grossini = new cc.Sprite('#tcc_grossini_dance_01.png');
        grossini.x = winSize.width / 3;
        grossini.y = winSize.height / 2;

        var sister = new cc.Sprite('#tcc_grossinis_sister1.png');
        sister.x = winSize.width / 3 * 2;
        sister.y = winSize.height / 2;

        this.addChild(grossini);
        this.addChild(sister);

        grossini.color = new Color(255, 255, 0);
        sister.color = new Color(255, 0, 255);
        //----end56----
    }
    onExit() {
        //----start56----onExit
        cc.spriteFrameCache.removeSpriteFramesFromFile(s_tcc_issue_1_plist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(s_tcc_issue_2_plist);
        super.onExit();
        //----end56----
    }
    // Automation
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 3, winSize.height / 2 + 43, 5, 5);
        var ret2 = this.readPixels(winSize.width / 3 * 2, winSize.height / 2 - 3, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, true, 5) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, true, 5) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}

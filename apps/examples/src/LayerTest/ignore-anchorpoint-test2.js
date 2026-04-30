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

import { LayerTest } from "./layer-test.js";
import { director } from "../tests-main-constants.js";

export class IgnoreAnchorpointTest2 extends LayerTest {
    constructor() {
        super();
        this.pixel1 = {"0": 50, "1": 100, "2": 50, "3": 200};
        this.pixel2 = {"0": 100, "1": 50, "2": 50, "3": 200};
    }

    onEnter() {
        //----start4----onEnter
        super.onEnter();
        //create layer
        var ws = director.getWinSize();
        var layer1 = new cc.LayerColor(new cc.Color(255, 100, 100, 128), ws.width / 2, ws.height / 2);
        layer1.ignoreAnchorPointForPosition(true);
        var layer2 = new cc.LayerColor(new cc.Color(100, 255, 100, 128), ws.width / 4, ws.height / 4);
        layer2.ignoreAnchorPointForPosition(false);
        layer1.addChild(layer2);
        layer1.x = ws.width / 2;
        layer1.y = ws.height / 2;
        this.addChild(layer1);
        //----end4----
    }
    title() {
        return "ignore Anchorpoint Test #2";
    }
    subtitle() {
        return "red:true  green:false";
    }


    //
    // Automation
    //


    getExpectedResult() {
        
        var s = director.getWinSize();
        var ret = {"big": "yes", "small": "yes"};
        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret2 =  this.readPixels(s.width/2 - 50, s.height/2 - 50, 5, 5);
        var ret3 =  this.readPixels(s.width - 50, s.height - 50, 5, 5);
        var ret = {"big": this.containsPixel(ret2, this.pixel1, true, 100) ? "yes" : "no",
		   "small": this.containsPixel(ret3, this.pixel2, true, 100) ? "yes" : "no"};
	
        return JSON.stringify(ret);
    }

}

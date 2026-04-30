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
import { winSize } from "../tests-main-constants.js";

export class labelTTFDrawModeTest extends AtlasDemo {
    constructor() {
        super();
        var cacheLabel = new cc.LabelTTF();
        cacheLabel.font = "32px 'Courier New'";
        cacheLabel.string = "This is a labelTTF \ndrawn On cached Canvas!";
        cacheLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(cacheLabel);
        cacheLabel.x = winSize.width / 2;
        cacheLabel.y = 3*winSize.height / 4 - cacheLabel.height;


        var directLabel = new cc.LabelTTF();
        if(cc.rendererConfig.isCanvas) {
            directLabel.setDrawMode(false);
            directLabel.string = "This is a labelTTF \ndrawn On Screen";
        }
        else
            directLabel.string = "WebGL does NOT support to \ndraw labelTTF on Screen";
        directLabel.font = "32px 'Courier New'";
        directLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(directLabel);
        directLabel.x = winSize.width / 2;
        directLabel.y = winSize.height / 4 ;
    }
    title() {
        return "LabelTTF DrawMode Test";
    }
    subtitle() {
        return "Compare cacheMode to directMode";
    }

}

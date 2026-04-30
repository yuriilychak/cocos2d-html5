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

import { TestNodeDemo } from "./test-node-demo.js";
import { s_back1 } from "../tests_resources.js";

export class NodeOpaqueTest extends TestNodeDemo {
    constructor() {
        //----start13----ctor
        super();
        var winSize = cc.director.getWinSize();
        var background;
        for (var i = 0; i < 50; i++) {
            background = new cc.Sprite(s_back1);
            background.setBlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
            background.x = winSize.width / 2;
            background.y = winSize.height / 2;
            this.addChild(background);
        }
        //----end13----
    }

    title() {
        return "Node Opaque Test";
    }

    subtitle() {
        return "Node rendered with GL_BLEND disabled";
    }

}

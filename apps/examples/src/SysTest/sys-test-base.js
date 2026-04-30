/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.


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
// SysTestBase
//
//------------------------------------------------------------------
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer.js";
import { sysTestSceneIdx } from "./sys-test-constants.js";
import { arrayOfSysTest, nextSysTest, previousSysTest, restartSysTest } from "./sys-test-helpers.js";
import { SysTestScene } from "./sys-test-scene.js";
import { director } from "../tests-main-constants.js";

export class SysTestBase extends BaseTestLayer {

    constructor() {
        super(new cc.Color(0,0,0,0), new cc.Color(98,99,117,0));


        this._title = "";


        this._subtitle = "";
    }
    onRestartCallback(sender) {
        var s = new SysTestScene();
        s.addChild(restartSysTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new SysTestScene();
        s.addChild(nextSysTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new SysTestScene();
        s.addChild(previousSysTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfSysTest.length-1) - sysTestSceneIdx );
    }

    getTestNumber() {
        return sysTestSceneIdx;
    }


}

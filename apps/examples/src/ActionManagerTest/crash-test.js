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
// Test1
//
//------------------------------------------------------------------
import { NOT_CRASHED_CONST } from "./action-manager-test-constants.js";
import { ActionManagerTest } from "./action-manager-test.js";
import { s_pathGrossini } from "../tests_resources.js";

export class CrashTest extends ActionManagerTest {
    title() {
        return "Test 1. Should not crash";
    }
    onEnter() {
        //----start0----onEnter
        super.onEnter();

        var child = new cc.Sprite(s_pathGrossini);
        child.x = 200;
        child.y = 200;
        this.addChild(child, 1);

        //Sum of all action's duration is 1.5 second.
        child.runAction(new cc.RotateBy(1.5, 90));
        // child.runAction(cc.sequence(
        //     new cc.DelayTime(1.4),
        //     new cc.FadeOut(1.1))
        // );

        //After 1.5 second, self will be removed.
        this.runAction(cc.sequence(
           new cc.DelayTime(1.4),
           new cc.CallFunc(this.onRemoveThis, this))
        );
        //----end0----
    }

    onExitTransitionDidStart() {
        this.stopAllActions();
        super.onExitTransitionDidStart();
    }

    onRemoveThis() {
        //----start0----onRemoveThis
        this.parent.removeChild(this);
        this.onNextCallback(this);
        //----end0----
    }

    //
    // Automation
    //
    getExpectedResult() {
        return NOT_CRASHED_CONST;
    }
    getCurrentResult() {
        return NOT_CRASHED_CONST;
    }

}

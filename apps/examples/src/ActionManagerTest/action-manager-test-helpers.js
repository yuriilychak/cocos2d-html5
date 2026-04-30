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

import { ActionMgrTestIdx , _setActionMgrTestIdx} from "./action-manager-test-constants.js";
import { CrashTest } from "./crash-test.js";
import { LogicTest } from "./logic-test.js";
import { PauseTest } from "./pause-test.js";
import { RemoveTest } from "./remove-test.js";
import { ResumeTest } from "./resume-test.js";

;

;

;

;

;

;

;

//-
//
// Flow control
//
export var arrayOfActionMgrTest = [
    CrashTest,
    LogicTest,
    PauseTest,
    RemoveTest,
    ResumeTest
];

export function nextActionMgrTest(num) {

    _setActionMgrTestIdx(num ? num - 1 : ActionMgrTestIdx);

    _setActionMgrTestIdx(ActionMgrTestIdx + 1);
    _setActionMgrTestIdx(ActionMgrTestIdx % arrayOfActionMgrTest.length);

    if(window.sideIndexBar){
        _setActionMgrTestIdx(window.sideIndexBar.changeTest(ActionMgrTestIdx, 0));
    }

    return new arrayOfActionMgrTest[ActionMgrTestIdx]();
}

;

export function previousActionMgrTest() {
    _setActionMgrTestIdx(ActionMgrTestIdx - 1);
    if (ActionMgrTestIdx < 0)
        _setActionMgrTestIdx(ActionMgrTestIdx + (arrayOfActionMgrTest.length));

    if(window.sideIndexBar){
        _setActionMgrTestIdx(window.sideIndexBar.changeTest(ActionMgrTestIdx, 0));
    }

    return new arrayOfActionMgrTest[ActionMgrTestIdx]();
}

;

export function restartActionMgrTest() {
    return new arrayOfActionMgrTest[ActionMgrTestIdx]();
}

;

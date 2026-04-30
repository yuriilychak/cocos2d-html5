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

import { TextFieldTTFActionTest } from "./text-field-ttfaction-test.js";
import { TextFieldTTFDefaultTest } from "./text-field-ttfdefault-test.js";
import { sceneIdx , _setsceneIdx} from "./text-input-test-constants.js";

;

;

;

;

;

//
// Flow control
//
export var arrayOfTextInputTest = [
    TextFieldTTFDefaultTest,
    TextFieldTTFActionTest
];

export function nextTextInputTest() {
    _setsceneIdx(sceneIdx + 1);
    _setsceneIdx(sceneIdx % arrayOfTextInputTest.length);

    return new arrayOfTextInputTest[sceneIdx]();
}

;

export function previousTextInputTest() {
    _setsceneIdx(sceneIdx - 1);
    if (sceneIdx < 0)
        _setsceneIdx(sceneIdx + (arrayOfTextInputTest.length));

    return new arrayOfTextInputTest[sceneIdx]();
}

;

export function restartTextInputTest() {
    return new arrayOfTextInputTest[sceneIdx]();
}

;

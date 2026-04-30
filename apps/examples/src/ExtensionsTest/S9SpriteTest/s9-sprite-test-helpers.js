/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013      Surith Thekkiam

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

import { S9BatchNodeBasic } from "./s9-batch-node-basic.js";
import { S9BatchNodeScaleWithCapInsets } from "./s9-batch-node-scale-with-cap-insets.js";
import { S9BatchNodeScaledNoInsets } from "./s9-batch-node-scaled-no-insets.js";
import { S9FrameNameSpriteSheetInsetsScaled } from "./s9-frame-name-sprite-sheet-insets-scaled.js";
import { S9FrameNameSpriteSheetInsets } from "./s9-frame-name-sprite-sheet-insets.js";
import { S9FrameNameSpriteSheetRotatedInsetsScaled } from "./s9-frame-name-sprite-sheet-rotated-insets-scaled.js";
import { S9FrameNameSpriteSheetRotatedInsets } from "./s9-frame-name-sprite-sheet-rotated-insets.js";
import { S9FrameNameSpriteSheetRotatedScaledNoInsets } from "./s9-frame-name-sprite-sheet-rotated-scaled-no-insets.js";
import { S9FrameNameSpriteSheetRotated } from "./s9-frame-name-sprite-sheet-rotated.js";
import { S9FrameNameSpriteSheetScaledNoInsets } from "./s9-frame-name-sprite-sheet-scaled-no-insets.js";
import { S9FrameNameSpriteSheet } from "./s9-frame-name-sprite-sheet.js";
import { S9SpriteActionTest } from "./s9-sprite-action-test.js";
import { S9SpriteColorOpacityTest } from "./s9-sprite-color-opacity-test.js";
import { S9SpriteOpacityWithFadeActionsTest } from "./s9-sprite-opacity-with-fade-actions-test.js";
import { S9SpriteRenderingTypeToggleTest } from "./s9-sprite-rendering-type-toggle-test.js";
import { sceneIdx , _setsceneIdx} from "./s9-sprite-test-constants.js";
import { S9_TexturePacker } from "./s9-texture-packer.js";

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

//
// Flow control
//
export var arrayOfS9SpriteTest = [
    S9BatchNodeBasic,
    S9FrameNameSpriteSheet,
    S9FrameNameSpriteSheetRotated,
    S9BatchNodeScaledNoInsets,
    S9FrameNameSpriteSheetScaledNoInsets,
    S9FrameNameSpriteSheetRotatedScaledNoInsets,
    S9BatchNodeScaleWithCapInsets,
    S9FrameNameSpriteSheetInsets,
    S9FrameNameSpriteSheetInsetsScaled,
    S9FrameNameSpriteSheetRotatedInsets,
    S9FrameNameSpriteSheetRotatedInsetsScaled,
    S9_TexturePacker,
    S9SpriteActionTest,
    S9SpriteColorOpacityTest,
    S9SpriteOpacityWithFadeActionsTest,
    S9SpriteRenderingTypeToggleTest
];

export function nextS9SpriteTest() {
    _setsceneIdx(sceneIdx + 1);
    _setsceneIdx(sceneIdx % arrayOfS9SpriteTest.length);

    return new arrayOfS9SpriteTest[sceneIdx]();
}

;

export function previousS9SpriteTest() {
    _setsceneIdx(sceneIdx - 1);
    if (sceneIdx < 0)
        _setsceneIdx(sceneIdx + (arrayOfS9SpriteTest.length));

    return new arrayOfS9SpriteTest[sceneIdx]();
}

;

export function restartS9SpriteTest() {
    return new arrayOfS9SpriteTest[sceneIdx]();
}

;

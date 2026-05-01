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

import {
  ProgressTestSceneIdx,
  _setProgressTestSceneIdx
} from "./progress-actions-test-constants";
import { SpriteProgressBarTintAndFade } from "./sprite-progress-bar-tint-and-fade";
import { SpriteProgressBarVarious } from "./sprite-progress-bar-various";
import { SpriteProgressToHorizontal } from "./sprite-progress-to-horizontal";
import { SpriteProgressToRadialMidpointChanged } from "./sprite-progress-to-radial-midpoint-changed";
import { SpriteProgressToRadial } from "./sprite-progress-to-radial";
import { SpriteProgressToVertical } from "./sprite-progress-to-vertical";
import { SpriteProgressWithSpriteFrame } from "./sprite-progress-with-sprite-frame";

export var arrayOfProgressTest = [
  SpriteProgressToRadial,
  SpriteProgressToHorizontal,
  SpriteProgressToVertical,
  SpriteProgressToRadialMidpointChanged,
  SpriteProgressBarVarious,
  SpriteProgressBarTintAndFade,
  SpriteProgressWithSpriteFrame
];

export function nextProgressTest() {
  _setProgressTestSceneIdx(ProgressTestSceneIdx + 1);
  _setProgressTestSceneIdx(ProgressTestSceneIdx % arrayOfProgressTest.length);

  if (window.sideIndexBar) {
    _setProgressTestSceneIdx(
      window.sideIndexBar.changeTest(ProgressTestSceneIdx, 30)
    );
  }

  return new arrayOfProgressTest[ProgressTestSceneIdx]();
}

export function previousProgressTest() {
  _setProgressTestSceneIdx(ProgressTestSceneIdx - 1);
  if (ProgressTestSceneIdx < 0)
    _setProgressTestSceneIdx(ProgressTestSceneIdx + arrayOfProgressTest.length);

  if (window.sideIndexBar) {
    _setProgressTestSceneIdx(
      window.sideIndexBar.changeTest(ProgressTestSceneIdx, 30)
    );
  }

  return new arrayOfProgressTest[ProgressTestSceneIdx]();
}

export function restartProgressTest() {
  return new arrayOfProgressTest[ProgressTestSceneIdx]();
}

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

import {
  effectsTestSceneIdx,
  _seteffectsTestSceneIdx
} from "./effects-test-constants";
import { FadeOutBLTilesTest } from "./fade-out-bltiles-test";
import { FadeOutDownTilesTest } from "./fade-out-down-tiles-test";
import { FadeOutTRTilesTest } from "./fade-out-trtiles-test";
import { FadeOutUpTilesTest } from "./fade-out-up-tiles-test";
import { FlipXTest } from "./flip-xtest";
import { FlipYTest } from "./flip-ytest";
import { JumpTiles3DTest } from "./jump-tiles3-dtest";
import { Lens3DTest } from "./lens3-dtest";
import { LiquidTest } from "./liquid-test";
import { PageTurn3DInRectTest } from "./page-turn3-din-rect-test";
import { PageTurn3DTest } from "./page-turn3-dtest";
import { Ripple3DTest } from "./ripple3-dtest";
import { ShakyTiles3DTest } from "./shaky-tiles3-dtest";
import { Shaky3DTest } from "./shaky3-dtest";
import { ShatteredTiles3DTest } from "./shattered-tiles3-dtest";
import { ShuffleTilesTest } from "./shuffle-tiles-test";
import { SplitColsTest } from "./split-cols-test";
import { SplitRowsTest } from "./split-rows-test";
import { TurnOffTilesTest } from "./turn-off-tiles-test";
import { TwirlTest } from "./twirl-test";
import { WavesTest } from "./waves-test";
import { WavesTiles3DTest } from "./waves-tiles3-dtest";
import { Waves3DTest } from "./waves3-dtest";

//
// Flow control
//
export var arrayOfEffectsTest = [
  Shaky3DTest,
  Waves3DTest,
  FlipXTest,
  FlipYTest,
  Lens3DTest,
  Ripple3DTest,
  LiquidTest,
  WavesTest,
  TwirlTest,
  ShakyTiles3DTest,
  ShatteredTiles3DTest,
  ShuffleTilesTest,
  FadeOutTRTilesTest,
  FadeOutBLTilesTest,
  FadeOutUpTilesTest,
  FadeOutDownTilesTest,
  TurnOffTilesTest,
  WavesTiles3DTest,
  JumpTiles3DTest,
  SplitRowsTest,
  SplitColsTest,
  PageTurn3DTest,
  PageTurn3DInRectTest
];

export function nextEffectsTest() {
  _seteffectsTestSceneIdx(effectsTestSceneIdx + 1);
  _seteffectsTestSceneIdx(effectsTestSceneIdx % arrayOfEffectsTest.length);

  if (window.sideIndexBar) {
    _seteffectsTestSceneIdx(
      window.sideIndexBar.changeTest(effectsTestSceneIdx, 14)
    );
  }

  return new arrayOfEffectsTest[effectsTestSceneIdx]();
}

export function previousEffectsTest() {
  _seteffectsTestSceneIdx(effectsTestSceneIdx - 1);
  if (effectsTestSceneIdx < 0)
    _seteffectsTestSceneIdx(effectsTestSceneIdx + arrayOfEffectsTest.length);

  if (window.sideIndexBar) {
    _seteffectsTestSceneIdx(
      window.sideIndexBar.changeTest(effectsTestSceneIdx, 14)
    );
  }

  return new arrayOfEffectsTest[effectsTestSceneIdx]();
}

export function restartEffectsTest() {
  return new arrayOfEffectsTest[effectsTestSceneIdx]();
}

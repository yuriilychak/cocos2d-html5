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
var arrayOfEffectsTest = [
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
    effectsTestSceneIdx++;
    effectsTestSceneIdx = effectsTestSceneIdx % arrayOfEffectsTest.length;

    if(window.sideIndexBar){
        effectsTestSceneIdx = window.sideIndexBar.changeTest(effectsTestSceneIdx, 14);
    }

    return new arrayOfEffectsTest[effectsTestSceneIdx]();
}

;

export function previousEffectsTest() {
    effectsTestSceneIdx--;
    if (effectsTestSceneIdx < 0)
        effectsTestSceneIdx += arrayOfEffectsTest.length;

    if(window.sideIndexBar){
        effectsTestSceneIdx = window.sideIndexBar.changeTest(effectsTestSceneIdx, 14);
    }

    return new arrayOfEffectsTest[effectsTestSceneIdx]();
}

;

export function restartEffectsTest() {
    return new arrayOfEffectsTest[effectsTestSceneIdx]();
}

;

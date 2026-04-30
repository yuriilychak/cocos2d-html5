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

var arrayOfLayerTest = [
    LayerTest1,
    LayerTest2,
    LayerGradientTest,
    LayerTestBlend,
    IgnoreAnchorpointTest1,
    IgnoreAnchorpointTest2,
    IgnoreAnchorpointTest3,
    IgnoreAnchorpointTest4
];

export function nextLayerTest() {
    layerTestSceneIdx++;
    layerTestSceneIdx = layerTestSceneIdx % arrayOfLayerTest.length;

    if(window.sideIndexBar){
        layerTestSceneIdx = window.sideIndexBar.changeTest(layerTestSceneIdx, 20);
    }

    return new arrayOfLayerTest[layerTestSceneIdx]();
}

;

export function previousLayerTest() {
    layerTestSceneIdx--;
    if (layerTestSceneIdx < 0)
        layerTestSceneIdx += arrayOfLayerTest.length;

    if(window.sideIndexBar){
        layerTestSceneIdx = window.sideIndexBar.changeTest(layerTestSceneIdx, 20);
    }

    return new arrayOfLayerTest[layerTestSceneIdx]();
}

;

export function restartLayerTest() {
    return new arrayOfLayerTest[layerTestSceneIdx]();
}

;

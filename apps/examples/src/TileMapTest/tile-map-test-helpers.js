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

// Copy BaseTestLayer prototype methods (mixin pattern, originally cc.Layer.extend(BaseTestLayerProps))
Object.getOwnPropertyNames(BaseTestLayer.prototype).forEach(function(name) {
    if (name !== 'constructor' && typeof BaseTestLayer.prototype[name] === 'function') {
        FixBugBaseTest.prototype[name] = BaseTestLayer.prototype[name];
    }
});

;

Object.getOwnPropertyNames(TileDemo.prototype).forEach(function(name) {
    if (name !== 'constructor' && typeof TileDemo.prototype[name] === 'function') {
        TMXFixBugLayer.prototype[name] = TileDemo.prototype[name];
    }
});

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

;

;

;

;

;

;

//
// Flow control
//
var arrayOfTileMapTest = [
    TMXOrthoTest,
    TMXOrthoTest2,
    TMXOrthoTest3,
    TMXOrthoTest4,
    TMXReadWriteTest,
    TMXHexTest,
    TMXIsoTest,
    TMXIsoTest1,
    TMXIsoTest2,
    TMXUncompressedTest,
    TMXTilesetTest,
    TMXOrthoObjectsTest,
    TMXIsoObjectsTest,
    TMXResizeTest,
    TMXIsoZorder,
    TMXOrthoZorder,
    TMXIsoVertexZ,
    TMXOrthoVertexZ,
    TMXIsoMoveLayer,
    TMXOrthoMoveLayer,
    TMXTilePropertyTest,
    TMXOrthoFlipTest,
    TMXOrthoFlipRunTimeTest,
    TMXOrthoFromXMLTest,
    TMXBug987,
    TMXBug787,
    TMXIsoOffsetTest
];

if ( !cc.sys.isNative ){
    //This test is supported only in HTML5
    arrayOfTileMapTest.push(TMXGIDObjectsTest);
}

export function nextTileMapTest() {
    tileTestSceneIdx++;
    tileTestSceneIdx = tileTestSceneIdx % arrayOfTileMapTest.length;

    return new arrayOfTileMapTest[tileTestSceneIdx]();
}

;

export function previousTileMapTest() {
    tileTestSceneIdx--;
    if (tileTestSceneIdx < 0)
        tileTestSceneIdx += arrayOfTileMapTest.length;

    return new arrayOfTileMapTest[tileTestSceneIdx]();
}

;

export function restartTileMapTest() {
    return new arrayOfTileMapTest[tileTestSceneIdx]();
}

;

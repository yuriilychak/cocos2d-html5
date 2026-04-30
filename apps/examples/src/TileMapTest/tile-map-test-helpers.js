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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer.js";
import { FixBugBaseTest } from "./fix-bug-base-test.js";
import { TileDemo } from "./tile-demo.js";
import { tileTestSceneIdx , _settileTestSceneIdx} from "./tile-map-test-constants.js";
import { TMXBug787 } from "./tmxbug787.js";
import { TMXBug987 } from "./tmxbug987.js";
import { TMXFixBugLayer } from "./tmxfix-bug-layer.js";
import { TMXGIDObjectsTest } from "./tmxgidobjects-test.js";
import { TMXHexTest } from "./tmxhex-test.js";
import { TMXIsoMoveLayer } from "./tmxiso-move-layer.js";
import { TMXIsoObjectsTest } from "./tmxiso-objects-test.js";
import { TMXIsoOffsetTest } from "./tmxiso-offset-test.js";
import { TMXIsoTest } from "./tmxiso-test.js";
import { TMXIsoTest1 } from "./tmxiso-test1.js";
import { TMXIsoTest2 } from "./tmxiso-test2.js";
import { TMXIsoVertexZ } from "./tmxiso-vertex-z.js";
import { TMXIsoZorder } from "./tmxiso-zorder.js";
import { TMXOrthoFlipRunTimeTest } from "./tmxortho-flip-run-time-test.js";
import { TMXOrthoFlipTest } from "./tmxortho-flip-test.js";
import { TMXOrthoFromXMLTest } from "./tmxortho-from-xmltest.js";
import { TMXOrthoMoveLayer } from "./tmxortho-move-layer.js";
import { TMXOrthoObjectsTest } from "./tmxortho-objects-test.js";
import { TMXOrthoTest } from "./tmxortho-test.js";
import { TMXOrthoTest2 } from "./tmxortho-test2.js";
import { TMXOrthoTest3 } from "./tmxortho-test3.js";
import { TMXOrthoTest4 } from "./tmxortho-test4.js";
import { TMXOrthoVertexZ } from "./tmxortho-vertex-z.js";
import { TMXOrthoZorder } from "./tmxortho-zorder.js";
import { TMXReadWriteTest } from "./tmxread-write-test.js";
import { TMXResizeTest } from "./tmxresize-test.js";
import { TMXTilePropertyTest } from "./tmxtile-property-test.js";
import { TMXTilesetTest } from "./tmxtileset-test.js";
import { TMXUncompressedTest } from "./tmxuncompressed-test.js";

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
export var arrayOfTileMapTest = [
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
    _settileTestSceneIdx(tileTestSceneIdx + 1);
    _settileTestSceneIdx(tileTestSceneIdx % arrayOfTileMapTest.length);

    return new arrayOfTileMapTest[tileTestSceneIdx]();
}

;

export function previousTileMapTest() {
    _settileTestSceneIdx(tileTestSceneIdx - 1);
    if (tileTestSceneIdx < 0)
        _settileTestSceneIdx(tileTestSceneIdx + (arrayOfTileMapTest.length));

    return new arrayOfTileMapTest[tileTestSceneIdx]();
}

;

export function restartTileMapTest() {
    return new arrayOfTileMapTest[tileTestSceneIdx]();
}

;

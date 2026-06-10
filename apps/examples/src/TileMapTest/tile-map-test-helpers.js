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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { FixBugBaseTest } from "./fix-bug-base-test";
import { TileDemo } from "./tile-demo";
import {
  tileTestSceneIdx,
  _settileTestSceneIdx
} from "./tile-map-test-constants";
import { TMXBug787 } from "./tmxbug787";
import { TMXBug987 } from "./tmxbug987";
import { TMXFixBugLayer } from "./tmxfix-bug-layer";
import { TMXGIDObjectsTest } from "./tmxgidobjects-test";
import { TMXHexTest } from "./tmxhex-test";
import { TMXIsoMoveLayer } from "./tmxiso-move-layer";
import { TMXIsoObjectsTest } from "./tmxiso-objects-test";
import { TMXIsoOffsetTest } from "./tmxiso-offset-test";
import { TMXIsoTest } from "./tmxiso-test";
import { TMXIsoTest1 } from "./tmxiso-test1";
import { TMXIsoTest2 } from "./tmxiso-test2";
import { TMXIsoVertexZ } from "./tmxiso-vertex-z";
import { TMXIsoZorder } from "./tmxiso-zorder";
import { TMXOrthoFlipRunTimeTest } from "./tmxortho-flip-run-time-test";
import { TMXOrthoFlipTest } from "./tmxortho-flip-test";
import { TMXOrthoFromXMLTest } from "./tmxortho-from-xmltest";
import { TMXOrthoMoveLayer } from "./tmxortho-move-layer";
import { TMXOrthoObjectsTest } from "./tmxortho-objects-test";
import { TMXOrthoTest } from "./tmxortho-test";
import { TMXOrthoTest2 } from "./tmxortho-test2";
import { TMXOrthoTest3 } from "./tmxortho-test3";
import { TMXOrthoTest4 } from "./tmxortho-test4";
import { TMXOrthoVertexZ } from "./tmxortho-vertex-z";
import { TMXOrthoZorder } from "./tmxortho-zorder";
import { TMXReadWriteTest } from "./tmxread-write-test";
import { TMXResizeTest } from "./tmxresize-test";
import { TMXTilePropertyTest } from "./tmxtile-property-test";
import { TMXTilesetTest } from "./tmxtileset-test";
import { TMXUncompressedTest } from "./tmxuncompressed-test";
import { Layer, ServiceLocator } from "@aspect/core";

// Copy BaseTestLayer prototype methods (mixin pattern, originally Layer.extend(BaseTestLayerProps))
Object.getOwnPropertyNames(BaseTestLayer.prototype).forEach(function (name) {
  if (
    name !== "constructor" &&
    typeof BaseTestLayer.prototype[name] === "function"
  ) {
    FixBugBaseTest.prototype[name] = BaseTestLayer.prototype[name];
  }
});

Object.getOwnPropertyNames(TileDemo.prototype).forEach(function (name) {
  if (
    name !== "constructor" &&
    typeof TileDemo.prototype[name] === "function"
  ) {
    TMXFixBugLayer.prototype[name] = TileDemo.prototype[name];
  }
});

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

if (!ServiceLocator.sys.isNative) {
  //This test is supported only in HTML5
  arrayOfTileMapTest.push(TMXGIDObjectsTest);
}

export function nextTileMapTest() {
  _settileTestSceneIdx(tileTestSceneIdx + 1);
  _settileTestSceneIdx(tileTestSceneIdx % arrayOfTileMapTest.length);

  return new arrayOfTileMapTest[tileTestSceneIdx]();
}

export function previousTileMapTest() {
  _settileTestSceneIdx(tileTestSceneIdx - 1);
  if (tileTestSceneIdx < 0)
    _settileTestSceneIdx(tileTestSceneIdx + arrayOfTileMapTest.length);

  return new arrayOfTileMapTest[tileTestSceneIdx]();
}

export function restartTileMapTest() {
  return new arrayOfTileMapTest[tileTestSceneIdx]();
}

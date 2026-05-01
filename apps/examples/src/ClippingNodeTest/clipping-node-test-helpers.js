/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2012 Pierre-David Bélanger
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
  clippingNodeTestSceneIdx,
  _setclippingNodeTestSceneIdx
} from "./clipping-node-test-constants";
import { HoleDemo } from "./hole-demo";
import { NestedTest } from "./nested-test";
import { ScrollViewDemo } from "./scroll-view-demo";
import { ShapeInvertedTest } from "./shape-inverted-test";
import { ShapeTest } from "./shape-test";
import { SpriteInvertedTest } from "./sprite-inverted-test";
import { SpriteNoAlphaTest } from "./sprite-no-alpha-test";
import { SpriteTest } from "./sprite-test";
import { Color } from "@aspect/core";

export let _stencilBits = -1;

export var _alphaThreshold = 0.05;

export var _PLANE_COUNT = 8;

export var _planeColor = [
  new Color(0, 0, 0, 166),
  new Color(179, 0, 0, 153),
  new Color(0, 179, 0, 140),
  new Color(0, 0, 179, 128),
  new Color(179, 179, 0, 115),
  new Color(0, 179, 179, 102),
  new Color(179, 0, 179, 89),
  new Color(179, 179, 179, 77)
];

export var arrayOfClippingNodeTest = [ScrollViewDemo, ShapeTest, SpriteTest];

if (!cc.sys.isNative && !cc.rendererConfig.isCanvas) {
  arrayOfClippingNodeTest.push(
    ShapeInvertedTest,
    SpriteNoAlphaTest,
    SpriteInvertedTest
    //TODO re-open them later.
    /*    RawStencilBufferTest,
         RawStencilBufferTest2,
         RawStencilBufferTest3,
         RawStencilBufferTest4,
         RawStencilBufferTest5,
         RawStencilBufferTest6*/
  );
}

if (cc.sys.isNative) {
  arrayOfClippingNodeTest.push(
    ShapeInvertedTest,
    SpriteNoAlphaTest,
    SpriteInvertedTest,
    NestedTest
  );
} else {
  arrayOfClippingNodeTest.push(HoleDemo);
}

export function nextClippingNodeTest() {
  _setclippingNodeTestSceneIdx(clippingNodeTestSceneIdx + 1);
  _setclippingNodeTestSceneIdx(
    clippingNodeTestSceneIdx % arrayOfClippingNodeTest.length
  );

  if (window.sideIndexBar) {
    _setclippingNodeTestSceneIdx(
      window.sideIndexBar.changeTest(clippingNodeTestSceneIdx, 5)
    );
  }

  return new arrayOfClippingNodeTest[clippingNodeTestSceneIdx]();
}

export function previousClippingNodeTest() {
  _setclippingNodeTestSceneIdx(clippingNodeTestSceneIdx - 1);
  if (clippingNodeTestSceneIdx < 0)
    _setclippingNodeTestSceneIdx(
      clippingNodeTestSceneIdx + arrayOfClippingNodeTest.length
    );

  if (window.sideIndexBar) {
    _setclippingNodeTestSceneIdx(
      window.sideIndexBar.changeTest(clippingNodeTestSceneIdx, 5)
    );
  }

  return new arrayOfClippingNodeTest[clippingNodeTestSceneIdx]();
}

export function restartClippingNodeTest() {
  return new arrayOfClippingNodeTest[clippingNodeTestSceneIdx]();
}

export function _set_stencilBits(v) {
  _stencilBits = v;
}

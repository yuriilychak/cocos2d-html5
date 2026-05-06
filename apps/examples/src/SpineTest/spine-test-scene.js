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

import { spineSceneIdx, _setspineSceneIdx } from "./spine-test-constants";
import { SpineTestLayerFFD } from "./spine-test-layer-ffd";
import { SpineTestLayerNormal } from "./spine-test-layer-normal";
import { SpineTestPerformanceLayer } from "./spine-test-performance-layer";
import { TestScene } from "../test-scene";
import { director } from "../constants";

export class SpineTestScene extends TestScene {
  constructor() {
    super("Spine Test");
  }

  runThisTest() {
    var layer = SpineTestScene.nextSpineTestLayer();
    this.addChild(layer);
    director.runScene(this);
  }

  static nextSpineTestLayer() {
    _setspineSceneIdx(spineSceneIdx + 1);
    var layers = SpineTestScene.testLayers;
    _setspineSceneIdx(spineSceneIdx % layers.length);
    return new layers[spineSceneIdx](spineSceneIdx);
  }

  static backSpineTestLayer() {
    _setspineSceneIdx(spineSceneIdx - 1);
    var layers = SpineTestScene.testLayers;
    if (spineSceneIdx < 0) _setspineSceneIdx(layers.length - 1);
    return new layers[spineSceneIdx](spineSceneIdx);
  }

  static restartSpineTestLayer() {
    return new SpineTestScene.testLayers[spineSceneIdx](spineSceneIdx);
  }
}

SpineTestScene.testLayers = [
  SpineTestLayerNormal,
  SpineTestLayerFFD,
  SpineTestPerformanceLayer
];

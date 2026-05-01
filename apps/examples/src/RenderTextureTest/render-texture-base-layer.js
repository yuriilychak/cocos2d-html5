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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { sceneRenderTextureIdx } from "./render-texture-test-constants";
import {
  arrayOfRenderTextureTest,
  nextRenderTextureTest,
  previousRenderTextureTest,
  restartRenderTextureTest
} from "./render-texture-test-helpers";
import { RenderTextureTestScene } from "./render-texture-test-scene";
import { director } from "../constants";
import { Color } from "@aspect/core";

export class RenderTextureBaseLayer extends BaseTestLayer {
  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));
  }

  title() {
    return "Render Texture";
  }

  subtitle() {
    return "";
  }

  code() {
    return "";
  }

  // callbacks
  onRestartCallback(sender) {
    var s = new RenderTextureTestScene();
    s.addChild(restartRenderTextureTest());
    director.runScene(s);
  }
  onNextCallback(sender) {
    var s = new RenderTextureTestScene();
    s.addChild(nextRenderTextureTest());
    director.runScene(s);
  }
  onBackCallback(sender) {
    var s = new RenderTextureTestScene();
    s.addChild(previousRenderTextureTest());
    director.runScene(s);
  }

  // automation
  numberOfPendingTests() {
    return arrayOfRenderTextureTest.length - 1 - sceneRenderTextureIdx;
  }

  getTestNumber() {
    return sceneRenderTextureIdx;
  }
}

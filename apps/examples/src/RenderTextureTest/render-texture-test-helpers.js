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

import { Issue1464 } from "./issue1464";
import { RenderTextureIssue937 } from "./render-texture-issue937";
import { RenderTextureSave } from "./render-texture-save";
import { RenderTextureTargetNode } from "./render-texture-target-node";
import {
  sceneRenderTextureIdx,
  _setsceneRenderTextureIdx
} from "./render-texture-test-constants";
import { RenderTextureTestDepthStencil } from "./render-texture-test-depth-stencil";
import { RenderTextureZbuffer } from "./render-texture-zbuffer";

//
// Flow control
//
export var arrayOfRenderTextureTest = [RenderTextureSave, Issue1464];

if (
  "opengl" in cc.sys.capabilities &&
  cc.rendererConfig.isWebGL &&
  !cc.sys.isNative
) {
  arrayOfRenderTextureTest.push(RenderTextureIssue937);
  arrayOfRenderTextureTest.push(RenderTextureZbuffer);
  arrayOfRenderTextureTest.push(RenderTextureTestDepthStencil);
  arrayOfRenderTextureTest.push(RenderTextureTargetNode);
}

export function nextRenderTextureTest() {
  _setsceneRenderTextureIdx(sceneRenderTextureIdx + 1);
  _setsceneRenderTextureIdx(
    sceneRenderTextureIdx % arrayOfRenderTextureTest.length
  );

  return new arrayOfRenderTextureTest[sceneRenderTextureIdx]();
}

export function previousRenderTextureTest() {
  _setsceneRenderTextureIdx(sceneRenderTextureIdx - 1);
  if (sceneRenderTextureIdx < 0)
    _setsceneRenderTextureIdx(
      sceneRenderTextureIdx + arrayOfRenderTextureTest.length
    );

  return new arrayOfRenderTextureTest[sceneRenderTextureIdx]();
}

export function restartRenderTextureTest() {
  return new arrayOfRenderTextureTest[sceneRenderTextureIdx]();
}

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

import { _alphaThreshold } from "./clipping-node-test-helpers";
import { RawStencilBufferTest } from "./raw-stencil-buffer-test";
import {
  glUseProgram,
  ServiceLocator,
  ShaderName,
  UniformName
} from "@aspect/core";
export class RawStencilBufferTest5 extends RawStencilBufferTest {
  subtitle() {
    return "5:DepthTest:DISABLE,DepthMask:FALSE,AlphaTest:ENABLE";
  }

  setupStencilForClippingOnPlane(plane) {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    super.setupStencilForClippingOnPlane(plane);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);

    var program = ServiceLocator.shaderCache.programForKey(
      ShaderName.POSITION_TEXTURECOLORALPHATEST
    );
    var alphaValueLocation = gl.getUniformLocation(
      program.getProgram(),
      UniformName.ALPHA_TEST_VALUE
    );
    glUseProgram(program.getProgram());
    program.setUniformLocationWith1f(alphaValueLocation, _alphaThreshold);
    this._sprite.shaderProgram = program;
  }

  setupStencilForDrawingOnPlane(plane) {
    ServiceLocator.sys.rendererConfig.renderContext.depthMask(true);
    //rendererConfig.renderContext.enable(rendererConfig.renderContext.DEPTH_TEST);
    super.setupStencilForDrawingOnPlane(plane);
  }
}

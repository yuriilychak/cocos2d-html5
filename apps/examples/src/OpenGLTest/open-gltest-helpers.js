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

import { GetSupportedExtensionsTest } from "./get-supported-extensions-test.js";
import { GLClearTest } from "./glclear-test.js";
import { GLGetActiveTest } from "./glget-active-test.js";
import { GLGetUniformTest } from "./glget-uniform-test.js";
import { GLNodeCCAPITest } from "./glnode-ccapitest.js";
import { GLNodeWebGLAPITest } from "./glnode-web-glapitest.js";
import { GLReadPixelsTest } from "./glread-pixels-test.js";
import { GLTexParamterTest } from "./gltex-paramter-test.js";
import { OpenGLTestIdx , _setOpenGLTestIdx} from "./open-gltest-constants.js";
import { ShaderFlowerTest } from "./shader-flower-test.js";
import { ShaderHeartTest } from "./shader-heart-test.js";
import { ShaderJuliaTest } from "./shader-julia-test.js";
import { ShaderMandelbrotTest } from "./shader-mandelbrot-test.js";
import { ShaderMonjoriTest } from "./shader-monjori-test.js";
import { ShaderOutlineEffect } from "./shader-outline-effect.js";
import { ShaderPlasmaTest } from "./shader-plasma-test.js";
import { ShaderRetroEffect } from "./shader-retro-effect.js";
import { TexImage2DTest } from "./tex-image2-dtest.js";

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

//-
//
// Flow control
//
export var arrayOfOpenGLTest = [
    ShaderOutlineEffect,
    ShaderRetroEffect,
    ShaderMonjoriTest,
    ShaderMandelbrotTest,
    ShaderHeartTest,
    ShaderPlasmaTest,
    ShaderFlowerTest,
    ShaderJuliaTest,
    GLGetActiveTest,
    TexImage2DTest,
    GetSupportedExtensionsTest,
    GLReadPixelsTest,
    GLClearTest,
    GLNodeWebGLAPITest,
    GLNodeCCAPITest,
    GLTexParamterTest,
    GLGetUniformTest
];

export function nextOpenGLTest() {
    _setOpenGLTestIdx(OpenGLTestIdx + 1);
    _setOpenGLTestIdx(OpenGLTestIdx % arrayOfOpenGLTest.length);

    return new arrayOfOpenGLTest[OpenGLTestIdx]();
}

;

export function previousOpenGLTest() {
    _setOpenGLTestIdx(OpenGLTestIdx - 1);
    if (OpenGLTestIdx < 0)
        _setOpenGLTestIdx(OpenGLTestIdx + (arrayOfOpenGLTest.length));

    return new arrayOfOpenGLTest[OpenGLTestIdx]();
}

;

export function restartOpenGLTest() {
    return new arrayOfOpenGLTest[OpenGLTestIdx]();
}

;

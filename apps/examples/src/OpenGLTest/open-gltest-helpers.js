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

;

cc.GLNode = cc.GLNode || class GLNode extends cc.Node {
    constructor() {
        super();
        this.init();
    }
    init() {
        this._renderCmd._needDraw = true;
        this._renderCmd._matrix = new math.Matrix4();
        this._renderCmd._matrix.identity();
        this._renderCmd.rendering =  function(ctx){
            var wt = this._worldTransform;
            this._matrix.mat[0] = wt.a;
            this._matrix.mat[4] = wt.c;
            this._matrix.mat[12] = wt.tx;
            this._matrix.mat[1] = wt.b;
            this._matrix.mat[5] = wt.d;
            this._matrix.mat[13] = wt.ty;

            kmGLMatrixMode(KM_GL_MODELVIEW);
            kmGLPushMatrix();
            kmGLLoadMatrix(this._matrix);

            this._node.draw(ctx);

            kmGLPopMatrix();
        };
    }
    draw(ctx) {
        super.draw(ctx);
    }
};

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
var arrayOfOpenGLTest = [
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
    OpenGLTestIdx++;
    OpenGLTestIdx = OpenGLTestIdx % arrayOfOpenGLTest.length;

    return new arrayOfOpenGLTest[OpenGLTestIdx]();
}

;

export function previousOpenGLTest() {
    OpenGLTestIdx--;
    if (OpenGLTestIdx < 0)
        OpenGLTestIdx += arrayOfOpenGLTest.length;

    return new arrayOfOpenGLTest[OpenGLTestIdx]();
}

;

export function restartOpenGLTest() {
    return new arrayOfOpenGLTest[OpenGLTestIdx]();
}

;

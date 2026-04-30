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

//------------------------------------------------------------------
//
// GLGetUniformTest
//
//------------------------------------------------------------------
import { OpenGLTestLayer } from "./open-gltest-layer.js";
import { autoTestEnabled } from "../tests-main-constants.js";

export class GLGetUniformTest extends OpenGLTestLayer {

    constructor() {
        super();

        if( 'opengl' in cc.sys.capabilities ) {

            if( ! autoTestEnabled ) {
                cc.log( JSON.stringify( this.runTest() ));
            }

        }
    }

    title() {
        return "GLGetUniformTest";
    }
    subtitle() {
        return "tests texParameter()\n See the Console";
    }
    runTest() {

        var shader = cc.shaderCache.getProgram("ShaderPositionTextureColor");
        var program = shader.getProgram();
        shader.use();

        var loc = cc.sys.isNative ? gl.getUniformLocation(program, "CC_MVPMatrix") : gl.getUniformLocation(program, "CC_MVMatrix");

        var pMatrix = [1,2,3,4, 4,3,2,1, 1,2,4,8, 1.1,1.2,1.3,1.4];
        this.pMatrix = new Float32Array(pMatrix);

        gl.uniformMatrix4fv(loc, false, this.pMatrix);

        return gl.getUniform( program, loc );
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"0":1,"1":2,"2":3,"3":4,"4":4,"5":3,"6":2,"7":1,"8":1,"9":2,"10":4,"11":8,"12":1.100000023841858,"13":1.2000000476837158,"14":1.2999999523162842,"15":1.399999976158142};
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = this.runTest();
        return JSON.stringify(ret);
    }

}

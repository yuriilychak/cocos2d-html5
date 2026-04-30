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
// GLNodeCCAPITest
//
//------------------------------------------------------------------
export class GLNodeCCAPITest extends OpenGLTestLayer {

    constructor() {
        super();

        if( 'opengl' in sys.capabilities ) {


            var glnode = new cc.GLNode();
            this.addChild(glnode,10);
            this.glnode = glnode;

            this.shader = shaderCache.getProgram("ShaderPositionColor");
            this.initBuffers();

            glnode.draw = function() {

                this.shader.use();
                this.shader.setUniformsForBuiltins();
                gl.enableVertexAttribArray(VERTEX_ATTRIB_COLOR);
                gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);

                // Draw fullscreen Square
                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
                gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
                gl.vertexAttribPointer(VERTEX_ATTRIB_COLOR, 4, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                // Draw fullscreen Triangle
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
                gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
                gl.vertexAttribPointer(VERTEX_ATTRIB_COLOR, 4, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

                gl.bindBuffer(gl.ARRAY_BUFFER, null);

            }.bind(this);

        }
    }

    initBuffers() {
        //
        // Triangle
        //
        var triangleVertexPositionBuffer = this.triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
                winSize.width/2,   winSize.height,
            0,                 0,
            winSize.width,     0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var triangleVertexColorBuffer = this.triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        //
        // Square
        //
        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        var vertices = [
            winSize.width,  winSize.height,
            0,              winSize.height,
            winSize.width,  0,
            0,              0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var squareVertexColorBuffer = this.squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        var colors = [
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    title() {
        return "GLNode + cocos2d API";
    }
    subtitle() {
        return "blue background with a red triangle in the middle";
    }

    //
    // Automation
    //
    getExpectedResult() {
        // blue, red, blue
        var ret = [{"0":0,"1":0,"2":255,"3":255},{"0":0,"1":0,"2":255,"3":255},{"0":255,"1":0,"2":0,"3":255}];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret1 = this.readPixels(10, winSize.height-1,  1, 1);
        var ret2 = this.readPixels(winSize.width-10, winSize.height-1,  1, 1);
        var ret3 = this.readPixels(winSize.width/2, winSize.height/2,  1, 1);

        return JSON.stringify([ret1,ret2,ret3]);
    }

}

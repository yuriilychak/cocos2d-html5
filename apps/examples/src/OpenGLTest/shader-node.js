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
// ShaderNode
//
//------------------------------------------------------------------
export class ShaderNode extends cc.GLNode {
    constructor(vertexShader, framentShader) {
        super();
        this.init();

        if( 'opengl' in sys.capabilities ) {
            this.width = 256;
            this.height = 256;
            this.anchorX = 0.5;
            this.anchorY = 0.5;

            this.shader = new GLProgram(vertexShader, framentShader);
            this.shader.addAttribute("aVertex", VERTEX_ATTRIB_POSITION);
            this.shader.link();
            this.shader.updateUniforms();

            var program = this.shader.getProgram();
            this.uniformCenter = gl.getUniformLocation( program, "center");
            this.uniformResolution = gl.getUniformLocation( program, "resolution");
            this.initBuffers();

            this.scheduleUpdate();
            this._time = 0;
        }
    }
    draw() {
        this.shader.use();
        this.shader.setUniformsForBuiltins();

        //
        // Uniforms
        //
        var frameSize = view.getFrameSize();
        var visibleSize = view.getVisibleSize();
        var retinaFactor = view.getDevicePixelRatio();
        var position = this.getPosition();

        var centerx = position.x * frameSize.width/visibleSize.width * retinaFactor;
        var centery = position.y * frameSize.height/visibleSize.height * retinaFactor;
        this.shader.setUniformLocationF32( this.uniformCenter, centerx, centery);
        this.shader.setUniformLocationF32( this.uniformResolution, 256, 256);

        gl.enableVertexAttribArray( VERTEX_ATTRIB_POSITION );

        // Draw fullscreen Square
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    update(dt) {
        this._time += dt;
    }
    initBuffers() {

        //
        // Square
        //
        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        var vertices = [
            256,            256,
            0,              256,
            256,            0,
            0,              0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

}

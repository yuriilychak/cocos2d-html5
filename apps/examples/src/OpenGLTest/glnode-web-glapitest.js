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
// GLNodeWebGLAPITest
//
//------------------------------------------------------------------
import { OpenGLTestLayer } from "./open-gltest-layer";
import { GLNode } from "./glnode-polyfill";
import { winSize } from "../constants";
import { log, ServiceLocator } from "@aspect/core";

export class GLNodeWebGLAPITest extends OpenGLTestLayer {
  constructor() {
    super();

    if (ServiceLocator.sys.capabilities.opengl) {
      // simple shader example taken from:
      // http://learningwebgl.com/blog/?p=134
      var vsh =
        "\n" +
        "attribute vec3 aVertexPosition;\n" +
        "attribute vec4 aVertexColor;\n" +
        "uniform mat4 uMVMatrix;\n" +
        "uniform mat4 uPMatrix;\n" +
        "varying vec4 vColor;\n" +
        "void main(void) {\n" +
        " gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
        " vColor = aVertexColor;\n" +
        "}\n";

      var fsh =
        "\n" +
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "varying vec4 vColor;\n" +
        "void main(void) {\n" +
        " gl_FragColor = vColor;\n" +
        "}\n";

      var fshader = this.compileShader(fsh, "fragment");
      var vshader = this.compileShader(vsh, "vertex");

      var shaderProgram = (this.shader = gl.createProgram());

      gl.attachShader(shaderProgram, vshader);
      gl.attachShader(shaderProgram, fshader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw "Could not initialise shaders";
      }

      gl.useProgram(shaderProgram);

      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
        shaderProgram,
        "aVertexPosition"
      );
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.vertexColorAttribute = gl.getAttribLocation(
        shaderProgram,
        "aVertexColor"
      );
      gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

      shaderProgram.pMatrixUniform = gl.getUniformLocation(
        shaderProgram,
        "uPMatrix"
      );
      shaderProgram.mvMatrixUniform = gl.getUniformLocation(
        shaderProgram,
        "uMVMatrix"
      );

      this.initBuffers();

      var glnode = new GLNode();
      this.addChild(glnode, 10);
      this.glnode = glnode;

      glnode.draw = function () {
        var pMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.pMatrix = pMatrix = new Float32Array(pMatrix);

        var mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.mvMatrix = mvMatrix = new Float32Array(mvMatrix);

        gl.useProgram(this.shader);
        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, this.pMatrix);
        gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, this.mvMatrix);

        gl.enableVertexAttribArray(this.shader.vertexPositionAttribute);
        gl.enableVertexAttribArray(this.shader.vertexColorAttribute);

        // Draw fullscreen Square
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        gl.vertexAttribPointer(
          this.shader.vertexPositionAttribute,
          this.squareVertexPositionBuffer.itemSize,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
        gl.vertexAttribPointer(
          this.shader.vertexColorAttribute,
          this.squareVertexColorBuffer.itemSize,
          gl.FLOAT,
          false,
          0,
          0
        );

        this.setMatrixUniforms();
        gl.drawArrays(
          gl.TRIANGLE_STRIP,
          0,
          this.squareVertexPositionBuffer.numItems
        );

        // Draw fullscreen Triangle
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
        gl.vertexAttribPointer(
          this.shader.vertexPositionAttribute,
          this.triangleVertexPositionBuffer.itemSize,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
        gl.vertexAttribPointer(
          this.shader.vertexColorAttribute,
          this.triangleVertexColorBuffer.itemSize,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.drawArrays(
          gl.TRIANGLES,
          0,
          this.triangleVertexPositionBuffer.numItems
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }.bind(this);
    }
  }

  setMatrixUniforms() {
    gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, this.mvMatrix);
  }

  initBuffers() {
    var triangleVertexPositionBuffer = (this.triangleVertexPositionBuffer =
      gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    var triangleVertexColorBuffer = (this.triangleVertexColorBuffer =
      gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var colors = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 3;

    var squareVertexPositionBuffer = (this.squareVertexPositionBuffer =
      gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var vertices = [
      1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;

    var squareVertexColorBuffer = (this.squareVertexColorBuffer =
      gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    var colors = [
      0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
      1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = 4;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  compileShader(source, type) {
    var shader;
    if (type == "fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
    else shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      log(gl.getShaderInfoLog(shader));
      throw "Could not compile " + type + " shader";
    }
    return shader;
  }

  title() {
    return "GLNode + WebGL API";
  }
  subtitle() {
    return "blue background with a red triangle in the middle";
  }

  //
  // Automation
  //
  getExpectedResult() {
    // blue, red, blue
    var ret = [
      { 0: 0, 1: 0, 2: 255, 3: 255 },
      { 0: 0, 1: 0, 2: 255, 3: 255 },
      { 0: 255, 1: 0, 2: 0, 3: 255 }
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret1 = this.readPixels(10, winSize.height - 1, 1, 1);
    var ret2 = this.readPixels(winSize.width - 10, winSize.height - 1, 1, 1);
    var ret3 = this.readPixels(winSize.width / 2, winSize.height / 2, 1, 1);

    return JSON.stringify([ret1, ret2, ret3]);
  }
}

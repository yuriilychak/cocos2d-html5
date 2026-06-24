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
// TexImage2DTest
//
//------------------------------------------------------------------
import { OpenGLTestLayer } from "./open-gltest-layer";
import { GLNode } from "./glnode-polyfill";
import { winSize } from "../constants";
import { ServiceLocator, VertexAttribute } from "@aspect/core";
export class TexImage2DTest extends OpenGLTestLayer {
  constructor() {
    super();

    if (ServiceLocator.sys.capabilities.opengl) {
      var glnode = new GLNode();
      this.addChild(glnode, 10);
      this.glnode = glnode;
      glnode.x = winSize.width / 2;
      glnode.y = winSize.height / 2;
      glnode.width = 128;
      glnode.height = 128;
      glnode.anchorX = 0.5;
      glnode.anchorY = 0.5;

      this.shader = ServiceLocator.shaderCache.getProgram(
        "ShaderPositionTexture"
      );
      this.initGL();

      glnode.draw = function () {
        this.shader.use();
        this.shader.setUniformsForBuiltins();

        gl.bindTexture(gl.TEXTURE_2D, this.my_texture);
        gl.enableVertexAttribArray(VertexAttribute.POSITION);
        gl.enableVertexAttribArray(VertexAttribute.TEX_COORDS);

        // Draw fullscreen Square
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        gl.vertexAttribPointer(
          VertexAttribute.POSITION,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexTextureBuffer);
        gl.vertexAttribPointer(
          VertexAttribute.TEX_COORDS,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }.bind(this);
    }
  }

  initGL() {
    var texture = (this.my_texture = gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, texture);

    var pixels = new Uint8Array(4096);
    for (var i = 0; i < pixels.length; ) {
      pixels[i++] = i / 4; // Red
      pixels[i++] = i / 16; // Green
      pixels[i++] = i / 8; // Blue
      pixels[i++] = 255; // Alpha
    }
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      32,
      32,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    //
    // Square
    //
    var squareVertexPositionBuffer = (this.squareVertexPositionBuffer =
      gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var vertices = [128, 128, 0, 128, 128, 0, 0, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var squareVertexTextureBuffer = (this.squareVertexTextureBuffer =
      gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureBuffer);
    var texcoords = [1, 1, 0, 1, 1, 0, 0, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
  title() {
    return "TexImage2DTest";
  }
  subtitle() {
    return "Testing Texture creation";
  }

  //
  // Automation
  //
  getExpectedResult() {
    // blue, red, blue
    var ret = {
      0: 239,
      1: 123,
      2: 247,
      3: 255,
      4: 239,
      5: 123,
      6: 247,
      7: 255,
      8: 240,
      9: 124,
      10: 248,
      11: 255,
      12: 240,
      13: 124,
      14: 248,
      15: 255,
      16: 239,
      17: 123,
      18: 247,
      19: 255,
      20: 239,
      21: 123,
      22: 247,
      23: 255,
      24: 240,
      25: 124,
      26: 248,
      27: 255,
      28: 240,
      29: 124,
      30: 248,
      31: 255,
      32: 15,
      33: 131,
      34: 7,
      35: 255,
      36: 15,
      37: 131,
      38: 7,
      39: 255,
      40: 16,
      41: 132,
      42: 8,
      43: 255,
      44: 16,
      45: 132,
      46: 8,
      47: 255,
      48: 15,
      49: 131,
      50: 7,
      51: 255,
      52: 15,
      53: 131,
      54: 7,
      55: 255,
      56: 16,
      57: 132,
      58: 8,
      59: 255,
      60: 16,
      61: 132,
      62: 8,
      63: 255
    };
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = this.readPixels(
      winSize.width / 2 - 2,
      winSize.height / 2 - 2,
      4,
      4
    );
    return JSON.stringify(ret);
  }
}

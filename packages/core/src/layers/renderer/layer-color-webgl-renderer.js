/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

import { RendererConfig } from "../../renderer/renderer-config";
import LayerWebGLRenderer from "./layer-webgl-renderer";
import {
  SHADER_POSITION_COLOR,
  VERTEX_ATTRIB_COLOR,
  VERTEX_ATTRIB_POSITION
} from "../../platform/macro/constants";
import ShaderCache from "../../shaders/CCShaderCache";

/**
 * LayerColor's WebGL render command
 */
const FLOAT_PER_VERTEX_COLOR = 4;

export default class LayerColorWebGLRenderer extends LayerWebGLRenderer {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;

    this._matrix = null;

    this.initData(4);
    this._color = new Uint32Array(1);
    this._vertexBuffer = null;

    this._shaderProgram = ShaderCache.getInstance().programForKey(
      SHADER_POSITION_COLOR
    );
  }

  initData(vertexCount) {
    this._data = new ArrayBuffer(16 * vertexCount);
    this._positionView = new Float32Array(this._data);
    this._colorView = new Uint32Array(this._data);
    this._dataDirty = true;
  }

  transform(parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);

    const node = this._node,
      width = node._contentSize.width,
      height = node._contentSize.height;

    const pos = this._positionView;
    pos[FLOAT_PER_VERTEX_COLOR] = width;
    pos[FLOAT_PER_VERTEX_COLOR * 2 + 1] = height;
    pos[FLOAT_PER_VERTEX_COLOR * 3] = width;
    pos[FLOAT_PER_VERTEX_COLOR * 3 + 1] = height;
    pos[2] =
      pos[FLOAT_PER_VERTEX_COLOR + 2] =
      pos[FLOAT_PER_VERTEX_COLOR * 2 + 2] =
      pos[FLOAT_PER_VERTEX_COLOR * 3 + 2] =
        node._vertexZ;

    this._dataDirty = true;
  }

  _updateColor() {
    const color = this._displayedColor;
    this._color[0] =
      (this._displayedOpacity << 24) |
      (color.b << 16) |
      (color.g << 8) |
      color.r;

    const colors = this._colorView;
    for (let i = 0; i < 4; i++) {
      colors[i * FLOAT_PER_VERTEX_COLOR + 3] = this._color[0];
    }
    this._dataDirty = true;
  }

  rendering(ctx) {
    const gl = ctx || RendererConfig.getInstance().renderContext;
    const node = this._node;

    if (!this._matrix) {
      this._matrix = new cc.math.Matrix4();
      this._matrix.identity();
    }

    const wt = this._worldTransform;
    this._matrix.mat[0] = wt.a;
    this._matrix.mat[4] = wt.c;
    this._matrix.mat[12] = wt.tx;
    this._matrix.mat[1] = wt.b;
    this._matrix.mat[5] = wt.d;
    this._matrix.mat[13] = wt.ty;

    if (this._dataDirty) {
      if (!this._vertexBuffer) {
        this._vertexBuffer = gl.createBuffer();
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.DYNAMIC_DRAW);
      this._dataDirty = false;
    }

    this._glProgramState.apply(this._matrix);
    cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_COLOR);

    gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_COLOR,
      4,
      gl.UNSIGNED_BYTE,
      true,
      16,
      12
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  updateBlendFunc(blendFunc) {}
}

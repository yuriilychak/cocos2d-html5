/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2009      On-Core

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

import {
  log,
  Vertex3F,
  Point,
  RendererConfig,
  VERTEX_ATTRIB_POSITION,
  VERTEX_ATTRIB_TEX_COORDS,
  incrementGLDraws,
  Matrix4
} from "@aspect/core";
import { GridBase } from "./grid-base.js";

/**
 * Grid3D is a 3D grid implementation. Each vertex has 3 dimensions: x,y,z
 */
export class Grid3D extends GridBase {
  constructor(gridSize, texture, flipped, rect) {
    super();
    this._texCoordinates = null;
    this._vertices = null;
    this._originalVertices = null;
    this._indices = null;

    this._texCoordinateBuffer = null;
    this._verticesBuffer = null;
    this._indicesBuffer = null;

    this._needDepthTestForBlit = false;
    this._oldDepthTestValue = false;
    this._oldDepthWriteValue = false;

    this._matrix = new Matrix4();
    this._matrix.identity();

    if (gridSize !== undefined)
      this.initWithSize(gridSize, texture, flipped, rect);
  }

  /**
   * returns the vertex at a given position
   * @param {Point} pos
   * @return {Vertex3F}
   */
  getVertex(pos) {
    if (pos.x !== (0 | pos.x) || pos.y !== (0 | pos.y))
      log("Grid3D.vertex() : Numbers must be integers");
    const index = 0 | ((pos.x * (this._gridSize.height + 1) + pos.y) * 3);
    const locVertices = this._vertices;
    return new Vertex3F(
      locVertices[index],
      locVertices[index + 1],
      locVertices[index + 2]
    );
  }

  /**
   * returns the original (non-transformed) vertex at a given position
   * @param {Point} pos
   * @return {Vertex3F}
   */
  getOriginalVertex(pos) {
    if (pos.x !== (0 | pos.x) || pos.y !== (0 | pos.y))
      log("Grid3D.originalVertex() : Numbers must be integers");
    const index = 0 | ((pos.x * (this._gridSize.height + 1) + pos.y) * 3);
    const locOriginalVertices = this._originalVertices;
    return new Vertex3F(
      locOriginalVertices[index],
      locOriginalVertices[index + 1],
      locOriginalVertices[index + 2]
    );
  }

  /**
   * sets a new vertex at a given position
   * @param {Point} pos
   * @param {Vertex3F} vertex
   */
  setVertex(pos, vertex) {
    if (pos.x !== (0 | pos.x) || pos.y !== (0 | pos.y))
      log("Grid3D.setVertex() : Numbers must be integers");
    const index = 0 | ((pos.x * (this._gridSize.height + 1) + pos.y) * 3);
    const vertArray = this._vertices;
    vertArray[index] = vertex.x;
    vertArray[index + 1] = vertex.y;
    vertArray[index + 2] = vertex.z;
    this._dirty = true;
  }

  beforeBlit() {
    if (this._needDepthTestForBlit) {
      const gl = RendererConfig.getInstance().renderContext;
      this._oldDepthTestValue = gl.isEnabled(gl.DEPTH_TEST);
      this._oldDepthWriteValue = gl.getParameter(gl.DEPTH_WRITEMASK);
      //CHECK_GL_ERROR_DEBUG();
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
    }
  }

  afterBlit() {
    if (this._needDepthTestForBlit) {
      const gl = RendererConfig.getInstance().renderContext;
      if (this._oldDepthTestValue) gl.enable(gl.DEPTH_TEST);
      else gl.disable(gl.DEPTH_TEST);
      gl.depthMask(this._oldDepthWriteValue);
    }
  }

  blit(target) {
    const n = this._gridSize.width * this._gridSize.height;

    var wt = target._renderCmd._worldTransform;
    this._matrix.mat[0] = wt.a;
    this._matrix.mat[4] = wt.c;
    this._matrix.mat[12] = wt.tx;
    this._matrix.mat[1] = wt.b;
    this._matrix.mat[5] = wt.d;
    this._matrix.mat[13] = wt.ty;

    this._glProgramState.apply(this._matrix);

    const gl = RendererConfig.getInstance().renderContext;
    const locDirty = this._dirty;

    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_TEX_COORDS);
    //
    // Attributes
    //
    // position
    gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
    if (locDirty)
      gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);

    // texCoords
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordinateBuffer);
    if (locDirty)
      gl.bufferData(gl.ARRAY_BUFFER, this._texCoordinates, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
    if (locDirty)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_SHORT, 0);
    if (locDirty) this._dirty = false;
    incrementGLDraws(1);
  }

  reuse() {
    if (this._reuseGrid > 0) {
      const locOriginalVertices = this._originalVertices,
        locVertices = this._vertices;
      for (let i = 0, len = this._vertices.length; i < len; i++)
        locOriginalVertices[i] = locVertices[i];
      --this._reuseGrid;
    }
  }

  calculateVertexPoints() {
    const gl = RendererConfig.getInstance().renderContext;

    const width = this._texture.pixelsWidth;
    const height = this._texture.pixelsHeight;
    const imageH = this._texture.getContentSizeInPixels().height;
    const locGridSize = this._gridSize;

    const numOfPoints = (locGridSize.width + 1) * (locGridSize.height + 1);
    this._vertices = new Float32Array(numOfPoints * 3);
    this._texCoordinates = new Float32Array(numOfPoints * 2);
    this._indices = new Uint16Array(locGridSize.width * locGridSize.height * 6);

    if (this._verticesBuffer) gl.deleteBuffer(this._verticesBuffer);
    this._verticesBuffer = gl.createBuffer();
    if (this._texCoordinateBuffer) gl.deleteBuffer(this._texCoordinateBuffer);
    this._texCoordinateBuffer = gl.createBuffer();
    if (this._indicesBuffer) gl.deleteBuffer(this._indicesBuffer);
    this._indicesBuffer = gl.createBuffer();

    let x, y, i;
    const locIndices = this._indices,
      locTexCoordinates = this._texCoordinates;
    const locIsTextureFlipped = this._isTextureFlipped,
      locVertices = this._vertices;
    for (x = 0; x < locGridSize.width; ++x) {
      for (y = 0; y < locGridSize.height; ++y) {
        const idx = y * locGridSize.width + x;
        const x1 = x * this._step.x + this._gridRect.x;
        const x2 = x1 + this._step.x;
        const y1 = y * this._step.y + this._gridRect.y;
        const y2 = y1 + this._step.y;

        const a = x * (locGridSize.height + 1) + y;
        const b = (x + 1) * (locGridSize.height + 1) + y;
        const c = (x + 1) * (locGridSize.height + 1) + (y + 1);
        const d = x * (locGridSize.height + 1) + (y + 1);

        locIndices[idx * 6] = a;
        locIndices[idx * 6 + 1] = b;
        locIndices[idx * 6 + 2] = d;
        locIndices[idx * 6 + 3] = b;
        locIndices[idx * 6 + 4] = c;
        locIndices[idx * 6 + 5] = d;

        const l1 = [a * 3, b * 3, c * 3, d * 3];
        const e = { x: x1, y: y1, z: 0 }; //new Vertex3F(x1, y1, 0);
        const f = { x: x2, y: y1, z: 0 }; //new Vertex3F(x2, y1, 0);
        const g = { x: x2, y: y2, z: 0 }; // new Vertex3F(x2, y2, 0);
        const h = { x: x1, y: y2, z: 0 }; //new Vertex3F(x1, y2, 0);

        const l2 = [e, f, g, h];
        const tex1 = [a * 2, b * 2, c * 2, d * 2];
        const tex2 = [
          new Point(x1, y1),
          new Point(x2, y1),
          new Point(x2, y2),
          new Point(x1, y2)
        ];
        for (i = 0; i < 4; ++i) {
          locVertices[l1[i]] = l2[i].x;
          locVertices[l1[i] + 1] = l2[i].y;
          locVertices[l1[i] + 2] = l2[i].z;
          locTexCoordinates[tex1[i]] = tex2[i].x / width;
          if (locIsTextureFlipped)
            locTexCoordinates[tex1[i] + 1] = (imageH - tex2[i].y) / height;
          else locTexCoordinates[tex1[i] + 1] = tex2[i].y / height;
        }
      }
    }
    this._originalVertices = new Float32Array(this._vertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordinateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._texCoordinates, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);
    this._dirty = true;
  }

  setNeedDepthTestForBlit(needDepthTest) {
    this._needDepthTestForBlit = needDepthTest;
  }

  getNeedDepthTestForBlit() {
    return this._needDepthTestForBlit;
  }
}

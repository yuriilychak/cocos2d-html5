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
  Quad3,
  RendererConfig,
  VERTEX_ATTRIB_POSITION,
  VERTEX_ATTRIB_TEX_COORDS,
  incrementGLDraws,
  Matrix4
} from "@aspect/core";
import { GridBase } from "./grid-base.js";

/**
 * TiledGrid3D is a 3D grid implementation. It differs from Grid3D in that   <br/>
 * the tiles can be separated from the grid.
 */
export class TiledGrid3D extends GridBase {
  constructor(gridSize, texture, flipped, rect) {
    super();
    this._texCoordinates = null;
    this._vertices = null;
    this._originalVertices = null;
    this._indices = null;

    this._texCoordinateBuffer = null;
    this._verticesBuffer = null;
    this._indicesBuffer = null;

    this._matrix = new Matrix4();
    this._matrix.identity();

    if (gridSize !== undefined)
      this.initWithSize(gridSize, texture, flipped, rect);
  }

  /**
   * returns the tile at the given position
   * @param {Point} pos
   * @return {Quad3}
   */
  getTile(pos) {
    if (pos.x !== (0 | pos.x) || pos.y !== (0 | pos.y))
      log("TiledGrid3D.tile() : Numbers must be integers");

    const idx = (this._gridSize.height * pos.x + pos.y) * 4 * 3;
    const locVertices = this._vertices;
    return new Quad3(
      new Vertex3F(
        locVertices[idx],
        locVertices[idx + 1],
        locVertices[idx + 2]
      ),
      new Vertex3F(
        locVertices[idx + 3],
        locVertices[idx + 4],
        locVertices[idx + 5]
      ),
      new Vertex3F(
        locVertices[idx + 6],
        locVertices[idx + 7],
        locVertices[idx + 8]
      ),
      new Vertex3F(
        locVertices[idx + 9],
        locVertices[idx + 10],
        locVertices[idx + 11]
      )
    );
  }

  /**
   * returns the original tile (untransformed) at the given position
   * @param {Point} pos
   * @return {Quad3}
   */
  getOriginalTile(pos) {
    if (pos.x !== (0 | pos.x) || pos.y !== (0 | pos.y))
      log("TiledGrid3D.originalTile() : Numbers must be integers");

    const idx = (this._gridSize.height * pos.x + pos.y) * 4 * 3;
    const locOriginalVertices = this._originalVertices;
    return new Quad3(
      new Vertex3F(
        locOriginalVertices[idx],
        locOriginalVertices[idx + 1],
        locOriginalVertices[idx + 2]
      ),
      new Vertex3F(
        locOriginalVertices[idx + 3],
        locOriginalVertices[idx + 4],
        locOriginalVertices[idx + 5]
      ),
      new Vertex3F(
        locOriginalVertices[idx + 6],
        locOriginalVertices[idx + 7],
        locOriginalVertices[idx + 8]
      ),
      new Vertex3F(
        locOriginalVertices[idx + 9],
        locOriginalVertices[idx + 10],
        locOriginalVertices[idx + 11]
      )
    );
  }

  /**
   * sets a new tile
   * @param {Point} pos
   * @param {Quad3} coords
   */
  setTile(pos, coords) {
    if (pos.x !== (0 | pos.x) || pos.y !== (0 | pos.y))
      log("TiledGrid3D.setTile() : Numbers must be integers");

    const idx = (this._gridSize.height * pos.x + pos.y) * 12;
    const locVertices = this._vertices;
    locVertices[idx] = coords.bl.x;
    locVertices[idx + 1] = coords.bl.y;
    locVertices[idx + 2] = coords.bl.z;
    locVertices[idx + 3] = coords.br.x;
    locVertices[idx + 4] = coords.br.y;
    locVertices[idx + 5] = coords.br.z;
    locVertices[idx + 6] = coords.tl.x;
    locVertices[idx + 7] = coords.tl.y;
    locVertices[idx + 8] = coords.tl.z;
    locVertices[idx + 9] = coords.tr.x;
    locVertices[idx + 10] = coords.tr.y;
    locVertices[idx + 11] = coords.tr.z;
    this._dirty = true;
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

    //
    // Attributes
    //
    const gl = RendererConfig.getInstance().renderContext;
    const locDirty = this._dirty;
    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_TEX_COORDS);

    // position
    gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
    if (locDirty)
      gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      3,
      gl.FLOAT,
      false,
      0,
      this._vertices
    );

    // texCoords
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordinateBuffer);
    if (locDirty)
      gl.bufferData(gl.ARRAY_BUFFER, this._texCoordinates, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      0,
      this._texCoordinates
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
    if (locDirty)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_SHORT, 0);
    if (locDirty) this._dirty = false;
    incrementGLDraws(1);
  }

  reuse() {
    if (this._reuseGrid > 0) {
      const locVertices = this._vertices,
        locOriginalVertices = this._originalVertices;
      for (let i = 0; i < locVertices.length; i++)
        locOriginalVertices[i] = locVertices[i];
      --this._reuseGrid;
    }
  }

  calculateVertexPoints() {
    const width = this._texture.pixelsWidth;
    const height = this._texture.pixelsHeight;
    const imageH = this._texture.getContentSizeInPixels().height;
    const locGridSize = this._gridSize;

    const numQuads = locGridSize.width * locGridSize.height;
    this._vertices = new Float32Array(numQuads * 12);
    this._texCoordinates = new Float32Array(numQuads * 8);
    this._indices = new Uint16Array(numQuads * 6);

    const gl = RendererConfig.getInstance().renderContext;
    if (this._verticesBuffer) gl.deleteBuffer(this._verticesBuffer);
    this._verticesBuffer = gl.createBuffer();
    if (this._texCoordinateBuffer) gl.deleteBuffer(this._texCoordinateBuffer);
    this._texCoordinateBuffer = gl.createBuffer();
    if (this._indicesBuffer) gl.deleteBuffer(this._indicesBuffer);
    this._indicesBuffer = gl.createBuffer();

    let x,
      y,
      i = 0;
    const locStep = this._step,
      locVertices = this._vertices,
      locTexCoords = this._texCoordinates,
      locIsTextureFlipped = this._isTextureFlipped;
    for (x = 0; x < locGridSize.width; x++) {
      for (y = 0; y < locGridSize.height; y++) {
        const x1 = x * locStep.x;
        const x2 = x1 + locStep.x;
        const y1 = y * locStep.y;
        const y2 = y1 + locStep.y;

        locVertices[i * 12] = x1;
        locVertices[i * 12 + 1] = y1;
        locVertices[i * 12 + 2] = 0;
        locVertices[i * 12 + 3] = x2;
        locVertices[i * 12 + 4] = y1;
        locVertices[i * 12 + 5] = 0;
        locVertices[i * 12 + 6] = x1;
        locVertices[i * 12 + 7] = y2;
        locVertices[i * 12 + 8] = 0;
        locVertices[i * 12 + 9] = x2;
        locVertices[i * 12 + 10] = y2;
        locVertices[i * 12 + 11] = 0;

        let newY1 = y1;
        let newY2 = y2;

        if (locIsTextureFlipped) {
          newY1 = imageH - y1;
          newY2 = imageH - y2;
        }

        locTexCoords[i * 8] = x1 / width;
        locTexCoords[i * 8 + 1] = newY1 / height;
        locTexCoords[i * 8 + 2] = x2 / width;
        locTexCoords[i * 8 + 3] = newY1 / height;
        locTexCoords[i * 8 + 4] = x1 / width;
        locTexCoords[i * 8 + 5] = newY2 / height;
        locTexCoords[i * 8 + 6] = x2 / width;
        locTexCoords[i * 8 + 7] = newY2 / height;
        i++;
      }
    }

    const locIndices = this._indices;
    for (x = 0; x < numQuads; x++) {
      locIndices[x * 6 + 0] = x * 4 + 0;
      locIndices[x * 6 + 1] = x * 4 + 1;
      locIndices[x * 6 + 2] = x * 4 + 2;

      locIndices[x * 6 + 3] = x * 4 + 1;
      locIndices[x * 6 + 4] = x * 4 + 2;
      locIndices[x * 6 + 5] = x * 4 + 3;
    }
    this._originalVertices = new Float32Array(this._vertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordinateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._texCoordinates, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.DYNAMIC_DRAW);
    this._dirty = true;
  }
}

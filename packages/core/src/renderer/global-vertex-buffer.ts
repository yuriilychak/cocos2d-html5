/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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

import { V3F_C4B_T2F_Quad } from "../platform/types/vertex";

type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

export default class GlobalVertexBuffer {
  static #VERTICES_SIZE = 888;
  #data: ArrayBuffer | null = null;
  #dataArray: Float32Array | null = null;
  #vertexBuffer: WebGLBuffer | null = null;
  #gl: WebGLContext;
  #byteLength: number;
  #dirty: boolean = false;
  #spaces: Record<string, number>;

  constructor(gl: WebGLContext, byteLength?: number) {
    // WebGL buffer
    this.#gl = gl;
    this.#vertexBuffer = gl.createBuffer();
    this.#byteLength =
      byteLength ||
      GlobalVertexBuffer.#VERTICES_SIZE * 4 * V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;

    // buffer data and views
    this.#data = new ArrayBuffer(this.#byteLength);
    this.#dataArray = new Float32Array(this.#data);

    // Init buffer data
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#vertexBuffer);
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#dataArray, gl.DYNAMIC_DRAW);

    this.#spaces = {
      0: this.#byteLength
    };
  }

  allocBuffer(offset: number, size: number): boolean {
    const space = this.#spaces[offset];
    if (space && space >= size) {
      // Remove the space
      delete this.#spaces[offset];
      if (space > size) {
        const newOffset = offset + size;
        this.#spaces[newOffset] = space - size;
      }
      return true;
    }

    return false;
  }

  requestBuffer(size: number): number {
    for (const key in this.#spaces) {
      const offset = parseInt(key, 10);
      const available = this.#spaces[key];
      if (available >= size && this.allocBuffer(offset, size)) {
        return offset;
      }
    }
    return -1;
  }

  freeBuffer(offset: number, size: number): void {
    // Merge with previous space
    for (const key in this.#spaces) {
      const i = parseInt(key, 10);
      if (i > offset) {
        break;
      }
      if (i + this.#spaces[key] >= offset) {
        size = size + offset - i;
        offset = i;
        break;
      }
    }

    const end = offset + size;
    // Merge with next space
    if (this.#spaces[end]) {
      size += this.#spaces[end];
      delete this.#spaces[end];
    }

    this.#spaces[offset] = size;
  }

  update(): void {
    if (this.#dirty && this.#dataArray) {
      // Note: Can memorize different dirty zones and update them separately, maybe faster
      this.updateSubData(0, this.#dataArray);
      this.#dirty = false;
    }
  }

  updateSubData(offset: number, dataArray: Float32Array): void {
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#vertexBuffer);
    this.#gl.bufferSubData(this.#gl.ARRAY_BUFFER, offset, dataArray);
  }

  destroy(): void {
    if (this.#vertexBuffer) {
      this.#gl.deleteBuffer(this.#vertexBuffer);
    }
    this.#data = null;
    this.#dataArray = null;;
    this.#vertexBuffer = null;
  }

  set dirty(value: boolean) {
    this.#dirty = value;
  }

  get dirty(): boolean {
    return this.#dirty;
  }

  get data(): ArrayBuffer | null {
    return this.#data;
  }

  get dataArray(): Float32Array | null {
    return this.#dataArray;
  }

  get vertexBuffer(): WebGLBuffer | null {
    return this.#vertexBuffer;
  }
}

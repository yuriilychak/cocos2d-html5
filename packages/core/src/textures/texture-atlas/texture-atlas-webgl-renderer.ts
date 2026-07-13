import { TEXTURE_ATLAS_USE_TRIANGLE_STRIP } from "../../platform/config";
import { ServiceLocator } from "../../service-locator";
import { VertexAttribute } from "../../enums";
import { V3F_C4B_T2F_Quad } from "../../platform/types";
import TextureAtlasRenderer from "./texture-atlas-renderer";

import type { TextureAtlasInterface } from "./types";

export default class TextureAtlasWebGLRenderer extends TextureAtlasRenderer {
  #bufferVBO: WebGLBuffer | null = null;
  #dirty = false;
  #indices = new Uint16Array(0);
  #quads: V3F_C4B_T2F_Quad[] = [];
  #quadsArrayBuffer = new ArrayBuffer(0);
  #quadsReader = new Uint8Array(this.#quadsArrayBuffer);
  #quadsWebBuffer: WebGLBuffer | null = null;

  constructor(textureAtlas: TextureAtlasInterface) {
    super(textureAtlas);
  }

  initWithCapacity(capacity: number): boolean {
    this.#quads = [];
    this.#indices = new Uint16Array(capacity * 6);
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    this.#quadsArrayBuffer = new ArrayBuffer(quadSize * capacity);
    this.#quadsReader = new Uint8Array(this.#quadsArrayBuffer);

    if (!(this.#quads && this.#indices) && capacity > 0) return false;

    var locQuads = this.#quads;
    for (var i = 0; i < capacity; i++)
      locQuads[i] = new V3F_C4B_T2F_Quad(
        null,
        null,
        null,
        null,
        this.#quadsArrayBuffer,
        i * quadSize
      );

    this.#setupIndices();
    this.setupVBO();
    this.#dirty = true;
    return true;
  }

  copyQuadsToTextureAtlas(
    quads: V3F_C4B_T2F_Quad[] | null,
    index: number
  ): void {
    if (!quads) return;

    for (var i = 0; i < quads.length; i++)
      this.#setQuadToArray(quads[i], index + i);
  }

  markDirty(): void {
    this.#dirty = true;
  }

  updateQuad(quad: V3F_C4B_T2F_Quad, index: number): void {
    this.#setQuadToArray(quad, index);
    this.#dirty = true;
  }

  insertQuad(quad: V3F_C4B_T2F_Quad, index: number): void {
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var totalQuads = this.textureAtlas.totalQuads;

    // issue #575. index can be > totalQuads
    var remaining = totalQuads - 1 - index;
    var startOffset = index * quadSize;
    var moveLength = remaining * quadSize;
    this.#quads[totalQuads - 1] = new V3F_C4B_T2F_Quad(
      null,
      null,
      null,
      null,
      this.#quadsArrayBuffer,
      (totalQuads - 1) * quadSize
    );
    this.#quadsReader.set(
      this.#quadsReader.subarray(startOffset, startOffset + moveLength),
      startOffset + quadSize
    );

    this.#setQuadToArray(quad, index);
    this.#dirty = true;
  }

  insertQuads(
    quads: V3F_C4B_T2F_Quad[],
    index: number,
    amount: number
  ): void {
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var totalQuads = this.textureAtlas.totalQuads;

    // issue #575. index can be > totalQuads
    var remaining = totalQuads - 1 - index - amount;
    var startOffset = index * quadSize;
    var moveLength = remaining * quadSize;
    var lastIndex = totalQuads - 1 - amount;

    var i;
    for (i = 0; i < amount; i++)
      this.#quads[lastIndex + i] = new V3F_C4B_T2F_Quad(
        null,
        null,
        null,
        null,
        this.#quadsArrayBuffer,
        (totalQuads - 1) * quadSize
      );
    this.#quadsReader.set(
      this.#quadsReader.subarray(startOffset, startOffset + moveLength),
      startOffset + quadSize * amount
    );
    for (i = 0; i < amount; i++) this.#setQuadToArray(quads[i], index + i);

    this.#dirty = true;
  }

  insertQuadFromIndex(fromIndex: number, newIndex: number): void {
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var locQuadsReader = this.#quadsReader;
    var sourceArr = locQuadsReader.subarray(fromIndex * quadSize, quadSize);
    var startOffset, moveLength;
    if (fromIndex > newIndex) {
      startOffset = newIndex * quadSize;
      moveLength = (fromIndex - newIndex) * quadSize;
      locQuadsReader.set(
        locQuadsReader.subarray(startOffset, startOffset + moveLength),
        startOffset + quadSize
      );
      locQuadsReader.set(sourceArr, startOffset);
    } else {
      startOffset = (fromIndex + 1) * quadSize;
      moveLength = (newIndex - fromIndex) * quadSize;
      locQuadsReader.set(
        locQuadsReader.subarray(startOffset, startOffset + moveLength),
        startOffset - quadSize
      );
      locQuadsReader.set(sourceArr, newIndex * quadSize);
    }
    this.#dirty = true;
  }

  removeQuadAtIndex(index: number): void {
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var totalQuads = this.textureAtlas.totalQuads;
    this.#quads.length = totalQuads;
    if (index !== totalQuads) {
      // move data
      var startOffset = (index + 1) * quadSize;
      var moveLength = (totalQuads - index) * quadSize;
      this.#quadsReader.set(
        this.#quadsReader.subarray(startOffset, startOffset + moveLength),
        startOffset - quadSize
      );
    }
    this.#dirty = true;
  }

  removeQuadsAtIndex(index: number, amount: number): void {
    var totalQuads = this.textureAtlas.totalQuads;

    if (index !== totalQuads) {
      // move data
      var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
      var srcOffset = (index + amount) * quadSize;
      var moveLength = (totalQuads - index) * quadSize;
      var dstOffset = index * quadSize;
      this.#quadsReader.set(
        this.#quadsReader.subarray(srcOffset, srcOffset + moveLength),
        dstOffset
      );
    }
    this.#dirty = true;
  }

  removeAllQuads(): void {
    this.#quads.length = 0;
  }

  resizeCapacity(capacity: number, oldCapacity: number): void {
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var locTotalQuads = this.textureAtlas.totalQuads;
    var i;

    if (this.#quads.length === 0) {
      this.#quads = [];
      this.#quadsArrayBuffer = new ArrayBuffer(quadSize * capacity);
      this.#quadsReader = new Uint8Array(this.#quadsArrayBuffer);
      for (i = 0; i < capacity; i++)
        this.#quads[i] = new V3F_C4B_T2F_Quad(
          null,
          null,
          null,
          null,
          this.#quadsArrayBuffer,
          i * quadSize
        );
    } else {
      var newQuads,
        newArrayBuffer,
        quads = this.#quads;
      if (capacity > oldCapacity) {
        newQuads = [];
        newArrayBuffer = new ArrayBuffer(quadSize * capacity);
        for (i = 0; i < locTotalQuads; i++) {
          newQuads[i] = new V3F_C4B_T2F_Quad(
            quads[i].tl,
            quads[i].bl,
            quads[i].tr,
            quads[i].br,
            newArrayBuffer,
            i * quadSize
          );
        }
        for (; i < capacity; i++)
          newQuads[i] = new V3F_C4B_T2F_Quad(
            null,
            null,
            null,
            null,
            newArrayBuffer,
            i * quadSize
          );

        this.#quadsReader = new Uint8Array(newArrayBuffer);
        this.#quads = newQuads;
        this.#quadsArrayBuffer = newArrayBuffer;
      } else {
        var count = Math.max(locTotalQuads, capacity);
        newQuads = [];
        newArrayBuffer = new ArrayBuffer(quadSize * capacity);
        for (i = 0; i < count; i++) {
          newQuads[i] = new V3F_C4B_T2F_Quad(
            quads[i].tl,
            quads[i].bl,
            quads[i].tr,
            quads[i].br,
            newArrayBuffer,
            i * quadSize
          );
        }
        this.#quadsReader = new Uint8Array(newArrayBuffer);
        this.#quads = newQuads;
        this.#quadsArrayBuffer = newArrayBuffer;
      }
    }

    if (this.#indices.length === 0) {
      this.#indices = new Uint16Array(capacity * 6);
    } else {
      if (capacity > oldCapacity) {
        var tempIndices = new Uint16Array(capacity * 6);
        tempIndices.set(this.#indices, 0);
        this.#indices = tempIndices;
      } else {
        this.#indices = this.#indices.subarray(0, capacity * 6);
      }
    }

    this.#setupIndices();
    this.mapBuffers();
    this.#dirty = true;
  }

  moveQuadsFromIndex(
    oldIndex: number,
    amount: number,
    newIndex: number
  ): void {
    var quadSize = V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var srcOffset = oldIndex * quadSize;
    var srcLength = amount * quadSize;
    var locQuadsReader = this.#quadsReader;
    var sourceArr = locQuadsReader.subarray(srcOffset, srcOffset + srcLength);
    var dstOffset = newIndex * quadSize;
    var moveLength, moveStart;
    if (newIndex < oldIndex) {
      moveLength = (oldIndex - newIndex) * quadSize;
      moveStart = newIndex * quadSize;
      locQuadsReader.set(
        locQuadsReader.subarray(moveStart, moveStart + moveLength),
        moveStart + srcLength
      );
    } else {
      moveLength = (newIndex - oldIndex) * quadSize;
      moveStart = (oldIndex + amount) * quadSize;
      locQuadsReader.set(
        locQuadsReader.subarray(moveStart, moveStart + moveLength),
        srcOffset
      );
    }
    locQuadsReader.set(sourceArr, dstOffset);
    this.#dirty = true;
  }

  fillWithEmptyQuadsFromIndex(index: number, amount: number): void {
    var count = amount * V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var clearReader = new Uint8Array(
      this.#quadsArrayBuffer,
      index * V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,
      count
    );
    for (var i = 0; i < count; i++) clearReader[i] = 0;
  }

  #setQuadToArray(quad: V3F_C4B_T2F_Quad, index: number): void {
    var locQuads = this.#quads;
    if (!locQuads[index]) {
      locQuads[index] = new V3F_C4B_T2F_Quad(
        quad.tl,
        quad.bl,
        quad.tr,
        quad.br,
        this.#quadsArrayBuffer,
        index * V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT
      );
      return;
    }
    locQuads[index].bl = quad.bl;
    locQuads[index].br = quad.br;
    locQuads[index].tl = quad.tl;
    locQuads[index].tr = quad.tr;
  }

  #setupIndices(): void {
    if (this.textureAtlas.capacity === 0) return;
    var locIndices = this.#indices,
      locCapacity = this.textureAtlas.capacity;
    for (var i = 0; i < locCapacity; i++) {
      if (TEXTURE_ATLAS_USE_TRIANGLE_STRIP) {
        locIndices[i * 6 + 0] = i * 4 + 0;
        locIndices[i * 6 + 1] = i * 4 + 0;
        locIndices[i * 6 + 2] = i * 4 + 2;
        locIndices[i * 6 + 3] = i * 4 + 1;
        locIndices[i * 6 + 4] = i * 4 + 3;
        locIndices[i * 6 + 5] = i * 4 + 3;
      } else {
        locIndices[i * 6 + 0] = i * 4 + 0;
        locIndices[i * 6 + 1] = i * 4 + 1;
        locIndices[i * 6 + 2] = i * 4 + 2;

        // inverted index. issue #179
        locIndices[i * 6 + 3] = i * 4 + 3;
        locIndices[i * 6 + 4] = i * 4 + 2;
        locIndices[i * 6 + 5] = i * 4 + 1;
      }
    }
  }

  setupVBO(): void {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    this.#bufferVBO = gl.createBuffer();
    this.#quadsWebBuffer = gl.createBuffer();
    this.mapBuffers();
  }

  mapBuffers(): void {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadsWebBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.#quadsArrayBuffer,
      gl.DYNAMIC_DRAW
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#bufferVBO);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      this.#indices,
      gl.STATIC_DRAW
    );

    //checkGLErrorDebug();
  }

  /**
   * <p>Draws n quads from an index (offset). <br />
   * n + start can't be greater than the capacity of the atlas</p>
   */
  drawNumberOfQuads(n: number, start?: number): void {
    start = start || 0;
    const texture = this.textureAtlas.texture as { loaded?: boolean } | null;
    if (
      0 === n ||
      !texture ||
      !texture.loaded
    )
      return;

    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    ServiceLocator.glStateCache.bindTexture2D(texture);

    //
    // Using VBO without VAO
    //
    // XXX: update is done in draw... perhaps it should be done in a timer

    gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadsWebBuffer);
    if (this.#dirty) {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.#quadsArrayBuffer,
        gl.DYNAMIC_DRAW
      );
      this.#dirty = false;
    }

    gl.enableVertexAttribArray(VertexAttribute.POSITION);
    gl.enableVertexAttribArray(VertexAttribute.COLOR);
    gl.enableVertexAttribArray(VertexAttribute.TEX_COORDS);

    gl.vertexAttribPointer(VertexAttribute.POSITION, 3, gl.FLOAT, false, 24, 0); // vertices
    gl.vertexAttribPointer(
      VertexAttribute.COLOR,
      4,
      gl.UNSIGNED_BYTE,
      true,
      24,
      12
    ); // colors
    gl.vertexAttribPointer(
      VertexAttribute.TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      24,
      16
    ); // tex coords

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#bufferVBO);

    if (TEXTURE_ATLAS_USE_TRIANGLE_STRIP)
      gl.drawElements(
        gl.TRIANGLE_STRIP,
        n * 6,
        gl.UNSIGNED_SHORT,
        start * 6 * this.#indices.BYTES_PER_ELEMENT
      );
    else
      gl.drawElements(
        gl.TRIANGLES,
        n * 6,
        gl.UNSIGNED_SHORT,
        start * 6 * this.#indices.BYTES_PER_ELEMENT
      );

    ServiceLocator.sys.rendererConfig.incrementDrawCount();
    //checkGLErrorDebug();
  }

  releaseBuffer(): void {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;

    if (this.#bufferVBO) {
      gl.deleteBuffer(this.#bufferVBO);
      this.#bufferVBO = null;
    }

    if (this.#quadsWebBuffer) {
      gl.deleteBuffer(this.#quadsWebBuffer);
      this.#quadsWebBuffer = null;
    }
  }


  get quads(): V3F_C4B_T2F_Quad[] | null {
    return this.#quads;
  }

  set quads(value: V3F_C4B_T2F_Quad[] | null) {
    // TODO need re-binding
    this.#quads = value ?? [];
  }
}

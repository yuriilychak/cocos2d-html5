import { BATCH_VERTEX_COUNT } from "../platform/macro/constants";
import { GLProgramState } from "../shaders/program-state";
import { ServiceLocator } from "../service-locator";
import {
  VertexAttribute,
  VertexType,
  ShaderName,
  GLState
} from "../enums";
import type { BlendFunc } from "../platform";
import type { Texture2D } from "../textures";

export default class BatchedInfo {
  #blendSrc: GLState | null = null;
  #blendDst: GLState | null = null;
  #glProgramState: GLProgramState | null = null;
  #isMulti: boolean = false;
  #batchBroken: boolean = false;
  #indexBuffer: WebGLBuffer | null = null;
  #vertexBuffer: WebGLBuffer | null = null;
  #indexSize: number = 0;
  #vertexData: ArrayBuffer | null = null;
  #vertexDataSize: number = 0;
  #vertexDataF32: Float32Array | null = null;
  #vertexDataUI32: Uint32Array | null = null;
  #indexData: Uint16Array | null = null;
  #prevIndexSize: number = 0;
  #pureQuad: boolean = true;
  #multiTexture: boolean = false;
  #maxBatchTextures: number = 1;
  #batchTextures: (Texture2D | null)[] = [];
  #batchTextureCount: number = 0;
  #textureUnits: Int32Array | null = null;
  #multiProgramState: GLProgramState | null = null;

  maxVertexSize: number = 0;
  batchingSize: number = 0;
  sizePerVertex: number = 6;

  get multiProgramState(): GLProgramState | null {
    if (!this.#multiTexture) {
      return null;
    }
    if (!this.#multiProgramState) {
      const program = ServiceLocator.shaderCache.get(
        ShaderName.SPRITE_POSITION_TEXTURECOLOR_MULTI
      );
      this.#multiProgramState = GLProgramState.getOrCreateWithGLProgram(program);
    }
    return this.#multiProgramState;
  }

  #resolveTextureSlot(texture: Texture2D, maxTextures: number): number {
    for (let i = 0; i < this.#batchTextureCount; ++i) {
      if (this.#batchTextures[i] === texture) {
        return i;
      }
    }
    if (this.#batchTextureCount < maxTextures) {
      this.#batchTextures[this.#batchTextureCount] = texture;
      return this.#batchTextureCount++;
    }
    return -1;
  }

  init(): void {
    // Enable the WebGL2 multi-texture batcher when available.
    this.#multiTexture = ServiceLocator.sys.rendererConfig.isWebGL2;
    this.sizePerVertex = this.#multiTexture ? 7 : 6;
    if (this.#multiTexture) {
      this.#maxBatchTextures = ServiceLocator.sys.rendererConfig.maxBatchTextures;
      this.#textureUnits = new Int32Array(this.#maxBatchTextures);
      for (let t = 0; t < this.#maxBatchTextures; ++t) {
        this.#textureUnits[t] = t;
      }
    } else {
      this.#maxBatchTextures = 1;
    }
    this.#batchTextures = new Array(this.#maxBatchTextures).fill(null);
    this.#batchTextureCount = 0;
    this.#initQuadBuffer(BATCH_VERTEX_COUNT);
  }

  increaseBatchingSize(increment: number, vertexType?: VertexType, indices: number[] = []): void {
    vertexType = vertexType || VertexType.QUAD;
    let curr;
    switch (vertexType) {
      case VertexType.QUAD:
        for (let i = 0; i < increment; i += 4) {
          curr = this.batchingSize + i;
          this.#indexData![this.#indexSize++] = curr + 0;
          this.#indexData![this.#indexSize++] = curr + 1;
          this.#indexData![this.#indexSize++] = curr + 2;
          this.#indexData![this.#indexSize++] = curr + 1;
          this.#indexData![this.#indexSize++] = curr + 2;
          this.#indexData![this.#indexSize++] = curr + 3;
        }
        break;
      case VertexType.TRIANGLE:
        this.#pureQuad = false;
        for (let i = 0; i < increment; i += 3) {
          curr = this.batchingSize + i;
          this.#indexData![this.#indexSize++] = curr + 0;
          this.#indexData![this.#indexSize++] = curr + 1;
          this.#indexData![this.#indexSize++] = curr + 2;
        }
        break;
      case VertexType.CUSTOM:
        // CUSTOM type increase the indices data
        this.#pureQuad = false;
        const len = indices.length;
        for (let i = 0; i < len; i++) {
          this.#indexData![this.#indexSize++] =
            this.batchingSize + indices[i];
        }
        break;
      default:
        return;
    }
    this.batchingSize += increment;
  }

  appendMultiBatch(
    texture: Texture2D,
    blendFunc: BlendFunc,
    glProgramState: GLProgramState,
    vertCount: number
  ): number {
    if (
      !this.#isMulti ||
      this.#glProgramState !== glProgramState ||
      this.#blendSrc !== blendFunc.src ||
      this.#blendDst !== blendFunc.dst
    ) {
      this.batchRendering();
      this.#isMulti = true;
      this.#glProgramState = glProgramState;
      this.#blendSrc = blendFunc.src;
      this.#blendDst = blendFunc.dst;
      this.#batchTextureCount = 0;
    }

    if (this.batchingSize + vertCount > this.maxVertexSize) {
      this.batchRendering();
      this.#batchTextureCount = 0;
    }

    let slot = this.#resolveTextureSlot(
      texture,
      this.#maxBatchTextures
    );
    if (slot === -1) {
      this.batchRendering();
      this.#batchTextureCount = 0;
      slot = this.#resolveTextureSlot(
        texture,
        this.#maxBatchTextures
      );
    }
    return slot;
  }

  updateBatchedInfo(
    texture: Texture2D,
    blendFunc: BlendFunc,
    glProgramState: GLProgramState
  ): boolean {
    if (
      this.#isMulti ||
      this.#batchTextures[0] !== texture ||
      blendFunc.src !== this.#blendSrc ||
      blendFunc.dst !== this.#blendDst ||
      glProgramState !== this.#glProgramState
    ) {
      // Draw batched elements
      this.batchRendering();
      // Update the single-texture batch state.
      this.#isMulti = false;
      this.#batchTextures[0] = texture;
      this.#batchTextureCount = 1;
      this.#blendSrc = blendFunc.src;
      this.#blendDst = blendFunc.dst;
      this.#glProgramState = glProgramState;

      return true;
    } else {
      return false;
    }
  }

  uploadBufferData(cmd: any): void {
    // Self-batching commands (e.g. spine skeletons) emit many primitives with
    // their own per-slot textures/blend and drive the batcher directly. Let
    // them manage the shared batch state instead of resolving a single texture
    // slot here (a skeleton has no single node texture).
    if (cmd._selfBatch) {
      cmd.uploadData(
        this.#vertexDataF32,
        this.#vertexDataUI32,
        this.batchingSize * this.sizePerVertex
      );
      return;
    }

    if (this.batchingSize >= this.maxVertexSize) {
      this.batchRendering();
      this.#batchTextureCount = 0;
    }

    // Check batching
    const node = cmd._node;
    const texture =
      node._texture || (node._spriteFrame && node._spriteFrame.texture);
    const blendSrc = node._blendFunc.src;
    const blendDst = node._blendFunc.dst;
    const glProgramState = cmd._glProgramState;
    // Multi-texture batching only applies to commands using the default
    // multi-texture sprite program; everything else keeps the single-texture
    // (flush-on-texture-change) behavior.
    const isMulti =
      this.#multiTexture &&
      glProgramState === this.multiProgramState;
    const maxTextures = isMulti ? this.#maxBatchTextures : 1;

    if (
      this.#batchBroken ||
      this.#isMulti !== isMulti ||
      this.#blendSrc !== blendSrc ||
      this.#blendDst !== blendDst ||
      this.#glProgramState !== glProgramState
    ) {
      // Draw batched elements
      this.batchRendering();
      // Update the batch state
      this.#isMulti = isMulti;
      this.#blendSrc = blendSrc;
      this.#blendDst = blendDst;
      this.#glProgramState = glProgramState;
      this.#batchTextureCount = 0;
      this.#batchBroken = false;
    }

    // Resolve the texture-unit slot for this command's texture, flushing if the
    // slot set is full.
    let beforeCount = this.#batchTextureCount;
    let slot = this.#resolveTextureSlot(texture, maxTextures);
    if (slot === -1) {
      this.batchRendering();
      this.#isMulti = isMulti;
      this.#blendSrc = blendSrc;
      this.#blendDst = blendDst;
      this.#glProgramState = glProgramState;
      this.#batchTextureCount = 0;
      beforeCount = 0;
      slot = this.#resolveTextureSlot(texture, maxTextures);
    }
    const appended = this.#batchTextureCount > beforeCount;

    // Upload vertex data
    const sizeBefore = this.batchingSize;
    const len = cmd.uploadData(
      this.#vertexDataF32,
      this.#vertexDataUI32,
      this.batchingSize * this.sizePerVertex,
      slot
    );
    if (len > 0) {
      this.increaseBatchingSize(len, cmd.vertexType, cmd._indices);
    } else if (appended && this.batchingSize === sizeBefore) {
      // The command emitted no geometry (e.g. an unloaded texture or fully
      // transparent node) and was not a self-batching command, so release the
      // texture slot it just reserved. This keeps unloaded/incomplete textures
      // out of the bound sampler set. Self-batching commands (spine/tilemap)
      // advance this.batchingSize themselves and are excluded by the size check.
      this.#batchTextures[slot] = null;
      this.#batchTextureCount = beforeCount;
    }
  }

  batchRendering(): void {
    if (
      this.batchingSize === 0 ||
      this.#batchTextureCount === 0
    ) {
      return;
    }

    const gl: any = ServiceLocator.sys.rendererConfig.renderContext;
    const glProgramState = this.#glProgramState;
    const uploadAll =
      this.batchingSize > this.maxVertexSize * 0.5;

    if (glProgramState) {
      glProgramState.apply();
      glProgramState.program.updateProjectionUniform();
    }

    ServiceLocator.glStateCache.blendFunc(
      this.#blendSrc,
      this.#blendDst
    );

    if (this.#isMulti) {
      // Bind every accumulated texture to its own unit, then pad the remaining
      // declared sampler slots with slot 0 so no active sampler is left
      // pointing at an incomplete texture.
      let u;
      for (u = 0; u < this.#batchTextureCount; ++u) {
        ServiceLocator.glStateCache.bindTexture2DN(
          u,
          this.#batchTextures[u]
        );
      }
      for (
        u = this.#batchTextureCount;
        u < this.#maxBatchTextures;
        ++u
      ) {
        ServiceLocator.glStateCache.bindTexture2DN(
          u,
          this.#batchTextures[0]
        );
      }
      if (glProgramState) {
        glProgramState.program.setTextureUnits(this.#textureUnits!);
      }
    } else {
      ServiceLocator.glStateCache.bindTexture2DN(
        0,
        this.#batchTextures[0]
      );
    }

    const stride = this.sizePerVertex * 4;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
    // upload the vertex data to the gl buffer
    if (uploadAll) {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.#vertexDataF32,
        gl.DYNAMIC_DRAW
      );
    } else {
      const view = this.#vertexDataF32!.subarray(
        0,
        this.batchingSize * this.sizePerVertex
      );
      gl.bufferData(gl.ARRAY_BUFFER, view, gl.DYNAMIC_DRAW);
    }

    gl.enableVertexAttribArray(VertexAttribute.POSITION);
    gl.enableVertexAttribArray(VertexAttribute.COLOR);
    gl.enableVertexAttribArray(VertexAttribute.TEX_COORDS);
    gl.vertexAttribPointer(
      VertexAttribute.POSITION,
      3,
      gl.FLOAT,
      false,
      stride,
      0
    );
    gl.vertexAttribPointer(
      VertexAttribute.COLOR,
      4,
      gl.UNSIGNED_BYTE,
      true,
      stride,
      12
    );
    gl.vertexAttribPointer(
      VertexAttribute.TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      stride,
      16
    );
    if (this.#multiTexture) {
      gl.enableVertexAttribArray(VertexAttribute.TEX_INDEX);
      gl.vertexAttribPointer(
        VertexAttribute.TEX_INDEX,
        1,
        gl.FLOAT,
        false,
        stride,
        24
      );
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indexBuffer);
    if (
      !this.#prevIndexSize ||
      !this.#pureQuad ||
      this.#indexSize > this.#prevIndexSize
    ) {
      if (uploadAll) {
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          this.#indexData,
          gl.DYNAMIC_DRAW
        );
      } else {
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          this.#indexData!.subarray(0, this.#indexSize),
          gl.DYNAMIC_DRAW
        );
      }
    }
    gl.drawElements(gl.TRIANGLES, this.#indexSize, gl.UNSIGNED_SHORT, 0);

    ServiceLocator.sys.rendererConfig.incrementDrawCount();

    if (this.#pureQuad) {
      this.#prevIndexSize = this.#indexSize;
    } else {
      this.#prevIndexSize = 0;
      this.#pureQuad = true;
    }
    this.batchingSize = 0;
    this.#indexSize = 0;
  }

  rendering(context: any, cmds: any[]): void {
    context.bindBuffer(context.ARRAY_BUFFER, null);

    for (let i = 0; i < cmds.length; ++i) {
      const cmd = cmds[i];
      if (!cmd.needDraw()) continue;

      if (cmd.uploadData) {
        this.uploadBufferData(cmd);
      } else {
        if (this.batchingSize > 0) {
          this.batchRendering();
        }
        this.#batchTextureCount = 0;
        cmd.rendering(context);
      }
    }
    this.batchRendering();
    this.#batchTextureCount = 0;
    this.#glProgramState = null;
    this.#isMulti = false;
  }

  // Inspired from @Heishe's gotta-batch-them-all branch
  // https://github.com/Talisca/cocos2d-html5/commit/de731f16414eb9bcaa20480006897ca6576d362c
  #updateBuffer(numVertex: number): void {
    const gl: any = ServiceLocator.sys.rendererConfig.renderContext;
    if (this.#indexBuffer) {
      const indexCount = Math.ceil(numVertex / 4) * 6;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indexBuffer);
      this.#indexData = new Uint16Array(indexCount);
      let currentQuad = 0;
      for (let i = 0, len = indexCount; i < len; i += 6) {
        this.#indexData[i] = currentQuad + 0;
        this.#indexData[i + 1] = currentQuad + 1;
        this.#indexData[i + 2] = currentQuad + 2;
        this.#indexData[i + 3] = currentQuad + 1;
        this.#indexData[i + 4] = currentQuad + 2;
        this.#indexData[i + 5] = currentQuad + 3;
        currentQuad += 4;
      }
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.#indexData, gl.DYNAMIC_DRAW);
    }
    if (this.#vertexBuffer) {
      this.#vertexDataSize = numVertex * this.sizePerVertex;
      this.#vertexData = new ArrayBuffer(this.#vertexDataSize * 4);
      this.#vertexDataF32 = new Float32Array(this.#vertexData);
      this.#vertexDataUI32 = new Uint32Array(this.#vertexData);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.#vertexDataF32, gl.DYNAMIC_DRAW);
    }
    this.maxVertexSize = numVertex - 200;
  }

  #initQuadBuffer(numVertex: number): void {
    const gl: WebGL2RenderingContext = ServiceLocator.sys.rendererConfig.renderContext;
    if (this.#indexBuffer === null) {
      this.#vertexBuffer = gl.createBuffer();
      this.#indexBuffer = gl.createBuffer();
    }
    this.#updateBuffer(numVertex);
  }
}

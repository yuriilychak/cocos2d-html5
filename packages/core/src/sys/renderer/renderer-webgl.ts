/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

import { arrayRemoveObject } from "../../platform";
import Matrix4 from "../../kazmath/mat4";
import { ServiceLocator } from "../../service-locator";
import { VertexType } from "../../enums";
import { BYTE } from "../../constants";
import BatchedInfo from "./batched-info";
import type { BlendFunc } from "../../platform";
import type { Texture2D } from "../../textures";
import type { GLProgramState } from "../../shaders";
import { RendererBase } from "./renderer-base";

type RenderCommand = {
  needDraw(): boolean;
  rendering(context: any): void;
  uploadData?: (...args: any[]) => number;
  _selfBatch?: boolean;
  _node?: any;
  _glProgramState?: GLProgramState;
  vertexType?: VertexType;
  _indices?: number[];
};

export default class RendererWebGL extends RendererBase<RenderCommand> {
  static #batchedInfo = new BatchedInfo();
  #mat4Identity: Matrix4 = new Matrix4();
  #isCacheToBufferOn = false;
  #cacheToBufferCmds = new Map<number, RenderCommand[]>();
  #cacheInstanceIds: number[] = [];
  #currentID: number = 0;

  constructor() {
    super(1 / 100);
    const gl: any = ServiceLocator.sys.rendererConfig.renderContext;
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    RendererWebGL.#batchedInfo.init();

    this.#mat4Identity.identity();
  }

  get mat4Identity(): Matrix4 {
    return this.#mat4Identity;
  }

  getBufferCmd(key: number): RenderCommand[] | null {
    const cmds = this.#cacheToBufferCmds.get(key);
    return cmds && cmds.length > 0 ? cmds : null;
  }

  get sizePerVertex(): number {
    return RendererWebGL.#batchedInfo.sizePerVertex;
  }

  // The shared GLProgramState for the multi-texture sprite program, used to
  // detect whether a render command participates in multi-texture batching.
  get multiProgramState(): GLProgramState | null {
    return RendererWebGL.#batchedInfo.multiProgramState;
  }

  get vertexSize(): number {
    return RendererWebGL.#batchedInfo.maxVertexSize;
  }

  // Current number of vertices accumulated in the open batch. Self-batching
  // commands (e.g. spine) use this to know where to write their next vertex.
  get batchingSize(): number {
    return RendererWebGL.#batchedInfo.batchingSize;
  }


  get allNeedDraw(): boolean {
    return false;
  }

  set allNeedDraw(_value: boolean) {}
  // Append geometry to the shared multi-texture batch on behalf of a
  // self-batching command (spine). Flushes the open batch when it is
  // incompatible (not multi, different program/blend) or when the texture-unit
  // set or vertex buffer would overflow, then returns the texture-unit slot the
  // caller must write as the per-vertex texIndex. After calling this, the write
  // offset is batchingSize * sizePerVertex.
  appendMultiBatch(texture: Texture2D, blendFunc: BlendFunc, glProgramState: GLProgramState, vertCount: number): number {
    return RendererWebGL.#batchedInfo.appendMultiBatch(
      texture,
      blendFunc,
      glProgramState,
      vertCount
    );
  }

  turnToCacheMode(renderTextureID: number = 0): void {
    this.#isCacheToBufferOn = true;
    renderTextureID = renderTextureID || 0;
    if (!this.#cacheToBufferCmds.has(renderTextureID)) {
      this.#cacheToBufferCmds.set(renderTextureID, []);
    } else {
      this.#cacheToBufferCmds.get(renderTextureID)!.length = 0;
    }

    if (this.#cacheInstanceIds.indexOf(renderTextureID) === -1) {
      this.#cacheInstanceIds.push(renderTextureID);
    }
    this.#currentID = renderTextureID;
  }

  turnToNormalMode(): void {
    this.#isCacheToBufferOn = false;
  }

  removeCache(instanceID: number = this.#currentID): void {
    instanceID = instanceID || this.#currentID;
    const cmds = this.#cacheToBufferCmds.get(instanceID);

    if (cmds) {
      cmds.length = 0;
      this.#cacheToBufferCmds.delete(instanceID);
    }

    const locIDs = this.#cacheInstanceIds;
    arrayRemoveObject(locIDs, instanceID);
  }

  /**
   * drawing all renderer command to cache canvas' context
   * @param {Number} [renderTextureId]
   */
  renderingToBuffer(renderTextureId: number = this.#currentID): void {
    renderTextureId = renderTextureId || this.#currentID;
    const locCmds = this.#cacheToBufferCmds.get(renderTextureId) || [];
    const ctx = ServiceLocator.sys.rendererConfig.renderContext;
    this.rendering(ctx, locCmds);
    this.removeCache(renderTextureId);

    const locIDs = this.#cacheInstanceIds;
    if (locIDs.length === 0) this.#isCacheToBufferOn = false;
    else this.#currentID = locIDs[locIDs.length - 1];
  }

  //reset renderer's flag
  clear(): void {
    const gl: any = ServiceLocator.sys.rendererConfig.renderContext;
    gl.clearColor(
      this.clearColor.r / BYTE,
      this.clearColor.g / BYTE,
      this.clearColor.b / BYTE,
      this.clearColor.a / BYTE
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  setDepthTest(enable: boolean): void {
    const gl: any = ServiceLocator.sys.rendererConfig.renderContext;
    if (enable) {
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
  }

  pushRenderCommand(cmd: RenderCommand): void {
    if (!cmd.rendering && !cmd.uploadData) {
      return;
    }
    if (this.#isCacheToBufferOn) {
      const currentId = this.#currentID;
      const cmdList = this.#cacheToBufferCmds.get(currentId);
      if (cmdList && cmdList.indexOf(cmd) === -1) cmdList.push(cmd);
    } else if (this.renderCmds.indexOf(cmd) === -1) {
        this.renderCmds.push(cmd);
    }
  }

  increaseBatchingSize(increment: number, vertexType?: VertexType, indices?: number[]): void {
    return RendererWebGL.#batchedInfo.increaseBatchingSize(
      increment,
      vertexType,
      indices
    );
  }

  updateBatchedInfo(texture: Texture2D, blendFunc: BlendFunc, glProgramState: GLProgramState): boolean {
    return RendererWebGL.#batchedInfo.updateBatchedInfo(
      texture,
      blendFunc,
      glProgramState
    );
  }

  uploadBufferData(cmd: RenderCommand): void {
    RendererWebGL.#batchedInfo.uploadBufferData(cmd);
  }

  batchRendering(): void {
    RendererWebGL.#batchedInfo.batchRendering();
  }

  /**
   * drawing all renderer command to context (default is _renderContext)
   * @param {WebGLRenderingContext} [ctx=_renderContext]
   */
  rendering(ctx: any, cmds?: RenderCommand[]): void {
    const locCmds = cmds || this.renderCmds,
      context = ctx || ServiceLocator.sys.rendererConfig.renderContext;

    return RendererWebGL.#batchedInfo.rendering(context, locCmds);
  }
}

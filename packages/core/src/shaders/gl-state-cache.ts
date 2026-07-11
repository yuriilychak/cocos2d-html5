/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
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

import { TEXTURE_ATLAS_USE_VAO } from "../platform/config";
import { KMGLMatrix } from "../kazmath/km-gl-matrix";
import { Sys } from "../sys";
import type { CachedTexture, TextureLike } from "./types";

export class GLStateCache {
  static MAX_ACTIVE_TEXTURE: number = 16;
  #currentProjectionMatrix: number = -1;
  #currentShaderProgram: WebGLProgram | -1 = -1;
  #currentBoundTexture: CachedTexture[] = new Array(
    GLStateCache.MAX_ACTIVE_TEXTURE
  ).fill(-1);
  #blendingSource: number = -1;
  #blendingDest: number = -1;
  #glServerState: number = 0;
  #uVAO: unknown = TEXTURE_ATLAS_USE_VAO ? 0 : undefined;
  #kmglMatrix: KMGLMatrix;
  #sys: Sys;

  constructor(sys: Sys, kmglMatrix: KMGLMatrix) {
    this.#sys = sys;
    this.#kmglMatrix = kmglMatrix;
  }

  invalidateStateCache(): void {
    this.#kmglMatrix.freeAll();
    this.#currentProjectionMatrix = -1;
    this.#currentShaderProgram = -1;
    for (let i = 0; i < GLStateCache.MAX_ACTIVE_TEXTURE; i++) {
      this.#currentBoundTexture[i] = -1;
    }
    this.#blendingSource = -1;
    this.#blendingDest = -1;
    this.#glServerState = 0;
  }

  useProgram(program: WebGLProgram): void {
    if (program !== this.#currentShaderProgram) {
      this.#currentShaderProgram = program;
      this.#sys.rendererConfig.renderContext.useProgram(program);
    }
  }

  deleteProgram(program: WebGLProgram): void {
    if (program === this.#currentShaderProgram) this.#currentShaderProgram = -1;
    this.#sys.rendererConfig.renderContext.deleteProgram(program);
  }

  setBlending(sfactor: number, dfactor: number): void {
    const ctx = this.#sys.rendererConfig.renderContext;
    if (sfactor === ctx.ONE && dfactor === ctx.ZERO) {
      ctx.disable(ctx.BLEND);
    } else {
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(sfactor, dfactor);
      //TODO need fix for WebGL
      //ctx.blendFuncSeparate(ctx.SRC_ALPHA, dfactor, sfactor, dfactor);
    }
  }

  blendFunc(sfactor: number, dfactor: number): void {
    if (sfactor !== this.#blendingSource || dfactor !== this.#blendingDest) {
      this.#blendingSource = sfactor;
      this.#blendingDest = dfactor;
      this.setBlending(sfactor, dfactor);
    }
  }

  blendFuncForParticle(sfactor: number, dfactor: number): void {
    if (sfactor !== this.#blendingSource || dfactor !== this.#blendingDest) {
      this.#blendingSource = sfactor;
      this.#blendingDest = dfactor;
      const ctx = this.#sys.rendererConfig.renderContext;
      if (sfactor === ctx.ONE && dfactor === ctx.ZERO) {
        ctx.disable(ctx.BLEND);
      } else {
        ctx.enable(ctx.BLEND);
        //TODO need fix for WebGL
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, dfactor, sfactor, dfactor);
      }
    }
  }

  blendResetToCache(): void {
    const ctx = this.#sys.rendererConfig.renderContext;
    ctx.blendEquation(ctx.FUNC_ADD);
    this.setBlending(this.#blendingSource, this.#blendingDest);
  }

  setProjectionMatrixDirty(): void {
    this.#currentProjectionMatrix = -1;
  }

  bindTexture2D(textureId: TextureLike | null): void {
    this.bindTexture2DN(0, textureId);
  }

  bindTexture2DN(textureUnit: number, textureId: TextureLike | null): void {
    if (this.#currentBoundTexture[textureUnit] === textureId) return;
    this.#currentBoundTexture[textureUnit] = textureId;

    const ctx = this.#sys.rendererConfig.renderContext;
    ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
    if (textureId) ctx.bindTexture(ctx.TEXTURE_2D, textureId.renderer.webTexture);
    else ctx.bindTexture(ctx.TEXTURE_2D, null);
  }

  deleteTexture(textureId: TextureLike): void {
    this.deleteTextureN(0, textureId);
  }

  deleteTextureN(textureUnit: number, textureId: TextureLike): void {
    if (textureId === this.#currentBoundTexture[textureUnit])
      this.#currentBoundTexture[textureUnit] = -1;
    this.#sys.rendererConfig.renderContext.deleteTexture(
      textureId.renderer.webTexture
    );
  }

  bindVAO(vaoId: unknown): void {
    if (!TEXTURE_ATLAS_USE_VAO) return;
    if (this.#uVAO !== vaoId) {
      this.#uVAO = vaoId;
      //TODO need fixed
      //glBindVertexArray(vaoId);
    }
  }

  enable(flags: number): void {
    void flags;
    /*TODO: implement GL_BLEND server state tracking via _GLServerState */
  }
}

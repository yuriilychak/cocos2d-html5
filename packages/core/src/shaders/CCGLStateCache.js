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

import { RendererConfig } from "../renderer/renderer-config";
import { KMGLMatrix } from "../kazmath/gl/km-gl-matrix";
import { TEXTURE_ATLAS_USE_VAO } from "../platform/config";

export class GLStateCache {
  static MAX_ACTIVE_TEXTURE = 16;

  static #instance = null;

  constructor() {
    this._currentProjectionMatrix = -1;
    this._currentShaderProgram = -1;
    this._currentBoundTexture = new Array(GLStateCache.MAX_ACTIVE_TEXTURE).fill(-1);
    this._blendingSource = -1;
    this._blendingDest = -1;
    this._GLServerState = 0;
    this._uVAO = TEXTURE_ATLAS_USE_VAO ? 0 : undefined;
  }

  static getInstance() {
    if (!GLStateCache.#instance) {
      GLStateCache.#instance = new GLStateCache();
    }
    return GLStateCache.#instance;
  }

  invalidateStateCache() {
    KMGLMatrix.getInstance().freeAll();
    this._currentProjectionMatrix = -1;
    this._currentShaderProgram = -1;
    for (let i = 0; i < GLStateCache.MAX_ACTIVE_TEXTURE; i++) {
      this._currentBoundTexture[i] = -1;
    }
    this._blendingSource = -1;
    this._blendingDest = -1;
    this._GLServerState = 0;
  }

  useProgram(program) {
    if (program !== this._currentShaderProgram) {
      this._currentShaderProgram = program;
      RendererConfig.getInstance().renderContext.useProgram(program);
    }
  }

  deleteProgram(program) {
    if (program === this._currentShaderProgram) this._currentShaderProgram = -1;
    gl.deleteProgram(program);
  }

  setBlending(sfactor, dfactor) {
    const ctx = RendererConfig.getInstance().renderContext;
    if (sfactor === ctx.ONE && dfactor === ctx.ZERO) {
      ctx.disable(ctx.BLEND);
    } else {
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(sfactor, dfactor);
      //TODO need fix for WebGL
      //ctx.blendFuncSeparate(ctx.SRC_ALPHA, dfactor, sfactor, dfactor);
    }
  }

  blendFunc(sfactor, dfactor) {
    if (sfactor !== this._blendingSource || dfactor !== this._blendingDest) {
      this._blendingSource = sfactor;
      this._blendingDest = dfactor;
      this.setBlending(sfactor, dfactor);
    }
  }

  blendFuncForParticle(sfactor, dfactor) {
    if (sfactor !== this._blendingSource || dfactor !== this._blendingDest) {
      this._blendingSource = sfactor;
      this._blendingDest = dfactor;
      const ctx = RendererConfig.getInstance().renderContext;
      if (sfactor === ctx.ONE && dfactor === ctx.ZERO) {
        ctx.disable(ctx.BLEND);
      } else {
        ctx.enable(ctx.BLEND);
        //TODO need fix for WebGL
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, dfactor, sfactor, dfactor);
      }
    }
  }

  blendResetToCache() {
    const ctx = RendererConfig.getInstance().renderContext;
    ctx.blendEquation(ctx.FUNC_ADD);
    this.setBlending(this._blendingSource, this._blendingDest);
  }

  setProjectionMatrixDirty() {
    this._currentProjectionMatrix = -1;
  }

  bindTexture2D(textureId) {
    this.bindTexture2DN(0, textureId);
  }

  bindTexture2DN(textureUnit, textureId) {
    if (this._currentBoundTexture[textureUnit] === textureId) return;
    this._currentBoundTexture[textureUnit] = textureId;

    const ctx = RendererConfig.getInstance().renderContext;
    ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
    if (textureId) ctx.bindTexture(ctx.TEXTURE_2D, textureId._webTextureObj);
    else ctx.bindTexture(ctx.TEXTURE_2D, null);
  }

  deleteTexture(textureId) {
    this.deleteTextureN(0, textureId);
  }

  deleteTextureN(textureUnit, textureId) {
    if (textureId === this._currentBoundTexture[textureUnit])
      this._currentBoundTexture[textureUnit] = -1;
    RendererConfig.getInstance().renderContext.deleteTexture(textureId._webTextureObj);
  }

  bindVAO(vaoId) {
    if (!TEXTURE_ATLAS_USE_VAO) return;
    if (this._uVAO !== vaoId) {
      this._uVAO = vaoId;
      //TODO need fixed
      //glBindVertexArray(vaoId);
    }
  }

  enable(flags) {
    /*TODO: implement GL_BLEND server state tracking via _GLServerState */
  }
}

// Backward-compatible standalone functions (used by external packages)
export const glInvalidateStateCache = () => GLStateCache.getInstance().invalidateStateCache();
export const glUseProgram = (program) => GLStateCache.getInstance().useProgram(program);
export const glDeleteProgram = (program) => GLStateCache.getInstance().deleteProgram(program);
export const setBlending = (sfactor, dfactor) => GLStateCache.getInstance().setBlending(sfactor, dfactor);
export const glBlendFunc = (sfactor, dfactor) => GLStateCache.getInstance().blendFunc(sfactor, dfactor);
export const glBlendFuncForParticle = (sfactor, dfactor) => GLStateCache.getInstance().blendFuncForParticle(sfactor, dfactor);
export const glBlendResetToCache = () => GLStateCache.getInstance().blendResetToCache();
export const setProjectionMatrixDirty = () => GLStateCache.getInstance().setProjectionMatrixDirty();
export const glBindTexture2D = (textureId) => GLStateCache.getInstance().bindTexture2D(textureId);
export const glBindTexture2DN = (textureUnit, textureId) => GLStateCache.getInstance().bindTexture2DN(textureUnit, textureId);
export const glDeleteTexture = (textureId) => GLStateCache.getInstance().deleteTexture(textureId);
export const glDeleteTextureN = (textureUnit, textureId) => GLStateCache.getInstance().deleteTextureN(textureUnit, textureId);
export const glBindVAO = (vaoId) => GLStateCache.getInstance().bindVAO(vaoId);
export const glEnable = (flags) => GLStateCache.getInstance().enable(flags);

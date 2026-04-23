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

// GL State Cache functions

/**
 * Invalidates the GL state cache.
 * @function
 */
export function glInvalidateStateCache() {
  cc.kmGLFreeAll();
  cc._currentProjectionMatrix = -1;
  cc._currentShaderProgram = -1;
  for (let i = 0; i < cc.MAX_ACTIVETEXTURE; i++) {
    cc._currentBoundTexture[i] = -1;
  }
  cc._blendingSource = -1;
  cc._blendingDest = -1;
  cc._GLServerState = 0;
}

/**
 * Uses the GL program in case program is different than the current one.
 * @function
 * @param {WebGLProgram} program
 */
export function glUseProgram(program) {
  if (program !== cc._currentShaderProgram) {
    cc._currentShaderProgram = program;
    RendererConfig.getInstance().renderContext.useProgram(program);
  }
}

/**
 * Deletes the GL program. If it is the one that is being used, it invalidates it.
 * @function
 * @param {WebGLProgram} program
 */
export function glDeleteProgram(program) {
  if (program === cc._currentShaderProgram) cc._currentShaderProgram = -1;
  gl.deleteProgram(program);
}

/**
 * @function
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
export function setBlending(sfactor, dfactor) {
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

/**
 * Uses a blending function in case it not already used.
 * @function
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
export function glBlendFunc(sfactor, dfactor) {
  if (sfactor !== cc._blendingSource || dfactor !== cc._blendingDest) {
    cc._blendingSource = sfactor;
    cc._blendingDest = dfactor;
    setBlending(sfactor, dfactor);
  }
}

/**
 * @function
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
export function glBlendFuncForParticle(sfactor, dfactor) {
  if (sfactor !== cc._blendingSource || dfactor !== cc._blendingDest) {
    cc._blendingSource = sfactor;
    cc._blendingDest = dfactor;
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

/**
 * Resets the blending mode back to the cached state in case you used glBlendFuncSeparate() or glBlendEquation().
 * @function
 */
export function glBlendResetToCache() {
  const ctx = RendererConfig.getInstance().renderContext;
  ctx.blendEquation(ctx.FUNC_ADD);
  setBlending(cc._blendingSource, cc._blendingDest);
}

/**
 * sets the projection matrix as dirty
 * @function
 */
export function setProjectionMatrixDirty() {
  cc._currentProjectionMatrix = -1;
}

/**
 * If the texture is not already bound, it binds it.
 * @function
 * @param {Texture2D} textureId
 */
export function glBindTexture2D(textureId) {
  glBindTexture2DN(0, textureId);
}

/**
 * If the texture is not already bound to a given unit, it binds it.
 * @function
 * @param {Number} textureUnit
 * @param {Texture2D} textureId
 */
export function glBindTexture2DN(textureUnit, textureId) {
  if (cc._currentBoundTexture[textureUnit] === textureId) return;
  cc._currentBoundTexture[textureUnit] = textureId;

  const ctx = RendererConfig.getInstance().renderContext;
  ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
  if (textureId) ctx.bindTexture(ctx.TEXTURE_2D, textureId._webTextureObj);
  else ctx.bindTexture(ctx.TEXTURE_2D, null);
}

/**
 * It will delete a given texture. If the texture was bound, it will invalidate the cached.
 * @function
 * @param {WebGLTexture} textureId
 */
export function glDeleteTexture(textureId) {
  glDeleteTextureN(0, textureId);
}

/**
 * It will delete a given texture. If the texture was bound, it will invalidate the cached for the given texture unit.
 * @function
 * @param {Number} textureUnit
 * @param {WebGLTexture} textureId
 */
export function glDeleteTextureN(textureUnit, textureId) {
  if (textureId === cc._currentBoundTexture[textureUnit])
    cc._currentBoundTexture[textureUnit] = -1;
  RendererConfig.getInstance().renderContext.deleteTexture(
    textureId._webTextureObj
  );
}

/**
 * If the vertex array is not already bound, it binds it.
 * @function
 * @param {Number} vaoId
 */
export function glBindVAO(vaoId) {
  if (!cc.TEXTURE_ATLAS_USE_VAO) return;

  if (cc._uVAO !== vaoId) {
    cc._uVAO = vaoId;
    //TODO need fixed
    //glBindVertexArray(vaoId);
  }
}

/**
 * It will enable / disable the server side GL states.
 * @function
 * @param {Number} flags
 */
export function glEnable(flags) {
  /*TODO: implement GL_BLEND server state tracking via cc._GLServerState */
}

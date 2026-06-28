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

import { Color } from "../platform/types/color";
import { arrayRemoveObject } from "../platform/macro/utils";
import { BATCH_VERTEX_COUNT } from "../platform/macro/constants";
import { GLProgramState } from "../shaders/CCGLProgramState";
import Matrix4 from "../kazmath/mat4";
import { ServiceLocator } from "../service-locator";
import { OperatingSystem, VertexAttribute, ShaderName } from "../enums";
import { BYTE } from "../constants";

// Internal variables
// Batching general informations
var _batchedInfo = {
    // The batched blend source, all batching element should have the same blend source
    blendSrc: null,
    // The batched blend destination, all batching element should have the same blend destination
    blendDst: null,
    // The batched gl program state, all batching element should have the same state
    glProgramState: null,
    // Whether the current batch uses the multi-texture sprite program
    isMulti: false
  },
  _batchBroken = false,
  _indexBuffer = null,
  _vertexBuffer = null,
  // Total vertex size
  _maxVertexSize = 0,
  // Current batching vertex size
  _batchingSize = 0,
  // Current batching index size
  _indexSize = 0,
  // Float size per vertex
  _sizePerVertex = 6,
  // buffer data and views
  _vertexData = null,
  _vertexDataSize = 0,
  _vertexDataF32 = null,
  _vertexDataUI32 = null,
  _indexData = null,
  _prevIndexSize = 0,
  _pureQuad = true,
  _IS_IOS = false,
  // Multi-texture batching (WebGL2). When enabled, a single batch may reference
  // up to `_maxBatchTextures` distinct textures bound to separate texture units.
  _multiTexture = false,
  _maxBatchTextures = 1,
  _batchTextures = [],
  _batchTextureCount = 0,
  _textureUnits = null,
  _multiProgramState = null;

// Inspired from @Heishe's gotta-batch-them-all branch
// https://github.com/Talisca/cocos2d-html5/commit/de731f16414eb9bcaa20480006897ca6576d362c
function updateBuffer(numVertex) {
  var gl = ServiceLocator.sys.rendererConfig.renderContext;
  // Update index buffer size
  if (_indexBuffer) {
    var indexCount = Math.ceil(numVertex / 4) * 6;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indexBuffer);
    _indexData = new Uint16Array(indexCount);
    var currentQuad = 0;
    for (var i = 0, len = indexCount; i < len; i += 6) {
      _indexData[i] = currentQuad + 0;
      _indexData[i + 1] = currentQuad + 1;
      _indexData[i + 2] = currentQuad + 2;
      _indexData[i + 3] = currentQuad + 1;
      _indexData[i + 4] = currentQuad + 2;
      _indexData[i + 5] = currentQuad + 3;
      currentQuad += 4;
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _indexData, gl.DYNAMIC_DRAW);
  }
  // Update vertex buffer size
  if (_vertexBuffer) {
    _vertexDataSize = numVertex * _sizePerVertex;
    var byteLength = _vertexDataSize * 4;
    _vertexData = new ArrayBuffer(byteLength);
    _vertexDataF32 = new Float32Array(_vertexData);
    _vertexDataUI32 = new Uint32Array(_vertexData);
    // Init buffer data
    gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, _vertexDataF32, gl.DYNAMIC_DRAW);
  }
  // Downsize by 200 to avoid vertex data overflow
  _maxVertexSize = numVertex - 200;
}

// Inspired from @Heishe's gotta-batch-them-all branch
// https://github.com/Talisca/cocos2d-html5/commit/de731f16414eb9bcaa20480006897ca6576d362c
function initQuadBuffer(numVertex) {
  var gl = ServiceLocator.sys.rendererConfig.renderContext;
  if (_indexBuffer === null) {
    // TODO do user need to release the memory ?
    _vertexBuffer = gl.createBuffer();
    _indexBuffer = gl.createBuffer();
  }
  updateBuffer(numVertex);
}

var VertexType = {
  QUAD: 0,
  TRIANGLE: 1,
  CUSTOM: 2
};

var rendererWebGL = {
  mat4Identity: null,

  childrenOrderDirty: true,
  assignedZ: 0,
  assignedZStep: 1 / 100,

  VertexType: VertexType,

  _transformNodePool: [], //save nodes transform dirty
  _renderCmds: [], //save renderer commands

  _isCacheToBufferOn: false, //a switch that whether cache the rendererCmd to cacheToCanvasCmds
  _cacheToBufferCmds: {}, // an array saves the renderer commands need for cache to other canvas
  _cacheInstanceIds: [],
  _currentID: 0,
  _clearColor: new Color(0, 0, 0, BYTE), //background color,default BLACK

  init: function () {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    // Enable the WebGL2 multi-texture batcher when available.
    _multiTexture = ServiceLocator.sys.rendererConfig.isWebGL2;
    _sizePerVertex = _multiTexture ? 7 : 6;
    if (_multiTexture) {
      _maxBatchTextures = ServiceLocator.sys.rendererConfig.maxBatchTextures;
      _textureUnits = new Int32Array(_maxBatchTextures);
      for (var t = 0; t < _maxBatchTextures; ++t) {
        _textureUnits[t] = t;
      }
    } else {
      _maxBatchTextures = 1;
    }
    _batchTextures = new Array(_maxBatchTextures).fill(null);
    _batchTextureCount = 0;

    this.mat4Identity = new Matrix4();
    this.mat4Identity.identity();
    initQuadBuffer(BATCH_VERTEX_COUNT);
    if (ServiceLocator.sys.specification.os === OperatingSystem.IOS) {
      _IS_IOS = true;
    }
  },

  getSizePerVertex: function () {
    return _sizePerVertex;
  },

  // The shared GLProgramState for the multi-texture sprite program, used to
  // detect whether a render command participates in multi-texture batching.
  _getMultiProgramState: function () {
    if (!_multiTexture) {
      return null;
    }
    if (!_multiProgramState) {
      var program = ServiceLocator.shaderCache.programForKey(
        ShaderName.SPRITE_POSITION_TEXTURECOLOR_MULTI
      );
      _multiProgramState = GLProgramState.getOrCreateWithGLProgram(program);
    }
    return _multiProgramState;
  },

  // Find (or allocate) the texture-unit slot for a texture within the current
  // batch. Returns -1 when the slot set is full (caller must flush).
  _resolveTextureSlot: function (texture, maxTextures) {
    for (var i = 0; i < _batchTextureCount; ++i) {
      if (_batchTextures[i] === texture) {
        return i;
      }
    }
    if (_batchTextureCount < maxTextures) {
      _batchTextures[_batchTextureCount] = texture;
      return _batchTextureCount++;
    }
    return -1;
  },

  getVertexSize: function () {
    return _maxVertexSize;
  },

  // Current number of vertices accumulated in the open batch. Self-batching
  // commands (e.g. spine) use this to know where to write their next vertex.
  getBatchingSize: function () {
    return _batchingSize;
  },

  // Append geometry to the shared multi-texture batch on behalf of a
  // self-batching command (spine). Flushes the open batch when it is
  // incompatible (not multi, different program/blend) or when the texture-unit
  // set or vertex buffer would overflow, then returns the texture-unit slot the
  // caller must write as the per-vertex texIndex. After calling this, the write
  // offset is getBatchingSize() * sizePerVertex.
  _appendMultiBatch: function (texture, blendFunc, glProgramState, vertCount) {
    if (
      !_batchedInfo.isMulti ||
      _batchedInfo.glProgramState !== glProgramState ||
      _batchedInfo.blendSrc !== blendFunc.src ||
      _batchedInfo.blendDst !== blendFunc.dst
    ) {
      this._batchRendering();
      _batchedInfo.isMulti = true;
      _batchedInfo.glProgramState = glProgramState;
      _batchedInfo.blendSrc = blendFunc.src;
      _batchedInfo.blendDst = blendFunc.dst;
      _batchTextureCount = 0;
    }

    if (_batchingSize + vertCount > _maxVertexSize) {
      this._batchRendering();
      _batchTextureCount = 0;
    }

    var slot = this._resolveTextureSlot(texture, _maxBatchTextures);
    if (slot === -1) {
      this._batchRendering();
      _batchTextureCount = 0;
      slot = this._resolveTextureSlot(texture, _maxBatchTextures);
    }
    return slot;
  },

  getRenderCmd: function (renderableObject) {
    //TODO Add renderCmd pool here
    return renderableObject._createRenderCmd();
  },

  _turnToCacheMode: function (renderTextureID) {
    this._isCacheToBufferOn = true;
    renderTextureID = renderTextureID || 0;
    if (!this._cacheToBufferCmds[renderTextureID]) {
      this._cacheToBufferCmds[renderTextureID] = [];
    } else {
      this._cacheToBufferCmds[renderTextureID].length = 0;
    }
    if (this._cacheInstanceIds.indexOf(renderTextureID) === -1) {
      this._cacheInstanceIds.push(renderTextureID);
    }
    this._currentID = renderTextureID;
  },

  _turnToNormalMode: function () {
    this._isCacheToBufferOn = false;
  },

  _removeCache: function (instanceID) {
    instanceID = instanceID || this._currentID;
    var cmds = this._cacheToBufferCmds[instanceID];
    if (cmds) {
      cmds.length = 0;
      delete this._cacheToBufferCmds[instanceID];
    }

    var locIDs = this._cacheInstanceIds;
    arrayRemoveObject(locIDs, instanceID);
  },

  /**
   * drawing all renderer command to cache canvas' context
   * @param {Number} [renderTextureId]
   */
  _renderingToBuffer: function (renderTextureId) {
    renderTextureId = renderTextureId || this._currentID;
    var locCmds = this._cacheToBufferCmds[renderTextureId];
    var ctx = ServiceLocator.sys.rendererConfig.renderContext;
    this.rendering(ctx, locCmds);
    this._removeCache(renderTextureId);

    var locIDs = this._cacheInstanceIds;
    if (locIDs.length === 0) this._isCacheToBufferOn = false;
    else this._currentID = locIDs[locIDs.length - 1];
  },

  //reset renderer's flag
  resetFlag: function () {
    if (this.childrenOrderDirty) {
      this.childrenOrderDirty = false;
    }
    this._transformNodePool.length = 0;
  },

  //update the transform data
  transform: function () {
    var locPool = this._transformNodePool;
    //sort the pool
    locPool.sort(this._sortNodeByLevelAsc);
    //transform node
    var i, len, cmd;
    for (i = 0, len = locPool.length; i < len; i++) {
      cmd = locPool[i];
      cmd.updateStatus();
    }
    locPool.length = 0;
  },

  transformDirty: function () {
    return this._transformNodePool.length > 0;
  },

  _sortNodeByLevelAsc: function (n1, n2) {
    return n1._curLevel - n2._curLevel;
  },

  pushDirtyNode: function (node) {
    //if (this._transformNodePool.indexOf(node) === -1)
    this._transformNodePool.push(node);
  },

  clearRenderCommands: function () {
    // Copy previous command list for late check in rendering
    this._renderCmds.length = 0;
  },

  clear: function () {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    gl.clearColor(
      this._clearColor.r / BYTE,
      this._clearColor.g / BYTE,
      this._clearColor.b / BYTE,
      this._clearColor.a / BYTE
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },

  setDepthTest: function (enable) {
    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    if (enable) {
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
  },

  pushRenderCommand: function (cmd) {
    if (!cmd.rendering && !cmd.uploadData) return;
    if (this._isCacheToBufferOn) {
      var currentId = this._currentID,
        locCmdBuffer = this._cacheToBufferCmds;
      var cmdList = locCmdBuffer[currentId];
      if (cmdList.indexOf(cmd) === -1) cmdList.push(cmd);
    } else {
      if (this._renderCmds.indexOf(cmd) === -1) {
        this._renderCmds.push(cmd);
      }
    }
  },

  _increaseBatchingSize: function (increment, vertexType, indices) {
    vertexType = vertexType || VertexType.QUAD;
    var i, curr;
    switch (vertexType) {
      case VertexType.QUAD:
        for (i = 0; i < increment; i += 4) {
          curr = _batchingSize + i;
          _indexData[_indexSize++] = curr + 0;
          _indexData[_indexSize++] = curr + 1;
          _indexData[_indexSize++] = curr + 2;
          _indexData[_indexSize++] = curr + 1;
          _indexData[_indexSize++] = curr + 2;
          _indexData[_indexSize++] = curr + 3;
        }
        break;
      case VertexType.TRIANGLE:
        _pureQuad = false;
        for (i = 0; i < increment; i += 3) {
          curr = _batchingSize + i;
          _indexData[_indexSize++] = curr + 0;
          _indexData[_indexSize++] = curr + 1;
          _indexData[_indexSize++] = curr + 2;
        }
        break;
      case VertexType.CUSTOM:
        // CUSTOM type increase the indices data
        _pureQuad = false;
        var len = indices.length;
        for (i = 0; i < len; i++) {
          _indexData[_indexSize++] = _batchingSize + indices[i];
        }
        break;
      default:
        return;
    }
    _batchingSize += increment;
  },

  _updateBatchedInfo: function (texture, blendFunc, glProgramState) {
    if (
      _batchedInfo.isMulti ||
      _batchTextures[0] !== texture ||
      blendFunc.src !== _batchedInfo.blendSrc ||
      blendFunc.dst !== _batchedInfo.blendDst ||
      glProgramState !== _batchedInfo.glProgramState
    ) {
      // Draw batched elements
      this._batchRendering();
      // Update _batchedInfo (single-texture batch)
      _batchedInfo.isMulti = false;
      _batchTextures[0] = texture;
      _batchTextureCount = 1;
      _batchedInfo.blendSrc = blendFunc.src;
      _batchedInfo.blendDst = blendFunc.dst;
      _batchedInfo.glProgramState = glProgramState;

      return true;
    } else {
      return false;
    }
  },

  _breakBatch: function () {
    _batchBroken = true;
  },

  _uploadBufferData: function (cmd) {
    // Self-batching commands (e.g. spine skeletons) emit many primitives with
    // their own per-slot textures/blend and drive the batcher directly. Let
    // them manage the shared batch state instead of resolving a single texture
    // slot here (a skeleton has no single node texture).
    if (cmd._selfBatch) {
      cmd.uploadData(
        _vertexDataF32,
        _vertexDataUI32,
        _batchingSize * _sizePerVertex
      );
      return;
    }

    if (_batchingSize >= _maxVertexSize) {
      this._batchRendering();
      _batchTextureCount = 0;
    }

    // Check batching
    var node = cmd._node;
    var texture =
      node._texture || (node._spriteFrame && node._spriteFrame._texture);
    var blendSrc = node._blendFunc.src;
    var blendDst = node._blendFunc.dst;
    var glProgramState = cmd._glProgramState;
    // Multi-texture batching only applies to commands using the default
    // multi-texture sprite program; everything else keeps the single-texture
    // (flush-on-texture-change) behavior.
    var isMulti =
      _multiTexture && glProgramState === this._getMultiProgramState();
    var maxTextures = isMulti ? _maxBatchTextures : 1;

    if (
      _batchBroken ||
      _batchedInfo.isMulti !== isMulti ||
      _batchedInfo.blendSrc !== blendSrc ||
      _batchedInfo.blendDst !== blendDst ||
      _batchedInfo.glProgramState !== glProgramState
    ) {
      // Draw batched elements
      this._batchRendering();
      // Update _batchedInfo
      _batchedInfo.isMulti = isMulti;
      _batchedInfo.blendSrc = blendSrc;
      _batchedInfo.blendDst = blendDst;
      _batchedInfo.glProgramState = glProgramState;
      _batchTextureCount = 0;
      _batchBroken = false;
    }

    // Resolve the texture-unit slot for this command's texture, flushing if the
    // slot set is full.
    var beforeCount = _batchTextureCount;
    var slot = this._resolveTextureSlot(texture, maxTextures);
    if (slot === -1) {
      this._batchRendering();
      _batchedInfo.isMulti = isMulti;
      _batchedInfo.blendSrc = blendSrc;
      _batchedInfo.blendDst = blendDst;
      _batchedInfo.glProgramState = glProgramState;
      _batchTextureCount = 0;
      beforeCount = 0;
      slot = this._resolveTextureSlot(texture, maxTextures);
    }
    var appended = _batchTextureCount > beforeCount;

    // Upload vertex data
    var sizeBefore = _batchingSize;
    var len = cmd.uploadData(
      _vertexDataF32,
      _vertexDataUI32,
      _batchingSize * _sizePerVertex,
      slot
    );
    if (len > 0) {
      this._increaseBatchingSize(len, cmd.vertexType, cmd._indices);
    } else if (appended && _batchingSize === sizeBefore) {
      // The command emitted no geometry (e.g. an unloaded texture or fully
      // transparent node) and was not a self-batching command, so release the
      // texture slot it just reserved. This keeps unloaded/incomplete textures
      // out of the bound sampler set. Self-batching commands (spine/tilemap)
      // advance _batchingSize themselves and are excluded by the size check.
      _batchTextures[slot] = null;
      _batchTextureCount = beforeCount;
    }
  },

  _batchRendering: function () {
    if (_batchingSize === 0 || _batchTextureCount === 0) {
      return;
    }

    var gl = ServiceLocator.sys.rendererConfig.renderContext;
    var glProgramState = _batchedInfo.glProgramState;
    var uploadAll = _batchingSize > _maxVertexSize * 0.5;

    if (glProgramState) {
      glProgramState.apply();
      glProgramState.getGLProgram()._updateProjectionUniform();
    }

    ServiceLocator.glStateCache.blendFunc(
      _batchedInfo.blendSrc,
      _batchedInfo.blendDst
    );

    if (_batchedInfo.isMulti) {
      // Bind every accumulated texture to its own unit, then pad the remaining
      // declared sampler slots with slot 0 so no active sampler is left
      // pointing at an incomplete texture.
      var u;
      for (u = 0; u < _batchTextureCount; ++u) {
        ServiceLocator.glStateCache.bindTexture2DN(u, _batchTextures[u]);
      }
      for (u = _batchTextureCount; u < _maxBatchTextures; ++u) {
        ServiceLocator.glStateCache.bindTexture2DN(u, _batchTextures[0]);
      }
      if (glProgramState) {
        glProgramState.getGLProgram().setTextureUnits(_textureUnits);
      }
    } else {
      ServiceLocator.glStateCache.bindTexture2DN(0, _batchTextures[0]);
    }

    var stride = _sizePerVertex * 4;

    gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer);
    // upload the vertex data to the gl buffer
    if (uploadAll) {
      gl.bufferData(gl.ARRAY_BUFFER, _vertexDataF32, gl.DYNAMIC_DRAW);
    } else {
      var view = _vertexDataF32.subarray(0, _batchingSize * _sizePerVertex);
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
    if (_multiTexture) {
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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indexBuffer);
    if (!_prevIndexSize || !_pureQuad || _indexSize > _prevIndexSize) {
      if (uploadAll) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _indexData, gl.DYNAMIC_DRAW);
      } else {
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          _indexData.subarray(0, _indexSize),
          gl.DYNAMIC_DRAW
        );
      }
    }
    gl.drawElements(gl.TRIANGLES, _indexSize, gl.UNSIGNED_SHORT, 0);

    ServiceLocator.sys.rendererConfig.incrementDrawCount();

    if (_pureQuad) {
      _prevIndexSize = _indexSize;
    } else {
      _prevIndexSize = 0;
      _pureQuad = true;
    }
    _batchingSize = 0;
    _indexSize = 0;
  },

  /**
   * drawing all renderer command to context (default is _renderContext)
   * @param {WebGLRenderingContext} [ctx=_renderContext]
   */
  rendering: function (ctx, cmds) {
    var locCmds = cmds || this._renderCmds,
      i,
      len,
      cmd,
      context = ctx || ServiceLocator.sys.rendererConfig.renderContext;

    // Reset buffer for rendering
    context.bindBuffer(gl.ARRAY_BUFFER, null);

    for (i = 0, len = locCmds.length; i < len; ++i) {
      cmd = locCmds[i];
      if (!cmd.needDraw()) continue;

      if (cmd.uploadData) {
        this._uploadBufferData(cmd);
      } else {
        if (_batchingSize > 0) {
          this._batchRendering();
        }
        // The pending batch (if any) was fully drawn above; start the next
        // batch with a clean texture-slot set so it only binds the textures it
        // actually uses.
        _batchTextureCount = 0;
        cmd.rendering(context);
      }
    }
    this._batchRendering();
    _batchTextureCount = 0;
    _batchedInfo.glProgramState = null;
    _batchedInfo.isMulti = false;
  }
};

export { rendererWebGL };

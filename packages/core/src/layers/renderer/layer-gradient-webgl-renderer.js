/****************************************************************************
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

import { RendererConfig } from "../../renderer/renderer-config";
import LayerColorWebGLRenderer from "./layer-color-webgl-renderer";
import { Node } from "../../base-nodes/node";
import { Point } from "../../cocoa/geometry/point";
import { Rect } from "../../cocoa/geometry/rect";
import {
  VERTEX_ATTRIB_COLOR,
  VERTEX_ATTRIB_POSITION
} from "../../platform/macro/constants";

/**
 * LayerGradient's WebGL render command
 */
const FLOAT_PER_VERTEX_GRADIENT = 4;

export default class LayerGradientWebGLRenderer extends LayerColorWebGLRenderer {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;
    this._clipRect = new Rect();
    this._clippingRectDirty = false;
  }

  updateStatus() {
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    if (locFlag & flags.gradientDirty) {
      this._dirtyFlag |= flags.colorDirty;
      this._updateVertex();
      this._dirtyFlag &= ~flags.gradientDirty;
    }

    this.originUpdateStatus();
  }

  _syncStatus(parentCmd) {
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    if (locFlag & flags.gradientDirty) {
      this._dirtyFlag |= flags.colorDirty;
      this._updateVertex();
      this._dirtyFlag &= ~flags.gradientDirty;
    }

    this._originSyncStatus(parentCmd);
  }

  transform(parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);
    this._updateVertex();
  }

  _updateVertex() {
    const node = this._node,
      stops = node._colorStops;
    if (!stops || stops.length < 2) return;

    this._clippingRectDirty = true;
    let i;
    const stopsLen = stops.length,
      verticesLen = stopsLen * 2,
      contentSize = node._contentSize;
    if (this._positionView.length / FLOAT_PER_VERTEX_GRADIENT < verticesLen) {
      this.initData(verticesLen);
    }

    const angle =
        Math.PI + Point.angleSigned(new Point(0, -1), node._alongVector),
      locAnchor = new Point(contentSize.width / 2, contentSize.height / 2);
    const degrees = Math.round(cc.radiansToDegrees(angle));
    let transMat = cc.affineTransformMake(1, 0, 0, 1, locAnchor.x, locAnchor.y);
    transMat = cc.affineTransformRotate(transMat, angle);
    let a, b;
    if (degrees < 90) {
      a = new Point(-locAnchor.x, locAnchor.y);
      b = new Point(locAnchor.x, locAnchor.y);
    } else if (degrees < 180) {
      a = new Point(locAnchor.x, locAnchor.y);
      b = new Point(locAnchor.x, -locAnchor.y);
    } else if (degrees < 270) {
      a = new Point(locAnchor.x, -locAnchor.y);
      b = new Point(-locAnchor.x, -locAnchor.y);
    } else {
      a = new Point(-locAnchor.x, -locAnchor.y);
      b = new Point(-locAnchor.x, locAnchor.y);
    }

    const sin = Math.sin(angle),
      cos = Math.cos(angle);
    const tx = Math.abs((a.x * cos - a.y * sin) / locAnchor.x),
      ty = Math.abs((b.x * sin + b.y * cos) / locAnchor.y);
    transMat = cc.affineTransformScale(transMat, tx, ty);
    const pos = this._positionView;
    for (i = 0; i < stopsLen; i++) {
      const stop = stops[i],
        y = stop.p * contentSize.height;
      const p0 = cc.pointApplyAffineTransform(
        -locAnchor.x,
        y - locAnchor.y,
        transMat
      );
      let offset = i * 2 * FLOAT_PER_VERTEX_GRADIENT;
      pos[offset] = p0.x;
      pos[offset + 1] = p0.y;
      pos[offset + 2] = node._vertexZ;
      const p1 = cc.pointApplyAffineTransform(
        contentSize.width - locAnchor.x,
        y - locAnchor.y,
        transMat
      );
      offset += FLOAT_PER_VERTEX_GRADIENT;
      pos[offset] = p1.x;
      pos[offset + 1] = p1.y;
      pos[offset + 2] = node._vertexZ;
    }

    this._dataDirty = true;
  }

  _updateColor() {
    const node = this._node,
      stops = node._colorStops;
    if (!stops || stops.length < 2) return;

    const stopsLen = stops.length,
      colors = this._colorView,
      opacityf = this._displayedOpacity / 255;
    let stopColor, offset;
    for (let i = 0; i < stopsLen; i++) {
      stopColor = stops[i].color;
      this._color[0] =
        ((stopColor.a * opacityf) << 24) |
        (stopColor.b << 16) |
        (stopColor.g << 8) |
        stopColor.r;

      offset = i * 2 * FLOAT_PER_VERTEX_GRADIENT;
      colors[offset + 3] = this._color[0];
      offset += FLOAT_PER_VERTEX_GRADIENT;
      colors[offset + 3] = this._color[0];
    }
    this._dataDirty = true;
  }

  rendering(ctx) {
    const context = ctx || RendererConfig.getInstance().renderContext,
      node = this._node;

    if (!this._matrix) {
      this._matrix = new cc.math.Matrix4();
      this._matrix.identity();
    }

    const clippingRect = this._getClippingRect();
    context.enable(context.SCISSOR_TEST);
    cc.view.setScissorInPoints(
      clippingRect.x,
      clippingRect.y,
      clippingRect.width,
      clippingRect.height
    );

    const wt = this._worldTransform;
    this._matrix.mat[0] = wt.a;
    this._matrix.mat[4] = wt.c;
    this._matrix.mat[12] = wt.tx;
    this._matrix.mat[1] = wt.b;
    this._matrix.mat[5] = wt.d;
    this._matrix.mat[13] = wt.ty;

    if (this._dataDirty) {
      if (!this._vertexBuffer) {
        this._vertexBuffer = gl.createBuffer();
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.DYNAMIC_DRAW);
      this._dataDirty = false;
    }

    this._glProgramState.apply(this._matrix);
    cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_COLOR);

    gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_COLOR,
      4,
      gl.UNSIGNED_BYTE,
      true,
      16,
      12
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    context.disable(context.SCISSOR_TEST);
  }

  _getClippingRect() {
    if (this._clippingRectDirty) {
      const node = this._node;
      const rect = new Rect(
        0,
        0,
        node._contentSize.width,
        node._contentSize.height
      );
      const trans = node.getNodeToWorldTransform();
      this._clipRect = cc._rectApplyAffineTransformIn(rect, trans);
    }
    return this._clipRect;
  }
}

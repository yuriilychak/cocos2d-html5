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

import LayerColorCanvasRenderer from "./layer-color-canvas-renderer";
import { Node } from "../../base-nodes/node";
import { Point } from "../../cocoa/geometry/point";

/**
 * LayerGradient's Canvas render command
 */
export default class LayerGradientCanvasRenderer extends LayerColorCanvasRenderer {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;
    this._startPoint = new Point(0, 0);
    this._endPoint = new Point(0, 0);
    this._startStopStr = null;
    this._endStopStr = null;
  }

  rendering(ctx, scaleX, scaleY) {
    const wrapper = ctx || cc._renderContext,
      context = wrapper.getContext(),
      node = this._node,
      opacity = this._displayedOpacity / 255;

    if (opacity === 0) return;

    const locWidth = node._contentSize.width,
      locHeight = node._contentSize.height;
    wrapper.setCompositeOperation(this._blendFuncStr);
    wrapper.setGlobalAlpha(opacity);
    const gradient = context.createLinearGradient(
      this._startPoint.x,
      this._startPoint.y,
      this._endPoint.x,
      this._endPoint.y
    );

    if (node._colorStops) {
      for (let i = 0; i < node._colorStops.length; i++) {
        const stop = node._colorStops[i];
        gradient.addColorStop(stop.p, this._colorStopsStr[i]);
      }
    } else {
      gradient.addColorStop(0, this._startStopStr);
      gradient.addColorStop(1, this._endStopStr);
    }

    wrapper.setFillStyle(gradient);

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    context.fillRect(0, 0, locWidth, -locHeight);
    cc.g_NumberOfDraws++;
  }

  updateStatus() {
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    if (locFlag & flags.gradientDirty) {
      this._dirtyFlag |= flags.colorDirty;
      this._dirtyFlag &= ~flags.gradientDirty;
    }

    this.originUpdateStatus();
  }

  _syncStatus(parentCmd) {
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    if (locFlag & flags.gradientDirty) {
      this._dirtyFlag |= flags.colorDirty;
      this._dirtyFlag &= ~flags.gradientDirty;
    }

    this._originSyncStatus(parentCmd);
  }

  _updateColor() {
    const node = this._node;
    const contentSize = node._contentSize;
    const tWidth = contentSize.width * 0.5,
      tHeight = contentSize.height * 0.5;

    const angle = cc.pAngleSigned(new Point(0, -1), node._alongVector);
    const p1 = cc.pRotateByAngle(new Point(0, -1), new Point(0, 0), angle);
    const factor = Math.min(Math.abs(1 / p1.x), Math.abs(1 / p1.y));

    this._startPoint.x = tWidth * (-p1.x * factor) + tWidth;
    this._startPoint.y = tHeight * (p1.y * factor) - tHeight;
    this._endPoint.x = tWidth * (p1.x * factor) + tWidth;
    this._endPoint.y = tHeight * (-p1.y * factor) - tHeight;

    const locStartColor = this._displayedColor,
      locEndColor = node._endColor;
    const startOpacity = node._startOpacity / 255,
      endOpacity = node._endOpacity / 255;
    this._startStopStr =
      "rgba(" +
      Math.round(locStartColor.r) +
      "," +
      Math.round(locStartColor.g) +
      "," +
      Math.round(locStartColor.b) +
      "," +
      startOpacity.toFixed(4) +
      ")";
    this._endStopStr =
      "rgba(" +
      Math.round(locEndColor.r) +
      "," +
      Math.round(locEndColor.g) +
      "," +
      Math.round(locEndColor.b) +
      "," +
      endOpacity.toFixed(4) +
      ")";

    if (node._colorStops) {
      this._startOpacity = 0;
      this._endOpacity = 0;

      this._colorStopsStr = [];
      for (let i = 0; i < node._colorStops.length; i++) {
        const stopColor = node._colorStops[i].color;
        const stopOpacity = stopColor.a == null ? 1 : stopColor.a / 255;
        this._colorStopsStr.push(
          "rgba(" +
            Math.round(stopColor.r) +
            "," +
            Math.round(stopColor.g) +
            "," +
            Math.round(stopColor.b) +
            "," +
            stopOpacity.toFixed(4) +
            ")"
        );
      }
    }
  }
}

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

import LayerCanvasRenderer from "./layer-canvas-renderer";
import { Rect, AffineTransform } from "../../geometry";
import { Color } from "../../platform/types/color";
import {
  CustomRenderCmd,
  CanvasRenderCmd as NodeCanvasRenderCmd
} from "../../base-nodes/node";
import { ServiceLocator } from "../../service-locator";
import { BYTE } from "../../constants";

/**
 * LayerColor's Canvas render command
 */
export default class LayerColorCanvasRenderer extends LayerCanvasRenderer {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;
    this._blendFuncStr = "source-over";
    this._bakeRenderCmd = new CustomRenderCmd(this, this._bakeRendering);
  }

  unbake() {
    super.unbake();
    this._needDraw = true;
  }

  rendering(ctx, scaleX, scaleY) {
    const wrapper = ctx || ServiceLocator.sys.rendererConfig.renderContext,
      context = wrapper.context,
      node = this._node,
      curColor = this._displayedColor,
      opacity = this._displayedOpacity / BYTE,
      locWidth = node.width,
      locHeight = node.height;

    if (opacity === 0) return;

    wrapper.compositeOperation = this._blendFuncStr;
    wrapper.globalAlpha = opacity;
    wrapper.fillStyle =
      Color.toRgba(0 | curColor.r, 0 | curColor.g, 0 | curColor.b);

    wrapper.setTransform(this._worldTransform, { x: scaleX, y: scaleY });
    context.fillRect(0, 0, locWidth, -locHeight);

    ServiceLocator.sys.rendererConfig.incrementDrawCount();
  }

  updateBlendFunc(blendFunc) {
    this._blendFuncStr =
      NodeCanvasRenderCmd._getCompositeOperationByBlendFunc(blendFunc);
  }

  _updateSquareVertices() {}
  _updateSquareVerticesWidth() {}
  _updateSquareVerticesHeight() {}

  _bakeRendering() {
    if (this._cacheDirty) {
      const node = this._node;
      const locBakeSprite = this._bakeSprite,
        children = node.children;
      let i;
      const len = children.length;

      this.transform(this.getParentRenderCmd(), true);
      const boundingBox = this._getBoundingBoxForBake();
      boundingBox.width = 0 | (boundingBox.width + 0.5);
      boundingBox.height = 0 | (boundingBox.height + 0.5);

      const bakeContext = locBakeSprite.getCacheContext();
      const ctx = bakeContext.context;

      locBakeSprite.position = { x: boundingBox.x, y: boundingBox.y };

      if (this._updateCache > 0) {
      ctx.fillStyle = bakeContext.fillStyle;
        locBakeSprite.resetCanvasSize(boundingBox.width, boundingBox.height);
        bakeContext.offset = {
          x: 0 - boundingBox.x,
          y: ctx.canvas.height - boundingBox.height + boundingBox.y
        };

        let child;
        const _r = ServiceLocator.sys.rendererConfig.renderer;
        _r.turnToCacheMode(this.instanceId);
        if (len > 0) {
          node.order.sortAllChildren();
          for (i = 0; i < len; i++) {
            child = children[i];
            if (child.order.localZOrder < 0) child.visit(node);
            else break;
          }
          _r.pushRenderCommand(this);
          for (; i < len; i++) {
            children[i].visit(node);
          }
        } else _r.pushRenderCommand(this);
        _r.renderingToCacheCanvas(bakeContext, this.instanceId);
        locBakeSprite.transform();
        this._updateCache--;
      }
      this._cacheDirty = false;
    }
  }

  _getBoundingBoxForBake() {
    const node = this._node;
    let rect = new Rect(
      0,
      0,
      node.width,
      node.height
    );
    const trans = node.nodeToWorldTransform;
    rect = AffineTransform.applyToRect(rect, node.nodeToWorldTransform);

    if (node.children.length === 0) return rect;

    const locChildren = node.children;
    for (let i = 0; i < locChildren.length; i++) {
      const child = locChildren[i];
      if (child && child.visible) {
        const childRect = child.getBoundingBoxToCurrentNode(trans);
        rect = Rect.union(rect, childRect);
      }
    }
    return rect;
  }
}

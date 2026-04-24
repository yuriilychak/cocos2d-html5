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

import { CanvasRenderCmd as NodeCanvasRenderCmd } from "../../base-nodes/node-canvas-render-cmd";
import { Node } from "../../base-nodes/node";
import { Point } from "../../cocoa/geometry/point";
import { Rect } from "../../cocoa/geometry/rect";
import { RendererConfig } from "../../renderer/renderer-config";

/**
 * Layer's Canvas render command
 */
export default class LayerCanvasRenderer extends NodeCanvasRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._isBaked = false;
    this._bakeSprite = null;
    this._canUseDirtyRegion = true;
    this._updateCache = 2;
  }

  _setCacheDirty(child) {
    if (child && this._updateCache === 0) this._updateCache = 2;
    if (this._cacheDirty === false) {
      this._cacheDirty = true;
      const cachedP = this._cachedParent;
      cachedP &&
        cachedP !== this &&
        cachedP._setNodeDirtyForCache &&
        cachedP._setNodeDirtyForCache();
    }
  }

  updateStatus() {
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    if (locFlag & flags.orderDirty) {
      this._cacheDirty = true;
      if (this._updateCache === 0) this._updateCache = 2;
      this._dirtyFlag &= ~flags.orderDirty;
    }

    this.originUpdateStatus();
  }

  _syncStatus(parentCmd) {
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    if (this._isBaked || locFlag & flags.orderDirty) {
      this._cacheDirty = true;
      if (this._updateCache === 0) this._updateCache = 2;
      this._dirtyFlag &= ~flags.orderDirty;
    }
    this._originSyncStatus(parentCmd);
  }

  transform(parentCmd, recursive) {
    if (!this._worldTransform) {
      this._worldTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
    }
    const wt = this._worldTransform;
    const a = wt.a,
      b = wt.b,
      c = wt.c,
      d = wt.d,
      tx = wt.tx,
      ty = wt.ty;
    this.originTransform(parentCmd, recursive);
    if (
      (wt.a !== a || wt.b !== b || wt.c !== c || wt.d !== d) &&
      this._updateCache === 0
    )
      this._updateCache = 2;
  }

  bake() {
    if (!this._isBaked) {
      this._needDraw = true;
      RendererConfig.getInstance().renderer.childrenOrderDirty = true;
      this._isBaked = this._cacheDirty = true;
      if (this._updateCache === 0) this._updateCache = 2;

      const children = this._node._children;
      for (let i = 0, len = children.length; i < len; i++)
        children[i]._renderCmd._setCachedParent(this);

      if (!this._bakeSprite) {
        this._bakeSprite = new cc.BakeSprite();
        this._bakeSprite.setAnchorPoint(0, 0);
      }
    }
  }

  unbake() {
    if (this._isBaked) {
      RendererConfig.getInstance().renderer.childrenOrderDirty = true;
      this._needDraw = false;
      this._isBaked = false;
      this._cacheDirty = true;
      if (this._updateCache === 0) this._updateCache = 2;

      const children = this._node._children;
      for (let i = 0, len = children.length; i < len; i++)
        children[i]._renderCmd._setCachedParent(null);
    }
  }

  isBaked() {
    return this._isBaked;
  }

  rendering() {
    if (this._cacheDirty) {
      const node = this._node;
      const children = node._children,
        locBakeSprite = this._bakeSprite;

      this.transform(this.getParentRenderCmd(), true);

      const boundingBox = this._getBoundingBoxForBake();
      boundingBox.width = 0 | (boundingBox.width + 0.5);
      boundingBox.height = 0 | (boundingBox.height + 0.5);

      const bakeContext = locBakeSprite.getCacheContext();
      const ctx = bakeContext.getContext();

      locBakeSprite.setPosition(boundingBox.x, boundingBox.y);

      if (this._updateCache > 0) {
        locBakeSprite.resetCanvasSize(boundingBox.width, boundingBox.height);
        bakeContext.setOffset(
          0 - boundingBox.x,
          ctx.canvas.height - boundingBox.height + boundingBox.y
        );
        node.sortAllChildren();
        const _r = RendererConfig.getInstance().renderer;
        _r._turnToCacheMode(this.__instanceId);
        for (let i = 0, len = children.length; i < len; i++) {
          children[i].visit(this);
        }
        _r._renderingToCacheCanvas(bakeContext, this.__instanceId);
        locBakeSprite.transform();
        this._updateCache--;
      }

      this._cacheDirty = false;
    }
  }

  _bakeForAddChild(child) {
    if (child._parent === this._node && this._isBaked)
      child._renderCmd._setCachedParent(this);
  }

  _getBoundingBoxForBake() {
    let rect = null;
    const node = this._node;

    if (!node._children || node._children.length === 0)
      return new Rect(0, 0, 10, 10);
    const trans = node.getNodeToWorldTransform();

    const locChildren = node._children;
    for (let i = 0, len = locChildren.length; i < len; i++) {
      const child = locChildren[i];
      if (child && child._visible) {
        if (rect) {
          const childRect = child._getBoundingBoxToCurrentNode(trans);
          if (childRect) rect = cc.Rect.union(rect, childRect);
        } else {
          rect = child._getBoundingBoxToCurrentNode(trans);
        }
      }
    }
    return rect;
  }
}

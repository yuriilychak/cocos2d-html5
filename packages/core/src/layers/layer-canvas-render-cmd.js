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

import { CanvasRenderCmd as NodeCanvasRenderCmd } from '../base-nodes/node-canvas-render-cmd';
import { Point } from '../cocoa/geometry/point';
import { Rect } from '../cocoa/geometry/rect';

/**
 * Layer's Canvas render command
 */
export class LayerCanvasRenderCmd extends NodeCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._isBaked = false;
        this._bakeSprite = null;
        this._canUseDirtyRegion = true;
        this._updateCache = 2;
    }

    _setCacheDirty(child) {
        if (child && this._updateCache === 0)
            this._updateCache = 2;
        if (this._cacheDirty === false) {
            this._cacheDirty = true;
            const cachedP = this._cachedParent;
            cachedP && cachedP !== this && cachedP._setNodeDirtyForCache && cachedP._setNodeDirtyForCache();
        }
    }

    updateStatus() {
        const flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.orderDirty) {
            this._cacheDirty = true;
            if (this._updateCache === 0)
                this._updateCache = 2;
            this._dirtyFlag &= ~flags.orderDirty;
        }

        this.originUpdateStatus();
    }

    _syncStatus(parentCmd) {
        const flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (this._isBaked || locFlag & flags.orderDirty) {
            this._cacheDirty = true;
            if (this._updateCache === 0)
                this._updateCache = 2;
            this._dirtyFlag &= ~flags.orderDirty;
        }
        this._originSyncStatus(parentCmd);
    }

    transform(parentCmd, recursive) {
        if (!this._worldTransform) {
            this._worldTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
        }
        const wt = this._worldTransform;
        const a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty;
        this.originTransform(parentCmd, recursive);
        if (( wt.a !== a || wt.b !== b || wt.c !== c || wt.d !== d ) && this._updateCache === 0)
            this._updateCache = 2;
    }

    bake() {
        if (!this._isBaked) {
            this._needDraw = true;
            cc.renderer.childrenOrderDirty = true;
            this._isBaked = this._cacheDirty = true;
            if (this._updateCache === 0)
                this._updateCache = 2;

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
            cc.renderer.childrenOrderDirty = true;
            this._needDraw = false;
            this._isBaked = false;
            this._cacheDirty = true;
            if (this._updateCache === 0)
                this._updateCache = 2;

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
            const children = node._children, locBakeSprite = this._bakeSprite;

            this.transform(this.getParentRenderCmd(), true);

            const boundingBox = this._getBoundingBoxForBake();
            boundingBox.width = 0 | (boundingBox.width + 0.5);
            boundingBox.height = 0 | (boundingBox.height + 0.5);

            const bakeContext = locBakeSprite.getCacheContext();
            const ctx = bakeContext.getContext();

            locBakeSprite.setPosition(boundingBox.x, boundingBox.y);

            if (this._updateCache > 0) {
                locBakeSprite.resetCanvasSize(boundingBox.width, boundingBox.height);
                bakeContext.setOffset(0 - boundingBox.x, ctx.canvas.height - boundingBox.height + boundingBox.y);
                node.sortAllChildren();
                cc.renderer._turnToCacheMode(this.__instanceId);
                for (let i = 0, len = children.length; i < len; i++) {
                    children[i].visit(this);
                }
                cc.renderer._renderingToCacheCanvas(bakeContext, this.__instanceId);
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
                    if (childRect)
                        rect = cc.rectUnion(rect, childRect);
                } else {
                    rect = child._getBoundingBoxToCurrentNode(trans);
                }
            }
        }
        return rect;
    }
}

/**
 * LayerColor's Canvas render command
 */
export class LayerColorCanvasRenderCmd extends LayerCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = true;
        this._blendFuncStr = "source-over";
        this._bakeRenderCmd = new cc.CustomRenderCmd(this, this._bakeRendering);
    }

    unbake() {
        super.unbake();
        this._needDraw = true;
    }

    rendering(ctx, scaleX, scaleY) {
        const wrapper = ctx || cc._renderContext, context = wrapper.getContext(),
            node = this._node,
            curColor = this._displayedColor,
            opacity = this._displayedOpacity / 255,
            locWidth = node._contentSize.width,
            locHeight = node._contentSize.height;

        if (opacity === 0)
            return;

        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(opacity);
        wrapper.setFillStyle("rgba(" + (0 | curColor.r) + "," + (0 | curColor.g) + ","
            + (0 | curColor.b) + ", 1)");

        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        context.fillRect(0, 0, locWidth, -locHeight);

        cc.g_NumberOfDraws++;
    }

    updateBlendFunc(blendFunc) {
        this._blendFuncStr = cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(blendFunc);
    }

    _updateSquareVertices() {}
    _updateSquareVerticesWidth() {}
    _updateSquareVerticesHeight() {}

    _bakeRendering() {
        if (this._cacheDirty) {
            const node = this._node;
            const locBakeSprite = this._bakeSprite, children = node._children;
            let i;
            const len = children.length;

            this.transform(this.getParentRenderCmd(), true);
            const boundingBox = this._getBoundingBoxForBake();
            boundingBox.width = 0 | (boundingBox.width + 0.5);
            boundingBox.height = 0 | (boundingBox.height + 0.5);

            const bakeContext = locBakeSprite.getCacheContext();
            const ctx = bakeContext.getContext();

            locBakeSprite.setPosition(boundingBox.x, boundingBox.y);

            if (this._updateCache > 0) {
                ctx.fillStyle = bakeContext._currentFillStyle;
                locBakeSprite.resetCanvasSize(boundingBox.width, boundingBox.height);
                bakeContext.setOffset(0 - boundingBox.x, ctx.canvas.height - boundingBox.height + boundingBox.y);

                let child;
                cc.renderer._turnToCacheMode(this.__instanceId);
                if (len > 0) {
                    node.sortAllChildren();
                    for (i = 0; i < len; i++) {
                        child = children[i];
                        if (child._localZOrder < 0)
                            child.visit(node);
                        else
                            break;
                    }
                    cc.renderer.pushRenderCommand(this);
                    for (; i < len; i++) {
                        children[i].visit(node);
                    }
                } else
                    cc.renderer.pushRenderCommand(this);
                cc.renderer._renderingToCacheCanvas(bakeContext, this.__instanceId);
                locBakeSprite.transform();
                this._updateCache--;
            }
            this._cacheDirty = false;
        }
    }

    _getBoundingBoxForBake() {
        const node = this._node;
        let rect = new Rect(0, 0, node._contentSize.width, node._contentSize.height);
        const trans = node.getNodeToWorldTransform();
        rect = cc.rectApplyAffineTransform(rect, node.getNodeToWorldTransform());

        if (!node._children || node._children.length === 0)
            return rect;

        const locChildren = node._children;
        for (let i = 0; i < locChildren.length; i++) {
            const child = locChildren[i];
            if (child && child._visible) {
                const childRect = child._getBoundingBoxToCurrentNode(trans);
                rect = cc.rectUnion(rect, childRect);
            }
        }
        return rect;
    }
}

/**
 * LayerGradient's Canvas render command
 */
export class LayerGradientCanvasRenderCmd extends LayerColorCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = true;
        this._startPoint = new Point(0, 0);
        this._endPoint = new Point(0, 0);
        this._startStopStr = null;
        this._endStopStr = null;
    }

    rendering(ctx, scaleX, scaleY) {
        const wrapper = ctx || cc._renderContext, context = wrapper.getContext(),
            node = this._node,
            opacity = this._displayedOpacity / 255;

        if (opacity === 0)
            return;

        const locWidth = node._contentSize.width, locHeight = node._contentSize.height;
        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(opacity);
        const gradient = context.createLinearGradient(this._startPoint.x, this._startPoint.y, this._endPoint.x, this._endPoint.y);

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
        const flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.gradientDirty) {
            this._dirtyFlag |= flags.colorDirty;
            this._dirtyFlag &= ~flags.gradientDirty;
        }

        this.originUpdateStatus();
    }

    _syncStatus(parentCmd) {
        const flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.gradientDirty) {
            this._dirtyFlag |= flags.colorDirty;
            this._dirtyFlag &= ~flags.gradientDirty;
        }

        this._originSyncStatus(parentCmd);
    }

    _updateColor() {
        const node = this._node;
        const contentSize = node._contentSize;
        const tWidth = contentSize.width * 0.5, tHeight = contentSize.height * 0.5;

        const angle = cc.pAngleSigned(new Point(0, -1), node._alongVector);
        const p1 = cc.pRotateByAngle(new Point(0, -1), new Point(0, 0), angle);
        const factor = Math.min(Math.abs(1 / p1.x), Math.abs(1 / p1.y));

        this._startPoint.x = tWidth * (-p1.x * factor) + tWidth;
        this._startPoint.y = tHeight * (p1.y * factor) - tHeight;
        this._endPoint.x = tWidth * (p1.x * factor) + tWidth;
        this._endPoint.y = tHeight * (-p1.y * factor) - tHeight;

        const locStartColor = this._displayedColor, locEndColor = node._endColor;
        const startOpacity = node._startOpacity / 255, endOpacity = node._endOpacity / 255;
        this._startStopStr = "rgba(" + Math.round(locStartColor.r) + "," + Math.round(locStartColor.g) + ","
            + Math.round(locStartColor.b) + "," + startOpacity.toFixed(4) + ")";
        this._endStopStr = "rgba(" + Math.round(locEndColor.r) + "," + Math.round(locEndColor.g) + ","
            + Math.round(locEndColor.b) + "," + endOpacity.toFixed(4) + ")";

        if (node._colorStops) {
            this._startOpacity = 0;
            this._endOpacity = 0;

            this._colorStopsStr = [];
            for (let i = 0; i < node._colorStops.length; i++) {
                const stopColor = node._colorStops[i].color;
                const stopOpacity = stopColor.a == null ? 1 : stopColor.a / 255;
                this._colorStopsStr.push("rgba(" + Math.round(stopColor.r) + "," + Math.round(stopColor.g) + ","
                    + Math.round(stopColor.b) + "," + stopOpacity.toFixed(4) + ")");
            }
        }
    }
}

import { CustomRenderCmd, RendererConfig } from '@aspect/core';
import { ClippingNode } from '@aspect/clipping-nodes';
import { ProtectedNodeCanvasRenderCmd } from '../base-classes/protected-node-canvas-render-cmd';

export class LayoutCanvasRenderCmd extends ProtectedNodeCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = false;

        this._rendererSaveCmd = null;
        this._rendererClipCmd = null;
        this._rendererRestoreCmd = null;
    }

    _onRenderSaveCmd(ctx, scaleX, scaleY) {
        var wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();
        wrapper.save();
        wrapper.save();
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        var buffer = this._node._clippingStencil._renderCmd._buffer;

        for (var i = 0, bufLen = buffer.length; i < bufLen; i++) {
            var element = buffer[i], vertices = element.verts;
            var firstPoint = vertices[0];
            context.beginPath();
            context.moveTo(firstPoint.x, -firstPoint.y);
            for (var j = 1, len = vertices.length; j < len; j++)
                context.lineTo(vertices[j].x, -vertices[j].y);
            context.closePath();
        }
    }

    _onRenderClipCmd(ctx) {
        var wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();
        wrapper.restore();
        context.clip();
    }

    _onRenderRestoreCmd(ctx) {
        var wrapper = ctx || RendererConfig.getInstance().renderContext;
        wrapper.restore();
    }

    rebindStencilRendering(stencil) {
        stencil._renderCmd.rendering = this.__stencilDraw;
        stencil._renderCmd._canUseDirtyRegion = true;
    }

    __stencilDraw(ctx, scaleX, scaleY) {
        //do nothing, rendering in layout
    }

    stencilClippingVisit(parentCmd) {
        var node = this._node;
        if (!node._clippingStencil || !node._clippingStencil.isVisible())
            return;

        if (!this._rendererSaveCmd) {
            this._rendererSaveCmd = new CustomRenderCmd(this, this._onRenderSaveCmd);
            this._rendererClipCmd = new CustomRenderCmd(this, this._onRenderClipCmd);
            this._rendererRestoreCmd = new CustomRenderCmd(this, this._onRenderRestoreCmd);
        }

        RendererConfig.getInstance().renderer.pushRenderCommand(this._rendererSaveCmd);
        node._clippingStencil.visit(this);

        RendererConfig.getInstance().renderer.pushRenderCommand(this._rendererClipCmd);
    }

    postStencilVisit() {
        RendererConfig.getInstance().renderer.pushRenderCommand(this._rendererRestoreCmd);
    }
}

// scissorClippingVisit is the same as stencilClippingVisit for canvas
LayoutCanvasRenderCmd.prototype.scissorClippingVisit = LayoutCanvasRenderCmd.prototype.stencilClippingVisit;
LayoutCanvasRenderCmd.prototype.postScissorVisit = LayoutCanvasRenderCmd.prototype.postStencilVisit;

LayoutCanvasRenderCmd._getSharedCache = function () {
    return (ClippingNode._sharedCache) || (ClippingNode._sharedCache = document.createElement("canvas"));
};

import { CustomRenderCmd, RendererConfig } from '@aspect/core';
import { ClippingNode } from '@aspect/clipping-nodes';
import { ProtectedNodeWebGLRenderCmd } from '../base-classes/protected-node-webgl-render-cmd';

export class LayoutWebGLRenderCmd extends ProtectedNodeWebGLRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = false;

        this._currentStencilEnabled = 0;
        this._scissorOldState = false;
        this._clippingOldRect = null;

        this._mask_layer_le = 0;

        this._beforeVisitCmdStencil = null;
        this._afterDrawStencilCmd = null;
        this._afterVisitCmdStencil = null;
        this._beforeVisitCmdScissor = null;
        this._afterVisitCmdScissor = null;
    }

    _syncStatus(parentCmd) {
        this._originSyncStatus(parentCmd);

        if (parentCmd && (parentCmd._dirtyFlag & cc.Node._dirtyFlags.transformDirty))
            this._node._clippingRectDirty = true;
    }

    _onBeforeVisitStencil(ctx) {
        var gl = ctx || RendererConfig.getInstance().renderContext;

        LayoutWebGLRenderCmd._layer++;

        var mask_layer = 0x1 << LayoutWebGLRenderCmd._layer;
        var mask_layer_l = mask_layer - 1;
        this._mask_layer_le = mask_layer | mask_layer_l;

        this._currentStencilEnabled = gl.isEnabled(gl.STENCIL_TEST);

        gl.clear(gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.STENCIL_TEST);

        gl.depthMask(false);

        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);

        gl.stencilMask(mask_layer);
        gl.clear(gl.STENCIL_BUFFER_BIT);
    }

    _onAfterDrawStencil(ctx) {
        var gl = ctx || RendererConfig.getInstance().renderContext;
        gl.depthMask(true);
        gl.stencilFunc(gl.EQUAL, this._mask_layer_le, this._mask_layer_le);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    }

    _onAfterVisitStencil(ctx) {
        var gl = ctx || RendererConfig.getInstance().renderContext;

        LayoutWebGLRenderCmd._layer--;

        if (this._currentStencilEnabled) {
            var mask_layer = 0x1 << LayoutWebGLRenderCmd._layer;
            var mask_layer_l = mask_layer - 1;
            var mask_layer_le = mask_layer | mask_layer_l;

            gl.stencilMask(mask_layer);
            gl.stencilFunc(gl.EQUAL, mask_layer_le, mask_layer_le);
        }
        else {
            gl.disable(gl.STENCIL_TEST);
        }
    }

    _onBeforeVisitScissor(ctx) {
        this._node._clippingRectDirty = true;
        var clippingRect = this._node._getClippingRect();
        var gl = ctx || RendererConfig.getInstance().renderContext;

        this._scissorOldState = gl.isEnabled(gl.SCISSOR_TEST);

        if (!this._scissorOldState) {
            gl.enable(gl.SCISSOR_TEST);
            cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
        }
        else {
            this._clippingOldRect = cc.view.getScissorRect();
            if (!cc.Rect.equalTo(this._clippingOldRect, clippingRect))
                cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
        }
    }

    _onAfterVisitScissor(ctx) {
        var gl = ctx || RendererConfig.getInstance().renderContext;
        if (this._scissorOldState) {
            if (!cc.Rect.equalTo(this._clippingOldRect, this._node._clippingRect)) {
                cc.view.setScissorInPoints(this._clippingOldRect.x,
                    this._clippingOldRect.y,
                    this._clippingOldRect.width,
                    this._clippingOldRect.height);
            }
        }
        else {
            gl.disable(gl.SCISSOR_TEST);
        }
    }

    rebindStencilRendering(stencil) {
    }

    transform(parentCmd, recursive) {
        var node = this._node;
        super.transform(parentCmd, recursive);
        if (node._clippingStencil)
            node._clippingStencil._renderCmd.transform(this, recursive);
    }

    stencilClippingVisit(parentCmd) {
        var node = this._node;
        if (!node._clippingStencil || !node._clippingStencil.isVisible())
            return;

        if (LayoutWebGLRenderCmd._layer + 1 === ClippingNode.stencilBits) {
            LayoutWebGLRenderCmd._visit_once = true;
            if (LayoutWebGLRenderCmd._visit_once) {
                cc.log("Nesting more than " + ClippingNode.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its childs.");
                LayoutWebGLRenderCmd._visit_once = false;
            }
            return;
        }

        if (!this._beforeVisitCmdStencil) {
            this._beforeVisitCmdStencil = new CustomRenderCmd(this, this._onBeforeVisitStencil);
            this._afterDrawStencilCmd = new CustomRenderCmd(this, this._onAfterDrawStencil);
            this._afterVisitCmdStencil = new CustomRenderCmd(this, this._onAfterVisitStencil);
        }

        RendererConfig.getInstance().renderer.pushRenderCommand(this._beforeVisitCmdStencil);

        node._clippingStencil.visit(node);

        RendererConfig.getInstance().renderer.pushRenderCommand(this._afterDrawStencilCmd);
    }

    postStencilVisit() {
        RendererConfig.getInstance().renderer.pushRenderCommand(this._afterVisitCmdStencil);
    }

    scissorClippingVisit(parentCmd) {
        if (!this._beforeVisitCmdScissor) {
            this._beforeVisitCmdScissor = new CustomRenderCmd(this, this._onBeforeVisitScissor);
            this._afterVisitCmdScissor = new CustomRenderCmd(this, this._onAfterVisitScissor);
        }
        RendererConfig.getInstance().renderer.pushRenderCommand(this._beforeVisitCmdScissor);
    }

    postScissorVisit() {
        RendererConfig.getInstance().renderer.pushRenderCommand(this._afterVisitCmdScissor);
    }
}

LayoutWebGLRenderCmd._layer = -1;
LayoutWebGLRenderCmd._visit_once = null;

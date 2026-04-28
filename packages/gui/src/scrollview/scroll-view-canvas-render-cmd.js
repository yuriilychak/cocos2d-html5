import { Layer, CustomRenderCmd, RendererConfig } from "@aspect/core";

export class GuiScrollViewCanvasRenderCmd extends Layer.CanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = false;

        this.startCmd = new CustomRenderCmd(this, this._startCmd);
        this.startCmd._canUseDirtyRegion = true;
        this.endCmd = new CustomRenderCmd(this, this._endCmd);
        this.endCmd._canUseDirtyRegion = true;
    }

    _startCmd(ctx, scaleX, scaleY) {
        var node = this._node;
        var wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();
        wrapper.save();

        if (node._clippingToBounds) {
            this._scissorRestored = false;
            wrapper.setTransform(this._worldTransform, scaleX, scaleY);

            var locScaleX = node.getScaleX(), locScaleY = node.getScaleY();
            var getWidth = (node._viewSize.width * locScaleX);
            var getHeight = (node._viewSize.height * locScaleY);

            context.beginPath();
            context.rect(0, 0, getWidth, -getHeight);
            context.closePath();
            context.clip();
        }
    }

    _endCmd(wrapper) {
        wrapper = wrapper || RendererConfig.getInstance().renderContext;
        wrapper.restore();
    }
}

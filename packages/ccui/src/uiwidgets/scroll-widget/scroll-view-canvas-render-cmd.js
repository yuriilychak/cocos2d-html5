import { RendererConfig } from '@aspect/core';
import { LayoutCanvasRenderCmd } from '../../layouts/layout-canvas-render-cmd';

export class ScrollViewCanvasRenderCmd extends LayoutCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._dirty = false;
    }

    rendering(ctx) {
        var currentID = this._node.__instanceId;
        var i, locCmds = RendererConfig.getInstance().renderer._cacheToCanvasCmds[currentID], len,
            scaleX = cc.view.getScaleX(),
            scaleY = cc.view.getScaleY();
        var context = ctx || RendererConfig.getInstance().renderContext;
        context.computeRealOffsetY();

        this._node.updateChildren();

        for (i = 0, len = locCmds.length; i < len; i++) {
            var checkNode = locCmds[i]._node;
            // Skip the ScrollView node itself to avoid recursive rendering
            if (checkNode && checkNode._className === 'ScrollView')
                continue;
            if (checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;
            locCmds[i].rendering(context, scaleX, scaleY);
        }
    }
}

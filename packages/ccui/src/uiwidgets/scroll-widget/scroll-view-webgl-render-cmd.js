import { RendererConfig } from '@aspect/core';
import { LayoutWebGLRenderCmd } from '../../layouts/layout-webgl-render-cmd';

export class ScrollViewWebGLRenderCmd extends LayoutWebGLRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = true;
        this._dirty = false;
    }

    rendering(ctx) {
        var renderer = RendererConfig.getInstance().renderer;
        var currentID = this._node.__instanceId,
            locCmds = renderer._cacheToBufferCmds[currentID],
            i, len, checkNode, cmd,
            context = ctx || RendererConfig.getInstance().renderContext;
        if (!locCmds) {
            return;
        }

        this._node.updateChildren();

        context.bindBuffer(context.ARRAY_BUFFER, null);

        for (i = 0, len = locCmds.length; i < len; i++) {
            cmd = locCmds[i];
            checkNode = cmd._node;
            if (checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;

            if (cmd.uploadData) {
                renderer._uploadBufferData(cmd);
            }
            else {
                if (cmd._batchingSize > 0) {
                    renderer._batchRendering();
                }
                cmd.rendering(context);
            }
            renderer._batchRendering();
        }
    }
}

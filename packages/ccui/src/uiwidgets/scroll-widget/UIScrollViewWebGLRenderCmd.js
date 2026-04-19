(function () {
    if (!ccui.ProtectedNode.WebGLRenderCmd)
        return;
    ccui.ScrollView.WebGLRenderCmd = class extends ccui.Layout.WebGLRenderCmd {
        constructor(renderable) {
            super(renderable);
            this._needDraw = true;
            this._dirty = false;
        }

        rendering(ctx) {
            var currentID = this._node.__instanceId,
                locCmds = cc.renderer._cacheToBufferCmds[currentID],
                i, len, checkNode, cmd,
                context = ctx || cc._renderContext;
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
                    cc.renderer._uploadBufferData(cmd);
                }
                else {
                    if (cmd._batchingSize > 0) {
                        cc.renderer._batchRendering();
                    }
                    cmd.rendering(context);
                }
                cc.renderer._batchRendering();
            }
        }
    };
})();

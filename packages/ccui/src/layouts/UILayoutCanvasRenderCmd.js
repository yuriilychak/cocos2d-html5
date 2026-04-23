/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
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

(function () {
    ccui.Layout.CanvasRenderCmd = class extends ccui.ProtectedNode.CanvasRenderCmd {
        constructor(renderable) {
            super(renderable);
            this._needDraw = false;

            this._rendererSaveCmd = null;
            this._rendererClipCmd = null;
            this._rendererRestoreCmd = null;
        }

        _onRenderSaveCmd(ctx, scaleX, scaleY) {
            var wrapper = ctx || cc.rendererConfig.renderContext, context = wrapper.getContext();
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
            var wrapper = ctx || cc.rendererConfig.renderContext, context = wrapper.getContext();
            wrapper.restore();
            context.clip();
        }

        _onRenderRestoreCmd(ctx) {
            var wrapper = ctx || cc.rendererConfig.renderContext, context = wrapper.getContext();
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
                this._rendererSaveCmd = new cc.CustomRenderCmd(this, this._onRenderSaveCmd);
                this._rendererClipCmd = new cc.CustomRenderCmd(this, this._onRenderClipCmd);
                this._rendererRestoreCmd = new cc.CustomRenderCmd(this, this._onRenderRestoreCmd);
            }

            cc.rendererConfig.renderer.pushRenderCommand(this._rendererSaveCmd);
            node._clippingStencil.visit(this);

            cc.rendererConfig.renderer.pushRenderCommand(this._rendererClipCmd);
        }

        postStencilVisit() {
            cc.rendererConfig.renderer.pushRenderCommand(this._rendererRestoreCmd);
        }
    };

    // scissorClippingVisit is the same as stencilClippingVisit for canvas
    var canvasProto = ccui.Layout.CanvasRenderCmd.prototype;
    canvasProto.scissorClippingVisit = canvasProto.stencilClippingVisit;
    canvasProto.postScissorVisit = canvasProto.postStencilVisit;

    ccui.Layout.CanvasRenderCmd._getSharedCache = function () {
        return (cc.ClippingNode._sharedCache) || (cc.ClippingNode._sharedCache = document.createElement("canvas"));
    };
})();

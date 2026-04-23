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

(function () {
    cc.RenderTexture.CanvasRenderCmd = class CanvasRenderCmd extends cc.Node.CanvasRenderCmd {
        constructor(renderableObject) {
            super(renderableObject);
            this._needDraw = false;
            this._clearColorStr = "rgba(255,255,255,1)";

            this._cacheCanvas = document.createElement('canvas');
            this._cacheContext = new cc.CanvasContextWrapper(this._cacheCanvas.getContext('2d'));
        }

        cleanup() {
            this._cacheContext = null;
            this._cacheCanvas = null;
        }

        clearStencil(stencilValue) {
        }

        setVirtualViewport(rtBegin, fullRect, fullViewport) {
        }

        updateClearColor(clearColor) {
            this._clearColorStr = "rgba(" + (0 | clearColor.r) + "," + (0 | clearColor.g) + "," + (0 | clearColor.b) + "," + clearColor.a / 255 + ")";
        }

        initWithWidthAndHeight(width, height, format, depthStencilFormat) {
            const node = this._node;
            const locCacheCanvas = this._cacheCanvas, locScaleFactor = cc.contentScaleFactor();
            locCacheCanvas.width = 0 | (width * locScaleFactor);
            locCacheCanvas.height = 0 | (height * locScaleFactor);

            const texture = new cc.Texture2D();
            texture.initWithElement(locCacheCanvas);
            texture.handleLoadedTexture();

            const locSprite = node.sprite = new cc.Sprite(texture);
            locSprite.setBlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
            // Disabled by default.
            node.autoDraw = false;
            // add sprite for backward compatibility
            node.addChild(locSprite);
            return true;
        }

        begin() {
        }

        _beginWithClear(r, g, b, a, depthValue, stencilValue, flags) {
            r = r || 0;
            g = g || 0;
            b = b || 0;
            a = isNaN(a) ? 255 : a;

            const context = this._cacheContext.getContext();
            const locCanvas = this._cacheCanvas;
            context.setTransform(1, 0, 0, 1, 0, 0);
            this._cacheContext.setFillStyle("rgba(" + (0 | r) + "," + (0 | g) + "," + (0 | b) + "," + a / 255 + ")");
            context.clearRect(0, 0, locCanvas.width, locCanvas.height);
            context.fillRect(0, 0, locCanvas.width, locCanvas.height);
        }

        end() {
            const node = this._node;

            const scale = cc.contentScaleFactor();
            cc.rendererConfig.renderer._renderingToCacheCanvas(this._cacheContext, node.__instanceId, scale, scale);
            const spriteRenderCmd = node.sprite._renderCmd;
            spriteRenderCmd._notifyRegionStatus && spriteRenderCmd._notifyRegionStatus(cc.Node.CanvasRenderCmd.RegionStatus.Dirty);
        }

        clearRect(x, y, width, height) {
            this._cacheContext.clearRect(x, y, width, -height);
        }

        clearDepth(depthValue) {
            cc.log("clearDepth isn't supported on Cocos2d-Html5");
        }
    };
})();

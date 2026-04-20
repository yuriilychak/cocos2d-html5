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
import { Rect } from '../cocoa/geometry/rect';
import { error, _LogInfos } from '../boot/debugger';

export class SpriteCanvasRenderCmd extends NodeCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = true;
        this._textureCoord = {
            renderX: 0,
            renderY: 0,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            validRect: false
        };
        this._blendFuncStr = "source-over";
        this._colorized = false;
        this._canUseDirtyRegion = true;
        this._textureToRender = null;
    }

    setDirtyRecursively(value) {
    }

    _setTexture(texture) {
        const node = this._node;
        if (node._texture !== texture) {
            node._textureLoaded = texture ? texture._textureLoaded : false;
            node._texture = texture;
            this._updateColor();
        }
    }

    _setColorDirty() {
        this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty);
    }

    isFrameDisplayed(frame) {
        const node = this._node;
        if (frame.getTexture() !== node._texture)
            return false;
        return cc.rectEqualToRect(frame.getRect(), node._rect);
    }

    updateBlendFunc(blendFunc) {
        this._blendFuncStr = cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(blendFunc);
    }

    _setBatchNodeForAddChild(child) {
        return true;
    }

    _handleTextureForRotatedTexture(texture, rect, rotated, counterclockwise) {
        if (rotated && texture.isLoaded()) {
            let tempElement = texture.getHtmlElementObj();
            tempElement = SpriteCanvasRenderCmd._cutRotateImageToCanvas(tempElement, rect, counterclockwise);
            const tempTexture = new cc.Texture2D();
            tempTexture.initWithElement(tempElement);
            tempTexture.handleLoadedTexture();
            texture = tempTexture;
            rect.x = rect.y = 0;
            this._node._rect = new Rect(0, 0, rect.width, rect.height);
        }
        return texture;
    }

    _checkTextureBoundary(texture, rect, rotated) {
        if (texture && texture.url) {
            const _x = rect.x + rect.width, _y = rect.y + rect.height;
            if (_x > texture.width)
                error(_LogInfos.RectWidth, texture.url);
            if (_y > texture.height)
                error(_LogInfos.RectHeight, texture.url);
        }
    }

    rendering(ctx, scaleX, scaleY) {
        const node = this._node;
        const locTextureCoord = this._textureCoord, alpha = (this._displayedOpacity / 255);
        const texture = this._textureToRender || node._texture;

        if ((texture && (locTextureCoord.width === 0 || locTextureCoord.height === 0 || !texture._textureLoaded)) || alpha === 0)
            return;

        const wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        let locX = node._offsetPosition.x;
        const locHeight = node._rect.height, locWidth = node._rect.width;
        let locY = -node._offsetPosition.y - locHeight, image;

        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(alpha);

        if (node._flippedX || node._flippedY)
            wrapper.save();
        if (node._flippedX) {
            locX = -locX - locWidth;
            context.scale(-1, 1);
        }
        if (node._flippedY) {
            locY = node._offsetPosition.y;
            context.scale(1, -1);
        }

        let sx, sy, sw, sh, x, y, w, h;
        if (this._colorized) {
            sx = 0;
            sy = 0;
        } else {
            sx = locTextureCoord.renderX;
            sy = locTextureCoord.renderY;
        }
        sw = locTextureCoord.width;
        sh = locTextureCoord.height;

        x = locX;
        y = locY;
        w = locWidth;
        h = locHeight;

        if (texture && texture._htmlElementObj) {
            image = texture._htmlElementObj;
            if (texture._pattern !== "") {
                wrapper.setFillStyle(context.createPattern(image, texture._pattern));
                context.fillRect(x, y, w, h);
            } else {
                context.drawImage(image,
                    sx, sy, sw, sh,
                    x, y, w, h);
            }
        } else {
            const contentSize = node._contentSize;
            if (locTextureCoord.validRect) {
                const curColor = this._displayedColor;
                wrapper.setFillStyle("rgba(" + curColor.r + "," + curColor.g + "," + curColor.b + ",1)");
                context.fillRect(x, y, contentSize.width * scaleX, contentSize.height * scaleY);
            }
        }
        if (node._flippedX || node._flippedY)
            wrapper.restore();
        cc.g_NumberOfDraws++;
    }

    _updateColor() {
        const node = this._node;

        const texture = node._texture, rect = this._textureCoord;
        const dColor = this._displayedColor;

        if (texture) {
            if (dColor.r !== 255 || dColor.g !== 255 || dColor.b !== 255) {
                this._textureToRender = texture._generateColorTexture(dColor.r, dColor.g, dColor.b, rect);
                this._colorized = true;
            } else if (texture) {
                this._textureToRender = texture;
                this._colorized = false;
            }
        }
    }

    _textureLoadedCallback(sender) {
        const node = this;
        if (node._textureLoaded)
            return;

        node._textureLoaded = true;
        let locRect = node._rect;
        const locRenderCmd = this._renderCmd;
        if (!locRect) {
            locRect = new Rect(0, 0, sender.width, sender.height);
        } else if (cc._rectEqualToZero(locRect)) {
            locRect.width = sender.width;
            locRect.height = sender.height;
        }

        node.texture = sender;
        node.setTextureRect(locRect, node._rectRotated);

        //set the texture's color after the it loaded
        const locColor = locRenderCmd._displayedColor;
        if (locColor.r !== 255 || locColor.g !== 255 || locColor.b !== 255)
            locRenderCmd._updateColor();

        // by default use "Self Render".
        // if the sprite is added to a batchnode, then it will automatically switch to "batchnode Render"
        node.setBatchNode(node._batchNode);
        node.dispatchEvent("load");
    }

    _setTextureCoords(rect, needConvert) {
        if (needConvert === undefined)
            needConvert = true;
        const locTextureRect = this._textureCoord,
            scaleFactor = needConvert ? cc.contentScaleFactor() : 1;
        locTextureRect.renderX = locTextureRect.x = 0 | (rect.x * scaleFactor);
        locTextureRect.renderY = locTextureRect.y = 0 | (rect.y * scaleFactor);
        locTextureRect.width = 0 | (rect.width * scaleFactor);
        locTextureRect.height = 0 | (rect.height * scaleFactor);
        locTextureRect.validRect = !(locTextureRect.width === 0 || locTextureRect.height === 0 || locTextureRect.x < 0 || locTextureRect.y < 0);
    }
}

SpriteCanvasRenderCmd._cutRotateImageToCanvas = function (texture, rect, counterclockwise) {
    if (!texture)
        return null;

    if (!rect)
        return texture;

    counterclockwise = counterclockwise == null ? true : counterclockwise;

    const nCanvas = document.createElement("canvas");
    nCanvas.width = rect.width;
    nCanvas.height = rect.height;
    const ctx = nCanvas.getContext("2d");
    ctx.translate(nCanvas.width / 2, nCanvas.height / 2);
    if (counterclockwise)
        ctx.rotate(-1.5707963267948966);
    else
        ctx.rotate(1.5707963267948966);
    ctx.drawImage(texture, rect.x, rect.y, rect.height, rect.width, -rect.height / 2, -rect.width / 2, rect.height, rect.width);
    return nCanvas;
};



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

import { LabelTTF } from './label-ttf';
import { SpriteCanvasRenderCmd } from '../sprites/sprite-canvas-render-cmd';

export const _textAlign = ["left", "center", "right"];
export const _textBaseline = ["top", "middle", "bottom"];

//check the first character
export let wrapInspection = true;

// These regular expressions consider a word any sequence of characters
// from these Unicode (sub)blocks:
// - Basic Latin (letters and numbers, plus the hypen-minus '-')
// - Latin-1 Supplement (accentuated letters and ¿¡ only)
// - Latin Extended-A (complete)
// - Latin Extended-B (complete)
// - IPA Extensions (complete)
// - Spacing Modifier Letters (complete)
// - Combining Diacritical Marks (Combining Grapheme Joiner excluded)
// - Greek and Coptic (complete, including reserved code points)
// - Cyrillic (complete)
// - Cyrillic Supplement (complete)
// - General Punctuation (Non-Breaking Hyphen* [U+2011] and quotation marks)
// * Note that Hyphen [U+2010] is considered a word boundary.
export const _wordRex = /([a-zA-Z0-9\-¿¡«À-ÖØ-öø-ʯ\u0300-\u034e\u0350-\u036FͰ-ԯ\u2011‵-‷‹⁅]+|\S)/;
export const _symbolRex = /^[!,.:;}\]%\?>、'"》»？。，！\u2010′-‴›‼⁆⁇-⁉]/;
export const _lastWordRex = /([a-zA-Z0-9\-¿¡«À-ÖØ-öø-ʯ\u0300-\u034e\u0350-\u036FͰ-ԯ\u2011‵-‷‹⁅]+|\S)$/;
export const _lastEnglish = /[a-zA-Z0-9\-¿¡«À-ÖØ-öø-ʯ\u0300-\u034e\u0350-\u036FͰ-ԯ\u2011‵-‷‹⁅]+$/;
export const _firsrEnglish = /^[a-zA-Z0-9\-¿¡«À-ÖØ-öø-ʯ\u0300-\u034e\u0350-\u036FͰ-ԯ\u2011‵-‷‹⁅]/;

const localBB = new cc.Rect();

// Mixin that adds label text rendering properties and methods to any RenderCmd base.
export const LabelRenderMixin = (Base) => class extends Base {
    constructor(renderable) {
        super(renderable);
        this._fontClientHeight = 18;
        this._fontStyleStr = "";
        this._shadowColorStr = "rgba(128, 128, 128, 0.5)";
        this._strokeColorStr = "";
        this._fillColorStr = "rgba(255,255,255,1)";

        this._labelCanvas = null;
        this._labelContext = null;
        this._lineWidths = [];
        this._strings = [];
        this._isMultiLine = false;
        this._status = [];
        this._renderingIndex = 0;

        this._canUseDirtyRegion = true;
    }

    _setFontStyle(fontNameOrFontDef, fontSize, fontStyle, fontWeight) {
        if (fontNameOrFontDef instanceof cc.FontDefinition) {
            this._fontStyleStr = fontNameOrFontDef._getCanvasFontStr();
            this._fontClientHeight = LabelTTF.__getFontHeightByDiv(fontNameOrFontDef);
        } else {
            const deviceFontSize = fontSize * cc.view.getDevicePixelRatio();
            this._fontStyleStr = fontStyle + " " + fontWeight + " " + deviceFontSize + "px '" + fontNameOrFontDef + "'";
            this._fontClientHeight = LabelTTF.__getFontHeightByDiv(fontNameOrFontDef, fontSize);
        }
    }

    _getFontStyle() {
        return this._fontStyleStr;
    }

    _getFontClientHeight() {
        return this._fontClientHeight;
    }

    _updateColor() {
        this._setColorsString();
        this._updateTexture();
    }

    _setColorsString() {
        const locDisplayColor = this._displayedColor, node = this._node,
            locShadowColor = node._shadowColor || this._displayedColor;
        const locStrokeColor = node._strokeColor, locFontFillColor = node._textFillColor;
        const dr = locDisplayColor.r / 255, dg = locDisplayColor.g / 255, db = locDisplayColor.b / 255;

        this._shadowColorStr = "rgba(" + (0 | (dr * locShadowColor.r)) + "," + (0 | ( dg * locShadowColor.g)) + ","
            + (0 | (db * locShadowColor.b)) + "," + node._shadowOpacity + ")";
        this._fillColorStr = "rgba(" + (0 | (dr * locFontFillColor.r)) + "," + (0 | (dg * locFontFillColor.g)) + ","
            + (0 | (db * locFontFillColor.b)) + ", 1)";
        this._strokeColorStr = "rgba(" + (0 | (dr * locStrokeColor.r)) + "," + (0 | (dg * locStrokeColor.g)) + ","
            + (0 | (db * locStrokeColor.b)) + ", 1)";
    }

    getLocalBB() {
        const node = this._node;
        localBB.x = localBB.y = 0;
        const pixelRatio = cc.view.getDevicePixelRatio();
        localBB.width = node._getWidth() * pixelRatio;
        localBB.height = node._getHeight() * pixelRatio;
        return localBB;
    }

    _updateTTF() {
        const node = this._node;
        const pixelRatio = cc.view.getDevicePixelRatio();
        const locDimensionsWidth = node._dimensions.width * pixelRatio;
        let i, strLength;
        const locLineWidth = this._lineWidths;
        locLineWidth.length = 0;

        this._isMultiLine = false;
        this._measureConfig();
        const textWidthCache = {};
        if (locDimensionsWidth !== 0) {
            // Content processing
            this._strings = node._string.split('\n');

            for (i = 0; i < this._strings.length; i++) {
                this._checkWarp(this._strings, i, locDimensionsWidth);
            }
        } else {
            this._strings = node._string.split('\n');
            for (i = 0, strLength = this._strings.length; i < strLength; i++) {
                if(this._strings[i]) {
                    const measuredWidth = this._measure(this._strings[i]);
                    locLineWidth.push(measuredWidth);
                    textWidthCache[this._strings[i]] = measuredWidth;
                } else {
                    locLineWidth.push(0);
                }
            }
        }

        if (this._strings.length > 1)
            this._isMultiLine = true;

        let locSize, locStrokeShadowOffsetX = 0, locStrokeShadowOffsetY = 0;
        if (node._strokeEnabled)
            locStrokeShadowOffsetX = locStrokeShadowOffsetY = node._strokeSize * 2;
        if (node._shadowEnabled) {
            const locOffsetSize = node._shadowOffset;
            locStrokeShadowOffsetX += Math.abs(locOffsetSize.x) * 2;
            locStrokeShadowOffsetY += Math.abs(locOffsetSize.y) * 2;
        }

        //get offset for stroke and shadow
        if (locDimensionsWidth === 0) {
            if (this._isMultiLine) {
                locSize = cc.size(Math.ceil(Math.max.apply(Math, locLineWidth) + locStrokeShadowOffsetX),
                                  Math.ceil((this._fontClientHeight * pixelRatio * this._strings.length) + locStrokeShadowOffsetY));
            }
            else {
                let measuredWidth = textWidthCache[node._string];
                if(!measuredWidth && node._string) {
                    measuredWidth = this._measure(node._string);
                }
                locSize = cc.size(Math.ceil((measuredWidth ? measuredWidth : 0) + locStrokeShadowOffsetX),
                                  Math.ceil(this._fontClientHeight * pixelRatio + locStrokeShadowOffsetY));
            }
        } else {
            if (node._dimensions.height === 0) {
                if (this._isMultiLine)
                    locSize = cc.size(
                        Math.ceil(locDimensionsWidth + locStrokeShadowOffsetX),
                        Math.ceil((node.getLineHeight() * pixelRatio * this._strings.length) + locStrokeShadowOffsetY));
                else
                    locSize = cc.size(
                        Math.ceil(locDimensionsWidth + locStrokeShadowOffsetX),
                        Math.ceil(node.getLineHeight() * pixelRatio + locStrokeShadowOffsetY));
            } else {
                //dimension is already set, contentSize must be same as dimension
                locSize = cc.size(
                    Math.ceil(locDimensionsWidth + locStrokeShadowOffsetX),
                    Math.ceil(node._dimensions.height * pixelRatio + locStrokeShadowOffsetY));
            }
        }
        if (node._getFontStyle() !== "normal") {    //add width for 'italic' and 'oblique'
            locSize.width = Math.ceil(locSize.width + node._fontSize * 0.3);
        }
        node.setContentSize(locSize);
        node._strokeShadowOffsetX = locStrokeShadowOffsetX;
        node._strokeShadowOffsetY = locStrokeShadowOffsetY;

        // need computing _anchorPointInPoints
        const locAP = node._anchorPoint;
        this._anchorPointInPoints.x = (locStrokeShadowOffsetX * 0.5) + ((locSize.width - locStrokeShadowOffsetX) * locAP.x);
        this._anchorPointInPoints.y = (locStrokeShadowOffsetY * 0.5) + ((locSize.height - locStrokeShadowOffsetY) * locAP.y);
    }

    _saveStatus() {
        const node = this._node;
        const scale = cc.view.getDevicePixelRatio();
        const locStrokeShadowOffsetX = node._strokeShadowOffsetX, locStrokeShadowOffsetY = node._strokeShadowOffsetY;
        const locContentSizeHeight = node._contentSize.height - locStrokeShadowOffsetY, locVAlignment = node._vAlignment,
            locHAlignment = node._hAlignment;
        const dx = locStrokeShadowOffsetX * 0.5,
            dy = locContentSizeHeight + locStrokeShadowOffsetY * 0.5;
        let xOffset = 0, yOffset = 0;
        const OffsetYArray = [];
        const locContentWidth = node._contentSize.width - locStrokeShadowOffsetX;

        //lineHeight
        const lineHeight = node.getLineHeight() * scale;
        const transformTop = (lineHeight - this._fontClientHeight * scale) / 2;

        if (locHAlignment === cc.TEXT_ALIGNMENT_RIGHT)
            xOffset += locContentWidth;
        else if (locHAlignment === cc.TEXT_ALIGNMENT_CENTER)
            xOffset += locContentWidth / 2;
        else
            xOffset += 0;

        if (this._isMultiLine) {
            const locStrLen = this._strings.length;
            if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
                yOffset = lineHeight - transformTop * 2 + locContentSizeHeight - lineHeight * locStrLen;
            else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                yOffset = (lineHeight - transformTop * 2) / 2 + (locContentSizeHeight - lineHeight * locStrLen) / 2;

            for (let i = 0; i < locStrLen; i++) {
                const tmpOffsetY = -locContentSizeHeight + (lineHeight * i + transformTop) + yOffset;
                OffsetYArray.push(tmpOffsetY);
            }
        } else {
            if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
                //do nothing
            } else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
                yOffset -= locContentSizeHeight;
            } else {
                yOffset -= locContentSizeHeight * 0.5;
            }
            OffsetYArray.push(yOffset);
        }
        const tmpStatus = {
            contextTransform: cc.p(dx, dy),
            xOffset: xOffset,
            OffsetYArray: OffsetYArray
        };
        this._status.push(tmpStatus);
    }

    _drawTTFInCanvas(context) {
        if (!context)
            return;
        const locStatus = this._status.pop();
        context.setTransform(1, 0, 0, 1, locStatus.contextTransform.x, locStatus.contextTransform.y);
        const xOffset = locStatus.xOffset;
        const yOffsetArray = locStatus.OffsetYArray;
        this.drawLabels(context, xOffset, yOffsetArray);
    }

    _checkWarp(strArr, i, maxWidth) {
        const text = strArr[i];
        const allWidth = this._measure(text);
        if (allWidth > maxWidth && text.length > 1) {

            let fuzzyLen = text.length * ( maxWidth / allWidth ) | 0;
            let tmpText = text.substr(fuzzyLen);
            let width = allWidth - this._measure(tmpText);
            let sLine;
            let pushNum = 0;

            //Increased while cycle maximum ceiling. default 100 time
            let checkWhile = 0;

            //Exceeded the size
            while (width > maxWidth && checkWhile++ < 100) {
                fuzzyLen *= maxWidth / width;
                fuzzyLen = fuzzyLen | 0;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - this._measure(tmpText);
            }

            checkWhile = 0;

            //Find the truncation point
            while (width < maxWidth && checkWhile++ < 100) {
                if (tmpText) {
                    const exec = _wordRex.exec(tmpText);
                    pushNum = exec ? exec[0].length : 1;
                    sLine = tmpText;
                }

                fuzzyLen = fuzzyLen + pushNum;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - this._measure(tmpText);
            }

            fuzzyLen -= pushNum;
            if (fuzzyLen === 0) {
                fuzzyLen = 1;
                sLine = sLine.substr(1);
            }

            let sText = text.substr(0, fuzzyLen), result;

            //symbol in the first
            if (cc.LabelTTF.wrapInspection) {
                if (_symbolRex.test(sLine || tmpText)) {
                    result = _lastWordRex.exec(sText);
                    fuzzyLen -= result ? result[0].length : 0;
                    if (fuzzyLen === 0) fuzzyLen = 1;

                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }

            //To judge whether a English words are truncated
            if (_firsrEnglish.test(sLine)) {
                result = _lastEnglish.exec(sText);
                if (result && sText !== result[0]) {
                    fuzzyLen -= result[0].length;
                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }

            strArr[i] = sLine || tmpText;
            strArr.splice(i, 0, sText);
        }
    }

    updateStatus() {
        const flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;

        if (locFlag & flags.textDirty)
            this._updateTexture();

        this.originUpdateStatus();
    }

    _syncStatus(parentCmd) {
        const flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;

        if (locFlag & flags.textDirty)
            this._updateTexture();

        this._originSyncStatus(parentCmd);

        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL || locFlag & flags.transformDirty)
            this.transform(parentCmd);
    }

    drawLabels(context, xOffset, yOffsetArray) {
        const node = this._node;
        //shadow style setup
        if (node._shadowEnabled) {
            const locShadowOffset = node._shadowOffset;
            context.shadowColor = this._shadowColorStr;
            context.shadowOffsetX = locShadowOffset.x;
            context.shadowOffsetY = -locShadowOffset.y;
            context.shadowBlur = node._shadowBlur;
        }

        const locHAlignment = node._hAlignment,
            locVAlignment = node._vAlignment,
            locStrokeSize = node._strokeSize;

        //this is fillText for canvas
        if (context.font !== this._fontStyleStr)
            context.font = this._fontStyleStr;
        context.fillStyle = this._fillColorStr;

        //stroke style setup
        const locStrokeEnabled = node._strokeEnabled;
        if (locStrokeEnabled) {
            context.lineWidth = locStrokeSize * 2;
            context.strokeStyle = this._strokeColorStr;
        }

        context.textBaseline = _textBaseline[locVAlignment];
        context.textAlign = _textAlign[locHAlignment];

        const locStrLen = this._strings.length;
        for (let i = 0; i < locStrLen; i++) {
            const line = this._strings[i];
            if (locStrokeEnabled) {
                context.lineJoin = 'round';
                context.strokeText(line, xOffset, yOffsetArray[i]);
            }
            context.fillText(line, xOffset, yOffsetArray[i]);
        }
        cc.g_NumberOfDraws++;
    }
};

// Mixin that adds off-screen canvas caching on top of LabelRenderMixin.
export const CacheLabelRenderMixin = (Base) => class extends LabelRenderMixin(Base) {
    constructor(renderable) {
        super(renderable);
        const locCanvas = this._labelCanvas = document.createElement("canvas");
        locCanvas.width = 1;
        locCanvas.height = 1;
        this._labelContext = locCanvas.getContext("2d");
    }

    _updateTexture() {
        this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.textDirty ^ this._dirtyFlag;
        const node = this._node;
        node._needUpdateTexture = false;
        const locContentSize = node._contentSize;
        this._updateTTF();
        const width = locContentSize.width, height = locContentSize.height;

        const locContext = this._labelContext, locLabelCanvas = this._labelCanvas;

        if (!node._texture) {
            const labelTexture = new cc.Texture2D();
            labelTexture.initWithElement(this._labelCanvas);
            node.setTexture(labelTexture);
        }

        if (node._string.length === 0) {
            locLabelCanvas.width = 1;
            locLabelCanvas.height = locContentSize.height || 1;
            if (node._texture) {
                node._texture._htmlElementObj = this._labelCanvas;
                node._texture.handleLoadedTexture();
            }
            node.setTextureRect(cc.rect(0, 0, 1, locContentSize.height));
            return true;
        }

        //set size for labelCanvas
        locContext.font = this._fontStyleStr;

        const flag = locLabelCanvas.width === width && locLabelCanvas.height === height;
        locLabelCanvas.width = width;
        locLabelCanvas.height = height;
        if (flag) locContext.clearRect(0, 0, width, height);
        this._saveStatus();
        this._drawTTFInCanvas(locContext);
        if (node._texture) {
            node._texture._htmlElementObj = this._labelCanvas;
            node._texture.handleLoadedTexture();
        }
        node.setTextureRect(cc.rect(0, 0, width, height));
        return true;
    }

    _measureConfig() {
        this._labelContext.font = this._fontStyleStr;
    }

    _measure(text) {
        if (text) {
            return this._labelContext.measureText(text).width;
        } else {
            return 0;
        }
    }
};

export class CacheCanvasRenderCmd extends CacheLabelRenderMixin(SpriteCanvasRenderCmd) {}

export class CanvasRenderCmd extends LabelRenderMixin(SpriteCanvasRenderCmd) {
    _measureConfig() {}

    _measure(text) {
        if(text) {
            const context = cc._renderContext.getContext();
            context.font = this._fontStyleStr;
            return context.measureText(text).width;
        } else {
            return 0;
        }
    }

    _updateTexture() {
        this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.textDirty ^ this._dirtyFlag;
        const node = this._node;
        const locContentSize = node._contentSize;
        this._updateTTF();
        const width = locContentSize.width, height = locContentSize.height;
        if (node._string.length === 0) {
            node.setTextureRect(cc.rect(0, 0, 1, locContentSize.height));
            return true;
        }
        this._saveStatus();
        node.setTextureRect(cc.rect(0, 0, width, height));
        return true;
    }

    rendering(ctx) {
        const scaleX = cc.view.getScaleX(),
            scaleY = cc.view.getScaleY();
        const wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (!context)
            return;
        const node = this._node;
        wrapper.computeRealOffsetY();
        if (this._status.length <= 0)
            return;
        const locIndex = (this._renderingIndex >= this._status.length) ? this._renderingIndex - this._status.length : this._renderingIndex;
        const status = this._status[locIndex];
        this._renderingIndex = locIndex + 1;

        const locHeight = node._rect.height;
        let locX = node._offsetPosition.x;
        let locY = -node._offsetPosition.y - locHeight;

        const alpha = (this._displayedOpacity / 255);

        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(alpha);

        wrapper.save();

        if (node._flippedX) {
            locX = -locX - node._rect.width;
            context.scale(-1, 1);
        }
        if (node._flippedY) {
            locY = node._offsetPosition.y;
            context.scale(1, -1);
        }

        const xOffset = status.xOffset + status.contextTransform.x + locX * scaleX;
        const yOffsetArray = [];

        const locStrLen = this._strings.length;
        for (let i = 0; i < locStrLen; i++)
            yOffsetArray.push(status.OffsetYArray[i] + status.contextTransform.y + locY * scaleY);

        this.drawLabels(context, xOffset, yOffsetArray);
        wrapper.restore();
    }
}

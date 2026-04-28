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

import { Rect, Size, Sprite } from '@aspect/core';
import { Widget } from '../base-classes/widget';
import { Scale9Sprite } from '../base-classes/scale9-sprite';

export class LoadingBar extends Widget {

    constructor(textureName, percentage) {
        super();
        this._direction = LoadingBar.TYPE_LEFT;
        this._barRendererTextureSize = new Size(0, 0);
        this._capInsets = new Rect(0, 0, 0, 0);

        this._percent = 100;
        this._totalLength = 0;
        this._renderBarTexType = Widget.LOCAL_TEXTURE;
        this._scale9Enabled = false;
        this._prevIgnoreSize = true;
        this._textureFile = "";
        this._isTextureLoaded = false;
        this._className = "LoadingBar";
        this._barRendererAdaptDirty = true;
        if (textureName !== undefined)
            this.loadTexture(textureName);
        if (percentage !== undefined)
            this.setPercent(percentage);
    }

    get direction() { return this.getDirection(); }
    set direction(v) { this.setDirection(v); }

    get percent() { return this.getPercent(); }
    set percent(v) { this.setPercent(v); }


    _initRenderer() {
        this._barRenderer = new Sprite();
        this.addProtectedChild(this._barRenderer, LoadingBar.RENDERER_ZORDER, -1);
        this._barRenderer.setAnchorPoint(0.0, 0.5);
    }

    setDirection(dir) {
        if (this._direction === dir)
            return;
        this._direction = dir;
        switch (this._direction) {
            case LoadingBar.TYPE_LEFT:
                this._barRenderer.setAnchorPoint(0, 0.5);
                this._barRenderer.setPosition(0, this._contentSize.height * 0.5);
                if (!this._scale9Enabled)
                    this._barRenderer.setFlippedX(false);

                break;
            case LoadingBar.TYPE_RIGHT:
                this._barRenderer.setAnchorPoint(1, 0.5);
                this._barRenderer.setPosition(this._totalLength, this._contentSize.height * 0.5);
                if (!this._scale9Enabled)
                    this._barRenderer.setFlippedX(true);

                break;
        }
    }

    getDirection() {
        return this._direction;
    }

    loadTexture(texture, texType) {
        if (!texture)
            return;
        texType = texType || Widget.LOCAL_TEXTURE;
        this._renderBarTexType = texType;
        this._textureFile = texture;
        var barRenderer = this._barRenderer;

        var self = this;
        if (!barRenderer._textureLoaded) {
            barRenderer.addEventListener("load", function () {
                self.loadTexture(self._textureFile, self._renderBarTexType);
                self._setPercent(self._percent);
            });
        }

        switch (this._renderBarTexType) {
            case Widget.LOCAL_TEXTURE:
                barRenderer.initWithFile(texture);
                break;
            case Widget.PLIST_TEXTURE:
                barRenderer.initWithSpriteFrameName(texture);
                break;
            default:
                break;
        }

        var bz = barRenderer.getContentSize();
        this._barRendererTextureSize.width = bz.width;
        this._barRendererTextureSize.height = bz.height;

        switch (this._direction) {
            case LoadingBar.TYPE_LEFT:
                barRenderer.setAnchorPoint(0, 0.5);
                if (!this._scale9Enabled)
                    barRenderer.setFlippedX(false);
                break;
            case LoadingBar.TYPE_RIGHT:
                barRenderer.setAnchorPoint(1, 0.5);
                if (!this._scale9Enabled)
                    barRenderer.setFlippedX(true);
                break;
        }
        if (this._scale9Enabled)
            barRenderer.setCapInsets(this._capInsets);

        this._updateChildrenDisplayedRGBA();
        this._barRendererScaleChangedWithSize();
        this._updateContentSizeWithTextureSize(this._barRendererTextureSize);
        this._barRendererAdaptDirty = true;
        this._findLayout();
    }

    setScale9Enabled(enabled) {
        if (this._scale9Enabled === enabled)
            return;
        this._scale9Enabled = enabled;
        this.removeProtectedChild(this._barRenderer);

        this._barRenderer = this._scale9Enabled ? new Scale9Sprite() : new Sprite();

        this.loadTexture(this._textureFile, this._renderBarTexType);
        this.addProtectedChild(this._barRenderer, LoadingBar.RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsets(this._capInsets);
        this.setPercent(this._percent);
        this._barRendererAdaptDirty = true;
    }

    isScale9Enabled() {
        return this._scale9Enabled;
    }

    setCapInsets(capInsets) {
        if (!capInsets)
            return;
        var locInsets = this._capInsets;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;

        if (this._scale9Enabled)
            this._barRenderer.setCapInsets(capInsets);
    }

    getCapInsets() {
        return new Rect(this._capInsets);
    }

    setPercent(percent) {
        if (percent > 100)
            percent = 100;
        if (percent < 0)
            percent = 0;
        if (percent === this._percent)
            return;
        this._percent = percent;
        this._setPercent(percent);
    }

    _setPercent() {
        var res, rect, spriteRenderer, spriteTextureRect;

        if (this._totalLength <= 0)
            return;
        res = this._percent / 100.0;

        if (this._scale9Enabled)
            this._setScale9Scale();
        else {
            spriteRenderer = this._barRenderer;
            spriteTextureRect = this._barRendererTextureSize;
            rect = spriteRenderer.getTextureRect();
            rect.width = spriteTextureRect.width * res;
            spriteRenderer.setTextureRect(
                new Rect(
                    rect.x,
                    rect.y,
                    spriteTextureRect.width * res,
                    spriteTextureRect.height
                ),
                spriteRenderer._rectRotated
            );
        }
    }

    setContentSize(contentSize, height) {
        super.setContentSize(contentSize, height);
        this._totalLength = (height === undefined) ? contentSize.width : contentSize;
    }

    getPercent() {
        return this._percent;
    }

    _onSizeChanged() {
        super._onSizeChanged();
        this._barRendererAdaptDirty = true;
    }

    _adaptRenderers() {
        if (this._barRendererAdaptDirty) {
            this._barRendererScaleChangedWithSize();
            this._barRendererAdaptDirty = false;
        }
    }

    ignoreContentAdaptWithSize(ignore) {
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            super.ignoreContentAdaptWithSize(ignore);
            this._prevIgnoreSize = ignore;
        }
    }

    getVirtualRendererSize() {
        return new Size(this._barRendererTextureSize);
    }

    getVirtualRenderer() {
        return this._barRenderer;
    }

    _barRendererScaleChangedWithSize() {
        var locBarRender = this._barRenderer, locContentSize = this._contentSize;
        if(this._unifySize){
            this._totalLength = this._contentSize.width;
            this.setPercent(this._percent);
        }else if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                this._totalLength = this._barRendererTextureSize.width;
                locBarRender.setScale(1.0);
            }
        } else {
            this._totalLength = locContentSize.width;
            if (this._scale9Enabled) {
                this._setScale9Scale();
                locBarRender.setScale(1.0);
            } else {
                var textureSize = this._barRendererTextureSize;
                if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                    locBarRender.setScale(1.0);
                    return;
                }
                var scaleX = locContentSize.width / textureSize.width;
                var scaleY = locContentSize.height / textureSize.height;
                locBarRender.setScaleX(scaleX);
                locBarRender.setScaleY(scaleY);
            }
        }
        switch (this._direction) {
            case LoadingBar.TYPE_LEFT:
                locBarRender.setPosition(0, locContentSize.height * 0.5);
                break;
            case LoadingBar.TYPE_RIGHT:
                locBarRender.setPosition(this._totalLength, locContentSize.height * 0.5);
                break;
            default:
                break;
        }
    }

    _setScale9Scale() {
        var width = (this._percent) / 100 * this._totalLength;
        this._barRenderer.setPreferredSize(new Size(width, this._contentSize.height));
    }

    getDescription() {
        return "LoadingBar";
    }

    _createCloneInstance() {
        return new LoadingBar();
    }

    _copySpecialProperties(loadingBar) {
        if (loadingBar instanceof LoadingBar) {
            this._prevIgnoreSize = loadingBar._prevIgnoreSize;
            this.setScale9Enabled(loadingBar._scale9Enabled);
            this.loadTexture(loadingBar._textureFile, loadingBar._renderBarTexType);
            this.setCapInsets(loadingBar._capInsets);
            this.setPercent(loadingBar._percent);
            this.setDirection(loadingBar._direction);
        }
    }

}

LoadingBar.TYPE_LEFT = 0;
LoadingBar.TYPE_RIGHT = 1;
LoadingBar.RENDERER_ZORDER = -1;

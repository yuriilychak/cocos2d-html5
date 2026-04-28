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

import { Widget } from '../base-classes/widget';
import { Scale9Sprite } from '../base-classes/scale9-sprite';

/**
 * The ImageView control of Cocos GUI
 */
export class ImageView extends Widget {

    constructor(imageFileName, texType) {
        super();
        this._capInsets = new cc.Rect(0,0,0,0);
        this._imageTextureSize = new cc.Size(this._capInsets.width, this._capInsets.height);
        this._scale9Enabled = false;
        this._prevIgnoreSize = true;
        this._textureFile = "";
        this._imageTexType = Widget.LOCAL_TEXTURE;
        this._className = "ImageView";
        this._imageRendererAdaptDirty = true;
        texType = texType === undefined ? 0 : texType;

        if(imageFileName) {
            this.loadTexture(imageFileName, texType);
        }
        else {
            this._imageTexType = Widget.LOCAL_TEXTURE;
        }
    }

    _initRenderer() {
        this._imageRenderer = new Scale9Sprite();
        this._imageRenderer.setRenderingType(Scale9Sprite.RenderingType.SIMPLE);
        this.addProtectedChild(this._imageRenderer, ImageView.RENDERER_ZORDER, -1);
    }

    loadTexture(fileName, texType) {
        if (!fileName || (this._textureFile == fileName && this._imageTexType == texType)) {
            return;
        }
        var self = this;
        texType = texType || Widget.LOCAL_TEXTURE;
        this._textureFile = fileName;
        this._imageTexType = texType;
        var imageRenderer = self._imageRenderer;

        switch (self._imageTexType) {
            case Widget.LOCAL_TEXTURE:
                if(self._scale9Enabled){
                    imageRenderer.initWithFile(fileName);
                    imageRenderer.setCapInsets(self._capInsets);
                }else{
                    imageRenderer.initWithFile(fileName);
                }
                break;
            case Widget.PLIST_TEXTURE:
                if(self._scale9Enabled){
                    imageRenderer.initWithSpriteFrameName(fileName);
                    imageRenderer.setCapInsets(self._capInsets);
                }else{
                    imageRenderer.initWithSpriteFrameName(fileName);
                }
                break;
            default:
                break;
        }

        if(!imageRenderer._textureLoaded){
            var handleTextureLoadedEvent = function(){
                imageRenderer.removeEventListener("load", handleTextureLoadedEvent);

                if(!self._ignoreSize && cc.Size.equalTo(self._customSize, new cc.Size(0, 0))) {
                    self._customSize = self._imageRenderer.getContentSize();
                }

                self._imageTextureSize = imageRenderer.getContentSize();

                self._updateChildrenDisplayedRGBA();

                self._updateContentSizeWithTextureSize(self._imageTextureSize);
            };

            imageRenderer.addEventListener("load", handleTextureLoadedEvent);
        }

        if(!this._ignoreSize && cc.Size.equalTo(this._customSize, new cc.Size(0, 0))) {
            this._customSize = this._imageRenderer.getContentSize();
        }

        self._imageTextureSize = imageRenderer.getContentSize();

        this._updateChildrenDisplayedRGBA();

        self._updateContentSizeWithTextureSize(self._imageTextureSize);
        self._imageRendererAdaptDirty = true;
        self._findLayout();

    }

    setTextureRect() {
        cc.warn('ImageView.setTextureRect  is deprecated!');
    }

    setScale9Enabled(able) {
        if (this._scale9Enabled === able)
            return;

        this._scale9Enabled = able;

        if (this._scale9Enabled) {
            this._imageRenderer.setRenderingType(Scale9Sprite.RenderingType.SLICED);
        } else {
            this._imageRenderer.setRenderingType(Scale9Sprite.RenderingType.SIMPLE);
        }

        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsets(this._capInsets);
        this._imageRendererAdaptDirty = true;
    }

    isScale9Enabled(){
        return this._scale9Enabled;
    }

    ignoreContentAdaptWithSize(ignore) {
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            super.ignoreContentAdaptWithSize(ignore);
            this._prevIgnoreSize = ignore;
        }
    }

    setCapInsets(capInsets) {
        if(!capInsets) return;

        var locInsets = this._capInsets;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;

        if (!this._scale9Enabled) return;
        this._imageRenderer.setCapInsets(capInsets);
    }

    getCapInsets(){
        return new cc.Rect(this._capInsets);
    }

    _onSizeChanged() {
        super._onSizeChanged();
        this._imageRendererAdaptDirty = true;
    }

    _adaptRenderers(){
        if (this._imageRendererAdaptDirty){
            this._imageTextureScaleChangedWithSize();
            this._imageRendererAdaptDirty = false;
        }
    }

    getVirtualRendererSize(){
        return new cc.Size(this._imageTextureSize);
    }

    getVirtualRenderer() {
        return this._imageRenderer;
    }

    _imageTextureScaleChangedWithSize() {
        this._imageRenderer.setContentSize(this._contentSize);
        this._imageRenderer.setPosition(this._contentSize.width / 2.0, this._contentSize.height / 2.0);
    }

    getDescription() {
        return "ImageView";
    }

    _createCloneInstance(){
        return new ImageView();
    }

    _copySpecialProperties(imageView) {
        if(imageView instanceof ImageView){
            this._prevIgnoreSize = imageView._prevIgnoreSize;
            this._capInsets = imageView._capInsets;
            this.loadTexture(imageView._textureFile, imageView._imageTexType);
            this.setScale9Enabled(imageView._scale9Enabled);
        }
    }

    setContentSize(contentSize, height){
        if (height) {
            contentSize = new cc.Size(contentSize, height);
        }

        super.setContentSize(contentSize);
        this._imageRenderer.setContentSize(contentSize);
    }

}

ImageView.RENDERER_ZORDER = -1;

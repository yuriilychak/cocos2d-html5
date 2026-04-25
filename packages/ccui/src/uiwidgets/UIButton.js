/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2015-2016 zilongshanren

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

/**
 * The button controls of Cocos UI.
 *
 * @property {String}   titleText               - The content string of the button title
 * @property {String}   titleFont               - The content string font of the button title
 * @property {Number}   titleFontSize           - The content string font size of the button title
 * @property {String}   titleFontName           - The content string font name of the button title
 * @property {cc.Color} titleColor          - The content string font color of the button title
 * @property {Boolean}  pressedActionEnabled    - Indicate whether button has zoom effect when clicked
 */
ccui.Button = class Button extends ccui.Widget {











    /**
     * Allocates and initializes a UIButton.
     * Constructor of ccui.Button. override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @param {String} normalImage
     * @param {String} [selectedImage=""]
     * @param {String} [disableImage=""]
     * @param {Number} [texType=ccui.Widget.LOCAL_TEXTURE]
     * @example
     * // example
     * var uiButton = new ccui.Button();
     */
    constructor(normalImage, selectedImage, disableImage, texType) {
        super();
        this._capInsetsNormal = new cc.Rect(0, 0, 0, 0);
        this._normalTextureSize = new cc.Size(0, 0);
        this._buttonNormalSpriteFrame = null;
        this._buttonClickedSpriteFrame = null;
        this._buttonDisableSpriteFrame = null;
        this._titleRenderer = null;
        this._normalFileName = "";
        this._clickedFileName = "";
        this._disabledFileName = "";
        this._prevIgnoreSize = true;
        this._scale9Enabled = false;
        this._normalTexType = ccui.Widget.LOCAL_TEXTURE;
        this._pressedTexType = ccui.Widget.LOCAL_TEXTURE;
        this._disabledTexType = ccui.Widget.LOCAL_TEXTURE;
        this.pressedActionEnabled = false;
        this._titleColor = null;
        this._zoomScale = 0.1;
        this._normalTextureLoaded = false;
        this._pressedTextureLoaded = false;
        this._disabledTextureLoaded = false;
        this._className = "Button";
        this._normalTextureAdaptDirty = true;
        this._fontName = "Thonburi";
        this._fontSize = 12;
        this._type = 0;
        this.setTouchEnabled(true);

        this._normalLoader = new cc.Sprite.LoadManager();
        this._clickedLoader = new cc.Sprite.LoadManager();
        this._disabledLoader = new cc.Sprite.LoadManager();

        if (normalImage) {
            this.loadTextures(normalImage, selectedImage,disableImage, texType);
        }
    }

    get titleText() { return this.getTitleText(); }
    set titleText(v) { this.setTitleText(v); }

    get titleFont() { return this._getTitleFont(); }
    set titleFont(v) { this._setTitleFont(v); }

    get titleFontSize() { return this.getTitleFontSize(); }
    set titleFontSize(v) { this.setTitleFontSize(v); }

    get titleFontName() { return this.getTitleFontName(); }
    set titleFontName(v) { this.setTitleFontName(v); }

    get titleColor() { return this.getTitleColor(); }
    set titleColor(v) { this.setTitleColor(v); }


    _createTitleRendererIfNeeded( ) {
        if(!this._titleRenderer) {
            this._titleRenderer = new cc.LabelTTF("");
            this._titleRenderer.setAnchorPoint(0.5, 0.5);
            this._titleColor = cc.color.WHITE;
            this._titleRenderer.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.addProtectedChild(this._titleRenderer, ccui.Button.TITLE_RENDERER_ZORDER, -1);
        }
    }

    _initRenderer() {
        this._buttonScale9Renderer = new ccui.Scale9Sprite();

        this._buttonScale9Renderer.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);

        this.addProtectedChild(this._buttonScale9Renderer, ccui.Button.DISABLED_RENDERER_ZORDER, -1);
    }

    /**
     * Sets if button is using scale9 renderer.
     * @param {Boolean} able true that using scale9 renderer, false otherwise.
     */
    setScale9Enabled(able) {
        if (this._scale9Enabled === able)
            return;

        this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
        this._scale9Enabled = able;

        if (this._scale9Enabled) {
            this._buttonScale9Renderer.setRenderingType(ccui.Scale9Sprite.RenderingType.SLICED);
        } else {
            this._buttonScale9Renderer.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);
        }

        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else {
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        }
        this.setCapInsets(this._capInsetsNormal);

        this.setBright(this._bright);

        this._normalTextureAdaptDirty = true;
    }

    /**
     *  Returns button is using scale9 renderer or not.
     * @returns {Boolean}
     */
    isScale9Enabled() {
        return this._scale9Enabled;
    }

    /**
     * Sets whether ignore the widget size
     * @param {Boolean} ignore true that widget will ignore it's size, use texture size, false otherwise. Default value is true.
     * @override
     */
    ignoreContentAdaptWithSize(ignore) {
        if(this._unifySize){
            this._updateContentSize();
            return;
        }
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            super.ignoreContentAdaptWithSize(ignore);
            this._prevIgnoreSize = ignore;
        }
    }

    /**
     * Returns the renderer size.
     * @returns {cc.Size}
     */
    getVirtualRendererSize(){
        if (this._unifySize)
            return this._getNormalSize();

        if (!this._normalTextureLoaded ) {
            if(this._titleRenderer && this._titleRenderer.getString().length > 0) {
                return this._titleRenderer.getContentSize();
            }
        }
        return new cc.Size(this._normalTextureSize);
    }

    /**
     * Load textures for button.
     * @param {String} normal normal state of texture's filename.
     * @param {String} selected  selected state of texture's filename.
     * @param {String} disabled  disabled state of texture's filename.
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextures(normal, selected, disabled, texType) {
        this.loadTextureNormal(normal, texType);
        this.loadTexturePressed(selected, texType);
        this.loadTextureDisabled(disabled, texType);
    }

    _createSpriteFrameWithFile(file) {
        var texture = cc.textureCache.getTextureForKey(file);
        if (!texture) {
            texture = cc.textureCache.addImage(file);
        }
        if(!texture._textureLoaded) {
            return texture;
        }

        var textureSize = texture.getContentSize();
        var rect = new cc.Rect(0, 0, textureSize.width, textureSize.height);
        return new cc.SpriteFrame(texture, rect);
    }

    _createSpriteFrameWithName(name) {
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        if (frame == null) {
            cc.log("ccui.Scale9Sprite.initWithSpriteFrameName(): can't find the sprite frame by spriteFrameName");
            return null;
        }

        return frame;
    }

    /**
     * Load normal state texture for button.
     * @param {String} normal normal state of texture's filename.
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureNormal(normal, texType) {
        if (!normal) return;

        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._normalFileName = normal;
        this._normalTexType = texType;

        var normalSpriteFrame;
        switch (this._normalTexType){
            case ccui.Widget.LOCAL_TEXTURE:
              normalSpriteFrame = this._createSpriteFrameWithFile(normal);
              break;
            case ccui.Widget.PLIST_TEXTURE:
              if (normal[0] === "#") {
                  normal = normal.substr(1, normal.length - 1);
              }
              normalSpriteFrame = this._createSpriteFrameWithName(normal);
              break;
          default:
              break;
        }

        if(!normalSpriteFrame) {
            return;
        }

        if(!normalSpriteFrame._textureLoaded) {
            this._normalLoader.clear();
            this._normalLoader.once(normalSpriteFrame, function () {
                this.loadTextureNormal(this._normalFileName, this._normalTexType);
            }, this);
            return;
        }

        this._normalTextureLoaded = normalSpriteFrame._textureLoaded;
        this._buttonNormalSpriteFrame = normalSpriteFrame;
        this._buttonScale9Renderer.setSpriteFrame(normalSpriteFrame);
        if (this._scale9Enabled){
            this._buttonScale9Renderer.setCapInsets(this._capInsetsNormal);
        }

        // FIXME: https://github.com/cocos2d/cocos2d-x/issues/12249
        if(!this._ignoreSize &&  cc.Size.equalTo(this._customSize, new cc.Size(0, 0))) {
            this._customSize = this._buttonScale9Renderer.getContentSize();
        }

        this._normalTextureSize = this._buttonScale9Renderer.getContentSize();
        this._updateChildrenDisplayedRGBA();
        if (this._unifySize){
            if (this._scale9Enabled){
                this._buttonScale9Renderer.setCapInsets(this._capInsetsNormal);
                this._updateContentSizeWithTextureSize(this._getNormalSize());
            }
        }else {
            this._updateContentSizeWithTextureSize(this._normalTextureSize);
        }

        this._normalTextureAdaptDirty = true;
        this._findLayout();
    }

    /**
     * Load selected state texture for button.
     * @param {String} selected selected state of texture's filename.
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTexturePressed(selected, texType) {
        if (!selected)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._clickedFileName = selected;
        this._pressedTexType = texType;

        var clickedSpriteFrame;
        switch (this._pressedTexType) {
          case ccui.Widget.LOCAL_TEXTURE:
              clickedSpriteFrame = this._createSpriteFrameWithFile(selected);
              break;
          case ccui.Widget.PLIST_TEXTURE:
              if (selected[0] === "#") {
                  selected = selected.substr(1, selected.length - 1);
              }
              clickedSpriteFrame = this._createSpriteFrameWithName(selected);
              break;
          default:
              break;
        }

        if(!clickedSpriteFrame) return;

        if(!clickedSpriteFrame._textureLoaded) {
            this._clickedLoader.clear();
            this._clickedLoader.once(clickedSpriteFrame, function () {
                this.loadTexturePressed(this._clickedFileName, this._pressedTexType);
            }, this);
            return;
        }

        this._buttonClickedSpriteFrame = clickedSpriteFrame;
        this._updateChildrenDisplayedRGBA();

        this._pressedTextureLoaded = true;
    }

    /**
     * Load dark state texture for button.
     * @param {String} disabled disabled state of texture's filename.
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureDisabled(disabled, texType) {
        if (!disabled)
            return;

        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._disabledFileName = disabled;
        this._disabledTexType = texType;

        var disabledSpriteframe;
        switch (this._disabledTexType) {
          case ccui.Widget.LOCAL_TEXTURE:
              disabledSpriteframe = this._createSpriteFrameWithFile(disabled);
              break;
          case ccui.Widget.PLIST_TEXTURE:
              if (disabled[0] === "#") {
                  disabled = disabled.substr(1, disabled.length - 1);
              }
              disabledSpriteframe = this._createSpriteFrameWithName(disabled);
              break;
          default:
              break;
        }

        if(!disabledSpriteframe) return;

        if(!disabledSpriteframe._textureLoaded) {
            this._disabledLoader.clear();
            this._disabledLoader.once(disabledSpriteframe, function () {
                this.loadTextureDisabled(this._disabledFileName, this._disabledTexType);
            }, this);
            return;
        }

        this._buttonDisableSpriteFrame = disabledSpriteframe;
        this._updateChildrenDisplayedRGBA();

        this._disabledTextureLoaded = true;
        this._findLayout();
    }

    /**
     * Sets capinsets for button, if button is using scale9 renderer.
     * @param {cc.Rect} capInsets
     */
    setCapInsets(capInsets) {
        this.setCapInsetsNormalRenderer(capInsets);
    }

    /**
     * Sets capinsets for button, if button is using scale9 renderer.
     * @param {cc.Rect} capInsets
     */
    setCapInsetsNormalRenderer(capInsets) {
        if(!capInsets || !this._scale9Enabled)
            return;

        var x = capInsets.x, y = capInsets.y;
        var width = capInsets.width, height = capInsets.height;
        if (this._normalTextureSize.width < width){
            x = 0;
            width = 0;
        }
        if (this._normalTextureSize.height < height){
            y = 0;
            height = 0;
        }

        var locInsets = this._capInsetsNormal;
        locInsets.x = x;
        locInsets.y = y;
        locInsets.width = width;
        locInsets.height = height;

        this._capInsetsNormal = locInsets;
        this._buttonScale9Renderer.setCapInsets(locInsets);
    }

    /**
     *  Returns normal renderer cap insets.
     * @returns {cc.Rect}
     */
    getCapInsetsNormalRenderer(){
        return new cc.Rect(this._capInsetsNormal);
    }

    /**
     * Sets capinsets for button, if button is using scale9 renderer.
     * @param {cc.Rect} capInsets
     */
    setCapInsetsPressedRenderer(capInsets) {
        this.setCapInsetsNormalRenderer(capInsets);
    }

    /**
     *  Returns pressed renderer cap insets.
     * @returns {cc.Rect}
     */
    getCapInsetsPressedRenderer() {
        return new cc.Rect(this._capInsetsNormal);
    }

    /**
     * Sets capinsets for button, if button is using scale9 renderer.
     * @param {cc.Rect} capInsets
     */
    setCapInsetsDisabledRenderer(capInsets) {
        this.setCapInsetsNormalRenderer(capInsets);
    }

    /**
     * Returns disable renderer cap insets.
     * @returns {cc.Rect}
     */
    getCapInsetsDisabledRenderer() {
        return new cc.Rect(this._capInsetsNormal);
    }

    _onPressStateChangedToNormal() {
        this._buttonScale9Renderer.setSpriteFrame(this._buttonNormalSpriteFrame);

        this._buttonScale9Renderer.setState( ccui.Scale9Sprite.state.NORMAL);

        if (this._pressedTextureLoaded) {
            if (this.pressedActionEnabled){
                this._buttonScale9Renderer.stopAllActions();
                this._buttonScale9Renderer.setScale(1.0);

                if(this._titleRenderer) {
                    this._titleRenderer.stopAllActions();

                    if (this._unifySize){
                        var zoomTitleAction = new cc.ScaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1, 1);
                        this._titleRenderer.runAction(zoomTitleAction);
                    }else{
                        this._titleRenderer.setScaleX(1);
                        this._titleRenderer.setScaleY(1);
                    }
                }

            }
        } else {
            this._buttonScale9Renderer.stopAllActions();
            this._buttonScale9Renderer.setScale(1.0);

            if (this._scale9Enabled) {
                this._buttonScale9Renderer.setColor(cc.color.WHITE);
            }

            if(this._titleRenderer) {
                this._titleRenderer.stopAllActions();

                this._titleRenderer.setScaleX(1);
                this._titleRenderer.setScaleY(1);
            }
        }
    }

    _onPressStateChangedToPressed() {
        this._buttonScale9Renderer.setState(ccui.Scale9Sprite.state.NORMAL);

        if (this._pressedTextureLoaded) {
            this._buttonScale9Renderer.setSpriteFrame(this._buttonClickedSpriteFrame);

            if (this.pressedActionEnabled) {
                this._buttonScale9Renderer.stopAllActions();

                var zoomAction = new cc.ScaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP,
                                            1.0 + this._zoomScale,
                                            1.0 + this._zoomScale);
                this._buttonScale9Renderer.runAction(zoomAction);

                if(this._titleRenderer) {
                    this._titleRenderer.stopAllActions();
                    this._titleRenderer.runAction(new cc.ScaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP,
                                                             1 + this._zoomScale,
                                                             1 + this._zoomScale));
                }
            }
        } else {
            this._buttonScale9Renderer.setSpriteFrame(this._buttonClickedSpriteFrame);

            this._buttonScale9Renderer.stopAllActions();
            this._buttonScale9Renderer.setScale(1.0 + this._zoomScale, 1.0 + this._zoomScale);

            if (this._titleRenderer) {
                this._titleRenderer.stopAllActions();
                this._titleRenderer.setScaleX(1 + this._zoomScale);
                this._titleRenderer.setScaleY(1 + this._zoomScale);
            }
        }
    }

    _onPressStateChangedToDisabled() {
        //if disable resource is null
        if (!this._disabledTextureLoaded){
            if (this._normalTextureLoaded) {
                this._buttonScale9Renderer.setState(ccui.Scale9Sprite.state.GRAY);
            }
        }else{
            this._buttonScale9Renderer.setSpriteFrame(this._buttonDisableSpriteFrame);
        }

        this._buttonScale9Renderer.setScale(1.0);
    }

    _updateContentSize(){
        if (this._unifySize){
            if (this._scale9Enabled)
                ccui.ProtectedNode.setContentSize(this._customSize);
            else{
                var s = this._getNormalSize();
                ccui.ProtectedNode.setContentSize(s);
            }
            this._onSizeChanged();
            return;
        }

        if (this._ignoreSize)
            this.setContentSize(this.getVirtualRendererSize());
    }

    _onSizeChanged() {
        super._onSizeChanged();
        if(this._titleRenderer) {
            this._updateTitleLocation();
        }
        this._normalTextureAdaptDirty = true;
    }

    /**
     * Gets the Virtual Renderer of widget.
     * @returns {cc.Node}
     */
    getVirtualRenderer() {
        return this._buttonScale9Renderer;
    }

    _normalTextureScaleChangedWithSize() {
        this._buttonScale9Renderer.setContentSize(this._contentSize);
        this._buttonScale9Renderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    }

    _adaptRenderers(){
        if (this._normalTextureAdaptDirty) {
            this._normalTextureScaleChangedWithSize();
            this._normalTextureAdaptDirty = false;
        }
    }

    _updateTitleLocation(){
        this._titleRenderer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
    }

    /**
     * Changes if button can be clicked zoom effect.
     * @param {Boolean} enabled
     */
    setPressedActionEnabled(enabled) {
        this.pressedActionEnabled = enabled;
    }

    /**
     * Sets title text to ccui.Button
     * @param {String} text
     */
    setTitleText(text) {
        if(text === this.getTitleText()) return;

        this._createTitleRendererIfNeeded();

        this._titleRenderer.setString(text);
        if (this._ignoreSize){
            var s = this.getVirtualRendererSize();
            this.setContentSize(s);
        }else{
            this._titleRenderer._renderCmd._updateTTF();
        }
    }

    /**
     * Returns title text of ccui.Button
     * @returns {String} text
     */
    getTitleText() {
        if(this._titleRenderer) {
            return this._titleRenderer.getString();
        }
        return "";
    }

    /**
     * Sets title color to ccui.Button.
     * @param {cc.Color} color
     */
    setTitleColor(color) {
        this._createTitleRendererIfNeeded();
        this._titleRenderer.setFontFillColor(color);
    }

    /**
     * Returns title color of ccui.Button
     * @returns {cc.Color}
     */
    getTitleColor() {
        if (this._titleRenderer) {
            return this._titleRenderer._getFillStyle();
        }
        return cc.color.WHITE;
    }

    /**
     * Sets title fontSize to ccui.Button
     * @param {cc.Size} size
     */
    setTitleFontSize(size) {
        this._createTitleRendererIfNeeded();

        this._titleRenderer.setFontSize(size);
        this._fontSize = size;
    }

    /**
     * Returns title fontSize of ccui.Button.
     * @returns {Number}
     */
    getTitleFontSize() {
        if (this._titleRenderer) {
            return this._titleRenderer.getFontSize();
        }
        return this._fontSize;
    }

    /**
     * When user pressed the button, the button will zoom to a scale.
     * The final scale of the button  equals (button original scale + _zoomScale)
     * @since v3.2
     * @param scale
     */
    setZoomScale(scale){
        this._zoomScale = scale;
    }

    /**
     * Returns a zoom scale
     * @since v3.2
     * @returns {number}
     */
    getZoomScale(){
        return this._zoomScale;
    }

    /**
     * Returns the normalize of texture size
     * @since v3.3
     * @returns {cc.Size}
     */
    getNormalTextureSize(){
        return this._normalTextureSize;
    }

    /**
     * Sets title fontName to ccui.Button.
     * @param {String} fontName
     */
    setTitleFontName(fontName) {
        this._createTitleRendererIfNeeded();

        this._titleRenderer.setFontName(fontName);
        this._fontName = fontName;
    }

    /**
     * Get the title renderer.
     * title ttf object.
     * @returns {cc.LabelTTF}
     */
    getTitleRenderer(){
        return this._titleRenderer;
    }

    /**
     * Gets title fontName of ccui.Button.
     * @returns {String}
     */
    getTitleFontName() {
        if(this._titleRenderer) {
            return this._titleRenderer.getFontName();
        }
        return this._fontName;
    }

    _setTitleFont(font) {
        this._titleRenderer.font = font;
    }
    _getTitleFont() {
        return this._titleRenderer.font;
    }

    /**
     * Returns the "class name" of widget.
     * @override
     * @returns {string}
     */
    getDescription() {
        return "Button";
    }

    _createCloneInstance() {
        return new ccui.Button();
    }

    _copySpecialProperties(uiButton) {
        this._prevIgnoreSize = uiButton._prevIgnoreSize;
        this._capInsetsNormal = uiButton._capInsetsNormal;
        this.setScale9Enabled(uiButton._scale9Enabled);

        this.loadTextureNormal(uiButton._normalFileName, uiButton._normalTexType);
        this.loadTexturePressed(uiButton._clickedFileName, uiButton._pressedTexType);
        this.loadTextureDisabled(uiButton._disabledFileName, uiButton._disabledTexType);

        if(uiButton._titleRenderer && uiButton._titleRenderer._string) {
            this.setTitleText(uiButton.getTitleText());
            this.setTitleFontName(uiButton.getTitleFontName());
            this.setTitleFontSize(uiButton.getTitleFontSize());
            this.setTitleColor(uiButton.getTitleColor());
        }
        this.setPressedActionEnabled(uiButton.pressedActionEnabled);
        this.setZoomScale(uiButton._zoomScale);
    }

    _getNormalSize(){
        var titleSize;
        if (this._titleRenderer !== null)
            titleSize = this._titleRenderer.getContentSize();

        var imageSize = this._buttonScale9Renderer.getContentSize();
        var width = titleSize.width > imageSize.width ? titleSize.width : imageSize.width;
        var height = titleSize.height > imageSize.height ? titleSize.height : imageSize.height;

        return new cc.Size(width,height);
    }

};


// Constants
/**
 * The normal renderer's zOrder value of ccui.Button.
 * @constant
 * @type {number}
 */
ccui.Button.NORMAL_RENDERER_ZORDER = -2;
/**
 * The pressed renderer's zOrder value ccui.Button.
 * @constant
 * @type {number}
 */
ccui.Button.PRESSED_RENDERER_ZORDER = -2;
/**
 * The disabled renderer's zOrder value of ccui.Button.
 * @constant
 * @type {number}
 */
ccui.Button.DISABLED_RENDERER_ZORDER = -2;
/**
 * The title renderer's zOrder value of ccui.Button.
 * @constant
 * @type {number}
 */
ccui.Button.TITLE_RENDERER_ZORDER = -1;

/**
 * the zoom action time step of ccui.Button
 * @constant
 * @type {number}
 */
ccui.Button.ZOOM_ACTION_TIME_STEP = 0.05;

/**
 * @ignore
 */
ccui.Button.SYSTEM = 0;
ccui.Button.TTF = 1;

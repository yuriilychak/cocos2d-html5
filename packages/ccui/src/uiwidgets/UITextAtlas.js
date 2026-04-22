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

/**
 * The text atlas control of Cocos UI.
 *
 * @property {String}   string  - Content string of the label
 */
ccui.TextAtlas = class TextAtlas extends ccui.Widget {
    /**
     * Allocates and initializes a UILabelAtlas.                  <br/>
     * Constructor of ccui.TextAtlas, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @param {String} stringValue
     * @param {String} charMapFile
     * @param {number} itemWidth
     * @param {number} itemHeight
     * @param {String} startCharMap
     * @example
     * // example
     * var uiLabelAtlas = new ccui.TextAtlas();
     */
    constructor(stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
        super();
        this._stringValue = "";
        this._charMapFileName = "";
        this._itemWidth = 0;
        this._itemHeight = 0;
        this._startCharMap = "";
        this._className = "TextAtlas";
        this._labelAtlasRendererAdaptDirty = null;
        if (startCharMap !== undefined) {
            this.setProperty(stringValue, charMapFile, itemWidth, itemHeight, startCharMap);
        }
    }

    get string() { return this.getString(); }
    set string(v) { this.setString(v); }


    _initRenderer() {
        this._labelAtlasRenderer = new cc.LabelAtlas();
        this._labelAtlasRenderer.setAnchorPoint(cc.p(0.5, 0.5));
        this.addProtectedChild(this._labelAtlasRenderer, ccui.TextAtlas.RENDERER_ZORDER, -1);

        this._labelAtlasRenderer.addEventListener('load', function () {
            this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
            this._findLayout();
        }, this);
    }

    /**
     * initializes the UILabelAtlas with a string, a char map file(the atlas), the width and height of each element and the starting char of the atlas
     * @param {String} stringValue
     * @param {String} charMapFile
     * @param {number} itemWidth
     * @param {number} itemHeight
     * @param {String} startCharMap
     */
    setProperty(stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
        this._stringValue = stringValue;
        this._charMapFileName = charMapFile;
        this._itemWidth = itemWidth;
        this._itemHeight = itemHeight;
        this._startCharMap = startCharMap;

        this._labelAtlasRenderer.initWithString(
            stringValue,
            this._charMapFileName,
            this._itemWidth,
            this._itemHeight,
            this._startCharMap[0]
        );

        this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
        this._labelAtlasRendererAdaptDirty = true;
    }

    /**
     * Sets string value for ui text atlas.
     * @param {String} value
     */
    setString(value) {
        if (value === this._labelAtlasRenderer.getString())
            return;
        this._stringValue = value;
        this._labelAtlasRenderer.setString(value);
        this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
        this._labelAtlasRendererAdaptDirty = true;
    }

    /**
     * Sets string value for text atlas.
     * @deprecated since v3.0, please use setString instead.
     * @param {String} value
     */
    setStringValue(value) {
        cc.log("Please use the setString");
        this.setString(value);
    }

    /**
     * get string value for text atlas.
     * @deprecated since v3.0, please use getString instead.
     * @returns {String}
     */
    getStringValue() {
        cc.log("Please use the getString");
        return this.getString();
    }

    /**
     * get string value for ui text atlas.
     * @returns {String}
     */
    getString() {
        return this._labelAtlasRenderer.getString();
    }

    /**
     * Returns the length of string.
     * @returns {*|Number|long|int}
     */
    getStringLength() {
        return this._labelAtlasRenderer.getStringLength();
    }

    _onSizeChanged() {
        super._onSizeChanged();
        this._labelAtlasRendererAdaptDirty = true;
    }

    _adaptRenderers() {
        if (this._labelAtlasRendererAdaptDirty) {
            this._labelAtlasScaleChangedWithSize();
            this._labelAtlasRendererAdaptDirty = false;
        }
    }

    /**
     * Returns the renderer's content size
     * @overrider
     * @returns {cc.Size}
     */
    getVirtualRendererSize() {
        return this._labelAtlasRenderer.getContentSize();
    }

    /**
     * Returns the renderer of ccui.TextAtlas.
     * @returns {cc.Node}
     */
    getVirtualRenderer() {
        return this._labelAtlasRenderer;
    }

    _labelAtlasScaleChangedWithSize() {
        var locRenderer = this._labelAtlasRenderer;
        if (this._ignoreSize) {
            locRenderer.setScale(1.0);
        } else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            locRenderer.setScaleX(this._contentSize.width / textureSize.width);
            locRenderer.setScaleY(this._contentSize.height / textureSize.height);
        }
        locRenderer.setPosition(this._contentSize.width / 2.0, this._contentSize.height / 2.0);
    }

    /**
     * Returns the "class name" of ccui.TextAtlas.
     * @returns {string}
     */
    getDescription() {
        return "LabelAtlas";
    }

    _copySpecialProperties(labelAtlas) {
        if (labelAtlas) {
            this.setProperty(labelAtlas._stringValue, labelAtlas._charMapFileName, labelAtlas._itemWidth, labelAtlas._itemHeight, labelAtlas._startCharMap);
        }
    }

    _createCloneInstance() {
        return new ccui.TextAtlas();
    }
};


// Constants
/**
 * The zOrder value of ccui.TextAtlas's renderer.
 * @type {number}
 */
ccui.TextAtlas.RENDERER_ZORDER = -1;

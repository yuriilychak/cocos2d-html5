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
 * ccui.RichElement is the base class of RichElementText, RichElementImage etc. It has type, tag, color and opacity attributes.
 */
ccui.RichElement = class RichElement extends cc.NewClass {
    /**
     * Constructor of ccui.RichElement
     */
    constructor(tag, color, opacity) {
        super();
        this._type = 0;
        this._tag = 0;
        this._color = null;
        this._opacity = 0;
        this._type = 0;
        this._tag = tag || 0;
        this._color = cc.color(255, 255, 255, 255);
        if (color) {
            this._color.r = color.r;
            this._color.g = color.g;
            this._color.b = color.b;
        }
        this._opacity = opacity || 0;
        if (opacity === undefined) {
            this._color.a = color.a;
        }
        else {
            this._color.a = opacity;
        }
    }

};

/**
 * The text element for RichText, it has text, fontName, fontSize attributes.
 */
ccui.RichElementText = class RichElementText extends ccui.RichElement {
    /** @type cc.FontDefinition */
    /**
     * Usage Example using FontDefinition:
     *
     * var rtEl  = new ccui.RichElementText("tag", new cc.FontDefinition({
     *                              fillStyle: cc.color.BLACK,
     *                              fontName: "Arial",
     *                              fontSize: 12,
     *                              fontWeight: "bold",
     *                              fontStyle: "normal",
     *                              lineHeight: 14
     *                          }), 255, "Some Text");
     *
     * Constructor of ccui.RichElementText
     * @param {Number} tag
     * @param {cc.Color|cc.FontDefinition} colorOrFontDef
     * @param {Number} opacity
     * @param {String} text
     * @param {String} fontName
     * @param {Number} fontSize
     */
    constructor(tag, colorOrFontDef, opacity, text, fontName, fontSize) {
        var color = colorOrFontDef;
        var fontDef = null;
        if (colorOrFontDef && colorOrFontDef instanceof cc.FontDefinition) {
            color = colorOrFontDef.fillStyle;
            fontName = colorOrFontDef.fontName;
            fontSize = colorOrFontDef.fontSize;
            fontDef = colorOrFontDef;
        }
        super(tag, color, opacity);
        this._text = "";
        this._fontName = "";
        this._fontSize = 0;
        this._fontDefinition = fontDef;
        this._type = ccui.RichElement.TEXT;
        this._text = text;
        this._fontName = fontName;
        this._fontSize = fontSize;
    }

};

/**
 * The image element for RichText, it has filePath, textureRect, textureType attributes.
 */
ccui.RichElementImage = class RichElementImage extends ccui.RichElement {

    /**
     * Constructor of ccui.RichElementImage
     * @param {Number} tag
     * @param {cc.Color} color
     * @param {Number} opacity
     * @param {String} filePath
     */
    constructor(tag, color, opacity, filePath) {
        super(tag, color, opacity);
        this._filePath = "";
        this._textureRect = null;
        this._textureType = 0;
        this._type = ccui.RichElement.IMAGE;
        this._filePath = filePath || "";
        this._textureRect = cc.rect(0, 0, 0, 0);
        this._textureType = 0;
    }

};

/**
 * The custom node element for RichText.
 */
ccui.RichElementCustomNode = class RichElementCustomNode extends ccui.RichElement {

    /**
     * Constructor of ccui.RichElementCustomNode
     * @param {Number} tag
     * @param {cc.Color} color
     * @param {Number} opacity
     * @param {cc.Node} customNode
     */
    constructor(tag, color, opacity, customNode) {
        super(tag, color, opacity);
        this._customNode = null;
        this._type = ccui.RichElement.CUSTOM;
        this._customNode = customNode || null;
    }

};

/**
 * The rich text control of Cocos UI. It receives text, image, and custom node as its children to display.
 */
ccui.RichText = class RichText extends ccui.Widget {

    /**
     * create a rich text
     * Constructor of ccui.RichText. override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @example
     * var uiRichText = new ccui.RichTex();
     */
    constructor() {
        super();
        this._formatTextDirty = false;
        this._richElements = null;
        this._elementRenders = null;
        this._leftSpaceWidth = 0;
        this._verticalSpace = 0;
        this._elementRenderersContainer = null;
        this._lineBreakOnSpace = false;
        this._textHorizontalAlignment = null;
        this._textVerticalAlignment = null;
        this._formatTextDirty = false;
        this._richElements = [];
        this._elementRenders = [];
        this._leftSpaceWidth = 0;
        this._verticalSpace = 0;
        this._textHorizontalAlignment = cc.TEXT_ALIGNMENT_LEFT;
        this._textVerticalAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    }

    _initRenderer() {
        this._elementRenderersContainer = new cc.Node();
        this._elementRenderersContainer.setAnchorPoint(0.5, 0.5);
        this.addProtectedChild(this._elementRenderersContainer, 0, -1);
    }

    /**
     * Insert a element
     * @param {ccui.RichElement} element
     * @param {Number} index
     */
    insertElement(element, index) {
        this._richElements.splice(index, 0, element);
        this._formatTextDirty = true;
    }

    /**
     * Push a element
     * @param {ccui.RichElement} element
     */
    pushBackElement(element) {
        this._richElements.push(element);
        this._formatTextDirty = true;
    }

    /**
     * Remove element
     * @param {ccui.RichElement} element
     */
    removeElement(element) {
        if (cc.isNumber(element))
            this._richElements.splice(element, 1);
        else
            cc.arrayRemoveObject(this._richElements, element);
        this._formatTextDirty = true;
    }

    /**
     * Formats the richText's content.
     */
    formatText() {
        if (this._formatTextDirty) {
            this._elementRenderersContainer.removeAllChildren();
            this._elementRenders.length = 0;
            var i, element, locRichElements = this._richElements;
            if (this._ignoreSize) {
                this._addNewLine();
                for (i = 0; i < locRichElements.length; i++) {
                    element = locRichElements[i];
                    var elementRenderer = null;
                    switch (element._type) {
                        case ccui.RichElement.TEXT:
                            if (element._fontDefinition)
                                elementRenderer = new cc.LabelTTF(element._text, element._fontDefinition);
                            else //todo: There may be ambiguous
                                elementRenderer = new cc.LabelTTF(element._text, element._fontName, element._fontSize);
                            break;
                        case ccui.RichElement.IMAGE:
                            elementRenderer = new cc.Sprite(element._filePath);
                            break;
                        case ccui.RichElement.CUSTOM:
                            elementRenderer = element._customNode;
                            break;
                        default:
                            break;
                    }
                    elementRenderer.setColor(element._color);
                    elementRenderer.setOpacity(element._color.a);
                    this._pushToContainer(elementRenderer);
                }
            } else {
                this._addNewLine();
                for (i = 0; i < locRichElements.length; i++) {
                    element = locRichElements[i];
                    switch (element._type) {
                        case ccui.RichElement.TEXT:
                            if (element._fontDefinition)
                                this._handleTextRenderer(element._text, element._fontDefinition, element._fontDefinition.fontSize, element._fontDefinition.fillStyle);
                            else
                                this._handleTextRenderer(element._text, element._fontName, element._fontSize, element._color);
                            break;
                        case ccui.RichElement.IMAGE:
                            this._handleImageRenderer(element._filePath, element._color, element._color.a);
                            break;
                        case ccui.RichElement.CUSTOM:
                            this._handleCustomRenderer(element._customNode);
                            break;
                        default:
                            break;
                    }
                }
            }
            this.formatRenderers();
            this._formatTextDirty = false;
        }
    }
    /**
     * Prepare the child LabelTTF based on line breaking
     * @param {String} text
     * @param {String|cc.FontDefinition} fontNameOrFontDef
     * @param {Number} fontSize
     * @param {cc.Color} color
     * @private
     */
    _handleTextRenderer(text, fontNameOrFontDef, fontSize, color) {
        if (text === "")
            return;

        if (text === "\n") { //Force Line Breaking
            this._addNewLine();
            return;
        }

        var textRenderer = fontNameOrFontDef instanceof cc.FontDefinition ? new cc.LabelTTF(text, fontNameOrFontDef) : new cc.LabelTTF(text, fontNameOrFontDef, fontSize);
        var textRendererWidth = textRenderer.getContentSize().width;
        this._leftSpaceWidth -= textRendererWidth;
        if (this._leftSpaceWidth < 0) {
            var overstepPercent = (-this._leftSpaceWidth) / textRendererWidth;
            var curText = text;
            var stringLength = curText.length;
            var leftLength = stringLength * (1 - overstepPercent);
            var leftWords = curText.substr(0, leftLength);
            var cutWords = curText.substr(leftLength, curText.length - 1);
            var validLeftLength = leftLength > 0;

            if (this._lineBreakOnSpace) {
                var lastSpaceIndex = leftWords.lastIndexOf(' ');
                leftLength = lastSpaceIndex === -1 ? leftLength : lastSpaceIndex + 1;
                cutWords = curText.substr(leftLength, curText.length - 1);
                validLeftLength = leftLength > 0 && cutWords !== " ";
            }

            if (validLeftLength) {
                var leftRenderer = null;
                if (fontNameOrFontDef instanceof cc.FontDefinition) {
                    leftRenderer = new cc.LabelTTF(leftWords.substr(0, leftLength), fontNameOrFontDef);
                    leftRenderer.setOpacity(fontNameOrFontDef.fillStyle.a); //TODO: Verify that might not be needed...
                } else {
                    leftRenderer = new cc.LabelTTF(leftWords.substr(0, leftLength), fontNameOrFontDef, fontSize);
                    leftRenderer.setColor(color);
                    leftRenderer.setOpacity(color.a);
                }
                this._pushToContainer(leftRenderer);
            }

            this._addNewLine();
            this._handleTextRenderer(cutWords, fontNameOrFontDef, fontSize, color);
        } else {
            if (fontNameOrFontDef instanceof cc.FontDefinition) {
                textRenderer.setOpacity(fontNameOrFontDef.fillStyle.a); //TODO: Verify that might not be needed...
            } else {
                textRenderer.setColor(color);
                textRenderer.setOpacity(color.a);
            }
            this._pushToContainer(textRenderer);
        }
    }

    _handleImageRenderer(filePath, color, opacity) {
        var imageRenderer = new cc.Sprite(filePath);
        this._handleCustomRenderer(imageRenderer);
    }

    _handleCustomRenderer(renderer) {
        var imgSize = renderer.getContentSize();
        this._leftSpaceWidth -= imgSize.width;
        if (this._leftSpaceWidth < 0) {
            this._addNewLine();
            this._pushToContainer(renderer);
            this._leftSpaceWidth -= imgSize.width;
        } else
            this._pushToContainer(renderer);
    }

    _addNewLine() {
        this._leftSpaceWidth = this._customSize.width;
        this._elementRenders.push([]);
    }

    /**
     * Formats richText's renderer.
     */
    formatRenderers() {
        var newContentSizeHeight = 0, locRenderersContainer = this._elementRenderersContainer;
        var locElementRenders = this._elementRenders;
        var i, j, row, nextPosX, l;
        var lineHeight, offsetX;
        if (this._ignoreSize) {
            var newContentSizeWidth = 0;
            row = locElementRenders[0];
            nextPosX = 0;

            for (j = 0; j < row.length; j++) {
                l = row[j];
                l.setAnchorPoint(cc.p(0, 0));
                l.setPosition(nextPosX, 0);
                locRenderersContainer.addChild(l, 1, j);

                lineHeight = l.getLineHeight ? l.getLineHeight() : newContentSizeHeight;

                var iSize = l.getContentSize();
                newContentSizeWidth += iSize.width;
                newContentSizeHeight = Math.max(Math.min(newContentSizeHeight, lineHeight), iSize.height);
                nextPosX += iSize.width;
            }

            //Text flow horizontal alignment:
            if (this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT) {
                offsetX = 0;
                if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                    offsetX = this._contentSize.width - nextPosX;
                else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
                    offsetX = (this._contentSize.width - nextPosX) / 2;

                for (j = 0; j < row.length; j++)
                    row[j].x += offsetX;
            }

            locRenderersContainer.setContentSize(newContentSizeWidth, newContentSizeHeight);
        } else {
            var maxHeights = [];
            for (i = 0; i < locElementRenders.length; i++) {
                row = locElementRenders[i];
                var maxHeight = 0;
                for (j = 0; j < row.length; j++) {
                    l = row[j];
                    lineHeight = l.getLineHeight ? l.getLineHeight() : l.getContentSize().height;
                    maxHeight = Math.max(Math.min(l.getContentSize().height, lineHeight), maxHeight);
                }
                maxHeights[i] = maxHeight;
                newContentSizeHeight += maxHeights[i];
            }

            var nextPosY = this._customSize.height;

            for (i = 0; i < locElementRenders.length; i++) {
                row = locElementRenders[i];
                nextPosX = 0;
                nextPosY -= (maxHeights[i] + this._verticalSpace);

                for (j = 0; j < row.length; j++) {
                    l = row[j];
                    l.setAnchorPoint(cc.p(0, 0));
                    l.setPosition(cc.p(nextPosX, nextPosY));
                    locRenderersContainer.addChild(l, 1);
                    nextPosX += l.getContentSize().width;
                }
                //Text flow alignment(s)
                if (this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT || this._textVerticalAlignment !== cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
                    offsetX = 0;
                    if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                        offsetX = this._contentSize.width - nextPosX;
                    else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
                        offsetX = (this._contentSize.width - nextPosX) / 2;

                    var offsetY = 0;
                    if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
                        offsetY = this._customSize.height - newContentSizeHeight;
                    else if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                        offsetY = (this._customSize.height - newContentSizeHeight) / 2;

                    for (j = 0; j < row.length; j++) {
                        l = row[j];
                        l.x += offsetX;
                        l.y -= offsetY;
                    }
                }
            }

            locRenderersContainer.setContentSize(this._contentSize);
        }

        var length = locElementRenders.length;
        for (i = 0; i < length; i++) {
            locElementRenders[i].length = 0;
        }
        this._elementRenders.length = 0;

        this.setContentSize(this._ignoreSize ? this.getVirtualRendererSize() : this._customSize);
        this._updateContentSizeWithTextureSize(this._contentSize);

        locRenderersContainer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
    }

    _pushToContainer(renderer) {
        if (this._elementRenders.length <= 0)
            return;
        this._elementRenders[this._elementRenders.length - 1].push(renderer);
    }

    _adaptRenderers() {
        this.formatText();
    }

    /**
     * Sets vertical space
     * @param {Number} space
     */
    setVerticalSpace(space) {
        this._verticalSpace = space;
    }

    /**
     * Sets anchor point
     * @override
     * @param {cc.Point} pt
     */
    setAnchorPoint(pt) {
        super.setAnchorPoint(pt);
        this._elementRenderersContainer.setAnchorPoint(pt);
    }
    _setAnchorX(x) {
        super._setAnchorX(x);
        this._elementRenderersContainer._setAnchorX(x);
    }
    _setAnchorY(y) {
        super._setAnchorY(y);
        this._elementRenderersContainer._setAnchorY(y);
    }

    /**
     * Returns the renderer container's content size.
     * @override
     * @returns {cc.Size}
     */
    getVirtualRendererSize() {
        return this._elementRenderersContainer.getContentSize();
    }

    /**
     * Ignore the richText's custom size, If ignore is true that richText will ignore it's custom size, use renderer's content size, false otherwise.
     * @param {Boolean} ignore
     * @override
     */
    ignoreContentAdaptWithSize(ignore) {
        if (this._ignoreSize !== ignore) {
            this._formatTextDirty = true;
            super.ignoreContentAdaptWithSize(ignore);
        }
    }

    /**
     * Gets the content size of ccui.RichText
     * @override
     * @return {cc.Size}
     */
    getContentSize() {
        this.formatText();
        return cc.Node.prototype.getContentSize.call(this);
    }
    _getWidth() {
        this.formatText();
        return cc.Node.prototype._getWidth.call(this);
    }
    _getHeight() {
        this.formatText();
        return cc.Node.prototype._getHeight.call(this);
    }

    setContentSize(contentSize, height) {
        var locWidth = (height === undefined) ? contentSize.width : contentSize;
        var locHeight = (height === undefined) ? contentSize.height : height;
        super.setContentSize(locWidth, locHeight);
        this._formatTextDirty = true;
    }

    /**
     * Returns the class name of ccui.RichText.
     * @returns {string}
     */
    getDescription() {
        return "RichText";
    }
    /**
     * Allow child renderer to be affected by ccui.RichText's opacity
     * @param {boolean} value
     */
    setCascadeOpacityEnabled(value) {
        super.setCascadeOpacityEnabled(value);
        this._elementRenderersContainer.setCascadeOpacityEnabled(value);
    }
    /**
     * This allow the RichText layout to break line on space only like in Latin text format
     * by default the property is false, which break the line on characters
     * @param value
     */
    setLineBreakOnSpace(value) {
        this._lineBreakOnSpace = value;
        this._formatTextDirty = true;
        this.formatText();
    }
    /**
     * Set the renderer horizontal flow alignment for the Control
     * although it is named TextHorizontalAlignment, it should work with all type of renderer too.
     * NOTE: we should rename this to setHorizontalAlignment directly
     *
     * @example
     * var richText = new ccui.RichText();
     * richText.setTextHorizontalAlignment(cc.Text_ALIGNMENT_RIGHT);
     *
     * @param {Number} value - example cc.TEXT_ALIGNMENT_RIGHT
     */
    setTextHorizontalAlignment(value) {
        if (value !== this._textHorizontalAlignment) {
            this._textHorizontalAlignment = value;
            this.formatText();
        }
    }
    /**
     * Set the renderer vertical flow alignment for the Control
     * although it is named TextVerticalAlignment, it should work with all type of renderer too.
     *
     * @example
     * var richText = new ccui.RichText();
     * richText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
     *
     * @param {Number} value - example cc.VERTICAL_TEXT_ALIGNMENT_CENTER
     */
    setTextVerticalAlignment(value) {
        if (value !== this._textVerticalAlignment) {
            this._textVerticalAlignment = value;
            this.formatText();
        }
    }

};

// Constants
//Rich element type
/**
 * The text type of rich element.
 * @constant
 * @type {number}
 */
ccui.RichElement.TEXT = 0;
/**
 * The image type of rich element.
 * @constant
 * @type {number}
 */
ccui.RichElement.IMAGE = 1;
/**
 * The custom type of rich element.
 * @constant
 * @type {number}
 */
ccui.RichElement.CUSTOM = 2;

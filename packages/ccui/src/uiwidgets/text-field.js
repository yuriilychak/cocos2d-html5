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

import { LabelTTF } from '@aspect/core';
import { TextFieldTTF } from '@aspect/text-input';
import { Widget } from '../base-classes/widget';

/**
 * @ignore
 */
//it's a private class, it's a renderer of TextField.
class TextFieldRenderer extends TextFieldTTF {

    constructor() {
        super();
        this._maxLengthEnabled = false;
        this._maxLength = 0;
        this._passwordEnabled = false;
        this._passwordStyleText = "*";
        this._attachWithIME = false;
        this._detachWithIME = false;
        this._insertText = false;
        this._deleteBackward = false;
        this._className = "_TextFieldRenderer";
    }

    onEnter() {
        super.onEnter();
        super.setDelegate(this);
    }

    onTextFieldAttachWithIME(sender) {
        this.setAttachWithIME(true);
        return false;
    }

    onTextFieldInsertText(sender, text, len) {
        if (len === 1 && text === "\n")
            return false;

        this.setInsertText(true);
        return (this._maxLengthEnabled) && (super.getCharCount() >= this._maxLength);
    }

    onTextFieldDeleteBackward(sender, delText, nLen) {
        this.setDeleteBackward(true);
        return false;
    }

    onTextFieldDetachWithIME(sender) {
        this.setDetachWithIME(true);
        return false;
    }

    insertText(text, len) {
        var input_text = text;

        if (text !== "\n"){
            if (this._maxLengthEnabled){
                var text_count = this.getString().length;
                if (text_count >= this._maxLength){
                    // password
                    if (this._passwordEnabled)
                        this.setPasswordText(this.getString());
                    return;
                }
            }
        }
        super.insertText(input_text, len);

        // password
        if (this._passwordEnabled && super.getCharCount() > 0)
            this.setPasswordText(this.getString());
    }

    deleteBackward() {
        super.deleteBackward();

        if (super.getCharCount() > 0 && this._passwordEnabled)
            this.setPasswordText(this._inputText);
    }

    openIME() {
        super.attachWithIME();
    }

    closeIME() {
        super.detachWithIME();
    }

    setMaxLengthEnabled(enable) {
        this._maxLengthEnabled = enable;
    }

    isMaxLengthEnabled() {
        return this._maxLengthEnabled;
    }

    setMaxLength(length) {
        this._maxLength = length;
    }

    getMaxLength() {
        return this._maxLength;
    }

    getCharCount() {
        return super.getCharCount();
    }

    setPasswordEnabled(enable) {
        this._passwordEnabled = enable;
    }

    isPasswordEnabled() {
        return this._passwordEnabled;
    }

    setPasswordStyleText(styleText) {
        if (styleText.length > 1)
            return;
        var header = styleText.charCodeAt(0);
        if (header < 33 || header > 126)
            return;
        this._passwordStyleText = styleText;
    }

    setPasswordText(text) {
        var tempStr = "";
        var text_count = text.length;
        var max = text_count;

        if (this._maxLengthEnabled && text_count > this._maxLength)
            max = this._maxLength;

        for (var i = 0; i < max; ++i)
            tempStr += this._passwordStyleText;

        LabelTTF.prototype.setString.call(this, tempStr);
    }

    setAttachWithIME(attach) {
        this._attachWithIME = attach;
    }

    getAttachWithIME() {
        return this._attachWithIME;
    }

    setDetachWithIME(detach) {
        this._detachWithIME = detach;
    }

    getDetachWithIME() {
        return this._detachWithIME;
    }

    setInsertText(insert) {
        this._insertText = insert;
    }

    getInsertText() {
        return this._insertText;
    }

    setDeleteBackward(deleteBackward) {
        this._deleteBackward = deleteBackward;
    }

    getDeleteBackward() {
        return this._deleteBackward;
    }

    onDraw(sender) {
        return false;
    }
};

TextFieldRenderer.create = function (placeholder, fontName, fontSize) {
    var ret = new TextFieldRenderer();
    if (ret && ret.initWithString("", fontName, fontSize)) {
        if (placeholder)
            ret.setPlaceHolder(placeholder);
        return ret;
    }
    return null;
};

/**
 *
 *
 * @property {String}   string              - The content string of the label
 * @property {String}   placeHolder         - The place holder of the text field
 * @property {String}   font                - The text field font with a style string: e.g. "18px Verdana"
 * @property {String}   fontName            - The text field font name
 * @property {Number}   fontSize            - The text field font size
 * @property {Boolean}  maxLengthEnabled    - Indicate whether max length limit is enabled
 * @property {Number}   maxLength           - The max length of the text field
 * @property {Boolean}  passwordEnabled     - Indicate whether the text field is for entering password
 */
export class TextField extends Widget {

    /**
     * allocates and initializes a UITextField.
     * Constructor of TextField. override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @param {string} placeholder
     * @param {string} fontName
     * @param {Number} fontSize
     * @example
     * // example
     * var uiTextField = new TextField();
     */
    constructor(placeholder, fontName, fontSize) {
        super();
        this._touchWidth = 0;
        this._touchHeight = 0;
        this._useTouchArea = false;
        this._textFieldEventListener = null;
        this._textFieldEventSelector = null;
        this._passwordStyleText = "";
        this._textFieldRendererAdaptDirty = true;
        this._fontName = "";
        this._fontSize = 12;
        this._ccEventCallback = null;

        this.setTouchEnabled(true);
        if (fontName)
            this.setFontName(fontName);
        if (fontSize)
            this.setFontSize(fontSize);
        if (placeholder)
            this.setPlaceHolder(placeholder);
    }

    get string() { return this.getString(); }
    set string(v) { this.setString(v); }

    get placeHolder() { return this.getPlaceHolder(); }
    set placeHolder(v) { this.setPlaceHolder(v); }

    get font() { return this._getFont(); }
    set font(v) { this._setFont(v); }

    get fontSize() { return this.getFontSize(); }
    set fontSize(v) { this.setFontSize(v); }

    get fontName() { return this.getFontName(); }
    set fontName(v) { this.setFontName(v); }

    get maxLengthEnabled() { return this.isMaxLengthEnabled(); }
    set maxLengthEnabled(v) { this.setMaxLengthEnabled(v); }

    get maxLength() { return this.getMaxLength(); }
    set maxLength(v) { this.setMaxLength(v); }

    get passwordEnabled() { return this.isPasswordEnabled(); }
    set passwordEnabled(v) { this.setPasswordEnabled(v); }


    /**
     * Calls parent class' onEnter and schedules update function.
     * @override
     */
    onEnter() {
        super.onEnter();
        this.scheduleUpdate();
    }

    _initRenderer() {
        this._textFieldRenderer = TextFieldRenderer.create("input words here", "Thonburi", 20);
        this.addProtectedChild(this._textFieldRenderer, TextField.RENDERER_ZORDER, -1);
    }

    /**
     * Sets touch size of TextField.
     * @param {cc.Size} size
     */
    setTouchSize(size) {
        this._touchWidth = size.width;
        this._touchHeight = size.height;
    }

    /**
     * Sets whether use touch area.
     * @param enable
     */
    setTouchAreaEnabled(enable){
        this._useTouchArea = enable;
    }

    /**
     * Checks a point if is in TextField's space
     * @param {cc.Point} pt
     * @returns {boolean}
     */
    hitTest(pt){
        if (this._useTouchArea) {
            var nsp = this.convertToNodeSpace(pt);
            var bb = new cc.Rect(
                -this._touchWidth * this._anchorPoint.x,
                -this._touchHeight * this._anchorPoint.y,
                this._touchWidth, this._touchHeight
            );

            return ( nsp.x >= bb.x && nsp.x <= bb.x + bb.width &&
                nsp.y >= bb.y && nsp.y <= bb.y + bb.height );
        } else
            return super.hitTest(pt);
    }

    /**
     * Returns touch size of TextField.
     * @returns {cc.Size}
     */
    getTouchSize() {
        return new cc.Size(this._touchWidth, this._touchHeight);
    }

    /**
     *  Changes the string value of textField.
     * @deprecated since v3.0, please use setString instead.
     * @param {String} text
     */
    setText(text) {
        cc.log("Please use the setString");
        this.setString(text);
    }

    /**
     *  Changes the string value of textField.
     * @param {String} text
     */
    setString(text) {
        if (text == null)
            return;

        text = String(text);
        if (this.isMaxLengthEnabled())
            text = text.substr(0, this.getMaxLength());
        if (this.isPasswordEnabled()) {
            this._textFieldRenderer.setPasswordText(text);
            this._textFieldRenderer.setString("");
            this._textFieldRenderer.insertText(text, text.length);
        } else
            this._textFieldRenderer.setString(text);
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    }

    /**
     * Sets the placeholder string. <br />
     * display this string if string equal "".
     * @param {String} value
     */
    setPlaceHolder(value) {
        this._textFieldRenderer.setPlaceHolder(value);
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    }

    /**
     * Returns the placeholder string.
     * @returns {String}
     */
    getPlaceHolder() {
        return this._textFieldRenderer.getPlaceHolder();
    }

    /**
     * Returns the color of TextField's place holder.
     * @returns {cc.Color}
     */
    getPlaceHolderColor(){
        return this._textFieldRenderer.getPlaceHolderColor();
    }

    /**
     * Sets the place holder color to TextField.
     * @param color
     */
    setPlaceHolderColor(color){
        this._textFieldRenderer.setColorSpaceHolder(color);
    }

    /**
     * Sets the text color to TextField
     * @param textColor
     */
    setTextColor(textColor){
        this._textFieldRenderer.setTextColor(textColor);
    }

    /**
     * Sets font size for TextField.
     * @param {Number} size
     */
    setFontSize(size) {
        this._textFieldRenderer.setFontSize(size);
        this._fontSize = size;
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    }

    /**
     * Gets font size of TextField.
     * @return {Number} size
     */
    getFontSize() {
        return this._fontSize;
    }

    /**
     * Sets font name for TextField
     * @param {String} name
     */
    setFontName(name) {
        this._textFieldRenderer.setFontName(name);
        this._fontName = name;
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    }

    /**
     * Returns font name of TextField.
     * @return {String} font name
     */
    getFontName() {
        return this._fontName;
    }

    /**
     * detach with IME
     */
    didNotSelectSelf() {
        this._textFieldRenderer.detachWithIME();
    }

    /**
     * Returns textField string value
     * @deprecated since v3.0, please use getString instead.
     * @returns {String}
     */
    getStringValue() {
        cc.log("Please use the getString");
        return this.getString();
    }

    /**
     * Returns string value of TextField.
     * @returns {String}
     */
    getString() {
        return this._textFieldRenderer.getString();
    }

    /**
     * Returns the length of TextField.
     * @returns {Number}
     */
    getStringLength(){
        return this._textFieldRenderer.getStringLength();
    }

    /**
     * The touch began event callback handler.
     * @param {cc.Point} touchPoint
     */
    onTouchBegan(touchPoint, unusedEvent) {
        var self = this;
        var pass = Widget.prototype.onTouchBegan.call(self, touchPoint, unusedEvent);
        if (self._hit) {
            setTimeout(function(){
                self._textFieldRenderer.attachWithIME();
            }, 0);
        }else{
            setTimeout(function(){
                self._textFieldRenderer.detachWithIME();
            }, 0);
        }
        return pass;
    }

    /**
     * Sets Whether to open string length limit for TextField.
     * @param {Boolean} enable
     */
    setMaxLengthEnabled(enable) {
        this._textFieldRenderer.setMaxLengthEnabled(enable);
    }

    /**
     * Returns Whether to open string length limit.
     * @returns {Boolean}
     */
    isMaxLengthEnabled() {
        return this._textFieldRenderer.isMaxLengthEnabled();
    }

    /**
     * Sets the max length of TextField. Only when you turn on the string length limit, it is valid.
     * @param {number} length
     */
    setMaxLength(length) {
        this._textFieldRenderer.setMaxLength(length);
        this.setString(this.getString());
    }

    /**
     * Returns the max length of TextField.
     * @returns {number} length
     */
    getMaxLength() {
        return this._textFieldRenderer.getMaxLength();
    }

    /**
     * Sets whether to open setting string as password character.
     * @param {Boolean} enable
     */
    setPasswordEnabled(enable) {
        this._textFieldRenderer.setPasswordEnabled(enable);
    }

    /**
     * Returns whether to open setting string as password character.
     * @returns {Boolean}
     */
    isPasswordEnabled() {
        return this._textFieldRenderer.isPasswordEnabled();
    }

    /**
     * Sets the password style character, Only when you turn on setting string as password character, it is valid.
     * @param styleText
     */
    setPasswordStyleText(styleText){
        this._textFieldRenderer.setPasswordStyleText(styleText);
        this._passwordStyleText = styleText;

        this.setString(this.getString());
    }

    /**
     * Returns the password style character.
     * @returns {String}
     */
    getPasswordStyleText() {
        return this._passwordStyleText;
    }

    update(dt) {
        if (this.getDetachWithIME()) {
            this._detachWithIMEEvent();
            this.setDetachWithIME(false);
        }
        if (this.getAttachWithIME()) {
            this._attachWithIMEEvent();
            this.setAttachWithIME(false);
        }
        if (this.getInsertText()) {
            this._textFieldRendererAdaptDirty = true;
            this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());

            this._insertTextEvent();
            this.setInsertText(false);
        }
        if (this.getDeleteBackward()) {
            this._textFieldRendererAdaptDirty = true;
            this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());

            this._deleteBackwardEvent();
            this.setDeleteBackward(false);
        }
    }

    /**
     * Returns whether attach with IME.
     * @returns {Boolean}
     */
    getAttachWithIME() {
        return this._textFieldRenderer.getAttachWithIME();
    }

    /**
     * Sets attach with IME.
     * @param {Boolean} attach
     */
    setAttachWithIME(attach) {
        this._textFieldRenderer.setAttachWithIME(attach);
    }

    /**
     * Returns whether detach with IME.
     * @returns {Boolean}
     */
    getDetachWithIME() {
        return this._textFieldRenderer.getDetachWithIME();
    }

    /**
     * Sets detach with IME.
     * @param {Boolean} detach
     */
    setDetachWithIME(detach) {
        this._textFieldRenderer.setDetachWithIME(detach);
    }

    /**
     * Returns insertText string of TextField.
     * @returns {String}
     */
    getInsertText() {
        return this._textFieldRenderer.getInsertText();
    }

    /**
     * Sets insertText string to TextField.
     * @param {String} insertText
     */
    setInsertText(insertText) {
        this._textFieldRenderer.setInsertText(insertText);
    }

    /**
     * Returns the delete backward of TextField.
     * @returns {Boolean}
     */
    getDeleteBackward() {
        return this._textFieldRenderer.getDeleteBackward();
    }

    /**
     * Sets the delete backward of TextField.
     * @param {Boolean} deleteBackward
     */
    setDeleteBackward(deleteBackward) {
        this._textFieldRenderer.setDeleteBackward(deleteBackward);
    }

    _attachWithIMEEvent() {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, TextField.EVENT_ATTACH_WITH_IME);
            else
                this._textFieldEventSelector(this, TextField.EVENT_ATTACH_WITH_IME);
        }
        if (this._ccEventCallback){
            this._ccEventCallback(this, TextField.EVENT_ATTACH_WITH_IME);
        }
    }

    _detachWithIMEEvent() {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, TextField.EVENT_DETACH_WITH_IME);
            else
                this._textFieldEventSelector(this, TextField.EVENT_DETACH_WITH_IME);
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, TextField.EVENT_DETACH_WITH_IME);
    }

    _insertTextEvent() {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, TextField.EVENT_INSERT_TEXT);
            else
                this._textFieldEventSelector(this, TextField.EVENT_INSERT_TEXT);          //eventCallback
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, TextField.EVENT_INSERT_TEXT);
    }

    _deleteBackwardEvent() {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, TextField.EVENT_DELETE_BACKWARD);
            else
                this._textFieldEventSelector(this, TextField.EVENT_DELETE_BACKWARD);         //eventCallback
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, TextField.EVENT_DELETE_BACKWARD);
    }

    /**
     * Adds event listener to cuci.TextField.
     * @param {Object} [target=]
     * @param {Function} selector
     * @deprecated since v3.0, please use addEventListener instead.
     */
    addEventListenerTextField(selector, target) {
        this.addEventListener(selector, target);
    }

    /**
     * Adds event listener callback.
     * @param {Object} [target=]
     * @param {Function} selector
     */
    addEventListener(selector, target){
        this._textFieldEventSelector = selector;        //when target is undefined, _textFieldEventSelector is ccEventCallback.
        this._textFieldEventListener = target;
    }

    _onSizeChanged() {
        super._onSizeChanged();
        this._textFieldRendererAdaptDirty = true;
    }

    _adaptRenderers(){
        if (this._textFieldRendererAdaptDirty) {
            this._textfieldRendererScaleChangedWithSize();
            this._textFieldRendererAdaptDirty = false;
        }
    }

    _textfieldRendererScaleChangedWithSize() {
        if (!this._ignoreSize)
            this._textFieldRenderer.setDimensions(this._contentSize);
        this._textFieldRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    }

    //@since v3.3
    getAutoRenderSize(){
        var virtualSize = this._textFieldRenderer.getContentSize();
        if (!this._ignoreSize) {
            this._textFieldRenderer.setDimensions(0, 0);
            virtualSize = this._textFieldRenderer.getContentSize();
            this._textFieldRenderer.setDimensions(this._contentSize.width, this._contentSize.height);
        }
        return virtualSize;
    }

    /**
     * Returns the TextField's content size.
     * @returns {cc.Size}
     */
    getVirtualRendererSize(){
        return this._textFieldRenderer.getContentSize();
    }

    /**
     * Returns the renderer of TextField.
     * @returns {cc.Node}
     */
    getVirtualRenderer() {
        return this._textFieldRenderer;
    }

    /**
     * Returns the "class name" of TextField.
     * @returns {string}
     */
    getDescription() {
        return "TextField";
    }

    /**
     * Open keyboard and receive input text.
     * @return {Boolean}
     */
    attachWithIME() {
        this._textFieldRenderer.attachWithIME();
    }

    _createCloneInstance() {
        return new TextField();
    }

    _copySpecialProperties(textField) {
        this.setString(textField._textFieldRenderer.getString());
        this.setPlaceHolder(textField.getString());
        this.setFontSize(textField._textFieldRenderer.getFontSize());
        this.setFontName(textField._textFieldRenderer.getFontName());
        this.setMaxLengthEnabled(textField.isMaxLengthEnabled());
        this.setMaxLength(textField.getMaxLength());
        this.setPasswordEnabled(textField.isPasswordEnabled());
        this.setPasswordStyleText(textField._passwordStyleText);
        this.setAttachWithIME(textField.getAttachWithIME());
        this.setDetachWithIME(textField.getDetachWithIME());
        this.setInsertText(textField.getInsertText());
        this.setDeleteBackward(textField.getDeleteBackward());
        this._ccEventCallback = textField._ccEventCallback;
        this._textFieldEventListener = textField._textFieldEventListener;
        this._textFieldEventSelector = textField._textFieldEventSelector;
    }

    /**
     * Sets the text area size to TextField.
     * @param {cc.Size} size
     */
    setTextAreaSize(size){
        this.setContentSize(size);
    }

    /**
     * Sets the text horizontal alignment of TextField.
     * @param alignment
     */
    setTextHorizontalAlignment(alignment){
        this._textFieldRenderer.setHorizontalAlignment(alignment);
    }

    /**
     * Sets the text vertical alignment of TextField.
     * @param alignment
     */
    setTextVerticalAlignment(alignment){
        this._textFieldRenderer.setVerticalAlignment(alignment);
    }

    _setFont(font) {
        this._textFieldRenderer._setFont(font);
        this._textFieldRendererAdaptDirty = true;
    }

    _getFont() {
        return this._textFieldRenderer._getFont();
    }

    _changePosition(){
        this._adaptRenderers();
    }
};


// Constants
//TextField event
/**
 * The attach with IME event flag of TextField
 * @constant
 * @type {number}
 */
TextField.EVENT_ATTACH_WITH_IME = 0;
/**
 * The detach with IME event flag of TextField
 * @constant
 * @type {number}
 */
TextField.EVENT_DETACH_WITH_IME = 1;
/**
 * The insert text event flag of TextField
 * @constant
 * @type {number}
 */
TextField.EVENT_INSERT_TEXT = 2;
/**
 * The delete backward event flag of TextField
 * @constant
 * @type {number}
 */
TextField.EVENT_DELETE_BACKWARD = 3;

/**
 * The zOrder value of TextField's renderer.
 * @constant
 * @type {number}
 */
TextField.RENDERER_ZORDER = -1;
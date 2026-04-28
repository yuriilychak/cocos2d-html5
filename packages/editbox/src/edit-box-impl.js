import { Point, Size, Color, LabelTTF, KEY, VERTICAL_TEXT_ALIGNMENT_TOP, VERTICAL_TEXT_ALIGNMENT_CENTER, EGLView, Game, Sys, screen, visibleRect } from '@aspect/core';
import {
    EDITBOX_INPUT_MODE_ANY,
    EDITBOX_INPUT_MODE_EMAILADDR,
    EDITBOX_INPUT_MODE_NUMERIC,
    EDITBOX_INPUT_MODE_DECIMAL,
    EDITBOX_INPUT_MODE_PHONENUMBER,
    EDITBOX_INPUT_MODE_URL,
    EDITBOX_INPUT_FLAG_PASSWORD,
    EDITBOX_INPUT_FLAG_SENSITIVE,
    EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS,
    EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD,
    EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE,
    KEYBOARD_RETURNTYPE_SEARCH
} from './constants';

// Detect Android browsers that have broken zoom handling
export const editBoxPolyfill = { zoomInvalid: false };
if (
    Sys.getInstance().OS_ANDROID === Sys.getInstance().os &&
    (Sys.getInstance().browserType === Sys.getInstance().BROWSER_TYPE_SOUGOU ||
        Sys.getInstance().browserType === Sys.getInstance().BROWSER_TYPE_360)
) {
    editBoxPolyfill.zoomInvalid = true;
}

const SCROLLY = 40;
const TIMER_NAME = 400;
const LEFT_PADDING = 2;

function adjustEditBoxPosition(editBox) {
    var worldPos = editBox.convertToWorldSpace(new Point(0, 0));
    var windowHeight = visibleRect.height;
    var windowWidth = visibleRect.width;
    var factor = 0.5;
    if (windowWidth > windowHeight) {
        factor = 0.7;
    }
    setTimeout(function () {
        if (window.scrollY < SCROLLY && worldPos.y < windowHeight * factor) {
            var scrollOffset = windowHeight * factor - worldPos.y - window.scrollY;
            if (scrollOffset < 35) scrollOffset = 35;
            if (scrollOffset > 320) scrollOffset = 320;
            window.scrollTo(scrollOffset, scrollOffset);
        }
    }, TIMER_NAME);
}

var capitalize = function (string) {
    return string.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Mixin object providing DOM-based editing behaviour for EditBox render commands.
 * Applied via Object.assign to CanvasRenderCmd / WebGLRenderCmd prototypes.
 */
export const editBoxImpl = {
    updateMatrix() {
        if (!this._edTxt) return;

        var node = this._node,
            view = EGLView.getInstance(),
            scaleX = view._scaleX,
            scaleY = view._scaleY;
        var dpr = view._devicePixelRatio;
        var t = this._worldTransform;

        scaleX /= dpr;
        scaleY /= dpr;

        var container = Game.getInstance().container;
        var a = t.a * scaleX,
            b = t.b,
            c = t.c,
            d = t.d * scaleY;

        var offsetX =
            container &&
            container.style.paddingLeft &&
            parseInt(container.style.paddingLeft);
        var offsetY =
            container &&
            container.style.paddingBottom &&
            parseInt(container.style.paddingBottom);
        var tx = t.tx * scaleX + offsetX,
            ty = t.ty * scaleY + offsetY;

        if (editBoxPolyfill.zoomInvalid) {
            this.updateSize(
                node._contentSize.width * a,
                node._contentSize.height * d
            );
            a = 1;
            d = 1;
        }

        var matrix =
            "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._edTxt.style["transform"] = matrix;
        this._edTxt.style["-webkit-transform"] = matrix;
        this._edTxt.style["transform-origin"] = "0px 100% 0px";
        this._edTxt.style["-webkit-transform-origin"] = "0px 100% 0px";
    },

    updateVisibility() {
        if (!this._edTxt) return;
        if (this._node.visible) {
            this._edTxt.style.visibility = "visible";
        } else {
            this._edTxt.style.visibility = "hidden";
        }
    },

    stayOnTop(flag) {
        if (flag) {
            this._removeLabels();
            this._edTxt.style.display = "";
        } else {
            this._createLabels();
            this._edTxt.style.display = "none";
            this._showLabels();
        }
    },

    _beginEditingOnMobile(editBox) {
        this.__orientationChanged = function () {
            adjustEditBoxPosition(editBox);
        };
        window.addEventListener("orientationchange", this.__orientationChanged);

        if (EGLView.getInstance().isAutoFullScreenEnabled()) {
            this.__fullscreen = true;
            EGLView.getInstance().enableAutoFullScreen(false);
            screen.exitFullScreen();
        } else {
            this.__fullscreen = false;
        }
        this.__autoResize = EGLView.getInstance().__resizeWithBrowserSize;
        EGLView.getInstance().resizeWithBrowserSize(false);
    },

    _endEditingOnMobile() {
        if (this.__rotateScreen) {
            var containerStyle = Game.getInstance().container.style;
            containerStyle["-webkit-transform"] = "rotate(90deg)";
            containerStyle.transform = "rotate(90deg)";

            var view = EGLView.getInstance();
            var width = view._originalDesignResolutionSize.width;
            var height = view._originalDesignResolutionSize.height;
            if (width > 0) {
                view.setDesignResolutionSize(width, height, view._resolutionPolicy);
            }
            this.__rotateScreen = false;
        }
        window.removeEventListener("orientationchange", this.__orientationChanged);
        window.scrollTo(0, 0);
        if (this.__fullscreen) {
            EGLView.getInstance().enableAutoFullScreen(true);
        }
        if (this.__autoResize) {
            EGLView.getInstance().resizeWithBrowserSize(true);
        }
    },

    _onFocusOnMobile(editBox) {
        if (EGLView.getInstance()._isRotated) {
            var containerStyle = Game.getInstance().container.style;
            containerStyle["-webkit-transform"] = "rotate(0deg)";
            containerStyle.transform = "rotate(0deg)";
            containerStyle.margin = "0px";
            window.scrollTo(35, 35);
            this.__rotateScreen = true;
        } else {
            this.__rotateScreen = false;
        }
        adjustEditBoxPosition(editBox);
    },

    _createDomInput() {
        this._removeDomFromGameContainer();
        var thisPointer = this;
        var tmpEdTxt = (this._edTxt = document.createElement("input"));
        tmpEdTxt.type = "text";
        tmpEdTxt.style.fontFamily = this._edFontName;
        tmpEdTxt.style.fontSize = this._edFontSize + "px";
        tmpEdTxt.style.color = "#000000";
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = "transparent";
        tmpEdTxt.style.width = "100%";
        tmpEdTxt.style.height = "100%";
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = "medium";
        tmpEdTxt.style.padding = "0";
        tmpEdTxt.style.textTransform = "uppercase";
        tmpEdTxt.style.display = "none";
        tmpEdTxt.style.position = "absolute";
        tmpEdTxt.style.bottom = "0px";
        tmpEdTxt.style.left = LEFT_PADDING + "px";
        tmpEdTxt.style.className = "cocosEditBox";
        this.setMaxLength(thisPointer._editBox._maxLength);

        tmpEdTxt.addEventListener("input", function () {
            var editBox = thisPointer._editBox;
            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                if (editBox._text !== this.value) {
                    editBox._text = this.value;
                    thisPointer._updateDomTextCases();
                    editBox._delegate.editBoxTextChanged(editBox, editBox._text);
                }
            }
        });

        tmpEdTxt.addEventListener("keypress", function (e) {
            var editBox = thisPointer._editBox;
            if (e.keyCode === KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                if (this.value === "") {
                    this.style.fontSize = editBox._placeholderFontSize + "px";
                    this.style.color = Color.toHex(editBox._placeholderColor);
                }
                editBox._text = this.value;
                thisPointer._updateDomTextCases();
                thisPointer._endEditing();
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
                Game.getInstance().canvas.focus();
            }
        });

        tmpEdTxt.addEventListener("focus", function () {
            var editBox = thisPointer._editBox;
            this.style.fontSize = thisPointer._edFontSize + "px";
            this.style.color = Color.toHex(editBox._textColor);
            thisPointer._hiddenLabels();
            if (Sys.getInstance().isMobile) {
                thisPointer._onFocusOnMobile(editBox);
            }
            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegin) {
                editBox._delegate.editBoxEditingDidBegin(editBox);
            }
        });

        tmpEdTxt.addEventListener("blur", function () {
            var editBox = thisPointer._editBox;
            editBox._text = this.value;
            thisPointer._updateDomTextCases();
            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnd) {
                editBox._delegate.editBoxEditingDidEnd(editBox);
            }
            if (this.value === "") {
                this.style.fontSize = editBox._placeholderFontSize + "px";
                this.style.color = Color.toHex(editBox._placeholderColor);
            }
            thisPointer._endEditing();
        });

        this._addDomToGameContainer();
        return tmpEdTxt;
    },

    _createDomTextArea() {
        this._removeDomFromGameContainer();
        var thisPointer = this;
        var tmpEdTxt = (this._edTxt = document.createElement("textarea"));
        tmpEdTxt.type = "text";
        tmpEdTxt.style.fontFamily = this._edFontName;
        tmpEdTxt.style.fontSize = this._edFontSize + "px";
        tmpEdTxt.style.color = "#000000";
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = "transparent";
        tmpEdTxt.style.width = "100%";
        tmpEdTxt.style.height = "100%";
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = "medium";
        tmpEdTxt.style.padding = "0";
        tmpEdTxt.style.resize = "none";
        tmpEdTxt.style.textTransform = "uppercase";
        tmpEdTxt.style.overflow_y = "scroll";
        tmpEdTxt.style.display = "none";
        tmpEdTxt.style.position = "absolute";
        tmpEdTxt.style.bottom = "0px";
        tmpEdTxt.style.left = LEFT_PADDING + "px";
        tmpEdTxt.style.className = "cocosEditBox";
        this.setMaxLength(thisPointer._editBox._maxLength);

        tmpEdTxt.addEventListener("input", function () {
            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }
            var editBox = thisPointer._editBox;
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                if (editBox._text.toLowerCase() !== this.value.toLowerCase()) {
                    editBox._text = this.value;
                    thisPointer._updateDomTextCases();
                    editBox._delegate.editBoxTextChanged(editBox, editBox._text);
                }
            }
        });

        tmpEdTxt.addEventListener("focus", function () {
            var editBox = thisPointer._editBox;
            thisPointer._hiddenLabels();
            this.style.fontSize = thisPointer._edFontSize + "px";
            this.style.color = Color.toHex(editBox._textColor);
            if (Sys.getInstance().isMobile) {
                thisPointer._onFocusOnMobile(editBox);
            }
            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegin) {
                editBox._delegate.editBoxEditingDidBegin(editBox);
            }
        });

        tmpEdTxt.addEventListener("keypress", function (e) {
            var editBox = thisPointer._editBox;
            if (e.keyCode === KEY.enter) {
                e.stopPropagation();
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
            }
        });

        tmpEdTxt.addEventListener("blur", function () {
            var editBox = thisPointer._editBox;
            editBox._text = this.value;
            thisPointer._updateDomTextCases();
            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnd) {
                editBox._delegate.editBoxEditingDidEnd(editBox);
            }
            if (this.value === "") {
                this.style.fontSize = editBox._placeholderFontSize + "px";
                this.style.color = Color.toHex(editBox._placeholderColor);
            }
            thisPointer._endEditing();
        });

        this._addDomToGameContainer();
        return tmpEdTxt;
    },

    _createLabels() {
        var editBoxSize = this._editBox.getContentSize();
        if (!this._textLabel) {
            this._textLabel = new LabelTTF();
            this._textLabel.setAnchorPoint(new Point(0, 1));
            this._editBox.addChild(this._textLabel, 100);
        }
        if (!this._placeholderLabel) {
            this._placeholderLabel = new LabelTTF();
            this._placeholderLabel.setAnchorPoint(new Point(0, 1));
            this._placeholderLabel.setColor(Color.GRAY);
            this._editBox.addChild(this._placeholderLabel, 100);
        }
        this._updateLabelPosition(editBoxSize);
    },

    _removeLabels() {
        if (!this._textLabel) return;
        this._editBox.removeChild(this._textLabel);
        this._textLabel = null;
    },

    _updateLabelPosition(editBoxSize) {
        if (!this._textLabel || !this._placeholderLabel) return;

        var labelContentSize = new Size(
            editBoxSize.width - LEFT_PADDING,
            editBoxSize.height
        );
        this._textLabel.setContentSize(labelContentSize);
        this._textLabel.setDimensions(labelContentSize);
        this._placeholderLabel.setLineHeight(editBoxSize.height);
        var placeholderLabelSize = this._placeholderLabel.getContentSize();

        if (this._editBox._editBoxInputMode === EDITBOX_INPUT_MODE_ANY) {
            this._textLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setVerticalAlignment(VERTICAL_TEXT_ALIGNMENT_TOP);
            this._textLabel.setVerticalAlignment(VERTICAL_TEXT_ALIGNMENT_TOP);
        } else {
            this._textLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setPosition(
                LEFT_PADDING,
                (editBoxSize.height + placeholderLabelSize.height) / 2
            );
            this._placeholderLabel.setVerticalAlignment(VERTICAL_TEXT_ALIGNMENT_CENTER);
            this._textLabel.setVerticalAlignment(VERTICAL_TEXT_ALIGNMENT_CENTER);
        }
    },

    setLineHeight(lineHeight) {
        if (this._textLabel) {
            this._textLabel.setLineHeight(lineHeight);
        }
    },

    _hiddenLabels() {
        if (this._textLabel) this._textLabel.setVisible(false);
        if (this._placeholderLabel) this._placeholderLabel.setVisible(false);
    },

    _updateDomTextCases() {
        var inputFlag = this._editBox._editBoxInputFlag;
        if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS) {
            this._editBox._text = this._editBox._text.toUpperCase();
        } else if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD) {
            this._editBox._text = capitalize(this._editBox._text);
        } else if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE) {
            this._editBox._text = capitalizeFirstLetter(this._editBox._text);
        }
    },

    _updateLabelStringStyle() {
        if (this._edTxt.type === "password") {
            var passwordString = "";
            var len = this._editBox._text.length;
            for (var i = 0; i < len; ++i) {
                passwordString += "\u25CF";
            }
            if (this._textLabel) {
                this._textLabel.setString(passwordString);
            }
        } else {
            this._updateDomTextCases();
            if (this._textLabel) {
                this._textLabel.setString(this._editBox._text);
            }
        }
    },

    _showLabels() {
        this._hiddenLabels();
        if (this._edTxt.value === "") {
            if (this._placeholderLabel) {
                this._placeholderLabel.setVisible(true);
                this._placeholderLabel.setString(this._editBox._placeholderText);
            }
        } else {
            if (this._textLabel) {
                this._textLabel.setVisible(true);
                this._textLabel.setString(this._editBox._text);
            }
        }
        this._updateLabelStringStyle();
    },

    _beginEditing() {
        if (!this._editBox._alwaysOnTop) {
            if (this._edTxt.style.display === "none") {
                this._edTxt.style.display = "";
                this._edTxt.focus();
            }
        }
        if (Sys.getInstance().isMobile && !this._editingMode) {
            this._beginEditingOnMobile(this._editBox);
        }
        this._editingMode = true;
    },

    _endEditing() {
        if (!this._editBox._alwaysOnTop) {
            this._edTxt.style.display = "none";
        }
        this._showLabels();
        if (Sys.getInstance().isMobile && this._editingMode) {
            var self = this;
            setTimeout(function () {
                self._endEditingOnMobile();
            }, TIMER_NAME);
        }
        this._editingMode = false;
    },

    _setFont(fontStyle) {
        var res = LabelTTF._fontStyleRE.exec(fontStyle);
        var textFontName = res[2];
        var textFontSize = parseInt(res[1]);
        if (res) {
            this.setFont(textFontName, textFontSize);
        }
    },

    setFont(fontName, fontSize) {
        this._edFontName = fontName || this._edFontName;
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    },

    setFontName(fontName) {
        this._edFontName = fontName || this._edFontName;
        this._updateDOMFontStyle();
    },

    setFontSize(fontSize) {
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    },

    setFontColor(color) {
        if (!this._edTxt) return;
        if (this._edTxt.value !== this._editBox._placeholderText) {
            this._edTxt.style.color = Color.toHex(color);
        }
        if (this._textLabel) {
            this._textLabel.setColor(color);
        }
    },

    setPlaceHolder(text) {
        this._placeholderLabel.setString(text);
    },

    setMaxLength(maxLength) {
        if (!this._edTxt) return;
        this._edTxt.maxLength = maxLength;
    },

    _updateDOMPlaceholderFontStyle() {
        this._placeholderLabel.setFontName(this._editBox._placeholderFontName);
        this._placeholderLabel.setFontSize(this._editBox._placeholderFontSize);
    },

    setPlaceholderFontColor(color) {
        this._placeholderLabel.setColor(color);
    },

    _updateDomInputType() {
        var inputMode = this._editBox._editBoxInputMode;
        if (inputMode === EDITBOX_INPUT_MODE_EMAILADDR) {
            this._edTxt.type = "email";
        } else if (
            inputMode === EDITBOX_INPUT_MODE_DECIMAL ||
            inputMode === EDITBOX_INPUT_MODE_NUMERIC
        ) {
            this._edTxt.type = "number";
        } else if (inputMode === EDITBOX_INPUT_MODE_PHONENUMBER) {
            this._edTxt.type = "number";
            this._edTxt.pattern = "[0-9]*";
        } else if (inputMode === EDITBOX_INPUT_MODE_URL) {
            this._edTxt.type = "url";
        } else {
            this._edTxt.type = "text";
            if (this._editBox._keyboardReturnType === KEYBOARD_RETURNTYPE_SEARCH) {
                this._edTxt.type = "search";
            }
        }
        if (this._editBox._editBoxInputFlag === EDITBOX_INPUT_FLAG_PASSWORD) {
            this._edTxt.type = "password";
        }
    },

    setInputFlag(inputFlag) {
        if (!this._edTxt) return;
        this._updateDomInputType();
        this._edTxt.style.textTransform = "none";
        if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS) {
            this._edTxt.style.textTransform = "uppercase";
        } else if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD) {
            this._edTxt.style.textTransform = "capitalize";
        }
        this._updateLabelStringStyle();
    },

    setInputMode(inputMode) {
        if (inputMode === EDITBOX_INPUT_MODE_ANY) {
            this._createDomTextArea();
        } else {
            this._createDomInput();
        }
        this._updateDomInputType();
        var contentSize = this._node.getContentSize();
        this.updateSize(contentSize.width, contentSize.height);
    },

    setString(text) {
        if (!this._edTxt) return;
        if (text !== null) {
            this._edTxt.value = text;
            if (text === "") {
                if (this._placeholderLabel) {
                    this._placeholderLabel.setString(this._editBox._placeholderText);
                    this._placeholderLabel.setColor(this._editBox._placeholderColor);
                }
                if (!this._editingMode) {
                    if (this._placeholderLabel) this._placeholderLabel.setVisible(true);
                    if (this._textLabel) this._textLabel.setVisible(false);
                }
            } else {
                this._edTxt.style.color = Color.toHex(this._editBox._textColor);
                if (this._textLabel) {
                    this._textLabel.setColor(this._editBox._textColor);
                }
                if (!this._editingMode) {
                    if (this._placeholderLabel) this._placeholderLabel.setVisible(false);
                    if (this._textLabel) this._textLabel.setVisible(true);
                }
                this._updateLabelStringStyle();
            }
        }
    },

    _updateDOMFontStyle() {
        if (!this._edTxt) return;
        if (this._edTxt.value !== "") {
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize + "px";
        }
        if (this._textLabel) {
            this._textLabel.setFontSize(this._edFontSize);
            this._textLabel.setFontName(this._edFontName);
        }
    },

    updateSize(newWidth, newHeight) {
        var editboxDomNode = this._edTxt;
        if (!editboxDomNode) return;
        editboxDomNode.style["width"] = newWidth + "px";
        editboxDomNode.style["height"] = newHeight + "px";
        this._updateLabelPosition(new Size(newWidth, newHeight));
    },

    _addDomToGameContainer() {
        Game.getInstance().container.appendChild(this._edTxt);
    },

    _removeDomFromGameContainer() {
        var editBox = this._edTxt;
        if (editBox) {
            var hasChild = false;
            if ("contains" in Game.getInstance().container) {
                hasChild = Game.getInstance().container.contains(editBox);
            } else {
                hasChild = Game.getInstance().container.compareDocumentPosition(editBox) % 16;
            }
            if (hasChild) Game.getInstance().container.removeChild(editBox);
        }
        this._edTxt = null;
    },

    initializeRenderCmd(node) {
        this._editBox = node;
        this._edFontSize = 14;
        this._edFontName = "Arial";
        this._textLabel = null;
        this._placeholderLabel = null;
        this._editingMode = false;
        this.__fullscreen = false;
        this.__autoResize = false;
        this.__rotateScreen = false;
        this.__orientationChanged = null;
    }
};

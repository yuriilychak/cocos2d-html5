import {
    Point,
    Size,
    Color,
    LabelTTF,
    KEY,
    VERTICAL_TEXT_ALIGNMENT_TOP,
    VERTICAL_TEXT_ALIGNMENT_CENTER,
    EGLView,
    Game
} from '@aspect/core';
import {
    EDITBOX_INPUT_MODE_ANY,
    EDITBOX_INPUT_MODE_EMAILADDR,
    EDITBOX_INPUT_MODE_NUMERIC,
    EDITBOX_INPUT_MODE_DECIMAL,
    EDITBOX_INPUT_MODE_PHONENUMBER,
    EDITBOX_INPUT_MODE_URL,
    EDITBOX_INPUT_FLAG_PASSWORD,
    EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS,
    EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD,
    EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE,
    KEYBOARD_RETURNTYPE_SEARCH
} from './constants';

const LEFT_PADDING = 2;

function capitalize(string) {
    return string.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Base class implementing DOM-backed input behaviour for an EditBox.
 * Subclasses (DesktopEditBoxInput / MobileEditBoxInput) override the
 * lifecycle hooks _onBeginEditing/_onEndEditing/_onFocus and the
 * _adjustZoom matrix helper for platform-specific quirks.
 */
export class EditBoxInputBase {
    constructor(editBox) {
        this._editBox = editBox;
        this._edTxt = null;
        this._edFontSize = 14;
        this._edFontName = 'Arial';
        this._textLabel = null;
        this._placeholderLabel = null;
        this._editingMode = false;
    }

    // --- Lifecycle hooks (overridden by mobile) ---
    _onBeginEditing() {}
    _onEndEditing() {}
    _onFocus() {}
    _adjustZoom(a, d) { return { a, d }; }

    // --- Transform sync ---
    updateMatrix(worldTransform) {
        if (!this._edTxt) return;

        var node = this._editBox,
            view = EGLView.getInstance(),
            scaleX = view._scaleX,
            scaleY = view._scaleY;
        var dpr = view._devicePixelRatio;
        var t = worldTransform;

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

        var zoomed = this._adjustZoom(a, d);
        a = zoomed.a;
        d = zoomed.d;

        var matrix =
            'matrix(' + a + ',' + -b + ',' + -c + ',' + d + ',' + tx + ',' + -ty + ')';
        this._edTxt.style['transform'] = matrix;
        this._edTxt.style['-webkit-transform'] = matrix;
        this._edTxt.style['transform-origin'] = '0px 100% 0px';
        this._edTxt.style['-webkit-transform-origin'] = '0px 100% 0px';
    }

    updateVisibility() {
        if (!this._edTxt) return;
        this._edTxt.style.visibility = this._editBox.visible ? 'visible' : 'hidden';
    }

    stayOnTop(flag) {
        if (flag) {
            this._removeLabels();
            this._edTxt.style.display = '';
        } else {
            this._createLabels();
            this._edTxt.style.display = 'none';
            this._showLabels();
        }
    }

    // --- DOM creation ---
    _createDomInput() {
        this._removeDomFromGameContainer();
        var self = this;
        var tmpEdTxt = (this._edTxt = document.createElement('input'));
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontFamily = this._edFontName;
        tmpEdTxt.style.fontSize = this._edFontSize + 'px';
        tmpEdTxt.style.color = '#000000';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        tmpEdTxt.style.width = '100%';
        tmpEdTxt.style.height = '100%';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.textTransform = 'uppercase';
        tmpEdTxt.style.display = 'none';
        tmpEdTxt.style.position = 'absolute';
        tmpEdTxt.style.bottom = '0px';
        tmpEdTxt.style.left = LEFT_PADDING + 'px';
        tmpEdTxt.style.className = 'cocosEditBox';
        this.setMaxLength(this._editBox._maxLength);

        tmpEdTxt.addEventListener('input', function () {
            var editBox = self._editBox;
            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                if (editBox._text !== this.value) {
                    editBox._text = this.value;
                    self._updateDomTextCases();
                    editBox._delegate.editBoxTextChanged(editBox, editBox._text);
                }
            }
        });

        tmpEdTxt.addEventListener('keypress', function (e) {
            var editBox = self._editBox;
            if (e.keyCode === KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                if (this.value === '') {
                    this.style.fontSize = editBox._placeholderFontSize + 'px';
                    this.style.color = Color.toHex(editBox._placeholderColor);
                }
                editBox._text = this.value;
                self._updateDomTextCases();
                self._endEditing();
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
                Game.getInstance().canvas.focus();
            }
        });

        tmpEdTxt.addEventListener('focus', function () {
            var editBox = self._editBox;
            this.style.fontSize = self._edFontSize + 'px';
            this.style.color = Color.toHex(editBox._textColor);
            self._hiddenLabels();
            self._onFocus();
            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegin) {
                editBox._delegate.editBoxEditingDidBegin(editBox);
            }
        });

        tmpEdTxt.addEventListener('blur', function () {
            var editBox = self._editBox;
            editBox._text = this.value;
            self._updateDomTextCases();
            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnd) {
                editBox._delegate.editBoxEditingDidEnd(editBox);
            }
            if (this.value === '') {
                this.style.fontSize = editBox._placeholderFontSize + 'px';
                this.style.color = Color.toHex(editBox._placeholderColor);
            }
            self._endEditing();
        });

        this._addDomToGameContainer();
        return tmpEdTxt;
    }

    _createDomTextArea() {
        this._removeDomFromGameContainer();
        var self = this;
        var tmpEdTxt = (this._edTxt = document.createElement('textarea'));
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontFamily = this._edFontName;
        tmpEdTxt.style.fontSize = this._edFontSize + 'px';
        tmpEdTxt.style.color = '#000000';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        tmpEdTxt.style.width = '100%';
        tmpEdTxt.style.height = '100%';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.resize = 'none';
        tmpEdTxt.style.textTransform = 'uppercase';
        tmpEdTxt.style.overflow_y = 'scroll';
        tmpEdTxt.style.display = 'none';
        tmpEdTxt.style.position = 'absolute';
        tmpEdTxt.style.bottom = '0px';
        tmpEdTxt.style.left = LEFT_PADDING + 'px';
        tmpEdTxt.style.className = 'cocosEditBox';
        this.setMaxLength(this._editBox._maxLength);

        tmpEdTxt.addEventListener('input', function () {
            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }
            var editBox = self._editBox;
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                if (editBox._text.toLowerCase() !== this.value.toLowerCase()) {
                    editBox._text = this.value;
                    self._updateDomTextCases();
                    editBox._delegate.editBoxTextChanged(editBox, editBox._text);
                }
            }
        });

        tmpEdTxt.addEventListener('focus', function () {
            var editBox = self._editBox;
            self._hiddenLabels();
            this.style.fontSize = self._edFontSize + 'px';
            this.style.color = Color.toHex(editBox._textColor);
            self._onFocus();
            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegin) {
                editBox._delegate.editBoxEditingDidBegin(editBox);
            }
        });

        tmpEdTxt.addEventListener('keypress', function (e) {
            var editBox = self._editBox;
            if (e.keyCode === KEY.enter) {
                e.stopPropagation();
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
            }
        });

        tmpEdTxt.addEventListener('blur', function () {
            var editBox = self._editBox;
            editBox._text = this.value;
            self._updateDomTextCases();
            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnd) {
                editBox._delegate.editBoxEditingDidEnd(editBox);
            }
            if (this.value === '') {
                this.style.fontSize = editBox._placeholderFontSize + 'px';
                this.style.color = Color.toHex(editBox._placeholderColor);
            }
            self._endEditing();
        });

        this._addDomToGameContainer();
        return tmpEdTxt;
    }

    // --- Labels (text + placeholder) ---
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
    }

    _removeLabels() {
        if (!this._textLabel) return;
        this._editBox.removeChild(this._textLabel);
        this._textLabel = null;
    }

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
    }

    setLineHeight(lineHeight) {
        if (this._textLabel) this._textLabel.setLineHeight(lineHeight);
    }

    _hiddenLabels() {
        if (this._textLabel) this._textLabel.setVisible(false);
        if (this._placeholderLabel) this._placeholderLabel.setVisible(false);
    }

    _updateDomTextCases() {
        var inputFlag = this._editBox._editBoxInputFlag;
        if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS) {
            this._editBox._text = this._editBox._text.toUpperCase();
        } else if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD) {
            this._editBox._text = capitalize(this._editBox._text);
        } else if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE) {
            this._editBox._text = capitalizeFirstLetter(this._editBox._text);
        }
    }

    _updateLabelStringStyle() {
        if (this._edTxt.type === 'password') {
            var passwordString = '';
            var len = this._editBox._text.length;
            for (var i = 0; i < len; ++i) passwordString += '\u25CF';
            if (this._textLabel) this._textLabel.setString(passwordString);
        } else {
            this._updateDomTextCases();
            if (this._textLabel) this._textLabel.setString(this._editBox._text);
        }
    }

    _showLabels() {
        this._hiddenLabels();
        if (this._edTxt.value === '') {
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
    }

    // --- Editing lifecycle ---
    _beginEditing() {
        if (!this._editBox._alwaysOnTop) {
            if (this._edTxt.style.display === 'none') {
                this._edTxt.style.display = '';
                this._edTxt.focus();
            }
        }
        if (!this._editingMode) this._onBeginEditing();
        this._editingMode = true;
    }

    _endEditing() {
        if (!this._editBox._alwaysOnTop) {
            this._edTxt.style.display = 'none';
        }
        this._showLabels();
        if (this._editingMode) this._onEndEditing();
        this._editingMode = false;
    }

    // --- Font ---
    setFont(fontName, fontSize) {
        this._edFontName = fontName || this._edFontName;
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    }

    setFontName(fontName) {
        this._edFontName = fontName || this._edFontName;
        this._updateDOMFontStyle();
    }

    setFontSize(fontSize) {
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    }

    setFontColor(color) {
        if (!this._edTxt) return;
        if (this._edTxt.value !== this._editBox._placeholderText) {
            this._edTxt.style.color = Color.toHex(color);
        }
        if (this._textLabel) this._textLabel.setColor(color);
    }

    _updateDOMFontStyle() {
        if (!this._edTxt) return;
        if (this._edTxt.value !== '') {
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize + 'px';
        }
        if (this._textLabel) {
            this._textLabel.setFontSize(this._edFontSize);
            this._textLabel.setFontName(this._edFontName);
        }
    }

    // --- Placeholder ---
    setPlaceHolder(text) {
        this._placeholderLabel.setString(text);
    }

    _updateDOMPlaceholderFontStyle() {
        this._placeholderLabel.setFontName(this._editBox._placeholderFontName);
        this._placeholderLabel.setFontSize(this._editBox._placeholderFontSize);
    }

    setPlaceholderFontColor(color) {
        this._placeholderLabel.setColor(color);
    }

    // --- Input mode / flag / max length / string ---
    setMaxLength(maxLength) {
        if (!this._edTxt) return;
        this._edTxt.maxLength = maxLength;
    }

    _updateDomInputType() {
        var inputMode = this._editBox._editBoxInputMode;
        if (inputMode === EDITBOX_INPUT_MODE_EMAILADDR) {
            this._edTxt.type = 'email';
        } else if (
            inputMode === EDITBOX_INPUT_MODE_DECIMAL ||
            inputMode === EDITBOX_INPUT_MODE_NUMERIC
        ) {
            this._edTxt.type = 'number';
        } else if (inputMode === EDITBOX_INPUT_MODE_PHONENUMBER) {
            this._edTxt.type = 'number';
            this._edTxt.pattern = '[0-9]*';
        } else if (inputMode === EDITBOX_INPUT_MODE_URL) {
            this._edTxt.type = 'url';
        } else {
            this._edTxt.type = 'text';
            if (this._editBox._keyboardReturnType === KEYBOARD_RETURNTYPE_SEARCH) {
                this._edTxt.type = 'search';
            }
        }
        if (this._editBox._editBoxInputFlag === EDITBOX_INPUT_FLAG_PASSWORD) {
            this._edTxt.type = 'password';
        }
    }

    setInputFlag(inputFlag) {
        if (!this._edTxt) return;
        this._updateDomInputType();
        this._edTxt.style.textTransform = 'none';
        if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS) {
            this._edTxt.style.textTransform = 'uppercase';
        } else if (inputFlag === EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD) {
            this._edTxt.style.textTransform = 'capitalize';
        }
        this._updateLabelStringStyle();
    }

    setInputMode(inputMode) {
        if (inputMode === EDITBOX_INPUT_MODE_ANY) {
            this._createDomTextArea();
        } else {
            this._createDomInput();
        }
        this._updateDomInputType();
        var contentSize = this._editBox.getContentSize();
        this.updateSize(contentSize.width, contentSize.height);
    }

    setString(text) {
        if (!this._edTxt) return;
        if (text === null) return;
        this._edTxt.value = text;
        if (text === '') {
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
            if (this._textLabel) this._textLabel.setColor(this._editBox._textColor);
            if (!this._editingMode) {
                if (this._placeholderLabel) this._placeholderLabel.setVisible(false);
                if (this._textLabel) this._textLabel.setVisible(true);
            }
            this._updateLabelStringStyle();
        }
    }

    // --- Sizing / DOM container management ---
    updateSize(newWidth, newHeight) {
        var dom = this._edTxt;
        if (!dom) return;
        dom.style['width'] = newWidth + 'px';
        dom.style['height'] = newHeight + 'px';
        this._updateLabelPosition(new Size(newWidth, newHeight));
    }

    _addDomToGameContainer() {
        Game.getInstance().container.appendChild(this._edTxt);
    }

    _removeDomFromGameContainer() {
        var dom = this._edTxt;
        if (dom) {
            var hasChild = false;
            if ('contains' in Game.getInstance().container) {
                hasChild = Game.getInstance().container.contains(dom);
            } else {
                hasChild = Game.getInstance().container.compareDocumentPosition(dom) % 16;
            }
            if (hasChild) Game.getInstance().container.removeChild(dom);
        }
        this._edTxt = null;
    }
}

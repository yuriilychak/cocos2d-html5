import { Size, Color, KEY, ServiceLocator } from "@aspect/core";
import { LabelBMFont } from '@aspect/labels';
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
const CARET_CHAR = '|';
const CARET_BLINK_INTERVAL = 0.5;

function capitalize(string) {
    return string.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Base class implementing hidden-input + LabelBMFont rendering for an EditBox.
 *
 * The DOM <input>/<textarea> element is created off-screen (1x1, opacity 0)
 * purely to capture keystrokes and to trigger the soft keyboard on mobile.
 * The visible text and placeholder are drawn by LabelBMFont children of the
 * EditBox, kept in sync with the DOM element's value via input events.
 *
 * Subclasses (DesktopEditBoxInput / MobileEditBoxInput) override the
 * lifecycle hooks _onBeginEditing/_onEndEditing/_onFocus for platform quirks.
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
        this._caretVisible = true;
        this._caretPos = 0;
        this._caretSprite = null;
        this._blinkedSprite = null;
        this._caretBlinker = this._toggleCaret.bind(this);
        this._caretSyncHandler = this._scheduleCaretSync.bind(this);
    }

    // --- Lifecycle hooks (overridden by mobile) ---
    _onBeginEditing() {}
    _onEndEditing() {}
    _onFocus() {}

    // The DOM input is invisible, so no transform sync is required. The
    // method is kept so that subclasses (mobile) and EditBox.visit() can
    // still call it without surprises.
    updateMatrix() {}

    updateVisibility() {}

    // --- DOM creation ---
    _applyHiddenInputStyle(el) {
        el.style.opacity = '0';
        el.style.position = 'absolute';
        el.style.top = '0px';
        el.style.left = '0px';
        el.style.width = '1px';
        el.style.height = '1px';
        el.style.padding = '0';
        el.style.margin = '0';
        el.style.border = '0';
        el.style.background = 'transparent';
        el.style.color = 'transparent';
        el.style.caretColor = 'transparent';
        el.style.outline = 'none';
        el.style.zIndex = '-1';
        el.style.pointerEvents = 'none';
        el.style.resize = 'none';
        el.style.overflow = 'hidden';
        el.style.className = 'cocosEditBox';
    }

    _onDomInput() {
        var editBox = this._editBox;
        if (this._edTxt.value.length > this._edTxt.maxLength) {
            this._edTxt.value = this._edTxt.value.slice(0, this._edTxt.maxLength);
        }
        if (editBox._text !== this._edTxt.value) {
            editBox._text = this._edTxt.value;
            this._updateDomTextCases();
        }
        this._caretPos = this._edTxt.selectionStart;
        this._updateLabelStringStyle();
        this._updatePlaceholderVisibility();
        if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
            editBox._delegate.editBoxTextChanged(editBox, editBox._text);
        }
    }

    _onDomFocus() {
        var editBox = this._editBox;
        this._editingMode = true;
        this._caretPos = this._edTxt.selectionStart;
        this._updateLabelStringStyle();
        this._updatePlaceholderVisibility();
        this._startCaretBlink();
        this._onFocus();
        if (editBox._delegate && editBox._delegate.editBoxEditingDidBegin) {
            editBox._delegate.editBoxEditingDidBegin(editBox);
        }
    }

    _onDomBlur() {
        var editBox = this._editBox;
        editBox._text = this._edTxt.value;
        this._updateDomTextCases();
        this._editingMode = false;
        this._stopCaretBlink();
        this._updateLabelStringStyle();
        this._updatePlaceholderVisibility();
        if (editBox._delegate && editBox._delegate.editBoxEditingDidEnd) {
            editBox._delegate.editBoxEditingDidEnd(editBox);
        }
        this._onEndEditing();
    }

    _createDomInput() {
        this._removeDomFromGameContainer();
        var self = this;
        var el = (this._edTxt = document.createElement('input'));
        el.type = 'text';
        this._applyHiddenInputStyle(el);
        this.setMaxLength(this._editBox._maxLength);

        el.addEventListener('input', function () { self._onDomInput(); });
        el.addEventListener('focus', function () { self._onDomFocus(); });
        el.addEventListener('blur', function () { self._onDomBlur(); });
        el.addEventListener('keydown', this._caretSyncHandler);
        el.addEventListener('keyup', this._caretSyncHandler);
        el.addEventListener('select', this._caretSyncHandler);
        el.addEventListener('keypress', function (e) {
            if (e.keyCode === KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                var editBox = self._editBox;
                editBox._text = el.value;
                self._updateDomTextCases();
                self._updateLabelStringStyle();
                self._endEditing();
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
                ServiceLocator.game.canvas.focus();
            }
        });

        this._addDomToGameContainer();
        return el;
    }

    _createDomTextArea() {
        this._removeDomFromGameContainer();
        var self = this;
        var el = (this._edTxt = document.createElement('textarea'));
        this._applyHiddenInputStyle(el);
        this.setMaxLength(this._editBox._maxLength);

        el.addEventListener('input', function () { self._onDomInput(); });
        el.addEventListener('focus', function () { self._onDomFocus(); });
        el.addEventListener('blur', function () { self._onDomBlur(); });
        el.addEventListener('keydown', this._caretSyncHandler);
        el.addEventListener('keyup', this._caretSyncHandler);
        el.addEventListener('select', this._caretSyncHandler);
        el.addEventListener('keypress', function (e) {
            if (e.keyCode === KEY.enter) {
                e.stopPropagation();
                var editBox = self._editBox;
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
            }
        });

        this._addDomToGameContainer();
        return el;
    }

    // --- Labels (text + placeholder) ---
    _createLabels() {
        var fntFile = this._editBox._fntFile;
        if (!fntFile) return;
        var editBoxSize = this._editBox.getContentSize();
        if (!this._textLabel) {
            this._textLabel = new LabelBMFont('', fntFile);
            this._textLabel.color = this._editBox._textColor;
            this._editBox.addChild(this._textLabel, 100);
        }
        if (!this._placeholderLabel) {
            this._placeholderLabel = new LabelBMFont('', fntFile);
            this._placeholderLabel.color = this._editBox._placeholderColor;
            this._editBox.addChild(this._placeholderLabel, 100);
        }
        this._updateLabelPosition(editBoxSize);
        this._updatePlaceholderVisibility();
    }

    _updateLabelPosition(editBoxSize) {
        if (!this._textLabel || !this._placeholderLabel) return;

        var boundingWidth = editBoxSize.width - LEFT_PADDING;
        this._textLabel.boundingWidth = boundingWidth;
        this._placeholderLabel.boundingWidth = boundingWidth;

        if (this._editBox._editBoxInputMode === EDITBOX_INPUT_MODE_ANY) {
            this._textLabel.setAnchorPoint(0, 1);
            this._placeholderLabel.setAnchorPoint(0, 1);
            this._textLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setPosition(LEFT_PADDING, editBoxSize.height);
        } else {
            this._textLabel.setAnchorPoint(0, 0.5);
            this._placeholderLabel.setAnchorPoint(0, 0.5);
            this._textLabel.setPosition(LEFT_PADDING, editBoxSize.height / 2);
            this._placeholderLabel.setPosition(LEFT_PADDING, editBoxSize.height / 2);
        }
    }

    _updatePlaceholderVisibility() {
        if (!this._textLabel || !this._placeholderLabel) return;
        var isEmpty = !this._editBox._text;
        this._placeholderLabel.setVisible(isEmpty && !this._editingMode);
        this._textLabel.setVisible(!isEmpty || this._editingMode);
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
        if (!this._textLabel) return;
        var text;
        if (this._editBox._editBoxInputFlag === EDITBOX_INPUT_FLAG_PASSWORD) {
            text = '';
            var len = this._editBox._text.length;
            for (var i = 0; i < len; ++i) text += '\u25CF';
        } else {
            this._updateDomTextCases();
            text = this._editBox._text;
        }
        var displayText;
        if (this._editingMode) {
            var pos = Math.max(0, Math.min(this._caretPos, text.length));
            this._caretPos = pos;
            displayText = text.slice(0, pos) + CARET_CHAR + text.slice(pos);
        } else {
            displayText = text;
        }
        this._restoreBlinkedSprite();
        this._textLabel.string = displayText;
        this._caretSprite = this._editingMode ? this._findCaretSprite() : null;
        this._caretVisible = true;
        if (this._editingMode) this._restartCaretBlink();
    }

    /**
     * After LabelBMFont.string the label's internal `_string` may be a
     * wrapped version with extra `\n`s, so a sprite at tag === _caretPos no
     * longer corresponds to the caret glyph. Walk the wrapped string,
     * skipping newlines (and null terminators), and return the sprite whose
     * tag matches our display-position caret.
     */
    _findCaretSprite() {
        var wrapped = this._textLabel._string || '';
        var nonSkip = 0;
        for (var i = 0; i < wrapped.length; i++) {
            var code = wrapped.charCodeAt(i);
            if (code === 10 || code === 0) continue;
            if (nonSkip === this._caretPos) {
                return this._textLabel.getChildByTag(i);
            }
            nonSkip++;
        }
        return null;
    }

    _restoreBlinkedSprite() {
        if (this._blinkedSprite) {
            this._blinkedSprite.setVisible(true);
            this._blinkedSprite = null;
        }
    }

    _toggleCaret() {
        if (!this._caretSprite || !this._editingMode) return;
        this._caretVisible = !this._caretVisible;
        this._caretSprite.setVisible(this._caretVisible);
        this._blinkedSprite = this._caretVisible ? null : this._caretSprite;
    }

    _syncCaret() {
        if (!this._edTxt || !this._editingMode) return;
        var pos = this._edTxt.selectionStart;
        if (pos === this._caretPos) return;
        this._caretPos = pos;
        this._updateLabelStringStyle();
    }

    _scheduleCaretSync() {
        var self = this;
        setTimeout(function () { self._syncCaret(); }, 0);
    }

    _restartCaretBlink() {
        this._stopCaretBlink();
        this._startCaretBlink();
    }

    _startCaretBlink() {
        this._editBox.schedule(this._caretBlinker, CARET_BLINK_INTERVAL);
    }

    _stopCaretBlink() {
        this._editBox.unschedule(this._caretBlinker);
    }

    // --- Editing lifecycle ---
    _beginEditing() {
        if (this._edTxt && document.activeElement !== this._edTxt) {
            this._edTxt.focus();
        }
        if (!this._editingMode) this._onBeginEditing();
        this._editingMode = true;
        this._updatePlaceholderVisibility();
    }

    _endEditing() {
        if (this._edTxt && document.activeElement === this._edTxt) {
            this._edTxt.blur();
        }
        this._editingMode = false;
        this._updatePlaceholderVisibility();
    }

    // --- Font ---
    setFont(fontName, fontSize) {
        this._edFontName = fontName || this._edFontName;
        this._edFontSize = fontSize || this._edFontSize;
        this._updateLabelFontStyle();
    }

    setFontName(fontName) {
        this._edFontName = fontName || this._edFontName;
        this._updateLabelFontStyle();
    }

    setFontSize(fontSize) {
        this._edFontSize = fontSize || this._edFontSize;
        this._updateLabelFontStyle();
    }

    setFontColor(color) {
        if (this._textLabel) this._textLabel.color = color;
    }

    _updateLabelFontStyle() {
        if (this._textLabel) {
            this._textLabel.fontSize = this._edFontSize;
        }
    }

    // --- Placeholder ---
    setPlaceHolder(text) {
        if (this._placeholderLabel) this._placeholderLabel.string = text;
    }

    _updateDOMPlaceholderFontStyle() {
        if (this._placeholderLabel) {
            this._placeholderLabel.fontSize = this._editBox._placeholderFontSize;
        }
    }

    setPlaceholderFontColor(color) {
        if (this._placeholderLabel) this._placeholderLabel.color = color;
    }

    // --- Input mode / flag / max length / string ---
    setMaxLength(maxLength) {
        if (!this._edTxt) return;
        this._edTxt.maxLength = maxLength;
    }

    _updateDomInputType() {
        if (!this._edTxt || this._edTxt.tagName === 'TEXTAREA') return;
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

    setInputFlag() {
        if (!this._edTxt) return;
        this._updateDomInputType();
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

    set string(text) {
        if (text === null) return;
        if (this._edTxt) this._edTxt.value = text;
        this._editBox._text = text;
        this._updateLabelStringStyle();
        this._updatePlaceholderVisibility();
    }

    // --- Sizing / DOM container management ---
    updateSize(newWidth, newHeight) {
        this._updateLabelPosition(new Size(newWidth, newHeight));
    }

    _addDomToGameContainer() {
        ServiceLocator.game.container.appendChild(this._edTxt);
    }

    _removeDomFromGameContainer() {
        var dom = this._edTxt;
        if (dom) {
            var container = ServiceLocator.game.container;
            var hasChild = 'contains' in container
                ? container.contains(dom)
                : container.compareDocumentPosition(dom) % 16;
            if (hasChild) container.removeChild(dom);
        }
        this._edTxt = null;
    }
}

import {
  Node,
  NewClass,
  Color,
  Point,
  Rect,
  RendererConfig,
  EventListener,
  EventManager,
  LabelTTF,
  warn
} from "@aspect/core";
import {
  EDITBOX_INPUT_MODE_ANY,
  EDITBOX_INPUT_FLAG_SENSITIVE,
  KEYBOARD_RETURNTYPE_DEFAULT
} from "./constants";

export class EditBoxDelegate extends NewClass {
    constructor() { super(); }
    editBoxEditingDidBegin(sender) {}
    editBoxEditingDidEnd(sender) {}
    editBoxTextChanged(sender, text) {}
    editBoxReturn(sender) {}
}

export class EditBox extends Node {
  /**
   * @param {Size} size
   * @param {Scale9Sprite} normal9SpriteBg
   */
  constructor(size, normal9SpriteBg) {
    super();

    this._backgroundSprite = null;
    this._delegate = null;
    this._editBoxInputMode = EDITBOX_INPUT_MODE_ANY;
    this._editBoxInputFlag = EDITBOX_INPUT_FLAG_SENSITIVE;
    this._keyboardReturnType = KEYBOARD_RETURNTYPE_DEFAULT;
    this._maxLength = 50;
    this._text = "";
    this._textColor = null;
    this._placeholderText = "";
    this._placeholderFontName = "";
    this._placeholderFontSize = 14;
    this._placeholderColor = null;
    this._className = "EditBox";
    this._touchListener = null;
    this._touchEnabled = true;

    this._anchorPoint = new Point(0.5, 0.5);
    this._textColor = Color.WHITE;
    this._placeholderColor = Color.GRAY;

    this._renderCmd._createLabels();
    this.createDomElementIfNeeded();
    this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg);

    this._touchListener = EventListener.create({
      event: EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this._onTouchBegan.bind(this),
      onTouchEnded: this._onTouchEnded.bind(this)
    });
    EventManager.getInstance().addListener(this._touchListener, this);

    this.setInputFlag(this._editBoxInputFlag);
  }

  set font(v) {
    this._setFont(v);
  }
  set fontName(v) {
    this.setFontName(v);
  }
  set fontSize(v) {
    this.setFontSize(v);
  }
  set fontColor(v) {
    this.setFontColor(v);
  }

  get string() {
    return this.getString();
  }
  set string(v) {
    this.setString(v);
  }

  get maxLength() {
    return this.getMaxLength();
  }
  set maxLength(v) {
    this.setMaxLength(v);
  }

  get placeholder() {
    return this.getPlaceHolder();
  }
  set placeholder(v) {
    this.setPlaceHolder(v);
  }

  set placeholderFont(v) {
    this._setPlaceholderFont(v);
  }
  set placeholderFontName(v) {
    this.setPlaceholderFontName(v);
  }
  set placeholderFontSize(v) {
    this.setPlaceholderFontSize(v);
  }
  set placeholderFontColor(v) {
    this.setPlaceholderFontColor(v);
  }
  set inputFlag(v) {
    this.setInputFlag(v);
  }
  set delegate(v) {
    this.setDelegate(v);
  }
  set inputMode(v) {
    this.setInputMode(v);
  }
  set returnType(v) {
    this.setReturnType(v);
  }

  setTouchEnabled(enable) {
    if (this._touchEnabled === enable) return;
    this._touchEnabled = enable;
    if (this._touchEnabled) {
      EventManager.getInstance().addListener(this._touchListener, this);
    } else {
      EventManager.getInstance().removeListener(this._touchListener);
    }
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas) {
      return new this.constructor.CanvasRenderCmd(this);
    } else {
      return new this.constructor.WebGLRenderCmd(this);
    }
  }

  setContentSize(width, height) {
    if (width.width !== undefined && width.height !== undefined) {
      height = width.height;
      width = width.width;
    }
    super.setContentSize(width, height);
    this._updateEditBoxSize(width, height);
  }

  setVisible(visible) {
    super.setVisible(visible);
    this._renderCmd.updateVisibility();
  }

  createDomElementIfNeeded() {
    if (!this._renderCmd._edTxt) {
      this._renderCmd._createDomTextArea();
    }
  }

  setTabIndex(index) {
    if (this._renderCmd._edTxt) {
      this._renderCmd._edTxt.tabIndex = index;
    }
  }

  getTabIndex() {
    if (this._renderCmd._edTxt) {
      return this._renderCmd._edTxt.tabIndex;
    }
    warn("The dom control is not created!");
    return -1;
  }

  setFocus() {
    if (this._renderCmd._edTxt) {
      this._renderCmd._edTxt.focus();
    }
  }

  isFocused() {
    if (this._renderCmd._edTxt) {
      return document.activeElement === this._renderCmd._edTxt;
    }
    warn("The dom control is not created!");
    return false;
  }

  stayOnTop(flag) {
    if (this._alwaysOnTop === flag) return;
    this._alwaysOnTop = flag;
    this._renderCmd.stayOnTop(this._alwaysOnTop);
  }

  cleanup() {
    super.cleanup();
    this._renderCmd._removeDomFromGameContainer();
  }

  _isAncestorsVisible(node) {
    if (null == node) return true;
    var parent = node.getParent();
    if (parent && !parent.isVisible()) return false;
    return this._isAncestorsVisible(parent);
  }

  _onTouchBegan(touch) {
    if (!this.isVisible() || !this._isAncestorsVisible(this)) return;
    var touchPoint = touch.getLocation();
    var bb = new Rect(0, 0, this._contentSize.width, this._contentSize.height);
    var hitted = Rect.containsPoint(bb, this.convertToNodeSpace(touchPoint));
    if (hitted) {
      return true;
    } else {
      this._renderCmd._endEditing();
      return false;
    }
  }

  _onTouchEnded() {
    if (!this.isVisible() || !this._isAncestorsVisible(this)) return;
    this._renderCmd._beginEditing();
  }

  _updateBackgroundSpriteSize(width, height) {
    if (this._backgroundSprite) {
      this._backgroundSprite.setContentSize(width, height);
    }
  }

  _updateEditBoxSize(size, height) {
    var newWidth = typeof size.width === "number" ? size.width : size;
    var newHeight = typeof size.height === "number" ? size.height : height;
    this._updateBackgroundSpriteSize(newWidth, newHeight);
    this._renderCmd.updateSize(newWidth, newHeight);
  }

  setLineHeight(lineHeight) {
    this._renderCmd.setLineHeight(lineHeight);
  }

  setFont(fontName, fontSize) {
    this._renderCmd.setFont(fontName, fontSize);
  }

  _setFont(fontStyle) {
    this._renderCmd._setFont(fontStyle);
  }

  getBackgroundSprite() {
    return this._backgroundSprite;
  }

  setFontName(fontName) {
    this._renderCmd.setFontName(fontName);
  }

  setFontSize(fontSize) {
    this._renderCmd.setFontSize(fontSize);
  }

  setString(text) {
    if (text.length >= this._maxLength) {
      text = text.slice(0, this._maxLength);
    }
    this._text = text;
    this._renderCmd.setString(text);
  }

  setFontColor(color) {
    this._textColor = color;
    this._renderCmd.setFontColor(color);
  }

  setMaxLength(maxLength) {
    if (!isNaN(maxLength)) {
      if (maxLength < 0) {
        maxLength = 65535;
      }
      this._maxLength = maxLength;
      this._renderCmd.setMaxLength(maxLength);
    }
  }

  getMaxLength() {
    return this._maxLength;
  }

  setPlaceHolder(text) {
    if (text !== null) {
      this._renderCmd.setPlaceHolder(text);
      this._placeholderText = text;
    }
  }

  setPlaceholderFont(fontName, fontSize) {
    this._placeholderFontName = fontName;
    this._placeholderFontSize = fontSize;
    this._renderCmd._updateDOMPlaceholderFontStyle();
  }

  _setPlaceholderFont(fontStyle) {
    var res = LabelTTF._fontStyleRE.exec(fontStyle);
    if (res) {
      this._placeholderFontName = res[2];
      this._placeholderFontSize = parseInt(res[1]);
      this._renderCmd._updateDOMPlaceholderFontStyle();
    }
  }

  setPlaceholderFontName(fontName) {
    this._placeholderFontName = fontName;
    this._renderCmd._updateDOMPlaceholderFontStyle();
  }

  setPlaceholderFontSize(fontSize) {
    this._placeholderFontSize = fontSize;
    this._renderCmd._updateDOMPlaceholderFontStyle();
  }

  setPlaceholderFontColor(color) {
    this._placeholderColor = color;
    this._renderCmd.setPlaceholderFontColor(color);
  }

  setInputFlag(inputFlag) {
    this._editBoxInputFlag = inputFlag;
    this._renderCmd.setInputFlag(inputFlag);
  }

  getString() {
    return this._text;
  }

  initWithSizeAndBackgroundSprite(size, normal9SpriteBg) {
    if (this._backgroundSprite) {
      this._backgroundSprite.removeFromParent();
    }
    this._backgroundSprite = normal9SpriteBg;
    this.setContentSize(size);

    if (this._backgroundSprite && !this._backgroundSprite.parent) {
      this._backgroundSprite.setAnchorPoint(new Point(0, 0));
      this.addChild(this._backgroundSprite);
      this._updateBackgroundSpriteSize(size.width, size.height);
    }

    this.x = 0;
    this.y = 0;
    return true;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  getPlaceHolder() {
    return this._placeholderText;
  }

  setInputMode(inputMode) {
    if (this._editBoxInputMode === inputMode) return;

    var oldText = this.getString();
    this._editBoxInputMode = inputMode;

    this._renderCmd.setInputMode(inputMode);
    this._renderCmd.transform();

    this.setString(oldText);
    this._renderCmd._updateLabelPosition(this.getContentSize());
  }

  setReturnType(returnType) {
    this._keyboardReturnType = returnType;
    this._renderCmd._updateDomInputType();
  }

  /**
   * @warning HTML5 Only
   * @param {Size} size
   * @param {color} bgColor
   */
  initWithBackgroundColor(size, bgColor) {
    this._edWidth = size.width;
    this.dom.style.width = this._edWidth.toString() + "px";
    this._edHeight = size.height;
    this.dom.style.height = this._edHeight.toString() + "px";
    this.dom.style.backgroundColor = Color.toHex(bgColor);
  }
}

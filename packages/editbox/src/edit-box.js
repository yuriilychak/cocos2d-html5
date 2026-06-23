import {
  Node,
  Color,
  Point,
  Rect,
  EventListener,
  EventListenerType,
  warn,
  ServiceLocator
} from "@aspect/core";
import {
  EDITBOX_INPUT_MODE_ANY,
  EDITBOX_INPUT_FLAG_SENSITIVE,
  KEYBOARD_RETURNTYPE_DEFAULT
} from "./constants";
import { DesktopEditBoxInput } from "./edit-box-input-desktop";
import { MobileEditBoxInput } from "./edit-box-input-mobile";

const FONT_STYLE_RE = /^(\d+)px\s+['"]?([\w\s\d]+)['"]?$/;

export class EditBox extends Node {
  /**
   * @param {Size} size
   * @param {Scale9Sprite} normal9SpriteBg
   * @param {String} fntFile Path to a preloaded BMFont .fnt file used to
   *                         render the text and placeholder labels.
   * @param {Rect} [backgroundPadding] Optional Rect(paddingLeft, paddingTop,
   *                         paddingRight, paddingBottom) that enlarges the
   *                         background sprite around the edit box area.
   */
  constructor(size, normal9SpriteBg, fntFile, backgroundPadding) {
    super();

    this._backgroundSprite = null;
    this._backgroundPadding = backgroundPadding || new Rect();
    this._delegate = null;
    this._editBoxInputMode = EDITBOX_INPUT_MODE_ANY;
    this._editBoxInputFlag = EDITBOX_INPUT_FLAG_SENSITIVE;
    this._keyboardReturnType = KEYBOARD_RETURNTYPE_DEFAULT;
    this._maxLength = 50;
    this._text = "";
    this._placeholderText = "";
    this._placeholderFontName = "";
    this._placeholderFontSize = 14;
    this._fntFile = fntFile || null;
    this._className = "EditBox";
    this._touchListener = null;
    this._touchEnabled = true;

    this._anchorPoint = new Point(0.5, 0.5);
    this._textColor = Color.WHITE;
    this._placeholderColor = Color.GRAY;

    this._input = ServiceLocator.sys.isMobile
      ? new MobileEditBoxInput(this)
      : new DesktopEditBoxInput(this);

    this._input._createLabels();
    this.createDomElementIfNeeded();
    this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg);

    this._touchListener = EventListener.create({
      event: EventListenerType.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this._onTouchBegan.bind(this),
      onTouchEnded: this._onTouchEnded.bind(this)
    });
    ServiceLocator.eventManager.addListener(this._touchListener, this);

    this.inputFlag = this._editBoxInputFlag;
  }

  set font(fontStyle) {
    var res = FONT_STYLE_RE.exec(fontStyle);
    if (res) {
      this._input.setFont(res[2], parseInt(res[1]));
    }
  }

  set fontName(fontName) {
    this._input.setFontName(fontName);
  }

  set fontSize(fontSize) {
    this._input.setFontSize(fontSize);
  }

  get fontColor() {
    return this._textColor;
  }
  set fontColor(color) {
    this._textColor = color;
    this._input.setFontColor(color);
  }

  get string() {
    return this._text;
  }
  set string(text) {
    if (text.length >= this._maxLength) {
      text = text.slice(0, this._maxLength);
    }
    this._text = text;
    this._input.string = text;
  }

  get maxLength() {
    return this._maxLength;
  }
  set maxLength(maxLength) {
    if (!isNaN(maxLength)) {
      if (maxLength < 0) {
        maxLength = 65535;
      }
      this._maxLength = maxLength;
      this._input.setMaxLength(maxLength);
    }
  }

  get placeholder() {
    return this._placeholderText;
  }
  set placeholder(text) {
    if (text !== null) {
      this._input.setPlaceHolder(text);
      this._placeholderText = text;
    }
  }

  set placeholderFont(fontStyle) {
    var res = FONT_STYLE_RE.exec(fontStyle);
    if (res) {
      this._placeholderFontName = res[2];
      this._placeholderFontSize = parseInt(res[1]);
      this._input._updateDOMPlaceholderFontStyle();
    }
  }

  get placeholderFontName() {
    return this._placeholderFontName;
  }
  set placeholderFontName(fontName) {
    this._placeholderFontName = fontName;
    this._input._updateDOMPlaceholderFontStyle();
  }

  get placeholderFontSize() {
    return this._placeholderFontSize;
  }
  set placeholderFontSize(fontSize) {
    this._placeholderFontSize = fontSize;
    this._input._updateDOMPlaceholderFontStyle();
  }

  get placeholderFontColor() {
    return this._placeholderColor;
  }
  set placeholderFontColor(color) {
    this._placeholderColor = color;
    this._input.setPlaceholderFontColor(color);
  }

  get inputFlag() {
    return this._editBoxInputFlag;
  }
  set inputFlag(inputFlag) {
    this._editBoxInputFlag = inputFlag;
    this._input.setInputFlag(inputFlag);
  }

  get delegate() {
    return this._delegate;
  }
  set delegate(delegate) {
    this._delegate = delegate;
  }

  get inputMode() {
    return this._editBoxInputMode;
  }
  set inputMode(inputMode) {
    if (this._editBoxInputMode === inputMode) return;

    var oldText = this.string;
    this._editBoxInputMode = inputMode;

    this._input.setInputMode(inputMode);
    this._renderCmd.transform();

    this.string = oldText;
    this._input._updateLabelPosition(this.getContentSize());
  }

  get returnType() {
    return this._keyboardReturnType;
  }
  set returnType(returnType) {
    this._keyboardReturnType = returnType;
    this._input._updateDomInputType();
  }

  setTouchEnabled(enable) {
    if (this._touchEnabled === enable) return;
    this._touchEnabled = enable;
    if (this._touchEnabled) {
      ServiceLocator.eventManager.addListener(this._touchListener, this);
    } else {
      ServiceLocator.eventManager.removeListener(this._touchListener);
    }
  }

  visit(parent) {
    super.visit(parent);
    if (this._input) this._input.updateMatrix(this._renderCmd._worldTransform);
  }

  setContentSize(width, height) {
    if (width.width !== undefined && width.height !== undefined) {
      height = width.height;
      width = width.width;
    }
    super.setContentSize(width, height);
    this._updateEditBoxSize(width, height);
  }

  set visible(visible) {
    super.visible = visible;
    this._input.updateVisibility();
  }

  createDomElementIfNeeded() {
    if (!this._input._edTxt) {
      this._input._createDomTextArea();
    }
  }

  setTabIndex(index) {
    if (this._input._edTxt) {
      this._input._edTxt.tabIndex = index;
    }
  }

  getTabIndex() {
    if (this._input._edTxt) {
      return this._input._edTxt.tabIndex;
    }
    warn("The dom control is not created!");
    return -1;
  }

  setFocus() {
    if (this._input._edTxt) {
      this._input._edTxt.focus();
    }
  }

  isFocused() {
    if (this._input._edTxt) {
      return document.activeElement === this._input._edTxt;
    }
    warn("The dom control is not created!");
    return false;
  }

  cleanup() {
    super.cleanup();
    this._input._removeDomFromGameContainer();
  }

  _isAncestorsVisible(node) {
    if (null == node) return true;
    var parent = node.parent;
    if (parent && !parent.visible) return false;
    return this._isAncestorsVisible(parent);
  }

  _onTouchBegan(touch) {
    if (!this.visible || !this._isAncestorsVisible(this)) return;
    var bb = new Rect(0, 0, this._contentSize.width, this._contentSize.height);
    var hitted = Rect.containsPoint(bb, this.convertToNodeSpace(touch));
    if (hitted) {
      return true;
    } else {
      this._input._endEditing();
      return false;
    }
  }

  _onTouchEnded() {
    if (!this.visible || !this._isAncestorsVisible(this)) return;
    this._input._beginEditing();
  }

  _updateBackgroundSpriteSize(width, height) {
    if (this._backgroundSprite) {
      var padding = this._backgroundPadding;
      this._backgroundSprite.setPosition(-padding.x, -padding.y);
      this._backgroundSprite.setContentSize(
        width + padding.x + padding.width,
        height + padding.y + padding.height
      );
    }
  }

  _updateEditBoxSize(size, height) {
    var newWidth = typeof size.width === "number" ? size.width : size;
    var newHeight = typeof size.height === "number" ? size.height : height;
    this._updateBackgroundSpriteSize(newWidth, newHeight);
    this._input.updateSize(newWidth, newHeight);
  }

  setFont(fontName, fontSize) {
    this._input.setFont(fontName, fontSize);
  }

  getBackgroundSprite() {
    return this._backgroundSprite;
  }

  setPlaceholderFont(fontName, fontSize) {
    this._placeholderFontName = fontName;
    this._placeholderFontSize = fontSize;
    this._input._updateDOMPlaceholderFontStyle();
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
}

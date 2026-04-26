import { LabelTTF } from "@aspect/core";
import { MenuItemLabel } from "./menu-item-label";

// Module-level font state (shared across all MenuItemFont instances)
export let _globalFontSize = 32; // ITEM_SIZE default
export let _globalFontName = "Arial";
export let _globalFontNameRelease = false;

/**
 * Helper class that creates a MenuItemLabel with a LabelTTF.
 */
export class MenuItemFont extends MenuItemLabel {
  _fontName = null;
  _fontSize = 0;

  constructor(value, callback, target) {
    var label;
    if (value && value.length > 0) {
      label = new LabelTTF(value, _globalFontName, _globalFontSize);
    }
    super(label, callback, target);
    if (label) {
      this._fontName = _globalFontName;
      this._fontSize = _globalFontSize;
    }
  }

  initWithString(value, callback, target) {
    if (!value || value.length === 0)
      throw new Error(
        "Value should be non-null and its length should be greater than 0"
      );

    this._fontName = _globalFontName;
    this._fontSize = _globalFontSize;

    var label = new LabelTTF(value, this._fontName, this._fontSize);
    this.initWithLabel(label, callback, target);
    return true;
  }

  setFontSize(s) {
    this._fontSize = s;
    this._recreateLabel();
  }

  getFontSize() {
    return this._fontSize;
  }

  setFontName(name) {
    this._fontName = name;
    this._recreateLabel();
  }

  getFontName() {
    return this._fontName;
  }

  _recreateLabel() {
    var label = new LabelTTF(
      this._label.string,
      this._fontName,
      this._fontSize
    );
    this.setLabel(label);
  }
}

// Static class-level font methods
MenuItemFont.setFontSize = function (fontSize) {
  _globalFontSize = fontSize;
};

MenuItemFont.fontSize = function () {
  return _globalFontSize;
};

MenuItemFont.setFontName = function (name) {
  if (_globalFontNameRelease) {
    _globalFontName = "";
  }
  _globalFontName = name;
  _globalFontNameRelease = true;
};

MenuItemFont.fontName = function () {
  return _globalFontName;
};

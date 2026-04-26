import { Node, Rect, isString, isFunction } from "@aspect/core";

/**
 * Subclass MenuItem (or any subclass) to create your custom MenuItem objects.
 * @param {function|String} callback
 * @param {Node} target
 */
export class MenuItem extends Node {
  _enabled = false;
  _target = null;
  _callback = null;
  _isSelected = false;
  _className = "MenuItem";

  constructor(callback, target) {
    super();
    this._target = null;
    this._callback = null;
    this._isSelected = false;
    this._enabled = false;

    super.setAnchorPoint(0.5, 0.5);
    this._target = target || null;
    this._callback = callback || null;
    if (this._callback) {
      this._enabled = true;
    }
  }

  get enabled() {
    return this.isEnabled();
  }
  set enabled(v) {
    this.setEnabled(v);
  }

  isSelected() {
    return this._isSelected;
  }

  setOpacityModifyRGB(value) {}
  isOpacityModifyRGB() {
    return false;
  }

  isEnabled() {
    return this._enabled;
  }

  setEnabled(enable) {
    this._enabled = enable;
  }

  initWithCallback(callback, target) {
    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this._target = target;
    this._callback = callback;
    this._enabled = true;
    this._isSelected = false;
    return true;
  }

  rect() {
    var locPosition = this._position,
      locContentSize = this._contentSize,
      locAnchorPoint = this._anchorPoint;
    return new Rect(
      locPosition.x - locContentSize.width * locAnchorPoint.x,
      locPosition.y - locContentSize.height * locAnchorPoint.y,
      locContentSize.width,
      locContentSize.height
    );
  }

  selected() {
    this._isSelected = true;
  }

  unselected() {
    this._isSelected = false;
  }

  setCallback(callback, target) {
    this._target = target;
    this._callback = callback;
  }

  activate() {
    if (this._enabled) {
      var locTarget = this._target,
        locCallback = this._callback;
      if (!locCallback) return;
      if (locTarget && isString(locCallback)) {
        locTarget[locCallback](this);
      } else if (locTarget && isFunction(locCallback)) {
        locCallback.call(locTarget, this);
      } else locCallback(this);
    }
  }
}

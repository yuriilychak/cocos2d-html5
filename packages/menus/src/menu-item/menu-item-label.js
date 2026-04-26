import { color, ZOOM_ACTION_TAG } from "@aspect/core";
import { ScaleTo } from "@aspect/actions";
import { MenuItem } from "./menu-item";

/**
 * Any Node that supports the LabelProtocol can be added.
 * @param {Node} label
 * @param {function|String} selector
 * @param {Node} target
 */
export class MenuItemLabel extends MenuItem {
  _disabledColor = null;
  _label = null;
  _originalScale = 0;
  _colorBackup = null;

  constructor(label, selector, target) {
    super(selector, target);
    this._disabledColor = null;
    this._label = null;
    this._colorBackup = null;

    if (label) {
      this._originalScale = 1.0;
      this._colorBackup = color.WHITE;
      this._disabledColor = color(126, 126, 126);
      this.setLabel(label);

      if (label.textureLoaded && !label.textureLoaded()) {
        label.addEventListener(
          "load",
          function (sender) {
            this.width = sender.width;
            this.height = sender.height;
            if (this.parent && this.parent.updateAlign) {
              this.parent.updateAlign();
            }
          },
          this
        );
      }

      this.setCascadeColorEnabled(true);
      this.setCascadeOpacityEnabled(true);
    }
  }

  get string() {
    return this.getString();
  }
  set string(v) {
    this.setString(v);
  }

  get disabledColor() {
    return this.getDisabledColor();
  }
  set disabledColor(v) {
    this.setDisabledColor(v);
  }

  get label() {
    return this.getLabel();
  }
  set label(v) {
    this.setLabel(v);
  }

  getDisabledColor() {
    return this._disabledColor;
  }
  setDisabledColor(color) {
    this._disabledColor = color;
  }

  getLabel() {
    return this._label;
  }

  setLabel(label) {
    if (label) {
      this.addChild(label);
      label.anchorX = 0;
      label.anchorY = 0;
      this.width = label.width;
      this.height = label.height;
      label.setCascadeColorEnabled(true);
    }
    if (this._label) {
      this.removeChild(this._label, true);
    }
    this._label = label;
  }

  setEnabled(enabled) {
    if (this._enabled !== enabled) {
      if (!enabled) {
        this._colorBackup = this.color;
        this._opacityBackup = this.opacity;
        this.setColor(this._disabledColor);
        this.setOpacity(128);
      } else {
        this.setColor(this._colorBackup);
        this.setOpacity(
          this._opacityBackup !== undefined ? this._opacityBackup : 255
        );
      }
    }
    super.setEnabled(enabled);
  }

  initWithLabel(label, selector, target) {
    this.initWithCallback(selector, target);
    this._originalScale = 1.0;
    this._colorBackup = color.WHITE;
    this._disabledColor = color(126, 126, 126);
    this.setLabel(label);
    this.setCascadeColorEnabled(true);
    this.setCascadeOpacityEnabled(true);
    return true;
  }

  setString(label) {
    this._label.string = label;
    this.width = this._label.width;
    this.height = this._label.height;
  }

  getString() {
    return this._label.string;
  }

  activate() {
    if (this._enabled) {
      this.stopAllActions();
      this.scale = this._originalScale;
      super.activate();
    }
  }

  selected() {
    if (this._enabled) {
      super.selected();
      var action = this.getActionByTag(ZOOM_ACTION_TAG);
      if (action) this.stopAction(action);
      else this._originalScale = this.scale;

      var zoomAction = new ScaleTo(0.1, this._originalScale * 1.2);
      zoomAction.setTag(ZOOM_ACTION_TAG);
      this.runAction(zoomAction);
    }
  }

  unselected() {
    if (this._enabled) {
      super.unselected();
      this.stopActionByTag(ZOOM_ACTION_TAG);
      var zoomAction = new ScaleTo(0.1, this._originalScale);
      zoomAction.setTag(ZOOM_ACTION_TAG);
      this.runAction(zoomAction);
    }
  }
}

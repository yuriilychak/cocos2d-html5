import { Sprite, Point, Color } from "@aspect/core";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSaturationBrightnessPicker extends Control {
  _saturation = 0;
  _brightness = 0;
  _background = null;
  _overlay = null;
  _shadow = null;
  _slider = null;
  _startPos = null;
  _boxPos = 0;
  _boxSize = 0;
  _className = "ControlSaturationBrightnessPicker";

  constructor(target, pos) {
    super();
    pos && this.initWithTargetAndPos(target, pos);
  }

  get saturation() {
    return this._saturation;
  }
  get brightness() {
    return this._brightness;
  }
  get background() {
    return this._background;
  }
  get overlay() {
    return this._overlay;
  }
  get shadow() {
    return this._shadow;
  }
  get slider() {
    return this._slider;
  }
  get startPos() {
    return this._startPos;
  }

  initWithTargetAndPos(target, pos) {
    if (super.init()) {
      this._background = Control.addSpriteToTargetWithPosAndAnchor(
        new Sprite("#default_theme/color_picker/tint.png"),
        target,
        pos,
        new Point(0.0, 0.0)
      );
      this._overlay = Control.addSpriteToTargetWithPosAndAnchor(
        new Sprite("#default_theme/color_picker/tint_gradient.png"),
        target,
        pos,
        new Point(0.0, 0.0)
      );
      this._shadow = Control.addSpriteToTargetWithPosAndAnchor(
        new Sprite("#default_theme/color_picker/tint_effect.png"),
        target,
        pos,
        new Point(0.0, 0.0)
      );
      this._slider = Control.addSpriteToTargetWithPosAndAnchor(
        new Sprite("#default_theme/color_picker/picker.png"),
        target,
        pos,
        new Point(0.5, 0.5)
      );
      this._startPos = pos;
      this._boxPos = 35;
      this._boxSize = this._background.getContentSize().width / 2;
      return true;
    }
    return false;
  }

  set enabled(enabled) {
    super.enabled = enabled;
    if (this._slider) {
      this._slider.enabled = enabled;
    }
  }

  get enabled() {
    return super.enabled;
  }

  updateWithHSV(hsv) {
    this._background.color = Color.fromHSV({ s: 1, h: hsv.h, v: 1 });
  }

  updateDraggerWithHSV(hsv) {
    var pos = new Point(
      this._startPos.x + this._boxPos + this._boxSize * (1 - hsv.s),
      this._startPos.y + this._boxPos + this._boxSize * hsv.v
    );
    this._updateSliderPosition(pos);
  }

  _updateSliderPosition(sliderPosition) {
    var centerX = this._startPos.x + this._background.boundingBox.width * 0.5;
    var centerY =
      this._startPos.y + this._background.boundingBox.height * 0.5;
    var dx = sliderPosition.x - centerX;
    var dy = sliderPosition.y - centerY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    var limit = this._background.boundingBox.width * 0.5;
    if (dist > limit) {
      sliderPosition.x = centerX + limit * Math.cos(angle);
      sliderPosition.y = centerY + limit * Math.sin(angle);
    }
    this._slider.setPosition(sliderPosition);
    if (sliderPosition.x < this._startPos.x + this._boxPos)
      sliderPosition.x = this._startPos.x + this._boxPos;
    else if (
      sliderPosition.x >
      this._startPos.x + this._boxPos + this._boxSize - 1
    )
      sliderPosition.x = this._startPos.x + this._boxPos + this._boxSize - 1;
    if (sliderPosition.y < this._startPos.y + this._boxPos)
      sliderPosition.y = this._startPos.y + this._boxPos;
    else if (sliderPosition.y > this._startPos.y + this._boxPos + this._boxSize)
      sliderPosition.y = this._startPos.y + this._boxPos + this._boxSize;
    this._saturation =
      1.0 -
      Math.abs(
        (this._startPos.x + this._boxPos - sliderPosition.x) / this._boxSize
      );
    this._brightness = Math.abs(
      (this._startPos.y + this._boxPos - sliderPosition.y) / this._boxSize
    );
  }

  _checkSliderPosition(location) {
    var centerX = this._startPos.x + this._background.boundingBox.width * 0.5;
    var centerY =
      this._startPos.y + this._background.boundingBox.height * 0.5;
    var dx = location.x - centerX;
    var dy = location.y - centerY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= this._background.boundingBox.width * 0.5) {
      this._updateSliderPosition(location);
      this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
      return true;
    }
    return false;
  }

  onTouchBegan(touch, event) {
    if (!this.enabled || !this.visible) return false;
    var touchLocation = this.getTouchLocation(touch);
    return this._checkSliderPosition(touchLocation);
  }

  onTouchMoved(touch, event) {
    var touchLocation = this.getTouchLocation(touch);
    this._checkSliderPosition(touchLocation);
  }
}

import { Sprite, Point, Color } from "@aspect/core";
import { Control } from "./control";
import { ControlHuePicker } from "./control-hue-picker";
import { ControlSaturationBrightnessPicker } from "./control-saturation-brightness-picker";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlColourPicker extends Control {
  _hsv = null;
  _colourPicker = null;
  _huePicker = null;
  _background = null;
  _className = "ControlColourPicker";

  get background() {
    return this.getBackground();
  }

  constructor() {
    super();
    this.init();
  }

  hueSliderValueChanged(sender, controlEvent) {
    this._hsv.h = sender.hue;
    super.color = Color.fromHSV(this._hsv);
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    this._updateControlPicker();
  }

  colourSliderValueChanged(sender, controlEvent) {
    this._hsv.s = sender.saturation;
    this._hsv.v = sender.brightness;
    super.color = Color.fromHSV(this._hsv);
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
  }

  set color(color) {
    super.color = color;

    this._hsv = color.hsv;
    this._updateHueAndControlPicker();
  }

  get background() {
    return this._background;
  }

  init() {
    if (super.init()) {
      this._hsv = { h: 0, s: 0, v: 0 };

      this._background = Control.addSpriteToTargetWithPosAndAnchor(
        new Sprite("#default_theme/color_picker/bacuground.png"),
        this,
        new Point(0, 0),
        new Point(0.5, 0.5)
      );

      var backgroundPointZero = Point.sub(
        this._background.getPosition(),
        new Point(
          this._background.getContentSize().width / 2 + 2,
          this._background.getContentSize().height / 2 + 2
        )
      );

      var hueShift = 8;
      var colourShift = 28;

      this._huePicker = new ControlHuePicker(
        this,
        new Point(
          backgroundPointZero.x + hueShift,
          backgroundPointZero.y + hueShift
        )
      );
      this._colourPicker = new ControlSaturationBrightnessPicker(
        this,
        new Point(
          backgroundPointZero.x + colourShift,
          backgroundPointZero.y + colourShift
        )
      );

      this._huePicker.addTargetWithActionForControlEvents(
        this,
        this.hueSliderValueChanged,
        CONTROL_EVENT_VALUE_CHANGED
      );
      this._colourPicker.addTargetWithActionForControlEvents(
        this,
        this.colourSliderValueChanged,
        CONTROL_EVENT_VALUE_CHANGED
      );

      this._updateHueAndControlPicker();
      this.addChild(this._huePicker);
      this.addChild(this._colourPicker);

      this.setContentSize(this._background.getContentSize());
      return true;
    }
    return false;
  }

  _updateControlPicker() {
    this._huePicker.hue = this._hsv.h;
    this._colourPicker.updateWithHSV(this._hsv);
  }

  _updateHueAndControlPicker() {
    this._huePicker.hue = this._hsv.h;
    this._colourPicker.updateWithHSV(this._hsv);
    this._colourPicker.updateDraggerWithHSV(this._hsv);
  }

  set enabled(enabled) {
    super.enabled = enabled;
    if (this._huePicker !== null) {
      this._huePicker.enabled = enabled;
    }
    if (this._colourPicker) {
      this._colourPicker.enabled = enabled;
    }
  }

  get enabled() {
    return super.enabled;
  }

  onTouchBegan() {
    return false;
  }
}

import { Sprite, Point, Color, NodeComponentName } from "@aspect/core";
import { Control } from "./control";
import ControlColourPickerColor from "./control-colour-picker-color";
import { ControlHuePicker } from "./control-hue-picker";
import { ControlSaturationBrightnessPicker } from "./control-saturation-brightness-picker";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlColourPicker extends Control {
  _colourPicker = null;
  _huePicker = null;
  _background = null;

  get background() {
    return this.getBackground();
  }

  constructor() {
    super();
    this.init();
  }

  get #colorComponent() {
    return this.getComponent(NodeComponentName.Color);
  }

  hueSliderValueChanged(sender, controlEvent) {
    const hsv = this.#colorComponent.hsv;
    hsv.h = sender.hue;
    this.#colorComponent.colorFromPicker = Color.fromHSV(hsv);
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    this._updateControlPicker();
  }

  colourSliderValueChanged(sender, controlEvent) {
    const hsv = this.#colorComponent.hsv;
    hsv.s = sender.saturation;
    hsv.v = sender.brightness;
    this.#colorComponent.colorFromPicker = Color.fromHSV(hsv);
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
  }

  createColor() {
    return new ControlColourPickerColor();
  }

  get background() {
    return this._background;
  }

  init() {
    if (super.init()) {
      this._background = Control.addSpriteToTargetWithPosAndAnchor(
        new Sprite("#default_theme/color_picker/bacuground.png"),
        this,
        new Point(0, 0),
        new Point(0.5, 0.5)
      );

      var backgroundPointZero = Point.sub(
        this._background.position,
        new Point(
          this._background.width / 2 + 2,
          this._background.height / 2 + 2
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

      this.contentSize = this._background.contentSize;
      return true;
    }
    return false;
  }

  _updateControlPicker() {
    const hsv = this.#colorComponent.hsv;
    this._huePicker.hue = hsv.h;
    this._colourPicker.updateWithHSV(hsv);
  }

  _updateHueAndControlPicker() {
    const hsv = this.#colorComponent.hsv;
    this._huePicker.hue = hsv.h;
    this._colourPicker.updateWithHSV(hsv);
    this._colourPicker.updateDraggerWithHSV(hsv);
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

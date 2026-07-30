import ControlColor from "./control-color";
import { Color } from "@aspect/core";

/** Color state proxied to ControlColourPicker's HSV controls. */
export default class ControlColourPickerColor extends ControlColor {
  #color = Color.WHITE;
  #hsv = { h: 0, s: 0, v: 0 };

  get hsv() {
    return this.#hsv;
  }

  set hsv(value) {
    this.#hsv = value;
  }

  get color() {
    return this.#color;
  }

  set color(value) {
    this.#color = value;
    this.hsv = value.hsv;
    this.owner._updateHueAndControlPicker();
  }

  get colorFromPicker() {
    return this.#color;
  }

  set colorFromPicker(value) {
    this.#color = value;
  }
}

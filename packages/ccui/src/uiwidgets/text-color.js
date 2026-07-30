import { NodeColor } from "@aspect/core";

/** Color state for Text and its label renderer. */
export default class TextColor extends NodeColor {
  get color() {
    return super.color;
  }

  set color(value) {
    super.color = value;
    this.owner._labelRenderer.color.color = value;
  }
}

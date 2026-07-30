import { NodeColor } from "@aspect/core";

/** Color state for Control and its own color-aware children. */
export default class ControlColor extends NodeColor {
  #opacityModifyRGB = false;

  get opacityModifyRGB() {
    return this.#opacityModifyRGB;
  }

  set opacityModifyRGB(value) {
    this.#opacityModifyRGB = value;
    const children = this.owner.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child) child.opacityModifyRGB = value;
    }
  }
}

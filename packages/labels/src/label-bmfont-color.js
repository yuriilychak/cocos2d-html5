import { NodeColor } from "@aspect/core";

/** Color state for LabelBMFont and its generated glyph sprites. */
export default class LabelBMFontColor extends NodeColor {
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

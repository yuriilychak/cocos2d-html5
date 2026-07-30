import { NodeColor } from "@aspect/core";

/** Color state for Scale9Sprite. */
export default class Scale9SpriteColor extends NodeColor {
  #opacityModifyRGB = false;

  get opacityModifyRGB() {
    return this.#opacityModifyRGB;
  }

  set opacityModifyRGB(value) {
    if (this.#opacityModifyRGB === value) return;
    this.#opacityModifyRGB = value;
    this.owner.renderCmd._setColorDirty();
  }
}

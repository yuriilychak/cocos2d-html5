import NodeColor from "../base-nodes/node/components/node-color";

/**
 * Color state for Sprite.
 *
 * Premultiplied textures require RGB channels to be multiplied by opacity.
 */
export default class SpriteColor extends NodeColor {
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

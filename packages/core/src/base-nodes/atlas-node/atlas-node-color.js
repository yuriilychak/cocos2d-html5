import NodeColor from "../node/components/node-color";

/**
 * Color state for AtlasNode.
 *
 * AtlasNode retains an unmodified color for premultiplied textures while its
 * renderer applies displayed opacity to the color stored by NodeColor.
 */
export default class AtlasNodeColor extends NodeColor {
  #opacityModifyRGB = false;

  get #renderCmd() {
    return this.owner.renderCmd;
  }

  get color() {
    return this.#opacityModifyRGB
      ? this.#renderCmd._colorUnmodified.clone()
      : super.color;
  }

  set color(value) {
    this.#renderCmd.color = value;
  }

  set colorFromRenderer(value) {
    super.color = value;
  }

  set opacity(value) {
    this.#renderCmd.opacity = value;
  }

  set opacityFromRenderer(value) {
    super.opacity = value;
  }

  get opacityModifyRGB() {
    return this.#opacityModifyRGB;
  }

  set opacityModifyRGB(value) {
    const color = this.color;
    this.#opacityModifyRGB = value;
    this.color = color;
  }
}

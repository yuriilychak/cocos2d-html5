import { NodeColor } from "@aspect/core";

/** Separates ScrollViewBar's requested opacity from its rendered opacity. */
export default class ScrollViewBarColor extends NodeColor {
  get opacity() {
    return this.owner._opacity;
  }

  set opacity(value) {
    this.owner._opacity = value;
  }

  set opacityFromRenderer(value) {
    super.opacity = value;
  }
}

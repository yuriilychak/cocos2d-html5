import { NodeColor } from "@aspect/core";

/** Color state for MenuPassive and its children. */
export default class MenuPassiveColor extends NodeColor {
  get color() {
    return super.color;
  }

  set color(value) {
    super.color = value;
    for (const child of this.owner.children) {
      if (child) child.color = value;
    }
    if (value.a !== undefined && !value.a_undefined) this.opacity = value.a;
  }

  get opacity() {
    return super.opacity;
  }

  set opacity(value) {
    super.opacity = value;
    for (const child of this.owner.children) {
      if (child) child.opacity = value;
    }
  }
}

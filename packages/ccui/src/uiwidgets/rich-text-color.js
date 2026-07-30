import { NodeColor } from "@aspect/core";

/** Cascade-opacity state shared with RichText's renderer container. */
export default class RichTextColor extends NodeColor {
  get cascadeOpacity() {
    return super.cascadeOpacity;
  }

  set cascadeOpacity(value) {
    super.cascadeOpacity = value;
    this.owner._elementRenderersContainer.color.cascadeOpacity = value;
  }
}

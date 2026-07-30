import { Node, NodeColor } from "@aspect/core";

/** Color state proxied to ProgressTimer's sprite. */
export default class ProgressTimerColor extends NodeColor {
  get color() {
    return this.owner._sprite.color.color;
  }

  set color(value) {
    this.owner._sprite.color.color = value;
    this.owner.renderCmd.setDirtyFlag(Node._dirtyFlags.colorDirty);
  }

  get opacity() {
    return this.owner._sprite.color.opacity;
  }

  set opacity(value) {
    this.owner._sprite.color.opacity = value;
    this.owner.renderCmd.setDirtyFlag(Node._dirtyFlags.opacityDirty);
  }
}

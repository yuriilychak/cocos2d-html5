import { Node, NodeColor } from "@aspect/core";

/** Color state proxied to ProgressTimer's sprite. */
export default class ProgressTimerColor extends NodeColor {
  get color() {
    return this.owner._sprite.color;
  }

  set color(value) {
    this.owner._sprite.color = value;
    this.owner.renderCmd.setDirtyFlag(Node._dirtyFlags.colorDirty);
  }

  get opacity() {
    return this.owner._sprite.opacity;
  }

  set opacity(value) {
    this.owner._sprite.opacity = value;
    this.owner.renderCmd.setDirtyFlag(Node._dirtyFlags.opacityDirty);
  }
}

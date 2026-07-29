import { Color } from "../platform/types/color";
import { BYTE } from "../constants";
import { dirtyFlags } from "./node-canvas-render-cmd";

export class NodeColor {
  #renderCmd;
  #realColor = new Color(BYTE, BYTE, BYTE, BYTE);
  #cascadeColorEnabled = false;
  #cascadeOpacityEnabled = false;

  constructor(renderCmd) {
    this.#renderCmd = renderCmd;
  }

  get opacity() { return this.#realColor.a; }
  set opacity(value) {
    if (this.#realColor.a === value) return;
    this.#realColor.a = value;
    this.#renderCmd.setDirtyFlag(dirtyFlags.opacityDirty);
  }

  get displayedOpacity() { return this.#renderCmd.getDisplayedOpacity(); }
  set displayedOpacity(parentOpacity) {
    this.#renderCmd._updateDisplayOpacity(parentOpacity);
  }

  get color() { return this.#realColor.clone(); }
  set color(value) {
    if (
      this.#realColor.r === value.r &&
      this.#realColor.g === value.g &&
      this.#realColor.b === value.b
    )
      return;
    this.#realColor.set(value.r, value.g, value.b);
    this.#renderCmd.setDirtyFlag(dirtyFlags.colorDirty);
  }

  get displayedColor() { return this.#renderCmd.getDisplayedColor(); }
  set displayedColor(parentColor) {
    this.#renderCmd._updateDisplayColor(parentColor);
  }

  get cascadeColor() { return this.#cascadeColorEnabled; }
  set cascadeColor(value) {
    if (this.#cascadeColorEnabled === value) return;
    this.#cascadeColorEnabled = value;
    this.#renderCmd.setCascadeColorEnabledDirty();
  }

  get cascadeOpacity() { return this.#cascadeOpacityEnabled; }
  set cascadeOpacity(value) {
    if (this.#cascadeOpacityEnabled === value) return;
    this.#cascadeOpacityEnabled = value;
    this.#renderCmd.setCascadeOpacityEnabledDirty();
  }
}

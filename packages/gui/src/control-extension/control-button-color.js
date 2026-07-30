import ControlColor from "./control-color";

/** Color state for ControlButton and its background variants. */
export default class ControlButtonColor extends ControlColor {
  get opacity() {
    return this.owner._opacity;
  }

  set opacity(value) {
    super.opacity = value;
    for (const key in this.owner._backgroundSpriteDispatchTable) {
      this.owner._backgroundSpriteDispatchTable[key].opacity = value;
    }
  }

  get color() {
    return super.color;
  }

  set color(value) {
    super.color = value;
    for (const key in this.owner._backgroundSpriteDispatchTable) {
      this.owner._backgroundSpriteDispatchTable[key].color = value;
    }
  }
}

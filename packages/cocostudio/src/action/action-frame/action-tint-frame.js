import { Color } from "@aspect/core";
import { TintTo } from "@aspect/actions";

import { ActionFrame } from "./action-frame.js";
import { FRAME_TYPE_TINT } from "./constants.js";
/**
 * The Cocostudio's tint action frame.
 */
export class ActionTintFrame extends ActionFrame {
  /**
   * Construction of ActionTintFrame
   */
  constructor() {
    super();
    this._color = new Color(255, 255, 255, 255);
    this.frameType = FRAME_TYPE_TINT;
  }

  /**
   * Changes the tint action color.
   * @param {Color} color
   */
  set color(color) {
    this._color.r = color.r;
    this._color.g = color.g;
    this._color.b = color.b;
  }

  /**
   * Returns the color of tint action.
   * @returns {Color}
   */
  get color() {
    return this._color.clone();
  }

  /**
   * Returns a tint action with easing.
   * @param duration
   * @returns {TintTo}
   */
  getAction(duration) {
    return this._getEasingAction(
      new TintTo(duration, this._color.r, this._color.g, this._color.b)
    );
  }
}

import { ScaleTo } from "@aspect/actions";

import { ActionFrame } from "./action-frame.js";
import { FRAME_TYPE_SCALE } from "./constants.js";
import { Point } from "@aspect/core";
/**
 * The Cocostudio's scale action frame
 */
export class ActionScaleFrame extends ActionFrame {
  #scale = new Point(1, 1);
  /**
   * Construction of ActionScaleFrame
   */
  constructor() {
    super();

    this.frameType = FRAME_TYPE_SCALE;
  }

  /**
   * Changes the scale action scaleX.
   * @param {number} scaleX
   */
  set scaleX(scaleX) {
    this.#scale.x = scaleX;
  }

  /**
   * Returns the scale action scaleX.
   * @returns {number}
   */
  get scaleX() {
    return this.#scale.x;
  }

  /**
   * Changes the scale action scaleY.
   * @param {number} scaleY
   */
  set scaleY(scaleY) {
    this.#scale.y = scaleY;
  }

  /**
   * Returns the scale action scaleY.
   * @returns {number}
   */
  get scaleY() {
    return this.#scale.y;
  }

  /**
   * Returns the action of ActionFrame.
   * @param {number} duration
   * @returns {ScaleTo}
   */
  getAction(duration) {
    return this._getEasingAction(
      new ScaleTo(duration, this.#scale.x, this.#scale.y)
    );
  }
};


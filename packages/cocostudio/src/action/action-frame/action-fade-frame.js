import { FadeTo } from "@aspect/actions";

import { ActionFrame } from "./action-frame.js";
import { FRAME_TYPE_FADE } from "./constants.js";
/**
 * The Cocostudio's fade action frame.
 */
export class ActionFadeFrame extends ActionFrame {
  #opacity = 255;
  #frameType = FRAME_TYPE_FADE;

  get frameType() {
    return this.#frameType;
  }

  set frameType(frameType) {
    this.#frameType = frameType;
  }

  /**
   * Changes the fade action opacity.
   * @param {number} opacity
   */
  set opacity(opacity) {
    this.#opacity = opacity;
  }

  /**
   * Returns the fade action opacity.
   * @returns {number}
   */
  get opacity() {
    return this.#opacity;
  }

  /**
   * Returns a fade action with easing.
   * @param {Number} duration
   * @returns {FadeTo}
   */
  getAction(duration) {
    return this._getEasingAction(new FadeTo(duration, this.#opacity));
  }
};


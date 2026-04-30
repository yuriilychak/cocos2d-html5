import { FadeTo } from "@aspect/actions";

/**
 * The Cocostudio's fade action frame.
 */
export class ActionFadeFrame extends ccs.ActionFrame {
  /**
   * Construction of ActionFadeFrame
   */
  constructor() {
    super();
    this._opacity = 255;
    this.frameType = ccs.FRAME_TYPE_FADE;
  }

  /**
   * Changes the fade action opacity.
   * @param {number} opacity
   */
  setOpacity(opacity) {
    this._opacity = opacity;
  }

  /**
   * Returns the fade action opacity.
   * @returns {number}
   */
  getOpacity() {
    return this._opacity;
  }

  /**
   * Returns a fade action with easing.
   * @param {Number} duration
   * @returns {FadeTo}
   */
  getAction(duration) {
    return this._getEasingAction(new FadeTo(duration, this._opacity));
  }
};

ccs.ActionFadeFrame = ActionFadeFrame;

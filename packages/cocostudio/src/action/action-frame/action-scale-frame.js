import { ScaleTo } from "@aspect/actions";

/**
 * The Cocostudio's scale action frame
 */
export class ActionScaleFrame extends ccs.ActionFrame {
  /**
   * Construction of ActionScaleFrame
   */
  constructor() {
    super();
    this._scaleX = 1;
    this._scaleY = 1;
    this.frameType = ccs.FRAME_TYPE_SCALE;
  }

  /**
   * Changes the scale action scaleX.
   * @param {number} scaleX
   */
  setScaleX(scaleX) {
    this._scaleX = scaleX;
  }

  /**
   * Returns the scale action scaleX.
   * @returns {number}
   */
  getScaleX() {
    return this._scaleX;
  }

  /**
   * Changes the scale action scaleY.
   * @param {number} scaleY
   */
  setScaleY(scaleY) {
    this._scaleY = scaleY;
  }

  /**
   * Returns the scale action scaleY.
   * @returns {number}
   */
  getScaleY() {
    return this._scaleY;
  }

  /**
   * Returns the action of ActionFrame.
   * @param {number} duration
   * @returns {ScaleTo}
   */
  getAction(duration) {
    return this._getEasingAction(
      new ScaleTo(duration, this._scaleX, this._scaleY)
    );
  }
};

ccs.ActionScaleFrame = ActionScaleFrame;

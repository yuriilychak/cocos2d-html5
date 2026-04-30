import { RotateBy, RotateTo } from "@aspect/actions";

/**
 * The Cocostudio's rotation action frame.
 */
export class ActionRotationFrame extends ccs.ActionFrame {
  /**
   * Construction of ActionRotationFrame
   */
  constructor() {
    super();
    this._rotation = 0;
    this.frameType = ccs.FRAME_TYPE_ROTATE;
  }

  /**
   * Changes rotate action rotation.
   * @param {number} rotation
   */
  setRotation(rotation) {
    this._rotation = rotation;
  }

  /**
   * Returns the rotate action rotation.
   * @returns {number}
   */
  getRotation() {
    return this._rotation;
  }

  /**
   * Returns the Action of ActionFrame.
   * @param {number} duration
   * @param {ActionFrame} [srcFrame]
   * @returns {RotateTo}
   */
  getAction(duration, srcFrame) {
    if (srcFrame === undefined)
      return this._getEasingAction(new RotateTo(duration, this._rotation));
    else {
      if (!(srcFrame instanceof ActionRotationFrame))
        return this.getAction(duration);
      else {
        var diffRotation = this._rotation - srcFrame._rotation;
        return this._getEasingAction(new RotateBy(duration, diffRotation));
      }
    }
  }
};

ccs.ActionRotationFrame = ActionRotationFrame;

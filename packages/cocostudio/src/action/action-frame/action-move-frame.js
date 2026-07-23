import { Point } from "@aspect/core";
import { MoveTo } from "@aspect/actions";

import { ActionFrame } from "./action-frame.js";
import { FRAME_TYPE_MOVE } from "./constants.js";
/**
 * The Cocostudio's move action frame.
 */
export class ActionMoveFrame extends ActionFrame {
  #position = new Point();
  /**
   * Construction of ActionMoveFrame
   */
  constructor() {
    super();
    this.frameType = FRAME_TYPE_MOVE;
  }

  /**
   * Changes the move action position.
   * @param {Point|Number} pos
   * @param {Number} y
   */
  setPosition(pos, y) {
    if (Point.isLike(pos)) {
      this.#position.set(pos);
    } else if (typeof pos === 'number' && typeof y === 'number') {
      this.#position.set(pos, y);
    }
  }

  /**
   * Returns the move action position.
   * @returns {Point}
   */
  getPosition() {
    return this.#position;
  }

  /**
   * Returns the Action of ActionFrame.
   * @param {number} duration
   * @returns {MoveTo}
   */
  getAction(duration) {
    return this._getEasingAction(new MoveTo(duration, this.#position));
  }
}

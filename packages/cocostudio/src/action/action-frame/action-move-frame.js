import { Point } from "@aspect/core";
import { MoveTo } from "@aspect/actions";

import { ActionFrame } from "./action-frame.js";
import { FRAME_TYPE_MOVE } from "./constants.js";
/**
 * The Cocostudio's move action frame.
 */
export class ActionMoveFrame extends ActionFrame {
  /**
   * Construction of ActionMoveFrame
   */
  constructor() {
    super();
    this._position = new Point(0, 0);
    this.frameType = FRAME_TYPE_MOVE;
  }

  /**
   * Changes the move action position.
   * @param {Point|Number} pos
   * @param {Number} y
   */
  setPosition(pos, y) {
    if (y === undefined) {
      this._position.x = pos.x;
      this._position.y = pos.y;
    } else {
      this._position.x = pos;
      this._position.y = y;
    }
  }

  /**
   * Returns the move action position.
   * @returns {Point}
   */
  getPosition() {
    return this._position;
  }

  /**
   * Returns the Action of ActionFrame.
   * @param {number} duration
   * @returns {MoveTo}
   */
  getAction(duration) {
    return this._getEasingAction(new MoveTo(duration, this._position));
  }
};


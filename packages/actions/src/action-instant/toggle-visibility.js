import ActionInstant from './action-instant';

/**
 * Toggles the visibility of a node.
 */
export default class ToggleVisibility extends ActionInstant {

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this.target.visible = !this.target.visible;
  }

  /**
   * returns a reversed action.
   * @returns {cc.ToggleVisibility}
   */
  reverse() {
    return new ToggleVisibility();
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.ToggleVisibility}
   */
  clone() {
    return new ToggleVisibility();
  }
};

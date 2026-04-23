import ActionInterval from "./action-interval";

/** Delays the action a certain amount of seconds
 */
export default class DelayTime extends ActionInterval {
  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * Will be overwrite.
   * @param {Number} dt time in seconds
   */
  update(dt) {}

  /**
   * Returns a reversed action.
   * @return {DelayTime}
   */
  reverse() {
    var action = new DelayTime(this._duration);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {DelayTime}
   */
  clone() {
    var action = new DelayTime();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration);
    return action;
  }
}

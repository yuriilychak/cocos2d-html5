import ScaleTo from './scale-to';

/** Scales a cc.Node object a zoom factor by modifying it's scale attribute.
 * Relative to its changes.
 * @class
 * @extends cc.ScaleTo
 */
export default class ScaleBy extends ScaleTo {
  /** @lends cc.ScaleBy# */
  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
    this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
  }

  /**
   * Returns a reversed action.
   * @return {cc.ScaleBy}
   */
  reverse() {
    var action = new ScaleBy(
      this._duration,
      1 / this._endScaleX,
      1 / this._endScaleY
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.ScaleBy}
   */
  clone() {
    var action = new ScaleBy();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  }
};

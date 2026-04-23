import ActionInstant from "./action-instant";

/**
 * Delete self in the next frame.
 * @param {Boolean} [isNeedCleanUp=true]
 *
 * @example
 * // example
 * var removeSelfAction = new RemoveSelf(false);
 */
export default class RemoveSelf extends ActionInstant {
  _isNeedCleanUp = true;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
   * @param {Boolean} [isNeedCleanUp=true]
   */
  constructor(isNeedCleanUp) {
    super();

    isNeedCleanUp !== undefined && this.init(isNeedCleanUp);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number} dt
   */
  update(dt) {
    this.target.removeFromParent(this._isNeedCleanUp);
  }

  /**
     * Initialization of the node, please do not call this function by yourself, you should pass the parameters to constructor to initialize it
.
     * @param isNeedCleanUp
     * @returns {boolean}
     */
  init(isNeedCleanUp) {
    this._isNeedCleanUp = isNeedCleanUp;
    return true;
  }

  /**
   * returns a reversed action.
   */
  reverse() {
    return new RemoveSelf(this._isNeedCleanUp);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {RemoveSelf}
   */
  clone() {
    return new RemoveSelf(this._isNeedCleanUp);
  }
}

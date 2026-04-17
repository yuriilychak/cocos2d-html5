import { ActionInstant } from './ActionInstant.js';

/**
 * Calls a 'callback'.
 * @class
 * @extends cc.ActionInstant
 * @param {function} selector
 * @param {object|null} [selectorTarget]
 * @param {*|null} [data] data for function, it accepts all data types.
 * @example
 * // example
 * // CallFunc without data
 * var finish = new cc.CallFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = new cc.CallFunc(this.removeFromParentAndCleanup, this,  true);
 */
export class CallFunc extends ActionInstant {
  /** @lends cc.CallFunc# */
  _selectorTarget = null;
  _function = null;
  _data = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates a CallFunc action with the callback.
   * @param {function} selector
   * @param {object|null} [selectorTarget]
   * @param {*|null} [data] data for function, it accepts all data types.
   */
  constructor(selector, selectorTarget, data) {
    super();

    this.initWithFunction(selector, selectorTarget, data);
  }

  /**
   * Initializes the action with a function or function and its target
   * @param {function} selector
   * @param {object|Null} selectorTarget
   * @param {*|Null} [data] data for function, it accepts all data types.
   * @return {Boolean}
   */
  initWithFunction(selector, selectorTarget, data) {
    if (selector) {
      this._function = selector;
    }
    if (selectorTarget) {
      this._selectorTarget = selectorTarget;
    }
    if (data !== undefined) {
      this._data = data;
    }
    return true;
  }

  /**
   * execute the function.
   */
  execute() {
    if (this._function) {
      this._function.call(this._selectorTarget, this.target, this._data);
    }
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    this.execute();
  }

  /**
   * Get selectorTarget.
   * @return {object}
   */
  getTargetCallback() {
    return this._selectorTarget;
  }

  /**
   * Set selectorTarget.
   * @param {object} sel
   */
  setTargetCallback(sel) {
    if (sel !== this._selectorTarget) {
      if (this._selectorTarget) this._selectorTarget = null;
      this._selectorTarget = sel;
    }
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.CallFunc}
   */
  clone() {
    const action = new CallFunc();
    action.initWithFunction(this._function, this._selectorTarget, this._data);
    return action;
  }
};

import { FadeTo } from './fade-to.js';
import { FadeIn } from './fade-in.js';

/** Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * The "reverse" of this action is FadeIn
 * @class
 * @extends cc.FadeTo
 * @param {Number} duration duration in seconds
 */
export class FadeOut extends FadeTo {
  /** @lends cc.FadeOut# */

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   */
  constructor(duration = 0) {
    super();
    const actualDuration = duration == null ? 0 : duration;
    this.initWithDuration(actualDuration, 0);
  }

  /**
   * Returns a reversed action.
   * @return {cc.FadeIn}
   */
  reverse() {
    const action = new FadeIn();
    action._reverseAction = this;
    action.initWithDuration(this._duration, 255);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.FadeOut}
   */
  clone() {
    const action = new FadeOut();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }
};

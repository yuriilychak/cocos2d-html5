import FadeTo from './fade-to';
import FadeOut from './fade-out';

/** Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.<br/>
 * The "reverse" of this action is FadeOut
 * @param {Number} duration duration in seconds
 */
export default class FadeIn extends FadeTo {
  _reverseAction = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration duration in seconds
   */
  constructor(duration = 0) {
    super();
    const actualDuration = duration == null ? 0 : duration;
    this.initWithDuration(actualDuration, 255);
  }

  /**
   * Returns a reversed action.
   * @return {cc.FadeOut}
   */
  reverse() {
    const action = new FadeOut();
    action.initWithDuration(this._duration, 0);
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }

  /**
   * returns a new clone of the action
   * @returns {cc.FadeIn}
   */
  clone() {
    const action = new FadeIn();
    this._cloneDecoration(action);
    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }

  /**
   * Start the action with target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    if (this._reverseAction) this._toOpacity = this._reverseAction._fromOpacity;
    super.startWithTarget(target);
  }
};

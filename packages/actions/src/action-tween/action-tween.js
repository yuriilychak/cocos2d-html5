import { ActionInterval } from '../action-interval/action-interval.js';

/**
 * cc.ActionTween
 * cc.ActionTween is an action that lets you update any property of an object.
 *
 * @class
 * @extends cc.ActionInterval
 * @example
 * //For example, if you want to modify the "width" property of a target from 200 to 300 in 2 seconds, then:
 *  var modifyWidth = cc.actionTween(2,"width",200,300)
 *  target.runAction(modifyWidth);
 *
 * //Another example: cc.ScaleTo action could be rewriten using cc.PropertyAction:
 * // scaleA and scaleB are equivalents
 * var scaleA = cc.scaleTo(2,3);
 * var scaleB = cc.actionTween(2,"scale",1,3);
 * @param {Number} duration
 * @param {String} key
 * @param {Number} from
 * @param {Number} to
 */
export class ActionTween extends ActionInterval {
  /** @lends cc.ActionTween */
  key = "";
  from = 0;
  to = 0;
  delta = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Creates an initializes the action with the property name (key), and the from and to parameters.
   * @param {Number} duration
   * @param {String} key
   * @param {Number} from
   * @param {Number} to
   */
  constructor(duration, key, from, to) {
    super();
    this.key = "";

    to !== undefined && this.initWithDuration(duration, key, from, to);
  }

  /**
   * initializes the action with the property name (key), and the from and to parameters.
   * @param {Number} duration
   * @param {String} key
   * @param {Number} from
   * @param {Number} to
   * @return {Boolean}
   */
  initWithDuration(duration, key, from, to) {
    if (super.initWithDuration(duration)) {
      this.key = key;
      this.to = to;
      this.from = from;
      return true;
    }
    return false;
  }

  /**
   * Start this tween with target.
   * @param {cc.ActionTweenDelegate} target
   */
  startWithTarget(target) {
    if (!target || !target.updateTweenAction)
      throw new Error(
        "cc.ActionTween.startWithTarget(): target must be non-null, and target must implement updateTweenAction function"
      );
    super.startWithTarget(target);
    this.delta = this.to - this.from;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    this.target.updateTweenAction(this.to - this.delta * (1 - dt), this.key);
  }

  /**
   * returns a reversed action.
   * @return {cc.ActionTween}
   */
  reverse() {
    return new ActionTween(this.duration, this.key, this.to, this.from);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.ActionTween}
   */
  clone() {
    const action = new ActionTween();
    action.initWithDuration(this._duration, this.key, this.from, this.to);
    return action;
  }
};

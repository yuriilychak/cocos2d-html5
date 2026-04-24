import ActionInterval from "./action-interval";
import Sequence from "./sequence";
import DelayTime from "./delay-time";
import { log } from "@aspect/core/src/boot/debugger";

const delayTime = (d) => new DelayTime(d);

/** Spawn a new action immediately
 */
export default class Spawn extends ActionInterval {
  _one = null;
  _two = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Array|FiniteTimeAction} tempArray
   */
  constructor(tempArray) {
    super();
    this._one = null;
    this._two = null;

    var i, paramArray, last;
    if (tempArray instanceof Array) {
      paramArray = tempArray;
    } else {
      paramArray = new Array(arguments.length);
      for (i = 0; i < arguments.length; ++i) {
        paramArray[i] = arguments[i];
      }
    }
    last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null)
      log("parameters should not be ending with null in Javascript");

    if (last >= 0) {
      var prev = paramArray[0],
        action1;
      for (i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = Spawn._actionOneTwo(action1, paramArray[i]);
        }
      }
      this.initWithTwoActions(prev, paramArray[last]);
    }
  }

  /** initializes the Spawn action with the 2 actions to spawn
   * @param {FiniteTimeAction} action1
   * @param {FiniteTimeAction} action2
   * @return {Boolean}
   */
  initWithTwoActions(action1, action2) {
    if (!action1 || !action2)
      throw new Error(
        "Spawn.initWithTwoActions(): arguments must all be non null"
      );

    var ret = false;

    var d1 = action1._duration;
    var d2 = action2._duration;

    if (this.initWithDuration(Math.max(d1, d2))) {
      this._one = action1;
      this._two = action2;

      if (d1 > d2) {
        this._two = Sequence._actionOneTwo(action2, delayTime(d1 - d2));
      } else if (d1 < d2) {
        this._one = Sequence._actionOneTwo(action1, delayTime(d2 - d1));
      }

      ret = true;
    }
    return ret;
  }

  /**
   * returns a new clone of the action
   * @returns {Spawn}
   */
  clone() {
    var action = new Spawn();
    this._cloneDecoration(action);
    action.initWithTwoActions(this._one.clone(), this._two.clone());
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._one.startWithTarget(target);
    this._two.startWithTarget(target);
  }

  /**
   * Stop the action
   */
  stop() {
    this._one.stop();
    this._two.stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._one) this._one.update(dt);
    if (this._two) this._two.update(dt);
  }

  /**
   * Returns a reversed action.
   * @return {Spawn}
   */
  reverse() {
    var action = Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
}

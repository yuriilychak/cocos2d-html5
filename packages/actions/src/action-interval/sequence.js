import ActionInterval from "./action-interval";
import { log } from "@aspect/core";

/**
 * Runs actions sequentially, one after another.
 * @param {Array|FiniteTimeAction} tempArray
 * @example
 * // create sequence with actions
 * var seq = new Sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = new Sequence(actArray);
 */
export default class Sequence extends ActionInterval {
  _actions = null;
  _split = null;
  _last = 0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * Create an array of sequenceable actions.
   * @param {Array|FiniteTimeAction} tempArray
   */
  constructor(tempArray) {
    super();
    this._actions = [];

    var paramArray = tempArray instanceof Array ? tempArray : arguments;
    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null)
      log("parameters should not be ending with null in Javascript");

    if (last >= 0) {
      var prev = paramArray[0],
        action1;
      for (var i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = Sequence._actionOneTwo(action1, paramArray[i]);
        }
      }
      this.initWithTwoActions(prev, paramArray[last]);
    }
  }

  /**
   * Initializes the action <br/>
   * @param {FiniteTimeAction} actionOne
   * @param {FiniteTimeAction} actionTwo
   * @return {Boolean}
   */
  initWithTwoActions(actionOne, actionTwo) {
    if (!actionOne || !actionTwo)
      throw new Error(
        "Sequence.initWithTwoActions(): arguments must all be non nil"
      );

    var d = actionOne._duration + actionTwo._duration;
    this.initWithDuration(d);

    this._actions[0] = actionOne;
    this._actions[1] = actionTwo;
    return true;
  }

  /**
   * returns a new clone of the action
   * @returns {Sequence}
   */
  clone() {
    var action = new Sequence();
    this._cloneDecoration(action);
    action.initWithTwoActions(
      this._actions[0].clone(),
      this._actions[1].clone()
    );
    return action;
  }

  /**
   * Start the action with target.
   * @param {Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._split = this._actions[0]._duration / this._duration;
    this._last = -1;
  }

  /**
   * stop the action.
   */
  stop() {
    // Issue #1305
    if (this._last !== -1) this._actions[this._last].stop();
    super.stop();
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    var new_t,
      found = 0;
    var locSplit = this._split,
      locActions = this._actions,
      locLast = this._last,
      actionFound;

    dt = this._computeEaseTime(dt);
    if (dt < locSplit) {
      // action[0]
      new_t = locSplit !== 0 ? dt / locSplit : 1;

      if (found === 0 && locLast === 1) {
        // Reverse mode ?
        // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
        // since it will require a hack to know if an action is on reverse mode or not.
        // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
        locActions[1].update(0);
        locActions[1].stop();
      }
    } else {
      // action[1]
      found = 1;
      new_t = locSplit === 1 ? 1 : (dt - locSplit) / (1 - locSplit);

      if (locLast === -1) {
        // action[0] was skipped, execute it.
        locActions[0].startWithTarget(this.target);
        locActions[0].update(1);
        locActions[0].stop();
      }
      if (!locLast) {
        // switching to action 1. stop action 0.
        locActions[0].update(1);
        locActions[0].stop();
      }
    }

    actionFound = locActions[found];
    // Last action found and it is done.
    if (locLast === found && actionFound.isDone()) return;

    // Last action found and it is done
    if (locLast !== found) actionFound.startWithTarget(this.target);

    new_t = new_t * actionFound._timesForRepeat;
    actionFound.update(new_t > 1 ? new_t % 1 : new_t);
    this._last = found;
  }

  /**
   * Returns a reversed action.
   * @return {Sequence}
   */
  reverse() {
    var action = Sequence._actionOneTwo(
      this._actions[1].reverse(),
      this._actions[0].reverse()
    );
    this._cloneDecoration(action);
    this._reverseEaseList(action);
    return action;
  }
}

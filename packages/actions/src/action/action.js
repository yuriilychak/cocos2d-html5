/**
 * Base class for Action objects.
 *
 * @property {Node}  target          - The target will be set with the 'startWithTarget' method. When the 'stop' method is called, target will be set to nil.
 * @property {Node}  originalTarget  - The original target of the action.
 * @property {Number}   tag             - The tag of the action, can be used to find the action.
 */
import { NewClass, ACTION_TAG_INVALID, log } from "@aspect/core";

export default class Action extends NewClass {
  //***********variables*************
  originalTarget = null;
  target = null;
  tag = ACTION_TAG_INVALID;

  //**************Public Functions***********

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   */
  constructor() {
    super();
    this.originalTarget = null;
    this.target = null;
    this.tag = ACTION_TAG_INVALID;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {Action}
   */
  clone() {
    return new Action();
  }

  /**
   * return true if the action has finished.
   *
   * @return {Boolean}
   */
  isDone() {
    return true;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {Node} target
   */
  startWithTarget(target) {
    this.originalTarget = target;
    this.target = target;
  }

  /**
   * called after the action has finished. It will set the 'target' to nil. <br />
   * IMPORTANT: You should never call "action stop" manually. Instead, use: "target.stopAction(action);"
   */
  stop() {
    this.target = null;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    log("[Action step]. override me");
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    log("[Action update]. override me");
  }

  /**
   * get the target.
   *
   * @return {Node}
   */
  getTarget() {
    return this.target;
  }

  /**
   * The action will modify the target properties.
   *
   * @param {Node} target
   */
  setTarget(target) {
    this.target = target;
  }

  /**
   * get the original target.
   *
   * @return {Node}
   */
  getOriginalTarget() {
    return this.originalTarget;
  }

  /**
   * Set the original target, since target can be nil. <br/>
   * Is the target that were used to run the action.  <br/>
   * Unless you are doing something complex, like ActionManager, you should NOT call this method. <br/>
   * The target is 'assigned', it is not 'retained'. <br/>
   * @param {Node} originalTarget
   */
  setOriginalTarget(originalTarget) {
    this.originalTarget = originalTarget;
  }

  /**
   * get tag number.
   * @return {Number}
   */
  getTag() {
    return this.tag;
  }

  /**
   * set tag number.
   * @param {Number} tag
   */
  setTag(tag) {
    this.tag = tag;
  }
}

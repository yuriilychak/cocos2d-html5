import { assert, _LogInfos } from "../../../boot/debugger";
import { Component } from "../../../components";
import { REPEAT_FOREVER } from "../../../platform/macro/constants";
import { ServiceLocator } from "../../../service-locator";
import { NodeComponentName } from "../../../enums";

export default class NodeScheduler extends Component {
  #scheduler = null;

  constructor() {
    super(NodeComponentName.Scheduler);
  }

  onEnter() {
    this.scheduleUpdate();
  }

  onExit() {
    this.unscheduleUpdate();
  }

  get scheduler() {
    return this.#scheduler || ServiceLocator.scheduler;
  }

  set scheduler(value) {
    if (this.#scheduler !== value) {
      this.unscheduleAllCallbacks();
      this.#scheduler = value;
    }
  }

  /**
   * <p>schedules the "update" method.                                                                           <br/>
   * It will use the order number 0. This method will be called every frame.                                  <br/>
   * Scheduled methods with a lower order value will be called before the ones that have a higher order value.<br/>
   * Only one "update" method could be scheduled per node.</p>
   * @function
   */
  scheduleUpdate() {
    this.scheduleUpdateWithPriority(0);
  }

  /**
   * <p>
   * schedules the "update" callback function with a custom priority.
   * This callback function will be called every frame.<br/>
   * Scheduled callback functions with a lower priority will be called before the ones that have a higher value.<br/>
   * Only one "update" callback function could be scheduled per node (You can't have 2 'update' callback functions).<br/>
   * </p>
   * @function
   * @param {Number} priority
   */
  scheduleUpdateWithPriority(priority) {
    this.scheduler.scheduleUpdate(this.owner, priority, !this.owner.running);
  }

  /**
   * Unschedules the "update" method.
   * @function
   * @see NodeScheduler#scheduleUpdate
   */
  unscheduleUpdate() {
    this.scheduler.unscheduleUpdate(this.owner);
  }

  /**
   * <p>Schedules a custom selector.         <br/>
   * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.</p>
   * @function
   * @param {function} callback A function wrapped as a selector
   * @param {Number} interval  Tick interval in seconds. 0 means tick every frame. If interval = 0, it's recommended to use scheduleUpdate() instead.
   * @param {Number} repeat    The selector will be executed (repeat + 1) times, you can use kCCRepeatForever for tick infinitely.
   * @param {Number} delay     The amount of time that the first tick will wait before execution.
   * @param {String} key The only string identifying the callback
   */
  schedule(callback, interval, repeat, delay, key) {
    var len = arguments.length;
    if (typeof callback === "function") {
      if (len === 1) {
        interval = 0;
        repeat = REPEAT_FOREVER;
        delay = 0;
        key = this.owner.instanceId;
      } else if (len === 2) {
        if (typeof interval === "number") {
          repeat = REPEAT_FOREVER;
          delay = 0;
          key = this.owner.instanceId;
        } else {
          key = interval;
          interval = 0;
          repeat = REPEAT_FOREVER;
          delay = 0;
        }
      } else if (len === 3) {
        if (typeof repeat === "string") {
          key = repeat;
          repeat = REPEAT_FOREVER;
        } else {
          key = this.owner.instanceId;
        }
        delay = 0;
      } else if (len === 4) {
        key = this.owner.instanceId;
      }
    } else if (len === 1) {
      interval = 0;
      repeat = REPEAT_FOREVER;
      delay = 0;
    } else if (len === 2) {
      repeat = REPEAT_FOREVER;
      delay = 0;
    }

    assert(callback, _LogInfos.Node_schedule);
    assert(interval >= 0, _LogInfos.Node_schedule_2);

    this.scheduler.schedule(
      callback,
      this.owner,
      interval || 0,
      isNaN(repeat) ? REPEAT_FOREVER : repeat,
      delay || 0,
      !this.owner.running,
      key,
    );
  }

  /**
   * Schedules a callback function that runs only once, with a delay of 0 or larger
   * @function
   * @see NodeScheduler#schedule
   * @param {function} callback  A function wrapped as a selector
   * @param {Number} delay  The amount of time that the first tick will wait before execution.
   * @param {String} key The only string identifying the callback
   */
  scheduleOnce(callback, delay, key) {
    this.schedule(callback, 0, 0, delay, key === undefined ? this.owner.instanceId : key);
  }

  /**
   * unschedules a custom callback function.
   * @function
   * @see NodeScheduler#schedule
   * @param {function} callback_fn  A function wrapped as a selector
   */
  unschedule(callback) {
    if (callback) {
      this.scheduler.unschedule(callback, this.owner);
    }
  }

  /**
   * <p>unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
   * Actions are not affected by this method.</p>
   * @function
   */
  unscheduleAllCallbacks() {
    this.scheduler.unscheduleAllForTarget(this.owner);
  }

  resume() {
    this.scheduler.resumeTarget(this.owner);
  }

  pause() {
    this.scheduler.pauseTarget(this.owner);
  }
}

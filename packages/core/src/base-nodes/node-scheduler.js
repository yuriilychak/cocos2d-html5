import { assert, _LogInfos } from "../boot/debugger";
import { Component } from "../components";
import { REPEAT_FOREVER } from "../platform/macro/constants";
import { ServiceLocator } from "../service-locator";

export class NodeScheduler extends Component {
  #scheduler = null;

  constructor() {
    super("scheduler");
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

  scheduleUpdate() {
    this.scheduleUpdateWithPriority(0);
  }

  scheduleUpdateWithPriority(priority) {
    this.scheduler.scheduleUpdate(this.owner, priority, !this.owner.running);
  }

  unscheduleUpdate() {
    this.scheduler.unscheduleUpdate(this.owner);
  }

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

  scheduleOnce(callback, delay, key) {
    this.schedule(callback, 0, 0, delay, key === undefined ? this.owner.instanceId : key);
  }

  unschedule(callback) {
    if (callback) {
      this.scheduler.unschedule(callback, this.owner);
    }
  }

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

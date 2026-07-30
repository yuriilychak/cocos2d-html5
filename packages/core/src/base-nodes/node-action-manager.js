import { assert, log, _LogInfos } from "../boot/debugger";
import { Component } from "../components";
import { ACTION_TAG_INVALID } from "../platform/macro/constants";
import { ServiceLocator } from "../service-locator";

export class NodeActionManager extends Component {
  #actionManager = null;

  constructor() {
    super("actionManager");
  }

  get actionManager() {
    return this.#actionManager || ServiceLocator.actionManager;
  }

  set actionManager(value) {
    if (this.#actionManager !== value) {
      this.stopAllActions();
      this.#actionManager = value;
    }
  }

  runAction(action) {
    assert(action, _LogInfos.Node_runAction);
    this.actionManager.addAction(action, this.owner, !this.owner.running);
    return action;
  }

  stopAllActions() {
    this.actionManager.removeAllActionsFromTarget(this.owner);
  }

  stopAction(action) {
    this.actionManager.removeAction(action);
  }

  stopActionByTag(tag) {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.Node_stopActionByTag);
      return;
    }
    this.actionManager.removeActionByTag(tag, this.owner);
  }

  getActionByTag(tag) {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.Node_getActionByTag);
      return null;
    }
    return this.actionManager.getActionByTag(tag, this.owner);
  }

  get numberOfRunningActions() {
    return this.actionManager.numberOfRunningActionsInTarget(this.owner);
  }

  resume() {
    this.actionManager.resumeTarget(this.owner);
  }

  pause() {
    this.actionManager.pauseTarget(this.owner);
  }
}

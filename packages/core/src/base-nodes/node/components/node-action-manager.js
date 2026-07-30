import { assert, log, _LogInfos } from "../../../boot/debugger";
import { Component } from "../../../components";
import { ACTION_TAG_INVALID } from "../../../platform/macro/constants";
import { ServiceLocator } from "../../../service-locator";
import { NodeComponentName } from "../../../enums";

export default class NodeActionManager extends Component {
  #actionManager = null;

  constructor() {
    super(NodeComponentName.ActionManager);
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

  /**
   * Executes an action, and returns the action that is executed.<br/>
   * The owner node becomes the action's target. Refer to Action's getTarget().
   *
   * @function
   * @warning Starting from v0.8 actions don't retain their target anymore.
   * @param {Action} action
   * @return {Action} An Action pointer.
   */
  runAction(action) {
    assert(action, _LogInfos.Node_runAction);
    this.actionManager.addAction(action, this.owner, !this.owner.running);
    return action;
  }

  /**
   * Stops and removes all actions from the running action list.
   *
   * @function
   */
  stopAllActions() {
    this.actionManager.removeAllActionsFromTarget(this.owner);
  }

  /**
   * Stops and removes an action from the running action list.
   *
   * @function
   * @param {Action} action An action object to be removed.
   */
  stopAction(action) {
    this.actionManager.removeAction(action);
  }

  /**
   * Removes an action from the running action list by its tag.
   *
   * @function
   * @param {number} tag A tag that indicates the action to be removed.
   */
  stopActionByTag(tag) {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.Node_stopActionByTag);
      return;
    }
    this.actionManager.removeActionByTag(tag, this.owner);
  }

  /**
   * Returns an action from the running action list by its tag.
   *
   * @function
   * @param {number} tag
   * @return {Action} The action object with the given tag.
   */
  getActionByTag(tag) {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.Node_getActionByTag);
      return null;
    }
    return this.actionManager.getActionByTag(tag, this.owner);
  }

  /**
   * Returns the number of actions that are running plus the ones scheduled to run.<br/>
   * Composable actions are counted as one action. Example:<br/>
   * If you are running one Sequence of seven actions, it returns one.<br/>
   * If you are running seven Sequences of two actions, it returns seven.
   *
   * @function
   * @return {number} The number of actions that are running plus the ones scheduled to run.
   */
  get runningActionCount() {
    return this.actionManager.numberOfRunningActionsInTarget(this.owner);
  }

  resume() {
    this.actionManager.resumeTarget(this.owner);
  }

  pause() {
    this.actionManager.pauseTarget(this.owner);
  }
}

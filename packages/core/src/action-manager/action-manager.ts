/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { BaseClass } from "../platform/class";
import { log, assert, _LogInfos } from "../boot/debugger";
import { ACTION_TAG_INVALID } from "../platform/macro/constants";
import Scheduler from "../scheduler/scheduler";
import HashElement from "./hash-element";
import HashElementPool from "./hash-element-pool";
import type { ActionLike, ActionTarget } from "./types";

/**
 * ActionManager is a class that can manage actions.<br/>
 * Normally you won't need to use this class directly. 99% of the cases you will use the Node interface,
 * which uses this class's singleton object.
 * But there are some cases where you might need to use this class. <br/>
 * Examples:<br/>
 * - When you want to run an action where the target is different from a Node.<br/>
 * - When you want to pause / resume the actions<br/>
 * @example
 * var mng = new ActionManager();
 */
export default class ActionManager extends BaseClass {
  #scheduler: Scheduler;
  #elementPool: HashElementPool = new HashElementPool();
  #hashTargets: Map<number, HashElement> = new Map();
  #targets: HashElement[] = [];

  constructor(scheduler: Scheduler) {
    super();
    this.#scheduler = scheduler;
  }

  addAction(action: ActionLike, target: ActionTarget, paused: boolean = false): void {
    if (!action)
      throw new Error("ActionManager.addAction(): action must be non-null");
    if (!target)
      throw new Error("ActionManager.addAction(): target must be non-null");

    let element: HashElement;
    if (this.#hashTargets.has(target.instanceId)) {
      element = this.#hashTargets.get(target.instanceId)!;
    } else {
      element = this.#elementPool.get(target, paused);
      this.#hashTargets.set(target.instanceId, element);
      this.#targets.push(element);
    }

    element.addAction(action);
  }

  removeAllActions(): void {
    for (let i = 0; i < this.#targets.length; ++i) {
      this.#deleteHashElement(this.#targets[i]);
    }
  }

  removeAllActionsFromTarget(target: ActionTarget | null): void {
    if (target == null || !this.#hashTargets.has(target.instanceId)) {
      return;
    }

    const element = this.#hashTargets.get(target.instanceId)!;
    this.#deleteHashElement(element);
  }

  removeAction(action: ActionLike | null): void {
    if (action == null) {
      return;
    }

    const target = action.getOriginalTarget();

    if (!this.#hashTargets.has(target.instanceId)) {
      log(_LogInfos.ActionManager_removeAction);
      return;
    }

    const element = this.#hashTargets.get(target.instanceId)!;
    element.removeAction(action);
  }

  removeActionByTag(tag: number, target: ActionTarget): void {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.ActionManager_addAction);
    }

    assert(target, _LogInfos.ActionManager_addAction);

    if (!this.#hashTargets.has(target.instanceId)) {
      return;
    }

    const element = this.#hashTargets.get(target.instanceId)!;
    element.removeActionByTag(tag, target);

    if (!element.hasActions) {
      this.#deleteHashElement(element);
    }
  }

  getActionByTag(tag: number, target: ActionTarget): ActionLike | null {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.ActionManager_getActionByTag);
    }

    if (!this.#hashTargets.has(target.instanceId)) {
      return null;
    }

    const element = this.#hashTargets.get(target.instanceId)!;
    const action = element.getActionByTag(tag);

    if (action) {
      return action;
    }
    log(_LogInfos.ActionManager_getActionByTag_2, tag);
    return null;
  }

  numberOfRunningActionsInTarget(target: ActionTarget): number {
    if (!this.#hashTargets.has(target.instanceId)) {
      return 0;
    }
    const element = this.#hashTargets.get(target.instanceId)!;

    return element.numberOfRunningActions;
  }

  pauseTarget(target: ActionTarget): void {
    if (!this.#hashTargets.has(target.instanceId)) {
      return;
    }
    const element = this.#hashTargets.get(target.instanceId)!;
    element.paused = true;
  }

  resumeTarget(target: ActionTarget): void {
    if (!this.#hashTargets.has(target.instanceId)) {
      return;
    }
    const element = this.#hashTargets.get(target.instanceId)!;
    element.paused = false;
  }

  pauseAllRunningActions(): ActionTarget[] {
    const idsWithActions: ActionTarget[] = [];
    for (let i = 0; i < this.#targets.length; ++i) {
      const element = this.#targets[i];
      if (!element.paused) {
        element.paused = true;
        const target = element.target;
        if (target) {
          idsWithActions.push(target);
        }
      }
    }
    return idsWithActions;
  }

  resumeTargets(targetsToResume: Array<ActionTarget | null> | null | undefined): void {
    if (!targetsToResume) {
      return;
    }

    for (let i = 0; i < targetsToResume.length; i++) {
      const target = targetsToResume[i];
      if (target) {
        this.resumeTarget(target);
      }
    }
  }

  purgeSharedManager(): void {
    this.#scheduler.unscheduleUpdate(this);
  }

  scheduleUpdate(): void {
    this.#scheduler.scheduleUpdate(this, Scheduler.PRIORITY_SYSTEM, false);
  }

  update(dt: number): void {
    for (let i = 0; i < this.#targets.length; ++i) {
      const currentTarget = this.#targets[i];
      currentTarget.update(dt);

      if (!currentTarget.hasActions) {
        this.#deleteHashElement(currentTarget) && i--;
      }
    }
  }

  #deleteHashElement(element: HashElement): boolean {
    element.removeAction();

    if (element.lock) {
      return false;
    }

    const index = this.#targets.indexOf(element);

    if (index !== -1) {
      this.#targets.splice(index, 1);
    }

    const targetId = element.targetId;
    if (targetId !== null) {
      this.#hashTargets.delete(targetId);
    }
    this.#elementPool.put(element);

    return true;
  }
}

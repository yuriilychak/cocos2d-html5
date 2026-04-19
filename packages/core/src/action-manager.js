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

import { NewClass } from './platform/class';

/**
 * @class
 * @extends cc.Class
 * @example
 * var element = new cc.HashElement();
 */
export var HashElement = function () {
    this.actions = [];
    this.target = null;
    this.actionIndex = 0;
    this.currentAction = null;
    this.paused = false;
    this.lock = false;
};

/**
 * ActionManager is a class that can manage actions.<br/>
 * Normally you won't need to use this class directly. 99% of the cases you will use the CCNode interface,
 * which uses this class's singleton object.
 * But there are some cases where you might need to use this class. <br/>
 * Examples:<br/>
 * - When you want to run an action where the target is different from a CCNode.<br/>
 * - When you want to pause / resume the actions<br/>
 * @example
 * var mng = new ActionManager();
 */
export class ActionManager extends NewClass {
    _searchElementByTarget(arr, target) {
        for (var k = 0; k < arr.length; k++) {
            if (target === arr[k].target)
                return arr[k];
        }
        return null;
    }

    constructor() {
        super();
        this._elementPool = [];
        this._hashTargets = {};
        this._arrayTargets = [];
        this._currentTarget = null;
    }

    _getElement(target, paused) {
        var element = this._elementPool.pop();
        if (!element) {
            element = new HashElement();
        }
        element.target = target;
        element.paused = !!paused;
        return element;
    }

    _putElement(element) {
        element.actions.length = 0;
        element.actionIndex = 0;
        element.currentAction = null;
        element.paused = false;
        element.target = null;
        element.lock = false;
        this._elementPool.push(element);
    }

    addAction(action, target, paused) {
        if (!action)
            throw new Error("cc.ActionManager.addAction(): action must be non-null");
        if (!target)
            throw new Error("cc.ActionManager.addAction(): target must be non-null");

        var element = this._hashTargets[target.__instanceId];
        if (!element) {
            element = this._getElement(target, paused);
            this._hashTargets[target.__instanceId] = element;
            this._arrayTargets.push(element);
        }
        else if (!element.actions) {
            element.actions = [];
        }

        element.actions.push(action);
        action.startWithTarget(target);
    }

    removeAllActions() {
        var locTargets = this._arrayTargets;
        for (var i = 0; i < locTargets.length; i++) {
            var element = locTargets[i];
            if (element)
                this.removeAllActionsFromTarget(element.target, true);
        }
    }

    removeAllActionsFromTarget(target, forceDelete) {
        if (target == null)
            return;
        var element = this._hashTargets[target.__instanceId];
        if (element) {
            element.actions.length = 0;
            this._deleteHashElement(element);
        }
    }

    removeAction(action) {
        if (action == null)
            return;
        var target = action.getOriginalTarget();
        var element = this._hashTargets[target.__instanceId];

        if (element) {
            for (var i = 0; i < element.actions.length; i++) {
                if (element.actions[i] === action) {
                    element.actions.splice(i, 1);
                    if (element.actionIndex >= i)
                        element.actionIndex--;
                    break;
                }
            }
        } else {
            cc.log(cc._LogInfos.ActionManager_removeAction);
        }
    }

    removeActionByTag(tag, target) {
        if (tag === cc.ACTION_TAG_INVALID)
            cc.log(cc._LogInfos.ActionManager_addAction);

        cc.assert(target, cc._LogInfos.ActionManager_addAction);

        var element = this._hashTargets[target.__instanceId];

        if (element) {
            var limit = element.actions.length;
            for (var i = 0; i < limit; ++i) {
                var action = element.actions[i];
                if (action && action.getTag() === tag && action.getOriginalTarget() === target) {
                    this._removeActionAtIndex(i, element);
                    break;
                }
            }
        }
    }

    getActionByTag(tag, target) {
        if (tag === cc.ACTION_TAG_INVALID)
            cc.log(cc._LogInfos.ActionManager_getActionByTag);

        var element = this._hashTargets[target.__instanceId];
        if (element) {
            if (element.actions != null) {
                for (var i = 0; i < element.actions.length; ++i) {
                    var action = element.actions[i];
                    if (action && action.getTag() === tag)
                        return action;
                }
            }
            cc.log(cc._LogInfos.ActionManager_getActionByTag_2, tag);
        }
        return null;
    }

    numberOfRunningActionsInTarget(target) {
        var element = this._hashTargets[target.__instanceId];
        if (element)
            return (element.actions) ? element.actions.length : 0;
        return 0;
    }

    pauseTarget(target) {
        var element = this._hashTargets[target.__instanceId];
        if (element)
            element.paused = true;
    }

    resumeTarget(target) {
        var element = this._hashTargets[target.__instanceId];
        if (element)
            element.paused = false;
    }

    pauseAllRunningActions() {
        var idsWithActions = [];
        var locTargets = this._arrayTargets;
        for (var i = 0; i < locTargets.length; i++) {
            var element = locTargets[i];
            if (element && !element.paused) {
                element.paused = true;
                idsWithActions.push(element.target);
            }
        }
        return idsWithActions;
    }

    resumeTargets(targetsToResume) {
        if (!targetsToResume)
            return;

        for (var i = 0; i < targetsToResume.length; i++) {
            if (targetsToResume[i])
                this.resumeTarget(targetsToResume[i]);
        }
    }

    purgeSharedManager() {
        cc.director.getScheduler().unscheduleUpdate(this);
    }

    _removeActionAtIndex(index, element) {
        var action = element.actions[index];

        element.actions.splice(index, 1);

        if (element.actionIndex >= index)
            element.actionIndex--;

        if (element.actions.length === 0) {
            this._deleteHashElement(element);
        }
    }

    _deleteHashElement(element) {
        var ret = false;
        if (element && !element.lock) {
            if (this._hashTargets[element.target.__instanceId]) {
                delete this._hashTargets[element.target.__instanceId];
                var targets = this._arrayTargets;
                for (var i = 0, l = targets.length; i < l; i++) {
                    if (targets[i] === element) {
                        targets.splice(i, 1);
                        break;
                    }
                }
                this._putElement(element);
                ret = true;
            }
        }
        return ret;
    }

    update(dt) {
        var locTargets = this._arrayTargets, locCurrTarget;
        for (var elt = 0; elt < locTargets.length; elt++) {
            this._currentTarget = locTargets[elt];
            locCurrTarget = this._currentTarget;
            if (!locCurrTarget.paused && locCurrTarget.actions) {
                locCurrTarget.lock = true;
                for (locCurrTarget.actionIndex = 0; locCurrTarget.actionIndex < locCurrTarget.actions.length; locCurrTarget.actionIndex++) {
                    locCurrTarget.currentAction = locCurrTarget.actions[locCurrTarget.actionIndex];
                    if (!locCurrTarget.currentAction)
                        continue;

                    locCurrTarget.currentAction.step(dt * (locCurrTarget.currentAction._speedMethod ? locCurrTarget.currentAction._speed : 1));

                    if (locCurrTarget.currentAction && locCurrTarget.currentAction.isDone()) {
                        locCurrTarget.currentAction.stop();
                        var action = locCurrTarget.currentAction;
                        locCurrTarget.currentAction = null;
                        this.removeAction(action);
                    }

                    locCurrTarget.currentAction = null;
                }
                locCurrTarget.lock = false;
            }
            if (locCurrTarget.actions.length === 0) {
                this._deleteHashElement(locCurrTarget) && elt--;
            }
        }
    }
}

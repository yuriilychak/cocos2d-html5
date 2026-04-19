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

import { NewClass } from '../platform/class';
import { ListEntry } from './list-entry';
import { HashUpdateEntry } from './hash-update-entry';
import { HashTimerEntry } from './hash-timer-entry';
import { CallbackTimer } from './callback-timer';

/**
 * Scheduler is responsible of triggering the scheduled callbacks.
 */
export class Scheduler extends NewClass {
    static PRIORITY_SYSTEM = (-2147483647 - 1);
    static PRIORITY_NON_SYSTEM = Scheduler.PRIORITY_SYSTEM + 1;

    constructor() {
        super();
        this._timeScale = 1.0;
        this._updatesNegList = [];
        this._updates0List = [];
        this._updatesPosList = [];

        this._hashForUpdates = {};
        this._hashForTimers = {};
        this._currentTarget = null;
        this._currentTargetSalvaged = false;
        this._updateHashLocked = false;

        this._arrayForTimers = [];
    }

    _schedulePerFrame(callback, target, priority, paused) {
        var hashElement = this._hashForUpdates[target.__instanceId];
        if (hashElement && hashElement.entry) {
            if (hashElement.entry.priority !== priority) {
                if (this._updateHashLocked) {
                    cc.log("warning: you CANNOT change update priority in scheduled function");
                    hashElement.entry.markedForDeletion = false;
                    hashElement.entry.paused = paused;
                    return;
                } else {
                    this.unscheduleUpdate(target);
                }
            } else {
                hashElement.entry.markedForDeletion = false;
                hashElement.entry.paused = paused;
                return;
            }
        }

        if (priority === 0) {
            this._appendIn(this._updates0List, callback, target, paused);
        } else if (priority < 0) {
            this._priorityIn(this._updatesNegList, callback, target, priority, paused);
        } else {
            this._priorityIn(this._updatesPosList, callback, target, priority, paused);
        }
    }

    _removeHashElement(element) {
        delete this._hashForTimers[element.target.__instanceId];
        var arr = this._arrayForTimers;
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === element) {
                arr.splice(i, 1);
                break;
            }
        }
        HashTimerEntry.put(element);
    }

    _removeUpdateFromHash(entry) {
        var self = this;
        var element = self._hashForUpdates[entry.target.__instanceId];
        if (element) {
            var list = element.list, listEntry = element.entry;
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i] === listEntry) {
                    list.splice(i, 1);
                    break;
                }
            }

            delete self._hashForUpdates[element.target.__instanceId];
            ListEntry.put(listEntry);
            HashUpdateEntry.put(element);
        }
    }

    _priorityIn(ppList, callback, target, priority, paused) {
        var self = this,
            listElement = ListEntry.get(null, null, callback, target, priority, paused, false);

        if (!ppList) {
            ppList = [];
            ppList.push(listElement);
        } else {
            var index2Insert = ppList.length - 1;
            for (var i = 0; i <= index2Insert; i++) {
                if (priority < ppList[i].priority) {
                    index2Insert = i;
                    break;
                }
            }
            ppList.splice(i, 0, listElement);
        }

        self._hashForUpdates[target.__instanceId] = HashUpdateEntry.get(ppList, listElement, target, null);

        return ppList;
    }

    _appendIn(ppList, callback, target, paused) {
        var self = this,
            listElement = ListEntry.get(null, null, callback, target, 0, paused, false);
        ppList.push(listElement);

        self._hashForUpdates[target.__instanceId] = HashUpdateEntry.get(ppList, listElement, target, null, null);
    }

    setTimeScale(timeScale) {
        this._timeScale = timeScale;
    }

    getTimeScale() {
        return this._timeScale;
    }

    update(dt) {
        this._updateHashLocked = true;
        if (this._timeScale !== 1)
            dt *= this._timeScale;

        var i, list, len, entry;

        for (i = 0, list = this._updatesNegList, len = list.length; i < len; i++) {
            entry = list[i];
            if (!entry.paused && !entry.markedForDeletion)
                entry.callback(dt);
        }

        for (i = 0, list = this._updates0List, len = list.length; i < len; i++) {
            entry = list[i];
            if (!entry.paused && !entry.markedForDeletion)
                entry.callback(dt);
        }

        for (i = 0, list = this._updatesPosList, len = list.length; i < len; i++) {
            entry = list[i];
            if (!entry.paused && !entry.markedForDeletion)
                entry.callback(dt);
        }

        var elt, arr = this._arrayForTimers;
        for (i = 0; i < arr.length; i++) {
            elt = arr[i];
            this._currentTarget = elt;
            this._currentTargetSalvaged = false;

            if (!elt.paused) {
                for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; ++(elt.timerIndex)) {
                    elt.currentTimer = elt.timers[elt.timerIndex];
                    elt.currentTimerSalvaged = false;

                    elt.currentTimer.update(dt);
                    elt.currentTimer = null;
                }
            }

            if (this._currentTargetSalvaged && this._currentTarget.timers.length === 0)
                this._removeHashElement(this._currentTarget);
        }

        for (i = 0, list = this._updatesNegList; i < list.length;) {
            entry = list[i];
            if (entry.markedForDeletion)
                this._removeUpdateFromHash(entry);
            else
                i++;
        }

        for (i = 0, list = this._updates0List; i < list.length;) {
            entry = list[i];
            if (entry.markedForDeletion)
                this._removeUpdateFromHash(entry);
            else
                i++;
        }

        for (i = 0, list = this._updatesPosList; i < list.length;) {
            entry = list[i];
            if (entry.markedForDeletion)
                this._removeUpdateFromHash(entry);
            else
                i++;
        }

        this._updateHashLocked = false;
        this._currentTarget = null;
    }

    schedule(callback, target, interval, repeat, delay, paused, key) {
        var isSelector = false;
        if (typeof callback !== "function") {
            var tmp = callback;
            callback = target;
            target = tmp;
            isSelector = true;
        }
        if (arguments.length === 4 || arguments.length === 5) {
            key = delay;
            paused = repeat;
            repeat = cc.REPEAT_FOREVER;
            delay = 0;
        }
        if (key === undefined) {
            key = target.__instanceId + "";
        }

        cc.assert(target, cc._LogInfos.Scheduler_scheduleCallbackForTarget_3);

        var element = this._hashForTimers[target.__instanceId];

        if (!element) {
            element = HashTimerEntry.get(null, target, 0, null, null, paused);
            this._arrayForTimers.push(element);
            this._hashForTimers[target.__instanceId] = element;
        } else {
            cc.assert(element.paused === paused, "");
        }

        var timer, i;
        if (element.timers == null) {
            element.timers = [];
        } else {
            for (i = 0; i < element.timers.length; i++) {
                timer = element.timers[i];
                if (callback === timer._callback) {
                    cc.log(cc._LogInfos.Scheduler_scheduleCallbackForTarget, timer.getInterval().toFixed(4), interval.toFixed(4));
                    timer._interval = interval;
                    return;
                }
            }
        }

        timer = CallbackTimer.get();
        timer.initWithCallback(this, callback, target, interval, repeat, delay, key);
        element.timers.push(timer);
    }

    scheduleUpdate(target, priority, paused) {
        this._schedulePerFrame(function (dt) {
            target.update(dt);
        }, target, priority, paused);
    }

    _getUnscheduleMark(key, timer) {
        switch (typeof key) {
            case "number":
            case "string":
                return key === timer._key;
            case "function":
                return key === timer._callback;
        }
    }

    unschedule(key, target) {
        if (!target || !key)
            return;

        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            var timers = element.timers;
            for (var i = 0, li = timers.length; i < li; i++) {
                var timer = timers[i];
                if (this._getUnscheduleMark(key, timer)) {
                    if ((timer === element.currentTimer) && (!element.currentTimerSalvaged)) {
                        element.currentTimerSalvaged = true;
                    }
                    timers.splice(i, 1);
                    CallbackTimer.put(timer);
                    if (element.timerIndex >= i) {
                        element.timerIndex--;
                    }

                    if (timers.length === 0) {
                        if (self._currentTarget === element) {
                            self._currentTargetSalvaged = true;
                        } else {
                            self._removeHashElement(element);
                        }
                    }
                    return;
                }
            }
        }
    }

    unscheduleUpdate(target) {
        if (!target)
            return;

        var element = this._hashForUpdates[target.__instanceId];

        if (element) {
            if (this._updateHashLocked) {
                element.entry.markedForDeletion = true;
            } else {
                this._removeUpdateFromHash(element.entry);
            }
        }
    }

    unscheduleAllForTarget(target) {
        if (!target) {
            return;
        }

        var element = this._hashForTimers[target.__instanceId];

        if (element) {
            var timers = element.timers;
            if (timers.indexOf(element.currentTimer) > -1 &&
                (!element.currentTimerSalvaged)) {
                element.currentTimerSalvaged = true;
            }
            for (var i = 0, l = timers.length; i < l; i++) {
                CallbackTimer.put(timers[i]);
            }
            timers.length = 0;

            if (this._currentTarget === element) {
                this._currentTargetSalvaged = true;
            } else {
                this._removeHashElement(element);
            }
        }

        this.unscheduleUpdate(target);
    }

    unscheduleAll() {
        this.unscheduleAllWithMinPriority(Scheduler.PRIORITY_SYSTEM);
    }

    unscheduleAllWithMinPriority(minPriority) {
        var i, element, arr = this._arrayForTimers;
        for (i = arr.length - 1; i >= 0; i--) {
            element = arr[i];
            this.unscheduleAllForTarget(element.target);
        }

        var entry;
        var temp_length = 0;
        if (minPriority < 0) {
            for (i = 0; i < this._updatesNegList.length;) {
                temp_length = this._updatesNegList.length;
                entry = this._updatesNegList[i];
                if (entry && entry.priority >= minPriority)
                    this.unscheduleUpdate(entry.target);
                if (temp_length == this._updatesNegList.length)
                    i++;
            }
        }

        if (minPriority <= 0) {
            for (i = 0; i < this._updates0List.length;) {
                temp_length = this._updates0List.length;
                entry = this._updates0List[i];
                if (entry)
                    this.unscheduleUpdate(entry.target);
                if (temp_length == this._updates0List.length)
                    i++;
            }
        }

        for (i = 0; i < this._updatesPosList.length;) {
            temp_length = this._updatesPosList.length;
            entry = this._updatesPosList[i];
            if (entry && entry.priority >= minPriority)
                this.unscheduleUpdate(entry.target);
            if (temp_length == this._updatesPosList.length)
                i++;
        }
    }

    isScheduled(callback, target) {
        cc.assert(callback, "Argument callback must not be empty");
        cc.assert(target, "Argument target must be non-nullptr");

        var element = this._hashForTimers[target.__instanceId];

        if (!element) {
            return false;
        }

        if (element.timers == null) {
            return false;
        }
        else {
            var timers = element.timers;
            for (var i = 0; i < timers.length; ++i) {
                var timer = timers[i];

                if (callback === timer._callback) {
                    return true;
                }
            }
            return false;
        }
    }

    pauseAllTargets() {
        return this.pauseAllTargetsWithMinPriority(Scheduler.PRIORITY_SYSTEM);
    }

    pauseAllTargetsWithMinPriority(minPriority) {
        var idsWithSelectors = [];

        var self = this, element, locArrayForTimers = self._arrayForTimers;
        var i, li;
        for (i = 0, li = locArrayForTimers.length; i < li; i++) {
            element = locArrayForTimers[i];
            if (element) {
                element.paused = true;
                idsWithSelectors.push(element.target);
            }
        }

        var entry;
        if (minPriority < 0) {
            for (i = 0; i < this._updatesNegList.length; i++) {
                entry = this._updatesNegList[i];
                if (entry) {
                    if (entry.priority >= minPriority) {
                        entry.paused = true;
                        idsWithSelectors.push(entry.target);
                    }
                }
            }
        }

        if (minPriority <= 0) {
            for (i = 0; i < this._updates0List.length; i++) {
                entry = this._updates0List[i];
                if (entry) {
                    entry.paused = true;
                    idsWithSelectors.push(entry.target);
                }
            }
        }

        for (i = 0; i < this._updatesPosList.length; i++) {
            entry = this._updatesPosList[i];
            if (entry) {
                if (entry.priority >= minPriority) {
                    entry.paused = true;
                    idsWithSelectors.push(entry.target);
                }
            }
        }

        return idsWithSelectors;
    }

    resumeTargets(targetsToResume) {
        if (!targetsToResume)
            return;

        for (var i = 0; i < targetsToResume.length; i++) {
            this.resumeTarget(targetsToResume[i]);
        }
    }

    pauseTarget(target) {
        cc.assert(target, cc._LogInfos.Scheduler_pauseTarget);

        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            element.paused = true;
        }

        var elementUpdate = self._hashForUpdates[target.__instanceId];
        if (elementUpdate) {
            elementUpdate.entry.paused = true;
        }
    }

    resumeTarget(target) {
        cc.assert(target, cc._LogInfos.Scheduler_resumeTarget);

        var self = this, element = self._hashForTimers[target.__instanceId];

        if (element) {
            element.paused = false;
        }

        var elementUpdate = self._hashForUpdates[target.__instanceId];

        if (elementUpdate) {
            elementUpdate.entry.paused = false;
        }
    }

    isTargetPaused(target) {
        cc.assert(target, cc._LogInfos.Scheduler_isTargetPaused);

        var element = this._hashForTimers[target.__instanceId];
        if (element) {
            return element.paused;
        }
        var elementUpdate = this._hashForUpdates[target.__instanceId];
        if (elementUpdate) {
            return elementUpdate.entry.paused;
        }
        return false;
    }
}

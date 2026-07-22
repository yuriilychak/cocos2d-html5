import { BaseClass } from '../platform/class';
import { ListEntry } from './list-entry';
import { HashUpdateEntry } from './hash-update-entry';
import { HashTimerEntry } from './hash-timer-entry';
import { CallbackTimer } from './callback-timer';
import { log, assert, _LogInfos } from '../boot/debugger';
import { REPEAT_FOREVER } from '../platform/macro/constants';

interface SchedulerTarget {
    __instanceId: number;
    update?: (dt: number) => void;
}

type Callback = (dt: number) => void;
type TimerKey = string | number;

/** Scheduler is responsible for triggering scheduled callbacks. */
export default class Scheduler extends BaseClass {
    static PRIORITY_SYSTEM = -2147483647 - 1;
    static PRIORITY_NON_SYSTEM = Scheduler.PRIORITY_SYSTEM + 1;

    #timeScale = 1;
    #updatesNegList: ListEntry[] = [];
    #updates0List: ListEntry[] = [];
    #updatesPosList: ListEntry[] = [];
    #hashForUpdates = new Map<number, HashUpdateEntry>();
    #hashForTimers = new Map<number, HashTimerEntry>();
    #currentTarget: HashTimerEntry | null = null;
    #currentTargetSalvaged = false;
    #updateHashLocked = false;
    #arrayForTimers: HashTimerEntry[] = [];

    constructor() {
        super();
    }

    #schedulePerFrame(callback: Callback, target: SchedulerTarget, priority: number, paused: boolean): void {
        const hashElement = this.#hashForUpdates.get(target.__instanceId);
        if (hashElement && hashElement.entry) {
            if (hashElement.setPriority(priority, paused, this.#updateHashLocked)) {
                this.unscheduleUpdate(target);
            } else {
                return;
            }
        }

        if (priority === 0) {
            this.#appendIn(this.#updates0List, callback, target, paused);
        } else if (priority < 0) {
            this.#priorityIn(this.#updatesNegList, callback, target, priority, paused);
        } else {
            this.#priorityIn(this.#updatesPosList, callback, target, priority, paused);
        }
    }

    #removeHashElement(element: HashTimerEntry): void {
        this.#hashForTimers.delete(element.target!.__instanceId);
        const index = this.#arrayForTimers.indexOf(element);
        if (index !== -1) {
            this.#arrayForTimers.splice(index, 1);
        }
        HashTimerEntry.put(element);
    }

    #removeUpdateFromHash(entry: ListEntry): void {
        const targetId = entry.target!.__instanceId;
        if (!this.#hashForUpdates.has(targetId)) {
            return;
        }

        const element = this.#hashForUpdates.get(targetId)!;
        const list = element.list!;
        const listEntry = element.entry!;
        const index = list.indexOf(listEntry);
        if (index !== -1) {
            list.splice(index, 1);
        }

        this.#hashForUpdates.delete(targetId);
        ListEntry.put(listEntry);
        HashUpdateEntry.put(element);
    }

    #priorityIn(
        list: ListEntry[],
        callback: Callback,
        target: SchedulerTarget,
        priority: number,
        paused: boolean,
    ): ListEntry[] {
        const listElement = ListEntry.get(null, null, callback, target, priority, paused, false);
        let index = list.length;
        for (let i = 0; i < index; i++) {
            if (priority < list[i].priority) {
                index = i;
                break;
            }
        }
        list.splice(index, 0, listElement);
        this.#hashForUpdates.set(
            target.__instanceId,
            HashUpdateEntry.get(list, listElement, target, null),
        );
        return list;
    }

    #appendIn(list: ListEntry[], callback: Callback, target: SchedulerTarget, paused: boolean): void {
        const listElement = ListEntry.get(null, null, callback, target, 0, paused, false);
        list.push(listElement);
        this.#hashForUpdates.set(
            target.__instanceId,
            HashUpdateEntry.get(list, listElement, target, null),
        );
    }

    set timeScale(timeScale: number) {
        this.#timeScale = timeScale;
    }

    get timeScale(): number {
        return this.#timeScale;
    }

    update(dt: number): void {
        this.#updateHashLocked = true;
        if (this.#timeScale !== 1) {
            dt *= this.#timeScale;
        }

        this.#updateList(this.#updatesNegList, dt);
        this.#updateList(this.#updates0List, dt);
        this.#updateList(this.#updatesPosList, dt);

        for (let i = 0; i < this.#arrayForTimers.length; ++i) {
            this.#currentTarget = this.#arrayForTimers[i];
            this.#currentTargetSalvaged = false;

            this.#currentTarget.update(dt);

            if (this.#currentTargetSalvaged && !this.#currentTarget.hasTimers) {
                this.#removeHashElement(this.#currentTarget);
            }
        }

        this.#removeMarkedEntries(this.#updatesNegList);
        this.#removeMarkedEntries(this.#updates0List);
        this.#removeMarkedEntries(this.#updatesPosList);

        this.#updateHashLocked = false;
        this.#currentTarget = null;
    }

    #updateList(list: ListEntry[], dt: number): void {
        for (let i = 0, length = list.length; i < length; i++) {
            list[i].update(dt);
        }
    }

    #removeMarkedEntries(list: ListEntry[]): void {
        for (let i = 0; i < list.length;) {
            const entry = list[i];
            if (entry.markedForDeletion) {
                this.#removeUpdateFromHash(entry);
            } else {
                i++;
            }
        }
    }

    schedule(
        callback: any,
        target: any,
        interval: number,
        repeat?: number | boolean,
        delay?: number | string,
        paused?: boolean,
        key?: string,
    ): void {
        if (typeof callback !== 'function') {
            const temporary = callback;
            callback = target;
            target = temporary;
        }
        if (arguments.length === 4 || arguments.length === 5) {
            key = delay as string;
            paused = repeat as boolean;
            repeat = REPEAT_FOREVER;
            delay = 0;
        }
        if (key === undefined) {
            key = target.__instanceId + '';
        }

        assert(target, _LogInfos.Scheduler_scheduleCallbackForTarget_3);
        const timerTarget = target as SchedulerTarget;
        let element = this.#hashForTimers.get(timerTarget.__instanceId);

        if (!element) {
            element = HashTimerEntry.get(null, timerTarget, 0, null, null, paused as boolean);
            this.#arrayForTimers.push(element);
            this.#hashForTimers.set(timerTarget.__instanceId, element);
        } else {
            assert(element.paused === paused, '');
        }

        if (element.updateTimer(callback, interval)) {
            return;
        }

        const timer = CallbackTimer.get();
        timer.initWithCallback(this, callback, timerTarget, interval, repeat as number, delay as number, key);
        element.timers!.push(timer);
    }

    scheduleUpdate(target: any, priority: number = 0, paused: boolean = false): void {
        this.#schedulePerFrame((dt) => target.update(dt), target as SchedulerTarget, priority, paused);
    }

    #getUnscheduleMark(key: TimerKey | Callback, timer: CallbackTimer): boolean | undefined {
        switch (typeof key) {
            case 'number':
            case 'string':
                return key === timer.key;
            case 'function':
                return key === timer.callback;
        }
    }

    unschedule(key: TimerKey | Callback, target: SchedulerTarget): void {
        if (!target || !key) {
            return;
        }

        const element = this.#hashForTimers.get(target.__instanceId);
        if (element) {
            const timers = element.timers!;
            for (let i = 0; i < timers.length; i++) {
                const timer = timers[i];
                if (this.#getUnscheduleMark(key, timer)) {
                    if (timer === element.currentTimer && !element.currentTimerSalvaged) {
                        element.currentTimerSalvaged = true;
                    }
                    timers.splice(i, 1);
                    CallbackTimer.put(timer);
                    if (element.timerIndex >= i) {
                        element.timerIndex--;
                    }

                    if (timers.length === 0) {
                        if (this.#currentTarget === element) {
                            this.#currentTargetSalvaged = true;
                        } else {
                            this.#removeHashElement(element);
                        }
                    }
                    return;
                }
            }
        }
    }

    unscheduleUpdate(target: any): void {
        if (!target) {
            return;
        }

        const element = this.#hashForUpdates.get(target.__instanceId);
        if (element) {
            if (this.#updateHashLocked) {
                element.entry!.markedForDeletion = true;
            } else {
                this.#removeUpdateFromHash(element.entry!);
            }
        }
    }

    unscheduleAllForTarget(target: SchedulerTarget): void {
        if (!target) {
            return;
        }

        const element = this.#hashForTimers.get(target.__instanceId);
        if (element) {
            const timers = element.timers!;
            if (timers.indexOf(element.currentTimer!) > -1 && !element.currentTimerSalvaged) {
                element.currentTimerSalvaged = true;
            }
            for (const timer of timers) {
                CallbackTimer.put(timer);
            }
            timers.length = 0;

            if (this.#currentTarget === element) {
                this.#currentTargetSalvaged = true;
            } else {
                this.#removeHashElement(element);
            }
        }

        this.unscheduleUpdate(target);
    }

    unscheduleAll(): void {
        this.unscheduleAllWithMinPriority(Scheduler.PRIORITY_SYSTEM);
    }

    unscheduleAllWithMinPriority(minPriority: number): void {
        for (let i = this.#arrayForTimers.length - 1; i >= 0; i--) {
            this.unscheduleAllForTarget(this.#arrayForTimers[i].target!);
        }

        this.#unscheduleListWithMinPriority(this.#updatesNegList, minPriority, minPriority < 0);
        this.#unscheduleListWithMinPriority(this.#updates0List, minPriority, minPriority <= 0);
        this.#unscheduleListWithMinPriority(this.#updatesPosList, minPriority, true);
    }

    #unscheduleListWithMinPriority(list: ListEntry[], minPriority: number, enabled: boolean): void {
        if (!enabled) {
            return;
        }
        for (let i = 0; i < list.length;) {
            const length = list.length;
            const entry = list[i];
            if (entry && entry.priority >= minPriority) {
                this.unscheduleUpdate(entry.target!);
            }
            if (length === list.length) {
                i++;
            }
        }
    }

    isScheduled(callback: Callback, target: SchedulerTarget): boolean {
        assert(callback, 'Argument callback must not be empty');
        assert(target, 'Argument target must be non-nullptr');

        const element = this.#hashForTimers.get(target.__instanceId);
        if (!element || element.timers === null) {
            return false;
        }
        return element.timers.some((timer) => callback === timer.callback);
    }

    pauseAllTargets(): SchedulerTarget[] {
        return this.pauseAllTargetsWithMinPriority(Scheduler.PRIORITY_SYSTEM);
    }

    pauseAllTargetsWithMinPriority(minPriority: number): SchedulerTarget[] {
        const idsWithSelectors: SchedulerTarget[] = [];
        for (const element of this.#arrayForTimers) {
            element.paused = true;
            idsWithSelectors.push(element.target!);
        }

        this.#pauseListWithMinPriority(this.#updatesNegList, minPriority, minPriority < 0, idsWithSelectors);
        this.#pauseListWithMinPriority(this.#updates0List, minPriority, minPriority <= 0, idsWithSelectors);
        this.#pauseListWithMinPriority(this.#updatesPosList, minPriority, true, idsWithSelectors);
        return idsWithSelectors;
    }

    #pauseListWithMinPriority(
        list: ListEntry[],
        minPriority: number,
        enabled: boolean,
        targets: SchedulerTarget[],
    ): void {
        if (!enabled) {
            return;
        }
        for (const entry of list) {
            if (entry && entry.priority >= minPriority) {
                entry.paused = true;
                targets.push(entry.target!);
            }
        }
    }

    resumeTargets(targetsToResume: SchedulerTarget[] | null | undefined): void {
        if (!targetsToResume) {
            return;
        }
        for (const target of targetsToResume) {
            this.resumeTarget(target);
        }
    }

    pauseTarget(target: SchedulerTarget): void {
        assert(target, _LogInfos.Scheduler_pauseTarget);
        const element = this.#hashForTimers.get(target.__instanceId);
        if (element) {
            element.paused = true;
        }
        const elementUpdate = this.#hashForUpdates.get(target.__instanceId);
        if (elementUpdate) {
            elementUpdate.entry!.paused = true;
        }
    }

    resumeTarget(target: SchedulerTarget): void {
        assert(target, _LogInfos.Scheduler_resumeTarget);
        const element = this.#hashForTimers.get(target.__instanceId);
        if (element) {
            element.paused = false;
        }
        const elementUpdate = this.#hashForUpdates.get(target.__instanceId);
        if (elementUpdate) {
            elementUpdate.entry!.paused = false;
        }
    }

    isTargetPaused(target: SchedulerTarget): boolean {
        assert(target, _LogInfos.Scheduler_isTargetPaused);
        const element = this.#hashForTimers.get(target.__instanceId);
        if (element) {
            return element.paused;
        }
        const elementUpdate = this.#hashForUpdates.get(target.__instanceId);
        return elementUpdate ? elementUpdate.entry!.paused : false;
    }
}

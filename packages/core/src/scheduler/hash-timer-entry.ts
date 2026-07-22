import { MAX_POOL_SIZE } from './constants';
import type { CallbackTimer } from './callback-timer';
import { log, _LogInfos } from '../boot/debugger';

interface TimerTarget {
    __instanceId: number;
}

export class HashTimerEntry {
    static #pool: HashTimerEntry[] = [];

    #timers: CallbackTimer[] | null;
    #target: TimerTarget | null;
    #timerIndex: number;
    #currentTimer: CallbackTimer | null;
    #currentTimerSalvaged: boolean | null;
    #paused: boolean;

    constructor(
        timers: CallbackTimer[] | null,
        target: TimerTarget | null,
        timerIndex: number,
        currentTimer: CallbackTimer | null,
        currentTimerSalvaged: boolean | null,
        paused: boolean,
    ) {
        this.#timers = timers;
        this.#target = target;
        this.#timerIndex = timerIndex;
        this.#currentTimer = currentTimer;
        this.#currentTimerSalvaged = currentTimerSalvaged;
        this.#paused = paused;
    }

    init(
        timers: CallbackTimer[] | null,
        target: TimerTarget | null,
        timerIndex: number,
        currentTimer: CallbackTimer | null,
        currentTimerSalvaged: boolean | null,
        paused: boolean,
    ): void {
        this.#timers = timers;
        this.#target = target;
        this.#timerIndex = timerIndex;
        this.#currentTimer = currentTimer;
        this.#currentTimerSalvaged = currentTimerSalvaged;
        this.#paused = paused;
    }

    clear(): void {
        this.#timers = null;
        this.#target = null;
        this.#timerIndex = 0;
        this.#currentTimer = null;
        this.#currentTimerSalvaged = false;
        this.#paused = false;
    }

    get timers(): CallbackTimer[] | null {
        return this.#timers;
    }

    set timers(value: CallbackTimer[] | null) {
        this.#timers = value;
    }

    get target(): TimerTarget | null {
        return this.#target;
    }

    get timerIndex(): number {
        return this.#timerIndex;
    }

    set timerIndex(value: number) {
        this.#timerIndex = value;
    }

    get currentTimer(): CallbackTimer | null {
        return this.#currentTimer;
    }

    set currentTimer(value: CallbackTimer | null) {
        this.#currentTimer = value;
    }

    get currentTimerSalvaged(): boolean | null {
        return this.#currentTimerSalvaged;
    }

    set currentTimerSalvaged(value: boolean | null) {
        this.#currentTimerSalvaged = value;
    }

    get paused(): boolean {
        return this.#paused;
    }

    set paused(value: boolean) {
        this.#paused = value;
    }

    public get hasTimers(): boolean {
        return this.#timers !== null && this.#timers.length > 0;
    }

    public updateTimer(callback: (dt: number) => void, interval: number): boolean {
        if (!this.#timers) {
            this.#timers = [];
            return false;
        }

        for (const timer of this.#timers) {
            if (callback === timer.callback) {
                log(_LogInfos.Scheduler_scheduleCallbackForTarget, timer.interval.toFixed(4), interval.toFixed(4));
                timer.interval = interval;
                return true;
            }
        }

        return false;
    }

    public update(dt: number): void {
        if (this.#paused) {
            return;
        }

        for (
            this.#timerIndex = 0;
            this.#timerIndex < this.#timers!.length;
            this.#timerIndex++
        ) {
            this.#currentTimer = this.#timers![this.#timerIndex];
            this.#currentTimerSalvaged = false;
            this.#currentTimer!.update(dt);
            this.#currentTimer = null;
        }
    }

    static get(
        timers: CallbackTimer[] | null,
        target: TimerTarget | null,
        timerIndex: number,
        currentTimer: CallbackTimer | null,
        currentTimerSalvaged: boolean | null,
        paused: boolean,
    ): HashTimerEntry {
        const result = HashTimerEntry.#pool.pop();
        if (result) {
            result.init(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused);
            return result;
        }
        return new HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused);
    }

    static put(entry: HashTimerEntry): void {
        entry.clear();
        if (HashTimerEntry.#pool.length < MAX_POOL_SIZE) {
            HashTimerEntry.#pool.push(entry);
        }
    }
}

import { MAX_POOL_SIZE } from './constants';
import { REPEAT_FOREVER } from '../platform/macro/constants';

type Callback = (elapsed: number) => void;

interface TimerTarget {
    __instanceId: number;
}

interface SchedulerLike {
    unschedule(callback: Callback, target: TimerTarget): void;
}

export class CallbackTimer {
    static #pool: CallbackTimer[] = [];

    #scheduler: SchedulerLike | null = null;
    #elapsed = -1;
    #runForever = false;
    #useDelay = false;
    #timesExecuted = 0;
    #repeat = 0;
    #delay = 0;
    #interval = 0;
    #target: TimerTarget | null = null;
    #callback: Callback | null = null;
    #key: string | number | null = null;

    initWithCallback(
        scheduler: SchedulerLike,
        callback: Callback,
        target: TimerTarget,
        seconds: number,
        repeat: number,
        delay: number,
        key: string | number | null,
    ): boolean {
        this.#scheduler = scheduler;
        this.#target = target;
        this.#callback = callback;
        if (key) {
            this.#key = key;
        }

        this.#elapsed = -1;
        this.#interval = seconds;
        this.#delay = delay;
        this.#useDelay = this.#delay > 0;
        this.#repeat = repeat;
        this.#runForever = this.#repeat === REPEAT_FOREVER;
        return true;
    }

    update(dt: number): void {
        if (this.#elapsed === -1) {
            this.#elapsed = 0;
            this.#timesExecuted = 0;
            return;
        }

        this.#elapsed += dt;

        const interval = this.#useDelay ? this.#delay : this.#interval;

        if (this.#elapsed >= interval) {
            this.trigger();
            this.#elapsed = this.#useDelay ? this.#elapsed - this.#delay : 0;

            if (!this.#runForever || this.#useDelay) {
                this.#timesExecuted += 1;
            }

            this.#useDelay = false;
        }

        if (this.#callback && !this.#runForever && this.#timesExecuted > this.#repeat) {
            this.cancel();
        }
    }

    trigger(): void {
        if (this.#target && this.#callback) {
            this.#callback.call(this.#target, this.#elapsed);
        }
    }

    cancel(): void {
        this.#scheduler!.unschedule(this.#callback!, this.#target!);
    }

    clear(): void {
        this.#scheduler = null;
        this.#elapsed = -1;
        this.#runForever = false;
        this.#useDelay = false;
        this.#timesExecuted = 0;
        this.#repeat = 0;
        this.#delay = 0;
        this.#interval = 0;
        this.#target = null;
        this.#callback = null;
        this.#key = null;
    }

    get interval(): number {
        return this.#interval;
    }

    set interval(interval: number) {
        this.#interval = interval;
    }

    get callback(): Callback | null {
        return this.#callback;
    }

    get key(): string | number | null {
        return this.#key;
    }

    static get(): CallbackTimer {
        return CallbackTimer.#pool.pop() || new CallbackTimer();
    }

    static put(timer: CallbackTimer): void {
        timer.clear();
        if (CallbackTimer.#pool.length < MAX_POOL_SIZE) {
            CallbackTimer.#pool.push(timer);
        }
    }
}

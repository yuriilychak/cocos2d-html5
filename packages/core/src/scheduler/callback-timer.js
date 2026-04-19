import { MAX_POOL_SIZE } from './constants';

export class CallbackTimer {
    static _pool = [];

    constructor() {
        this._scheduler = null;
        this._elapsed = -1;
        this._runForever = false;
        this._useDelay = false;
        this._timesExecuted = 0;
        this._repeat = 0;
        this._delay = 0;
        this._interval = 0;
        this._target = null;
        this._callback = null;
        this._key = null;
    }

    initWithCallback(scheduler, callback, target, seconds, repeat, delay, key) {
        this._scheduler = scheduler;
        this._target = target;
        this._callback = callback;
        if (key)
            this._key = key;

        this._elapsed = -1;
        this._interval = seconds;
        this._delay = delay;
        this._useDelay = (this._delay > 0);
        this._repeat = repeat;
        this._runForever = (this._repeat === cc.REPEAT_FOREVER);
        return true;
    }

    getInterval() { return this._interval; }
    setInterval(interval) { this._interval = interval; }

    update(dt) {
        if (this._elapsed === -1) {
            this._elapsed = 0;
            this._timesExecuted = 0;
        } else {
            this._elapsed += dt;
            if (this._runForever && !this._useDelay) {
                if (this._elapsed >= this._interval) {
                    this.trigger();
                    this._elapsed = 0;
                }
            } else {
                if (this._useDelay) {
                    if (this._elapsed >= this._delay) {
                        this.trigger();

                        this._elapsed -= this._delay;
                        this._timesExecuted += 1;
                        this._useDelay = false;
                    }
                } else {
                    if (this._elapsed >= this._interval) {
                        this.trigger();

                        this._elapsed = 0;
                        this._timesExecuted += 1;
                    }
                }

                if (this._callback && !this._runForever && this._timesExecuted > this._repeat)
                    this.cancel();
            }
        }
    }

    getCallback() {
        return this._callback;
    }

    getKey() {
        return this._key;
    }

    trigger() {
        if (this._target && this._callback) {
            this._callback.call(this._target, this._elapsed);
        }
    }

    cancel() {
        this._scheduler.unschedule(this._callback, this._target);
    }

    static get() {
        return CallbackTimer._pool.pop() || new CallbackTimer();
    }

    static put(timer) {
        timer._scheduler = null;
        timer._elapsed = -1;
        timer._runForever = false;
        timer._useDelay = false;
        timer._timesExecuted = 0;
        timer._repeat = 0;
        timer._delay = 0;
        timer._interval = 0;
        timer._target = null;
        timer._callback = null;
        timer._key = null;
        if (CallbackTimer._pool.length < MAX_POOL_SIZE)
            CallbackTimer._pool.push(timer);
    }
}

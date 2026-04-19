import { MAX_POOL_SIZE } from './constants';

export class HashTimerEntry {
    static _pool = [];

    constructor(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
        this.timers = timers;
        this.target = target;
        this.timerIndex = timerIndex;
        this.currentTimer = currentTimer;
        this.currentTimerSalvaged = currentTimerSalvaged;
        this.paused = paused;
    }

    static get(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
        var result = HashTimerEntry._pool.pop();
        if (result) {
            result.timers = timers;
            result.target = target;
            result.timerIndex = timerIndex;
            result.currentTimer = currentTimer;
            result.currentTimerSalvaged = currentTimerSalvaged;
            result.paused = paused;
        } else {
            result = new HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused);
        }
        return result;
    }

    static put(entry) {
        entry.timers = null;
        entry.target = null;
        entry.timerIndex = 0;
        entry.currentTimer = null;
        entry.currentTimerSalvaged = false;
        entry.paused = false;
        if (HashTimerEntry._pool.length < MAX_POOL_SIZE)
            HashTimerEntry._pool.push(entry);
    }
}

import { MAX_POOL_SIZE } from './constants';

export class ListEntry {
    static _pool = [];

    constructor(prev, next, callback, target, priority, paused, markedForDeletion) {
        this.prev = prev;
        this.next = next;
        this.callback = callback;
        this.target = target;
        this.priority = priority;
        this.paused = paused;
        this.markedForDeletion = markedForDeletion;
    }

    static get(prev, next, callback, target, priority, paused, markedForDeletion) {
        var result = ListEntry._pool.pop();
        if (result) {
            result.prev = prev;
            result.next = next;
            result.callback = callback;
            result.target = target;
            result.priority = priority;
            result.paused = paused;
            result.markedForDeletion = markedForDeletion;
        } else {
            result = new ListEntry(prev, next, callback, target, priority, paused, markedForDeletion);
        }
        return result;
    }

    static put(entry) {
        entry.prev = null;
        entry.next = null;
        entry.callback = null;
        entry.target = null;
        entry.priority = 0;
        entry.paused = false;
        entry.markedForDeletion = false;
        if (ListEntry._pool.length < MAX_POOL_SIZE)
            ListEntry._pool.push(entry);
    }
}

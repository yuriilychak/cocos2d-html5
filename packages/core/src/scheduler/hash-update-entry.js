import { MAX_POOL_SIZE } from './constants';

export class HashUpdateEntry {
    static _pool = [];

    constructor(list, entry, target, callback) {
        this.list = list;
        this.entry = entry;
        this.target = target;
        this.callback = callback;
    }

    static get(list, entry, target, callback) {
        var result = HashUpdateEntry._pool.pop();
        if (result) {
            result.list = list;
            result.entry = entry;
            result.target = target;
            result.callback = callback;
        } else {
            result = new HashUpdateEntry(list, entry, target, callback);
        }
        return result;
    }

    static put(entry) {
        entry.list = null;
        entry.entry = null;
        entry.target = null;
        entry.callback = null;
        if (HashUpdateEntry._pool.length < MAX_POOL_SIZE)
            HashUpdateEntry._pool.push(entry);
    }
}

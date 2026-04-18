import AsyncPool from './async-pool';

/**
 * @class
 */
export default class Async {
    /**
     * Do tasks series.
     * @param {Array|Object} tasks
     * @param {function} [cb] callback
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    static series(tasks, cb, target) {
        var asyncPool = new AsyncPool(tasks, 1, (func, index, cb1) => {
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    }

    /**
     * Do tasks parallel.
     * @param {Array|Object} tasks
     * @param {function} cb callback
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    static parallel(tasks, cb, target) {
        var asyncPool = new AsyncPool(tasks, 0, (func, index, cb1) => {
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    }

    /**
     * Do tasks waterfall.
     * @param {Array|Object} tasks
     * @param {function} cb callback
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    static waterfall(tasks, cb, target) {
        var args = [];
        var lastResults = [null];
        var asyncPool = new AsyncPool(tasks, 1,
            (func, index, cb1) => {
                args.push((err, ...rest) => {
                    args = rest;
                    if (tasks.length - 1 === index) lastResults = lastResults.concat(args);
                    cb1(err, ...rest);
                });
                func.apply(target, args);
            }, (err) => {
                if (!cb)
                    return;
                if (err)
                    return cb.call(target, err);
                cb.apply(target, lastResults);
            });
        asyncPool.flow();
        return asyncPool;
    }

    /**
     * Do tasks by iterator.
     * @param {Array|Object} tasks
     * @param {function|Object} iterator
     * @param {function} [callback]
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    static map(tasks, iterator, callback, target) {
        var locIterator = iterator;
        if (typeof(iterator) === "object") {
            callback = iterator.cb;
            target = iterator.iteratorTarget;
            locIterator = iterator.iterator;
        }
        var asyncPool = new AsyncPool(tasks, 0, locIterator, callback, target);
        asyncPool.flow();
        return asyncPool;
    }

    /**
     * Do tasks by iterator limit.
     * @param {Array|Object} tasks
     * @param {Number} limit
     * @param {function} iterator
     * @param {function} cb callback
     * @param {Object} [target]
     */
    static mapLimit(tasks, limit, iterator, cb, target) {
        var asyncPool = new AsyncPool(tasks, limit, iterator, cb, target);
        asyncPool.flow();
        return asyncPool;
    }
}

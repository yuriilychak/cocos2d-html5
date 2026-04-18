import { each } from './utils';

/**
 * Async Pool class, a helper of cc.async
 * @param {Object|Array} srcObj
 * @param {Number} limit the limit of parallel number
 * @param {function} iterator
 * @param {function} onEnd
 * @param {object} target
 * @constructor
 */
export default class AsyncPool {
    constructor(srcObj, limit, iterator, onEnd, target) {
        this._finished = false;
        this._srcObj = srcObj;
        this._limit = limit;
        this._pool = [];
        this._iterator = iterator;
        this._iteratorTarget = target;
        this._onEnd = onEnd;
        this._onEndTarget = target;
        this._results = srcObj instanceof Array ? [] : {};
        this._errors = srcObj instanceof Array ? [] : {};

        each(srcObj, (value, index) => {
            this._pool.push({index: index, value: value});
        });

        this.size = this._pool.length;
        this.finishedSize = 0;
        this._workingSize = 0;

        this._limit = this._limit || this.size;
    }

    onIterator(iterator, target) {
        this._iterator = iterator;
        this._iteratorTarget = target;
    }

    onEnd(errors, results) {
        this._finished = true;
        if (this._onEnd) {
            var selector = this._onEnd;
            var target = this._onEndTarget;
            this._onEnd = null;
            this._onEndTarget = null;
            selector.call(target, errors, results);
        }
    }

    _handleItem() {
        if (this._pool.length === 0 || this._workingSize >= this._limit)
            return;

        var item = this._pool.shift();
        var value = item.value, index = item.index;
        this._workingSize++;
        this._iterator.call(this._iteratorTarget, value, index,
            (err, result) => {
                if (this._finished) {
                    return;
                }

                if (err) {
                    this._errors[index] = err;
                }
                else {
                    this._results[index] = result;
                }

                this.finishedSize++;
                this._workingSize--;
                if (this.finishedSize === this.size) {
                    var errors = this._errors.length === 0 ? null : this._errors;
                    this.onEnd(errors, this._results);
                    return;
                }
                this._handleItem();
            },
            this);
    }

    flow() {
        if (this._pool.length === 0) {
            if (this._onEnd)
                this._onEnd.call(this._onEndTarget, null, []);
            return;
        }
        for (var i = 0; i < this._limit; i++)
            this._handleItem();
    }
}

import Matrix4 from '../mat4';

export default class Matrix4Stack {
    constructor(top, stack) {
        this.top = top;
        this.stack = stack || [];
        this.lastUpdated = 0;
    }

    initialize() {
        this.stack.length = 0;
        this.top = null;
        return this;
    }

    push(item) {
        item = item || this.top;
        this.stack.push(this.top);
        this.top = new Matrix4(item);
    }

    pop() {
        this.top = this.stack.pop();
    }

    release() {
        this.stack = null;
        this.top = null;
        this._matrixPool = null;
    }

    _getFromPool(item) {
        const pool = this._matrixPool || [];
        if (pool.length === 0) return new Matrix4(item);
        const ret = pool.pop();
        ret.assignFrom(item);
        return ret;
    }

    _putInPool(matrix) {
        this._matrixPool = this._matrixPool || [];
        this._matrixPool.push(matrix);
    }
}

export function km_mat4_stack_push(stack, item) {
    stack.push(item);
}

export function km_mat4_stack_pop(stack) {
    stack.pop();
}

export function km_mat4_stack_release(stack) {
    stack.release();
}

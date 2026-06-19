import Matrix4 from "./mat4";
import type { Mat4Like } from "./types";

export default class Matrix4Stack {
    public top: Matrix4 | null;
    public stack: Array<Matrix4 | null> | null;
    public lastUpdated = 0;
    private _matrixPool: Matrix4[] | null = null;

    public constructor(top: Mat4Like | null = null, stack: Array<Matrix4 | null> | null = null) {
        this.top = top ? (top instanceof Matrix4 ? top : new Matrix4(top)) : null;
        this.stack = stack || [];
    }

    public initialize(): this {
        if (!this.stack) this.stack = [];
        this.stack.length = 0;
        this.top = null;
        return this;
    }

    public push(item: Mat4Like | null = null): void {
        item = item || this.top;
        this.stack!.push(this.top);
        this.top = new Matrix4(item);
    }

    public pop(): void {
        this.top = this.stack!.pop() || null;
    }

    public release(): void {
        this.stack = null;
        this.top = null;
        this._matrixPool = null;
    }

    public _getFromPool(item: Mat4Like): Matrix4 {
        const pool = this._matrixPool || [];
        if (pool.length === 0) return new Matrix4(item);
        const ret = pool.pop()!;
        ret.assignFrom(item);
        return ret;
    }

    public _putInPool(matrix: Matrix4): void {
        this._matrixPool = this._matrixPool || [];
        this._matrixPool.push(matrix);
    }
}

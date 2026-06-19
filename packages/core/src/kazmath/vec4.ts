import { EPSILON, square } from "./utility";
import type { Mat4Like, Vec4Like } from "./types";

export default class Vec4 implements Vec4Like {
    #data: number[] = [0, 0, 0, 0];

    public constructor();
    public constructor(vec: Vec4Like);
    public constructor(x: number, y: number, z: number, w: number);
    public constructor(xOrVec: number | Vec4Like = 0, y = 0, z = 0, w = 0) {
        if (Vec4.isLike(xOrVec)) {
            this.#initFromVec4(xOrVec);
        } else {
            this.#initFromNumber(xOrVec, y, z, w);
        }
    }

    public get x(): number {
        return this.#data[0];
    }

    public set x(value: number) {
        this.#data[0] = value;
    }

    public get y(): number {
        return this.#data[1];
    }

    public set y(value: number) {
        this.#data[1] = value;
    }

    public get z(): number {
        return this.#data[2];
    }

    public set z(value: number) {
        this.#data[2] = value;
    }

    public get w(): number {
        return this.#data[3];
    }

    public set w(value: number) {
        this.#data[3] = value;
    }

    public fill(vec: Vec4Like): this;
    public fill(x: number, y: number, z: number, w: number): this;
    public fill(xOrVec: number | Vec4Like, y = 0, z = 0, w = 0): this {
        if (Vec4.isLike(xOrVec)) {
            this.#initFromVec4(xOrVec);
        } else {
            this.#initFromNumber(xOrVec, y, z, w);
        }
        return this;
    }

    public add(vec?: Vec4Like | null): this {
        if (!vec) return this;
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        this.w += vec.w;
        return this;
    }

    public dot(vec: Vec4Like): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
    }

    public get length(): number {
        return Math.sqrt(this.lengthSq);
    }

    public get lengthSq(): number {
        return (
            square(this.x) +
            square(this.y) +
            square(this.z) +
            square(this.w)
        );
    }

    public lerp(vec: Vec4Like, t: number): this {
        void vec;
        void t;
        return this;
    }

    public normalize(): this {
        const l = 1.0 / this.length;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        this.w *= l;
        return this;
    }

    public scale(scale: number): this {
        this.normalize();
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;
        return this;
    }

    public subtract(vec: Vec4Like): this {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        this.w -= vec.w;
        return this;
    }

    public transform(mat4: Mat4Like): this {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;
        const mat = mat4.mat;
        this.x = x * mat[0] + y * mat[4] + z * mat[8] + w * mat[12];
        this.y = x * mat[1] + y * mat[5] + z * mat[9] + w * mat[13];
        this.z = x * mat[2] + y * mat[6] + z * mat[10] + w * mat[14];
        this.w = x * mat[3] + y * mat[7] + z * mat[11] + w * mat[15];
        return this;
    }

    public static transformArray(vecArray: Vec4Like[], mat4: Mat4Like): Vec4[] {
        const retArray: Vec4[] = [];
        for (let i = 0; i < vecArray.length; i++) {
            const selVec = new Vec4(vecArray[i]);
            selVec.transform(mat4);
            retArray.push(selVec);
        }
        return retArray;
    }

    public equals(vec: Vec4Like): boolean {
        return (
            this.x < vec.x + EPSILON && this.x > vec.x - EPSILON &&
            this.y < vec.y + EPSILON && this.y > vec.y - EPSILON &&
            this.z < vec.z + EPSILON && this.z > vec.z - EPSILON &&
            this.w < vec.w + EPSILON && this.w > vec.w - EPSILON
        );
    }

    public assignFrom(vec: Vec4Like): this {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        this.w = vec.w;
        return this;
    }

    public toTypeArray(): Float32Array {
        const tyArr = new Float32Array(4);
        tyArr[0] = this.x;
        tyArr[1] = this.y;
        tyArr[2] = this.z;
        tyArr[3] = this.w;
        return tyArr;
    }

    private static isLike(value: unknown): value is Vec4Like {
        return (
            typeof value === "object" &&
            value !== null &&
            "x" in value &&
            "y" in value &&
            "z" in value &&
            "w" in value
        );
    }

    #initFromNumber(x: number, y: number, z: number, w: number): void {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    #initFromVec4(vec: Vec4Like): void {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        this.w = vec.w;
    }
}

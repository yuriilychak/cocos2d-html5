import { EPSILON, square } from "./utility";
import Vec4 from "./vec4";
import type { Mat4Like, Vec3Like } from "./types";

export default class Vec3 implements Vec3Like {
    #data: number[] = [0, 0, 0];

    public constructor();
    public constructor(vec: Vec3Like);
    public constructor(x: number, y: number, z: number);
    public constructor(xOrVec: number | Vec3Like = 0, y = 0, z = 0) {
        if (Vec3.isLike(xOrVec)) {
            this.#initFromVec3(xOrVec);
        } else {
            this.#initFromNumber(xOrVec, y, z);
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

    public fill(vec: Vec3Like): this;
    public fill(x: number, y: number, z: number): this;
    public fill(xOrVec: number | Vec3Like, y = 0, z = 0): this {
        if (Vec3.isLike(xOrVec)) {
            this.#initFromVec3(xOrVec);
        } else {
            this.#initFromNumber(xOrVec, y, z);
        }
        return this;
    }

    public get length(): number {
        return Math.sqrt(this.lengthSq);
    }

    public get lengthSq(): number {
        return square(this.x) + square(this.y) + square(this.z);
    }

    public normalize(): this {
        const l = 1.0 / this.length;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        return this;
    }

    public cross(vec3: Vec3Like): this {
        const x = this.x, y = this.y, z = this.z;
        this.x = (y * vec3.z) - (z * vec3.y);
        this.y = (z * vec3.x) - (x * vec3.z);
        this.z = (x * vec3.y) - (y * vec3.x);
        return this;
    }

    public dot(vec: Vec3Like): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    public add(vec: Vec3Like): this {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    public subtract(vec: Vec3Like): this {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }

    public transform(mat4: Mat4Like): this {
        const x = this.x, y = this.y, z = this.z, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[4] + z * mat[8] + mat[12];
        this.y = x * mat[1] + y * mat[5] + z * mat[9] + mat[13];
        this.z = x * mat[2] + y * mat[6] + z * mat[10] + mat[14];
        return this;
    }

    public transformNormal(mat4: Mat4Like): this {
        const x = this.x, y = this.y, z = this.z, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[4] + z * mat[8];
        this.y = x * mat[1] + y * mat[5] + z * mat[9];
        this.z = x * mat[2] + y * mat[6] + z * mat[10];
        return this;
    }

    public transformCoord(mat4: Mat4Like): this {
        const v = new Vec4(this.x, this.y, this.z, 1.0);
        v.transform(mat4);
        this.x = v.x / v.w;
        this.y = v.y / v.w;
        this.z = v.z / v.w;
        return this;
    }

    public scale(scale: number): this {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }

    public equals(vec: Vec3Like): boolean {
        return (
            this.x < (vec.x + EPSILON) && this.x > (vec.x - EPSILON) &&
            this.y < (vec.y + EPSILON) && this.y > (vec.y - EPSILON) &&
            this.z < (vec.z + EPSILON) && this.z > (vec.z - EPSILON)
        );
    }

    public inverseTransform(mat4: Mat4Like): this {
        const mat = mat4.mat;
        const v1 = new Vec3(this.x - mat[12], this.y - mat[13], this.z - mat[14]);
        this.x = v1.x * mat[0] + v1.y * mat[1] + v1.z * mat[2];
        this.y = v1.x * mat[4] + v1.y * mat[5] + v1.z * mat[6];
        this.z = v1.x * mat[8] + v1.y * mat[9] + v1.z * mat[10];
        return this;
    }

    public inverseTransformNormal(mat4: Mat4Like): this {
        const x = this.x, y = this.y, z = this.z, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[1] + z * mat[2];
        this.y = x * mat[4] + y * mat[5] + z * mat[6];
        this.z = x * mat[8] + y * mat[9] + z * mat[10];
        return this;
    }

    public assignFrom(vec?: Vec3Like | null): this {
        if (!vec) return this;
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        return this;
    }

    public static zero<T extends Vec3Like>(vec: T): T {
        vec.x = vec.y = vec.z = 0.0;
        return vec;
    }

    public toTypeArray(): Float32Array {
        const tyArr = new Float32Array(3);
        tyArr[0] = this.x;
        tyArr[1] = this.y;
        tyArr[2] = this.z;
        return tyArr;
    }

    private static isLike(value: unknown): value is Vec3Like {
        return (
            typeof value === "object" &&
            value !== null &&
            "x" in value &&
            "y" in value &&
            "z" in value
        );
    }

    #initFromNumber(x: number, y: number, z: number): void {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    #initFromVec3(vec: Vec3Like): void {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }
}

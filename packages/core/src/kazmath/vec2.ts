import { EPSILON, square } from "./utility";
import type { Mat3Like, Vec2Like } from "./types";

export default class Vec2 implements Vec2Like {
    #data: number[] = [0, 0];

    public constructor();
    public constructor(vec: Vec2Like);
    public constructor(x: number, y: number);
    public constructor(xOrVec: number | Vec2Like = 0, y = 0) {
        if (Vec2.isLike(xOrVec)) {
            this.#initFromVec2(xOrVec);
        } else {
            this.#initFromNumber(xOrVec, y);
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

    public fill(vec: Vec2Like): this;
    public fill(x: number, y: number): this;
    public fill(xOrVec: number | Vec2Like, y = 0): this {
        if (Vec2.isLike(xOrVec)) {
            this.#initFromVec2(xOrVec);
        } else {
            this.#initFromNumber(xOrVec, y);
        }
        return this;
    }

    public get length(): number {
        return Math.sqrt(this.lengthSq);
    }

    public get lengthSq(): number {
        return square(this.x) + square(this.y);
    }

    public normalize(): this {
        const l = 1.0 / this.length;
        this.x *= l;
        this.y *= l;
        return this;
    }

    public add(vec: Vec2Like): this {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public dot(vec: Vec2Like): number {
        return this.x * vec.x + this.y * vec.y;
    }

    public subtract(vec: Vec2Like): this {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    public transform(mat3: Mat3Like): this {
        const x = this.x;
        const y = this.y;
        this.x = x * mat3.mat[0] + y * mat3.mat[3] + mat3.mat[6];
        this.y = x * mat3.mat[1] + y * mat3.mat[4] + mat3.mat[7];
        return this;
    }

    public scale(s: number): this {
        this.x *= s;
        this.y *= s;
        return this;
    }

    public equals(vec: Vec2Like): boolean {
        return (
            this.x < vec.x + EPSILON &&
            this.x > vec.x - EPSILON &&
            this.y < vec.y + EPSILON &&
            this.y > vec.y - EPSILON
        );
    }

    public static add<T extends Vec2Like>(pOut: T, pV1: Vec2Like, pV2: Vec2Like): T {
        pOut.x = pV1.x + pV2.x;
        pOut.y = pV1.y + pV2.y;
        return pOut;
    }

    public static subtract<T extends Vec2Like>(pOut: T, pV1: Vec2Like, pV2: Vec2Like): T {
        pOut.x = pV1.x - pV2.x;
        pOut.y = pV1.y - pV2.y;
        return pOut;
    }

    public static scale<T extends Vec2Like>(pOut: T, pIn: Vec2Like, s: number): T {
        pOut.x = pIn.x * s;
        pOut.y = pIn.y * s;
        return pOut;
    }

    private static isLike(value: unknown): value is Vec2Like {
        return (
            typeof value === "object" &&
            value !== null &&
            "x" in value &&
            "y" in value
        );
    }

    #initFromNumber(x: number, y: number): void {
        this.x = x || 0;
        this.y = y || 0;
    }

    #initFromVec2(vec: Vec2Like): void {
        this.x = vec.x;
        this.y = vec.y;
    }
}

import { EPSILON, square } from './utility';

export default class Vec4 {
    constructor(x, y, z, w) {
        if (x && y === undefined) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    }

    fill(x, y, z, w) {
        if (x && y === undefined) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        return this;
    }

    add(vec) {
        if (!vec) return this;
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        this.w += vec.w;
        return this;
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
    }

    length() {
        return Math.sqrt(
            square(this.x) +
            square(this.y) +
            square(this.z) +
            square(this.w)
        );
    }

    lengthSq() {
        return (
            square(this.x) +
            square(this.y) +
            square(this.z) +
            square(this.w)
        );
    }

    lerp(vec, t) {
        return this;
    }

    normalize() {
        const l = 1.0 / this.length();
        this.x *= l;
        this.y *= l;
        this.z *= l;
        this.w *= l;
        return this;
    }

    scale(scale) {
        this.normalize();
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;
        return this;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        this.w -= vec.w;
        return this;
    }

    transform(mat4) {
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

    static transformArray(vecArray, mat4) {
        const retArray = [];
        for (let i = 0; i < vecArray.length; i++) {
            const selVec = new Vec4(vecArray[i]);
            selVec.transform(mat4);
            retArray.push(selVec);
        }
        return retArray;
    }

    equals(vec) {
        return (
            this.x < vec.x + EPSILON && this.x > vec.x - EPSILON &&
            this.y < vec.y + EPSILON && this.y > vec.y - EPSILON &&
            this.z < vec.z + EPSILON && this.z > vec.z - EPSILON &&
            this.w < vec.w + EPSILON && this.w > vec.w - EPSILON
        );
    }

    assignFrom(vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        this.w = vec.w;
        return this;
    }

    toTypeArray() {
        const tyArr = new Float32Array(4);
        tyArr[0] = this.x;
        tyArr[1] = this.y;
        tyArr[2] = this.z;
        tyArr[3] = this.w;
        return tyArr;
    }
}

import { EPSILON, square } from './utility';

export default class Vec2 {
    constructor(x, y) {
        if (y === undefined) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    fill(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    length() {
        return Math.sqrt(square(this.x) + square(this.y));
    }

    lengthSq() {
        return square(this.x) + square(this.y);
    }

    normalize() {
        const l = 1.0 / this.length();
        this.x *= l;
        this.y *= l;
        return this;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    transform(mat3) {
        const x = this.x;
        const y = this.y;
        this.x = x * mat3.mat[0] + y * mat3.mat[3] + mat3.mat[6];
        this.y = x * mat3.mat[1] + y * mat3.mat[4] + mat3.mat[7];
        return this;
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    equals(vec) {
        return (
            this.x < vec.x + EPSILON &&
            this.x > vec.x - EPSILON &&
            this.y < vec.y + EPSILON &&
            this.y > vec.y - EPSILON
        );
    }

    static add(pOut, pV1, pV2) {
        pOut.x = pV1.x + pV2.x;
        pOut.y = pV1.y + pV2.y;
        return pOut;
    }

    static subtract(pOut, pV1, pV2) {
        pOut.x = pV1.x - pV2.x;
        pOut.y = pV1.y - pV2.y;
        return pOut;
    }

    static scale(pOut, pIn, s) {
        pOut.x = pIn.x * s;
        pOut.y = pIn.y * s;
        return pOut;
    }
}

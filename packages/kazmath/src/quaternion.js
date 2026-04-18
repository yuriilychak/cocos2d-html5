import { EPSILON, square } from './utility';
import Vec3 from './vec3';

export default class Quaternion {
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

    conjugate(quaternion) {
        this.x = -quaternion.x;
        this.y = -quaternion.y;
        this.z = -quaternion.z;
        this.w = quaternion.w;
        return this;
    }

    dot(quaternion) {
        return (
            this.w * quaternion.w +
            this.x * quaternion.x +
            this.y * quaternion.y +
            this.z * quaternion.z
        );
    }

    exponential() {
        return this;
    }

    identity() {
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.w = 1.0;
        return this;
    }

    inverse() {
        const len = this.length();
        if (Math.abs(len) > EPSILON) {
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.w = 0.0;
            return this;
        }

        this.conjugate(this).scale(1.0 / len);
        return this;
    }

    isIdentity() {
        return (
            this.x === 0.0 &&
            this.y === 0.0 &&
            this.z === 0.0 &&
            this.w === 1.0
        );
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    lengthSq() {
        return (
            this.x * this.x +
            this.y * this.y +
            this.z * this.z +
            this.w * this.w
        );
    }

    multiply(quaternion) {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        this.w = w * quaternion.w - x * quaternion.x - y * quaternion.y - z * quaternion.z;
        this.x = w * quaternion.x + x * quaternion.w + y * quaternion.z - z * quaternion.y;
        this.y = w * quaternion.y + y * quaternion.w + z * quaternion.x - x * quaternion.z;
        this.z = w * quaternion.z + z * quaternion.w + x * quaternion.y - y * quaternion.x;
        return this;
    }

    normalize() {
        const length = this.length();
        if (Math.abs(length) <= EPSILON) {
            throw new Error("current quaternion is an invalid value");
        }
        this.scale(1.0 / length);
        return this;
    }

    rotationAxis(axis, angle) {
        const rad = angle * 0.5;
        const scale = Math.sin(rad);
        this.w = Math.cos(rad);
        this.x = axis.x * scale;
        this.y = axis.y * scale;
        this.z = axis.z * scale;
        return this;
    }

    slerp(quaternion, t) {
        if (
            this.x === quaternion.x &&
            this.y === quaternion.y &&
            this.z === quaternion.z &&
            this.w === quaternion.w
        ) {
            return this;
        }
        const ct = this.dot(quaternion);
        const theta = Math.acos(ct);
        const st = Math.sqrt(1.0 - square(ct));
        const stt = Math.sin(t * theta) / st;
        const somt = Math.sin((1.0 - t) * theta) / st;
        const temp2 = new Quaternion(quaternion);
        this.scale(somt);
        temp2.scale(stt);
        this.add(temp2);
        return this;
    }

    toAxisAndAngle() {
        const tempAngle = Math.acos(this.w);
        const scale = Math.sqrt(
            square(this.x) +
            square(this.y) +
            square(this.z)
        );
        let retAngle;
        const retAxis = new Vec3();

        if ((scale > -EPSILON && scale < EPSILON) ||
            (scale < 2 * Math.PI + EPSILON && scale > 2 * Math.PI - EPSILON)) {
            retAngle = 0.0;
            retAxis.x = 0.0;
            retAxis.y = 0.0;
            retAxis.z = 1.0;
        } else {
            retAngle = tempAngle * 2.0;
            retAxis.x = this.x / scale;
            retAxis.y = this.y / scale;
            retAxis.z = this.z / scale;
            retAxis.normalize();
        }
        return { axis: retAxis, angle: retAngle };
    }

    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;
        return this;
    }

    assignFrom(quaternion) {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;
        return this;
    }

    add(quaternion) {
        this.x += quaternion.x;
        this.y += quaternion.y;
        this.z += quaternion.z;
        this.w += quaternion.w;
        return this;
    }

    multiplyVec3(vec) {
        const x = this.x, y = this.y, z = this.z;
        const retVec = new Vec3(vec);
        const uv = new Vec3(x, y, z);
        const uuv = new Vec3(x, y, z);
        uv.cross(vec);
        uuv.cross(uv);
        uv.scale(2.0 * this.w);
        uuv.scale(2.0);
        retVec.add(uv);
        retVec.add(uuv);
        return retVec;
    }

    static rotationMatrix(mat3) {
        if (!mat3) return null;

        let x, y, z, w;
        const m4x4 = [];
        const mat = mat3.mat;
        let scale = 0.0;

        m4x4[0] = mat[0]; m4x4[1] = mat[3]; m4x4[2] = mat[6];
        m4x4[4] = mat[1]; m4x4[5] = mat[4]; m4x4[6] = mat[7];
        m4x4[8] = mat[2]; m4x4[9] = mat[5]; m4x4[10] = mat[8];
        m4x4[15] = 1;
        const pMatrix = m4x4[0];

        const diagonal = pMatrix[0] + pMatrix[5] + pMatrix[10] + 1;
        if (diagonal > EPSILON) {
            scale = Math.sqrt(diagonal) * 2;
            x = (pMatrix[9] - pMatrix[6]) / scale;
            y = (pMatrix[2] - pMatrix[8]) / scale;
            z = (pMatrix[4] - pMatrix[1]) / scale;
            w = 0.25 * scale;
        } else {
            if (pMatrix[0] > pMatrix[5] && pMatrix[0] > pMatrix[10]) {
                scale = Math.sqrt(1.0 + pMatrix[0] - pMatrix[5] - pMatrix[10]) * 2.0;
                x = 0.25 * scale;
                y = (pMatrix[4] + pMatrix[1]) / scale;
                z = (pMatrix[2] + pMatrix[8]) / scale;
                w = (pMatrix[9] - pMatrix[6]) / scale;
            } else if (pMatrix[5] > pMatrix[10]) {
                scale = Math.sqrt(1.0 + pMatrix[5] - pMatrix[0] - pMatrix[10]) * 2.0;
                x = (pMatrix[4] + pMatrix[1]) / scale;
                y = 0.25 * scale;
                z = (pMatrix[9] + pMatrix[6]) / scale;
                w = (pMatrix[2] - pMatrix[8]) / scale;
            } else {
                scale = Math.sqrt(1.0 + pMatrix[10] - pMatrix[0] - pMatrix[5]) * 2.0;
                x = (pMatrix[2] + pMatrix[8]) / scale;
                y = (pMatrix[9] + pMatrix[6]) / scale;
                z = 0.25 * scale;
                w = (pMatrix[4] - pMatrix[1]) / scale;
            }
        }
        return new Quaternion(x, y, z, w);
    }

    static rotationYawPitchRoll(yaw, pitch, roll) {
        const ex = cc.degreesToRadians(pitch) / 2.0;
        const ey = cc.degreesToRadians(yaw) / 2.0;
        const ez = cc.degreesToRadians(roll) / 2.0;

        const cr = Math.cos(ex);
        const cp = Math.cos(ey);
        const cy = Math.cos(ez);
        const sr = Math.sin(ex);
        const sp = Math.sin(ey);
        const sy = Math.sin(ez);

        const cpcy = cp * cy;
        const spsy = sp * sy;

        const ret = new Quaternion();
        ret.w = cr * cpcy + sr * spsy;
        ret.x = sr * cpcy - cr * spsy;
        ret.y = cr * sp * cy + sr * cp * sy;
        ret.z = cr * cp * sy - sr * sp * cy;
        ret.normalize();
        return ret;
    }

    static rotationBetweenVec3(vec1, vec2, fallback) {
        const v1 = new Vec3(vec1);
        const v2 = new Vec3(vec2);
        v1.normalize();
        v2.normalize();
        const a = v1.dot(v2);
        const quaternion = new Quaternion();

        if (a >= 1.0) {
            quaternion.identity();
            return quaternion;
        }

        if (a < 1e-6 - 1.0) {
            if (Math.abs(fallback.lengthSq()) < EPSILON) {
                quaternion.rotationAxis(fallback, Math.PI);
            } else {
                const axis = new Vec3(1.0, 0.0, 0.0);
                axis.cross(vec1);
                if (Math.abs(axis.lengthSq()) < EPSILON) {
                    axis.fill(0.0, 1.0, 0.0);
                    axis.cross(vec1);
                }
                axis.normalize();
                quaternion.rotationAxis(axis, Math.PI);
            }
        } else {
            const s = Math.sqrt((1 + a) * 2);
            const invs = 1 / s;
            v1.cross(v2);
            quaternion.x = v1.x * invs;
            quaternion.y = v1.y * invs;
            quaternion.z = v1.z * invs;
            quaternion.w = s * 0.5;
            quaternion.normalize();
        }
        return quaternion;
    }
}

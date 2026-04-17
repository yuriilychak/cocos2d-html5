/**
 * Copyright (c) 2008-2010 Ricardo Quesada
 * Copyright (c) 2011-2012 cocos2d-x.org
 * Copyright (c) 2013-2014 Chukong Technologies Inc.
 * Copyright (c) 2008, Luke Benstead.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function(cc) {
    /**
     * The Quaternion class
     * @param {Number|cc.math.Quaternion} [x=0]
     * @param {Number} [y=0]
     * @param {Number} [z=0]
     * @param {Number} [w=0]
     * @constructor
     */
    cc.math.Quaternion = class Quaternion {
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

        /**
         * Sets the conjugate of quaternion to self
         * @param {cc.math.Quaternion} quaternion
         * @returns {cc.math.Quaternion}
         */
        conjugate(quaternion) {
            this.x = -quaternion.x;
            this.y = -quaternion.y;
            this.z = -quaternion.z;
            this.w = quaternion.w;
            return this;
        }

        /**
         * Returns the dot product of the current quaternion and parameter quaternion
         * @param {cc.math.Quaternion} quaternion
         * @returns {number}
         */
        dot(quaternion) {
            return (
                this.w * quaternion.w +
                this.x * quaternion.x +
                this.y * quaternion.y +
                this.z * quaternion.z
            );
        }

        /**
         * Returns the exponential of the quaternion, this function doesn't implemented.
         * @returns {cc.math.Quaternion}
         */
        exponential() {
            return this;
        }

        /**
         * Makes the current quaternion an identity quaternion
         * @returns {cc.math.Quaternion}
         */
        identity() {
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.w = 1.0;
            return this;
        }

        /**
         * Inverses the value of current Quaternion
         * @returns {cc.math.Quaternion}
         */
        inverse() {
            const len = this.length();
            if (Math.abs(len) > cc.math.EPSILON) {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 0.0;
                return this;
            }

            this.conjugate(this).scale(1.0 / len);
            return this;
        }

        /**
         * Returns true if the quaternion is an identity quaternion
         * @returns {boolean}
         */
        isIdentity() {
            return (
                this.x === 0.0 &&
                this.y === 0.0 &&
                this.z === 0.0 &&
                this.w === 1.0
            );
        }

        /**
         * Returns the length of the quaternion
         * @returns {number}
         */
        length() {
            return Math.sqrt(this.lengthSq());
        }

        /**
         * Returns the length of the quaternion squared (prevents a sqrt)
         * @returns {number}
         */
        lengthSq() {
            return (
                this.x * this.x +
                this.y * this.y +
                this.z * this.z +
                this.w * this.w
            );
        }

        /**
         * Uses current quaternion multiplies other quaternion.
         * @param {cc.math.Quaternion} quaternion
         * @returns {cc.math.Quaternion}
         */
        multiply(quaternion) {
            const x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;
            this.w =
                w * quaternion.w -
                x * quaternion.x -
                y * quaternion.y -
                z * quaternion.z;
            this.x = w * quaternion.x + x * quaternion.w + y * quaternion.z - z * quaternion.y;
            this.y = w * quaternion.y + y * quaternion.w + z * quaternion.x - x * quaternion.z;
            this.z = w * quaternion.z + z * quaternion.w + x * quaternion.y - y * quaternion.x;
            return this;
        }

        /**
         * Normalizes a quaternion
         * @returns {cc.math.Quaternion}
         */
        normalize() {
            const length = this.length();
            if (Math.abs(length) <= cc.math.EPSILON) {
                throw new Error("current quaternion is an invalid value");
            }
            this.scale(1.0 / length);
            return this;
        }

        /**
         * Rotates a quaternion around an axis and an angle
         * @param {cc.math.Vec3} axis
         * @param {Number} angle
         * @returns {cc.math.Quaternion}
         */
        rotationAxis(axis, angle) {
            const rad = angle * 0.5;
            const scale = Math.sin(rad);
            this.w = Math.cos(rad);
            this.x = axis.x * scale;
            this.y = axis.y * scale;
            this.z = axis.z * scale;
            return this;
        }

        /**
         * Interpolate with other quaternions
         * @param {cc.math.Quaternion} quaternion
         * @param {Number} t
         * @returns {cc.math.Quaternion}
         */
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
            const st = Math.sqrt(1.0 - cc.math.square(ct));
            const stt = Math.sin(t * theta) / st;
            const somt = Math.sin((1.0 - t) * theta) / st;
            const temp2 = new cc.math.Quaternion(quaternion);
            this.scale(somt);
            temp2.scale(stt);
            this.add(temp2);
            return this;
        }

        /**
         * Get the axis and angle of rotation from a quaternion
         * @returns {{axis: cc.math.Vec3, angle: number}}
         */
        toAxisAndAngle() {
            const tempAngle = Math.acos(this.w);
            const scale = Math.sqrt(
                cc.math.square(this.x) +
                cc.math.square(this.y) +
                cc.math.square(this.z)
            );
            let retAngle;
            const retAxis = new cc.math.Vec3();

            if ((scale > -cc.math.EPSILON && scale < cc.math.EPSILON) ||
                (scale < 2 * Math.PI + cc.math.EPSILON && scale > 2 * Math.PI - cc.math.EPSILON)) {
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

        /**
         * Scale a quaternion
         * @param {Number} scale
         * @returns {cc.math.Quaternion}
         */
        scale(scale) {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
            this.w *= scale;
            return this;
        }

        /**
         * Assign current quaternion value from a quaternion.
         * @param {cc.math.Quaternion} quaternion
         * @returns {cc.math.Quaternion}
         */
        assignFrom(quaternion) {
            this.x = quaternion.x;
            this.y = quaternion.y;
            this.z = quaternion.z;
            this.w = quaternion.w;
            return this;
        }

        /**
         * Adds other quaternion
         * @param {cc.math.Quaternion} quaternion
         * @returns {cc.math.Quaternion}
         */
        add(quaternion) {
            this.x += quaternion.x;
            this.y += quaternion.y;
            this.z += quaternion.z;
            this.w += quaternion.w;
            return this;
        }

        /**
         * Current quaternion multiplies a vec3
         * @param {cc.math.Vec3} vec
         * @returns {cc.math.Vec3}
         */
        multiplyVec3(vec) {
            const x = this.x,
                y = this.y,
                z = this.z;
            const retVec = new cc.math.Vec3(vec);
            const uv = new cc.math.Vec3(x, y, z);
            const uuv = new cc.math.Vec3(x, y, z);
            uv.cross(vec);
            uuv.cross(uv);
            uv.scale(2.0 * this.w);
            uuv.scale(2.0);
            retVec.add(uv);
            retVec.add(uuv);
            return retVec;
        }

        /**
         * Creates a quaternion from a rotation matrix
         * @param {cc.math.Matrix3} mat3
         * @returns {cc.math.Quaternion|null}
         */
        static rotationMatrix(mat3) {
            if (!mat3) return null;

            let x, y, z, w;
            const m4x4 = [];
            const mat = mat3.mat;
            let scale = 0.0;

            m4x4[0] = mat[0];
            m4x4[1] = mat[3];
            m4x4[2] = mat[6];
            m4x4[4] = mat[1];
            m4x4[5] = mat[4];
            m4x4[6] = mat[7];
            m4x4[8] = mat[2];
            m4x4[9] = mat[5];
            m4x4[10] = mat[8];
            m4x4[15] = 1;
            const pMatrix = m4x4[0];

            const diagonal = pMatrix[0] + pMatrix[5] + pMatrix[10] + 1;
            if (diagonal > cc.math.EPSILON) {
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
            return new cc.math.Quaternion(x, y, z, w);
        }

        /**
         * Create a quaternion from yaw, pitch and roll
         * @param {Number} yaw
         * @param {Number} pitch
         * @param {Number} roll
         * @returns {cc.math.Quaternion}
         */
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

            const ret = new cc.math.Quaternion();
            ret.w = cr * cpcy + sr * spsy;
            ret.x = sr * cpcy - cr * spsy;
            ret.y = cr * sp * cy + sr * cp * sy;
            ret.z = cr * cp * sy - sr * sp * cy;
            ret.normalize();
            return ret;
        }

        /**
         * Gets the shortest arc quaternion to rotate vec1 to vec2.
         * @param {cc.math.Vec3} vec1
         * @param {cc.math.Vec3} vec2
         * @param {cc.math.Vec3} fallback
         * @returns {cc.math.Quaternion}
         */
        static rotationBetweenVec3(vec1, vec2, fallback) {
            const v1 = new cc.math.Vec3(vec1);
            const v2 = new cc.math.Vec3(vec2);
            v1.normalize();
            v2.normalize();
            const a = v1.dot(v2);
            const quaternion = new cc.math.Quaternion();

            if (a >= 1.0) {
                quaternion.identity();
                return quaternion;
            }

            if (a < 1e-6 - 1.0) {
                if (Math.abs(fallback.lengthSq()) < cc.math.EPSILON) {
                    quaternion.rotationAxis(fallback, Math.PI);
                } else {
                    const axis = new cc.math.Vec3(1.0, 0.0, 0.0);
                    axis.cross(vec1);
                    if (Math.abs(axis.lengthSq()) < cc.math.EPSILON) {
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
    };

    cc.kmQuaternion = cc.math.Quaternion;
})(cc);

/**
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2008, Luke Benstead.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function(cc){
    cc.math.Vec2 = class Vec2 {
        constructor(x, y) {
            if (y === undefined) {
                this.x = x.x;
                this.y = x.y;
            } else {
                this.x = x || 0;
                this.y = y || 0;
            }
        }

        /**
         * Sets the x and y components.
         * @param {number} x
         * @param {number} y
         * @returns {cc.math.Vec2}
         */
        fill(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
         * Returns the length of the vector.
         * @returns {number}
         */
        length() {
            return Math.sqrt(cc.math.square(this.x) + cc.math.square(this.y));
        }

        /**
         * Returns the squared length of the vector.
         * @returns {number}
         */
        lengthSq() {
            return cc.math.square(this.x) + cc.math.square(this.y);
        }

        /**
         * Normalizes this vector.
         * @returns {cc.math.Vec2}
         */
        normalize() {
            const l = 1.0 / this.length();
            this.x *= l;
            this.y *= l;
            return this;
        }

        /**
         * Adds another vector to this one.
         * @param {cc.math.Vec2} vec
         * @returns {cc.math.Vec2}
         */
        add(vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }

        /**
         * Returns the dot product with another vector.
         * @param {cc.math.Vec2} vec
         * @returns {number}
         */
        dot(vec) {
            return this.x * vec.x + this.y * vec.y;
        }

        /**
         * Subtracts another vector from this one.
         * @param {cc.math.Vec2} vec
         * @returns {cc.math.Vec2}
         */
        subtract(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }

        /**
         * Transforms this vector by a 3x3 matrix.
         * @param {cc.math.Matrix3} mat3
         * @returns {cc.math.Vec2}
         */
        transform(mat3) {
            const x = this.x;
            const y = this.y;
            this.x = x * mat3.mat[0] + y * mat3.mat[3] + mat3.mat[6];
            this.y = x * mat3.mat[1] + y * mat3.mat[4] + mat3.mat[7];
            return this;
        }

        /**
         * Scales this vector by a scalar.
         * @param {number} s
         * @returns {cc.math.Vec2}
         */
        scale(s) {
            this.x *= s;
            this.y *= s;
            return this;
        }

        /**
         * Returns true if this vector is equal to another within EPSILON.
         * @param {cc.math.Vec2} vec
         * @returns {boolean}
         */
        equals(vec) {
            return (
                this.x < vec.x + cc.math.EPSILON &&
                this.x > vec.x - cc.math.EPSILON &&
                this.y < vec.y + cc.math.EPSILON &&
                this.y > vec.y - cc.math.EPSILON
            );
        }

        /**
         * Adds two vectors and stores the result in pOut.
         * @param {cc.math.Vec2} pOut
         * @param {cc.math.Vec2} pV1
         * @param {cc.math.Vec2} pV2
         * @returns {cc.math.Vec2}
         */
        static add(pOut, pV1, pV2) {
            pOut.x = pV1.x + pV2.x;
            pOut.y = pV1.y + pV2.y;
            return pOut;
        }

        /**
         * Subtracts pV2 from pV1 and stores the result in pOut.
         * @param {cc.math.Vec2} pOut
         * @param {cc.math.Vec2} pV1
         * @param {cc.math.Vec2} pV2
         * @returns {cc.math.Vec2}
         */
        static subtract(pOut, pV1, pV2) {
            pOut.x = pV1.x - pV2.x;
            pOut.y = pV1.y - pV2.y;
            return pOut;
        }

        /**
         * Scales pIn by s and stores the result in pOut.
         * @param {cc.math.Vec2} pOut
         * @param {cc.math.Vec2} pIn
         * @param {number} s
         * @returns {cc.math.Vec2}
         */
        static scale(pOut, pIn, s) {
            pOut.x = pIn.x * s;
            pOut.y = pIn.y * s;
            return pOut;
        }
    };
})(cc);

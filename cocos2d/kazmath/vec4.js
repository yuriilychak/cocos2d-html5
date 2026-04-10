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

(function(cc) {
    cc.math.Vec4 = class Vec4 {
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

        fill(x, y, z, w) {     //=cc.kmVec4Fill
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

        add(vec) {    //cc.kmVec4Add
            if (!vec) return this;
            this.x += vec.x;
            this.y += vec.y;
            this.z += vec.z;
            this.w += vec.w;
            return this;
        }

        dot(vec) {           //cc.kmVec4Dot
            return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
        }

        length() {    //=cc.kmVec4Length
            return Math.sqrt(
                cc.math.square(this.x) +
                cc.math.square(this.y) +
                cc.math.square(this.z) +
                cc.math.square(this.w)
            );
        }

        lengthSq() {     //=cc.kmVec4LengthSq
            return (
                cc.math.square(this.x) +
                cc.math.square(this.y) +
                cc.math.square(this.z) +
                cc.math.square(this.w)
            );
        }

        lerp(vec, t) {    //= cc.kmVec4Lerp
            // not implemented
            return this;
        }

        normalize() {   // cc.kmVec4Normalize
            const l = 1.0 / this.length();
            this.x *= l;
            this.y *= l;
            this.z *= l;
            this.w *= l;
            return this;
        }

        scale(scale) {  //= cc.kmVec4Scale
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
                const selVec = new cc.math.Vec4(vecArray[i]);
                selVec.transform(mat4);
                retArray.push(selVec);
            }
            return retArray;
        }

        equals(vec) {              //=cc.kmVec4AreEqual
            const EPSILON = cc.math.EPSILON;
            return (
                this.x < vec.x + EPSILON && this.x > vec.x - EPSILON &&
                this.y < vec.y + EPSILON && this.y > vec.y - EPSILON &&
                this.z < vec.z + EPSILON && this.z > vec.z - EPSILON &&
                this.w < vec.w + EPSILON && this.w > vec.w - EPSILON
            );
        }

        assignFrom(vec) {      //= cc.kmVec4Assign
            this.x = vec.x;
            this.y = vec.y;
            this.z = vec.z;
            this.w = vec.w;
            return this;
        }

        toTypeArray() {      //cc.kmVec4ToTypeArray
            const tyArr = new Float32Array(4);
            tyArr[0] = this.x;
            tyArr[1] = this.y;
            tyArr[2] = this.z;
            tyArr[3] = this.w;
            return tyArr;
        }
    };

    cc.kmVec4 = cc.math.Vec4;
})(cc);

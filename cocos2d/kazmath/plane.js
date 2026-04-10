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

/**
 * @ignore
 */
(function(cc){
    cc.math.Plane = class Plane {
        constructor(a, b, c, d) {
            if (a && b === undefined) {
                this.a = a.a;
                this.b = a.b;
                this.c = a.c;
                this.d = a.d;
            } else {
                this.a = a || 0;
                this.b = b || 0;
                this.c = c || 0;
                this.d = d || 0;
            }
        }

        /**
         * Returns the dot product of the plane and the specified 4D vector.
         * @param {cc.math.Vec4} vec4
         * @returns {number}
         */
        dot(vec4) {
            return this.a * vec4.x + this.b * vec4.y + this.c * vec4.z + this.d * vec4.w;
        }

        /**
         * Returns the dot product of the plane and a coordinate.
         * @param {cc.math.Vec3} vec3
         * @returns {number}
         */
        dotCoord(vec3) {
            return this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
        }

        /**
         * Returns the dot product of the plane and a normal vector.
         * @param {cc.math.Vec3} vec3
         * @returns {number}
         */
        dotNormal(vec3) {
            return this.a * vec3.x + this.b * vec3.y + this.c * vec3.z;
        }

        /**
         * Normalizes the plane.
         * @returns {cc.math.Plane}
         */
        normalize() {
            const n = new cc.math.Vec3(this.a, this.b, this.c);
            const l = 1.0 / n.length();
            n.normalize();
            this.a = n.x;
            this.b = n.y;
            this.c = n.z;
            this.d = this.d * l;
            return this;
        }

        /**
         * Classifies a point relative to this plane.
         * @param {cc.math.Vec3} vec3
         * @returns {number}
         */
        classifyPoint(vec3) {
            const distance = this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
            if (distance > 0.001) return cc.math.Plane.POINT_INFRONT_OF_PLANE;
            if (distance < -0.001) return cc.math.Plane.POINT_BEHIND_PLANE;
            return cc.math.Plane.POINT_ON_PLANE;
        }

        /**
         * Builds a plane from a point and a normal.
         * @param {cc.math.Vec3} vec3
         * @param {cc.math.Vec3} normal
         * @returns {cc.math.Plane}
         */
        static fromPointNormal(vec3, normal) {
            return new cc.math.Plane(normal.x, normal.y, normal.z, -normal.dot(vec3));
        }

        /**
         * Builds a plane from three points.
         * @param {cc.math.Vec3} vec1
         * @param {cc.math.Vec3} vec2
         * @param {cc.math.Vec3} vec3
         * @returns {cc.math.Plane}
         */
        static fromPoints(vec1, vec2, vec3) {
            const v1 = new cc.math.Vec3(vec2);
            const v2 = new cc.math.Vec3(vec3);
            const plane = new cc.math.Plane();

            v1.subtract(vec1);
            v2.subtract(vec1);
            v1.cross(v2);
            v1.normalize();

            plane.a = v1.x;
            plane.b = v1.y;
            plane.c = v1.z;
            plane.d = v1.scale(-1.0).dot(vec1);
            return plane;
        }

        static LEFT = 0;
        static RIGHT = 1;
        static BOTTOM = 2;
        static TOP = 3;
        static NEAR = 4;
        static FAR = 5;

        static POINT_INFRONT_OF_PLANE = 0;
        static POINT_BEHIND_PLANE = 1;
        static POINT_ON_PLANE = 2;
    };

    cc.kmPlane = cc.math.Plane;
})(cc);

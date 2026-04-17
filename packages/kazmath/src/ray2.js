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
    cc.math.Ray2 = class Ray2 {
        constructor(start, dir) {
            this.start = start || new cc.math.Vec2();
            this.dir = dir || new cc.math.Vec2();
        }

        /**
         * Sets the ray using a start point and direction vector.
         * @param {number} px
         * @param {number} py
         * @param {number} vx
         * @param {number} vy
         */
        fill(px, py, vx, vy) {
            this.start.x = px;
            this.start.y = py;
            this.dir.x = vx;
            this.dir.y = vy;
            return this;
        }

        /**
         * Tests intersection with a line segment.
         * @param {cc.math.Vec2} p1
         * @param {cc.math.Vec2} p2
         * @param {cc.math.Vec2} intersection
         * @returns {boolean}
         */
        intersectLineSegment(p1, p2, intersection) {
            const x1 = this.start.x;
            const y1 = this.start.y;
            const x2 = this.start.x + this.dir.x;
            const y2 = this.start.y + this.dir.y;
            const x3 = p1.x;
            const y3 = p1.y;
            const x4 = p2.x;
            const y4 = p2.y;

            const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
            if (denom > -cc.math.EPSILON && denom < cc.math.EPSILON) return false;

            const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
            const x = x1 + ua * (x2 - x1);
            const y = y1 + ua * (y2 - y1);

            if (
                x < Math.min(p1.x, p2.x) - cc.math.EPSILON ||
                x > Math.max(p1.x, p2.x) + cc.math.EPSILON ||
                y < Math.min(p1.y, p2.y) - cc.math.EPSILON ||
                y > Math.max(p1.y, p2.y) + cc.math.EPSILON
            ) {
                return false;
            }

            if (
                x < Math.min(x1, x2) - cc.math.EPSILON ||
                x > Math.max(x1, x2) + cc.math.EPSILON ||
                y < Math.min(y1, y2) - cc.math.EPSILON ||
                y > Math.max(y1, y2) + cc.math.EPSILON
            ) {
                return false;
            }

            intersection.x = x;
            intersection.y = y;
            return true;
        }

        /**
         * Tests intersection with a triangle.
         * @param {cc.math.Vec2} p1
         * @param {cc.math.Vec2} p2
         * @param {cc.math.Vec2} p3
         * @param {cc.math.Vec2} intersection
         * @param {cc.math.Vec2} normal_out
         * @returns {boolean}
         */
        intersectTriangle(p1, p2, p3, intersection, normal_out) {
            const intersect = new cc.math.Vec2();
            const final_intersect = new cc.math.Vec2();
            const normal = new cc.math.Vec2();
            let distance = 10000.0;
            let intersected = false;

            const checkLine = (a, b) => {
                if (!this.intersectLineSegment(a, b, intersect)) return;

                const this_distance = intersect.subtract(this.start).length();
                if (this_distance < distance) {
                    final_intersect.x = intersect.x;
                    final_intersect.y = intersect.y;
                    distance = this_distance;
                    calculate_line_normal(a, b, normal);
                }
                intersected = true;
            };

            checkLine(p1, p2);
            checkLine(p2, p3);
            checkLine(p3, p1);

            if (intersected) {
                intersection.x = final_intersect.x;
                intersection.y = final_intersect.y;
                if (normal_out) {
                    normal_out.x = normal.x;
                    normal_out.y = normal.y;
                }
            }
            return intersected;
        }
    };

    cc.kmRay2 = cc.math.Ray2;

    function calculate_line_normal(p1, p2, normalOut) {
        const tmp = new cc.math.Vec2(p2);
        tmp.subtract(p1);
        normalOut.x = -tmp.y;
        normalOut.y = tmp.x;
        normalOut.normalize();
    }
})(cc);

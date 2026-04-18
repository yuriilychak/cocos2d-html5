/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * cc.Point is the class for point object, please do not use its constructor to create points, use cc.p() alias function instead.
 * @class cc.Point
 * @param {Number} x
 * @param {Number} y
 *
 * @property x {Number}
 * @property y {Number}
 * @see cc.p
 */
export function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * Helper function that creates a cc.Point.
 * @function
 * @param {Number|cc.Point} x a Number or a size object
 * @param {Number} y
 * @return {cc.Point}
 * @example
 * var point1 = cc.p();
 * var point2 = cc.p(100, 100);
 * var point3 = cc.p(point2);
 * var point4 = cc.p({x: 100, y: 100});
 */
export function p(x, y) {
    // This can actually make use of "hidden classes" in JITs and thus decrease
    // memory usage and overall performance drastically
    // return cc.p(x, y);
    // but this one will instead flood the heap with newly allocated hash maps
    // giving little room for optimization by the JIT,
    // note: we have tested this item on Chrome and firefox, it is faster than cc.p(x, y)
    if (x === undefined)
        return {x: 0, y: 0};
    if (y === undefined)
        return {x: x.x, y: x.y};
    return {x: x, y: y};
}

/**
 * Check whether a point's value equals to another
 * @function
 * @param {cc.Point} point1
 * @param {cc.Point} point2
 * @return {Boolean}
 */
export function pointEqualToPoint(point1, point2) {
    return point1 && point2 && (point1.x === point2.x) && (point1.y === point2.y);
}

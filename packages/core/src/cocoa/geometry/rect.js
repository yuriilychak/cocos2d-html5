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
 * cc.Rect is the class for rect object, please do not use its constructor to create rects, use cc.rect() alias function instead.
 * @class cc.Rect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 *
 * @see cc.rect
 */
export function Rect(x, y, width, height) {
    this.x = x||0;
    this.y = y||0;
    this.width = width||0;
    this.height = height||0;
}

/**
 * Helper function that creates a cc.Rect.
 * @function
 * @param {Number|cc.Rect} x a number or a rect object
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @returns {cc.Rect}
 * @example
 * var rect1 = cc.rect();
 * var rect2 = cc.rect(100,100,100,100);
 * var rect3 = cc.rect(rect2);
 * var rect4 = cc.rect({x: 100, y: 100, width: 100, height: 100});
 */
export function rect(x, y, w, h) {
    if (x === undefined)
        return {x: 0, y: 0, width: 0, height: 0};
    if (y === undefined)
        return {x: x.x, y: x.y, width: x.width, height: x.height};
    return {x: x, y: y, width: w, height: h };
}

/**
 * Check whether a rect's value equals to another
 * @function
 * @param {cc.Rect} rect1
 * @param {cc.Rect} rect2
 * @return {Boolean}
 */
export function rectEqualToRect(rect1, rect2) {
    return rect1 && rect2 && (rect1.x === rect2.x) && (rect1.y === rect2.y) && (rect1.width === rect2.width) && (rect1.height === rect2.height);
}

export function _rectEqualToZero(r) {
    return r && (r.x === 0) && (r.y === 0) && (r.width === 0) && (r.height === 0);
}

/**
 * Check whether the rect1 contains rect2
 * @function
 * @param {cc.Rect} rect1
 * @param {cc.Rect} rect2
 * @return {Boolean}
 */
export function rectContainsRect(rect1, rect2) {
    if (!rect1 || !rect2)
        return false;
    return !((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height));
}

/**
 * Returns the rightmost x-value of a rect
 * @function
 * @param {cc.Rect} rect
 * @return {Number} The rightmost x value
 */
export function rectGetMaxX(rect) {
    return (rect.x + rect.width);
}

/**
 * Return the midpoint x-value of a rect
 * @function
 * @param {cc.Rect} rect
 * @return {Number} The midpoint x value
 */
export function rectGetMidX(rect) {
    return (rect.x + rect.width / 2.0);
}

/**
 * Returns the leftmost x-value of a rect
 * @function
 * @param {cc.Rect} rect
 * @return {Number} The leftmost x value
 */
export function rectGetMinX(rect) {
    return rect.x;
}

/**
 * Return the topmost y-value of a rect
 * @function
 * @param {cc.Rect} rect
 * @return {Number} The topmost y value
 */
export function rectGetMaxY(rect) {
    return(rect.y + rect.height);
}

/**
 * Return the midpoint y-value of `rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number} The midpoint y value
 */
export function rectGetMidY(rect) {
    return rect.y + rect.height / 2.0;
}

/**
 * Return the bottommost y-value of a rect
 * @function
 * @param {cc.Rect} rect
 * @return {Number} The bottommost y value
 */
export function rectGetMinY(rect) {
    return rect.y;
}

/**
 * Check whether a rect contains a point
 * @function
 * @param {cc.Rect} rect
 * @param {cc.Point} point
 * @return {Boolean}
 */
export function rectContainsPoint(rect, point) {
    return (point.x >= rectGetMinX(rect) && point.x <= rectGetMaxX(rect) &&
        point.y >= rectGetMinY(rect) && point.y <= rectGetMaxY(rect)) ;
}

/**
 * Check whether a rect intersect with another
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {Boolean}
 */
export function rectIntersectsRect(ra, rb) {
    var maxax = ra.x + ra.width,
        maxay = ra.y + ra.height,
        maxbx = rb.x + rb.width,
        maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
}

/**
 * Check whether a rect overlaps another
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {Boolean}
 */
export function rectOverlapsRect(rectA, rectB) {
    return !((rectA.x + rectA.width < rectB.x) ||
        (rectB.x + rectB.width < rectA.x) ||
        (rectA.y + rectA.height < rectB.y) ||
        (rectB.y + rectB.height < rectA.y));
}

/**
 * Returns the smallest rectangle that contains the two source rectangles.
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {cc.Rect}
 */
export function rectUnion(rectA, rectB) {
    var r = rect(0, 0, 0, 0);
    r.x = Math.min(rectA.x, rectB.x);
    r.y = Math.min(rectA.y, rectB.y);
    r.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - r.x;
    r.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - r.y;
    return r;
}

/**
 * Returns the overlapping portion of 2 rectangles
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {cc.Rect}
 */
export function rectIntersection(rectA, rectB) {
    var intersection = rect(
        Math.max(rectGetMinX(rectA), rectGetMinX(rectB)),
        Math.max(rectGetMinY(rectA), rectGetMinY(rectB)),
        0, 0);

    intersection.width = Math.min(rectGetMaxX(rectA), rectGetMaxX(rectB)) - rectGetMinX(intersection);
    intersection.height = Math.min(rectGetMaxY(rectA), rectGetMaxY(rectB)) - rectGetMinY(intersection);
    return intersection;
}

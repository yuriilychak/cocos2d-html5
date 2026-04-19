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
 * cc.Rect is the class for rect object.
 * @class cc.Rect
 * @param {Number|cc.Rect} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [width=0]
 * @param {Number} [height=0]
 */
export class Rect {
  constructor(x, y, width, height) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    } else if (y === undefined) {
      this.x = x.x;
      this.y = x.y;
      this.width = x.width;
      this.height = x.height;
    } else {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }
}

/**
 * Helper function that creates a cc.Rect.
 * @function
 * @param {Number|cc.Rect} [x] a number or a rect object
 * @param {Number} [y]
 * @param {Number} [w]
 * @param {Number} [h]
 * @returns {Rect}
 */
export function rect(x, y, w, h) {
  return new Rect(x, y, w, h);
}

/**
 * Check whether a rect's value equals to another
 * @function
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {Boolean}
 */
export function rectEqualToRect(rect1, rect2) {
  return (
    rect1 &&
    rect2 &&
    rect1.x === rect2.x &&
    rect1.y === rect2.y &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height
  );
}

export function _rectEqualToZero(r) {
  return r && r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0;
}

/**
 * Check whether the rect1 contains rect2
 * @function
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {Boolean}
 */
export function rectContainsRect(rect1, rect2) {
  if (!rect1 || !rect2) return false;
  return !(
    rect1.x >= rect2.x ||
    rect1.y >= rect2.y ||
    rect1.x + rect1.width <= rect2.x + rect2.width ||
    rect1.y + rect1.height <= rect2.y + rect2.height
  );
}

/**
 * Returns the rightmost x-value of a rect
 * @function
 * @param {Rect} rect
 * @return {Number} The rightmost x value
 */
export function rectGetMaxX(rect) {
  return rect.x + rect.width;
}

/**
 * Return the midpoint x-value of a rect
 * @function
 * @param {Rect} rect
 * @return {Number} The midpoint x value
 */
export function rectGetMidX(rect) {
  return rect.x + rect.width / 2.0;
}

/**
 * Returns the leftmost x-value of a rect
 * @function
 * @param {Rect} rect
 * @return {Number} The leftmost x value
 */
export function rectGetMinX(rect) {
  return rect.x;
}

/**
 * Return the topmost y-value of a rect
 * @function
 * @param {Rect} rect
 * @return {Number} The topmost y value
 */
export function rectGetMaxY(rect) {
  return rect.y + rect.height;
}

/**
 * Return the midpoint y-value of `rect'
 * @function
 * @param {Rect} rect
 * @return {Number} The midpoint y value
 */
export function rectGetMidY(rect) {
  return rect.y + rect.height / 2.0;
}

/**
 * Return the bottommost y-value of a rect
 * @function
 * @param {Rect} rect
 * @return {Number} The bottommost y value
 */
export function rectGetMinY(rect) {
  return rect.y;
}

/**
 * Check whether a rect contains a point
 * @function
 * @param {Rect} rect
 * @param {Point} point
 * @return {Boolean}
 */
export function rectContainsPoint(rect, point) {
  return (
    point.x >= rectGetMinX(rect) &&
    point.x <= rectGetMaxX(rect) &&
    point.y >= rectGetMinY(rect) &&
    point.y <= rectGetMaxY(rect)
  );
}

/**
 * Check whether a rect intersect with another
 * @function
 * @param {Rect} rectA
 * @param {Rect} rectB
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
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Boolean}
 */
export function rectOverlapsRect(rectA, rectB) {
  return !(
    rectA.x + rectA.width < rectB.x ||
    rectB.x + rectB.width < rectA.x ||
    rectA.y + rectA.height < rectB.y ||
    rectB.y + rectB.height < rectA.y
  );
}

/**
 * Returns the smallest rectangle that contains the two source rectangles.
 * @function
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Rect}
 */
export function rectUnion(rectA, rectB) {
  var r = new Rect(0, 0, 0, 0);
  r.x = Math.min(rectA.x, rectB.x);
  r.y = Math.min(rectA.y, rectB.y);
  r.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - r.x;
  r.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - r.y;
  return r;
}

/**
 * Returns the overlapping portion of 2 rectangles
 * @function
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Rect}
 */
export function rectIntersection(rectA, rectB) {
  var intersection = new Rect(
    Math.max(rectGetMinX(rectA), rectGetMinX(rectB)),
    Math.max(rectGetMinY(rectA), rectGetMinY(rectB)),
    0,
    0
  );

  intersection.width =
    Math.min(rectGetMaxX(rectA), rectGetMaxX(rectB)) -
    rectGetMinX(intersection);
  intersection.height =
    Math.min(rectGetMaxY(rectA), rectGetMaxY(rectB)) -
    rectGetMinY(intersection);
  return intersection;
}

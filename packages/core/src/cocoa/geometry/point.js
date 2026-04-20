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
 * Point is the class for point object.
 * @param {Number|Point} [x=0]
 * @param {Number} [y=0]
 */
export class Point {
  constructor(x, y) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
    } else if (y === undefined) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }
}

/**
 * Helper function that creates a Point.
 * @function
 * @param {Number|Point} [x] a Number or a point object
 * @param {Number} [y]
 * @return {Point}
 */
export function p(x, y) {
  return new Point(x, y);
}

/**
 * Check whether a point's value equals to another
 * @function
 * @param {Point} point1
 * @param {Point} point2
 * @return {Boolean}
 */
export function pointEqualToPoint(point1, point2) {
  return point1 && point2 && point1.x === point2.x && point1.y === point2.y;
}

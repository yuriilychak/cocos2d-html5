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
 * cc.Size is the class for size object.
 * @class cc.Size
 * @param {Number|cc.Size} [width=0]
 * @param {Number} [height=0]
 */
export class Size {
  constructor(width, height) {
    if (width === undefined) {
      this.width = 0;
      this.height = 0;
    } else if (height === undefined) {
      this.width = width.width;
      this.height = width.height;
    } else {
      this.width = width;
      this.height = height;
    }
  }
}

/**
 * Helper function that creates a cc.Size.
 * @function
 * @param {Number|cc.Size} [w] width or a size object
 * @param {Number} [h] height
 * @return {Size}
 */
export function size(w, h) {
  return new Size(w, h);
}

/**
 * Check whether a point's value equals to another
 * @function
 * @param {Size} size1
 * @param {Size} size2
 * @return {Boolean}
 */
export function sizeEqualToSize(size1, size2) {
  return (
    size1 &&
    size2 &&
    size1.width === size2.width &&
    size1.height === size2.height
  );
}

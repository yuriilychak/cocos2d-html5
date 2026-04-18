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
 * cc.Size is the class for size object, please do not use its constructor to create sizes, use cc.size() alias function instead.
 * @class cc.Size
 * @param {Number} width
 * @param {Number} height
 * @property {Number} width
 * @property {Number} height
 * @see cc.size
 */
export function Size(width, height) {
    this.width = width || 0;
    this.height = height || 0;
}

/**
 * Helper function that creates a cc.Size.
 * @function
 * @param {Number|cc.Size} w width or a size object
 * @param {Number} h height
 * @return {cc.Size}
 * @example
 * var size1 = cc.size();
 * var size2 = cc.size(100,100);
 * var size3 = cc.size(size2);
 * var size4 = cc.size({width: 100, height: 100});
 */
export function size(w, h) {
    // This can actually make use of "hidden classes" in JITs and thus decrease
    // memory usage and overall performance drastically
    //return cc.size(w, h);
    // but this one will instead flood the heap with newly allocated hash maps
    // giving little room for optimization by the JIT
    // note: we have tested this item on Chrome and firefox, it is faster than cc.size(w, h)
    if (w === undefined)
        return {width: 0, height: 0};
    if (h === undefined)
        return {width: w.width, height: w.height};
    return {width: w, height: h};
}

/**
 * Check whether a point's value equals to another
 * @function
 * @param {cc.Size} size1
 * @param {cc.Size} size2
 * @return {Boolean}
 */
export function sizeEqualToSize(size1, size2) {
    return (size1 && size2 && (size1.width === size2.width) && (size1.height === size2.height));
}

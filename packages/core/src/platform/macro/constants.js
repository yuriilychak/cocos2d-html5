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
 * @constant
 * @type Number
 */
export const INVALID_INDEX = -1;

/**
 * PI is the ratio of a circle's circumference to its diameter.
 * @constant
 * @type Number
 */
export const PI = Math.PI;

/**
 * @constant
 * @type Number
 */
export const FLT_MAX = parseFloat('3.402823466e+38F');

/**
 * @constant
 * @type Number
 */
export const FLT_MIN = parseFloat("1.175494351e-38F");

/**
 * @constant
 * @type Number
 */
export const RAD = PI / 180;

/**
 * @constant
 * @type Number
 */
export const DEG = 180 / PI;

/**
 * maximum unsigned int value
 * @constant
 * @type Number
 */
export const UINT_MAX = 0xffffffff;

/**
 * @constant
 * @type Number
 */
export const REPEAT_FOREVER = Number.MAX_VALUE - 1;

/**
 * @constant
 * @type Number
 */
export const FLT_EPSILON = 0.0000001192092896;

/**
 * The maximum vertex count for a single batched draw call.
 * @constant
 * @type Number
 */
export const BATCH_VERTEX_COUNT = 2000;


/**
 * default size for font size
 * @constant
 * @type Number
 */
export const ITEM_SIZE = 32;

/**
 * default tag for current item
 * @constant
 * @type Number
 */
export const CURRENT_ITEM = 0xc0c05001;
/**
 * default tag for zoom action tag
 * @constant
 * @type Number
 */
export const ZOOM_ACTION_TAG = 0xc0c05002;
/**
 * default tag for normal
 * @constant
 * @type Number
 */
export const NORMAL_TAG = 8801;

/**
 * default selected tag
 * @constant
 * @type Number
 */
export const SELECTED_TAG = 8802;

/**
 * default disabled tag
 * @constant
 * @type Number
 */
export const DISABLE_TAG = 8803;

/** Default Action tag
 * @constant
 * @type {Number}
 * @default
 */
export const ACTION_TAG_INVALID = -1;

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
 * Horizontal center and vertical center.
 * @constant
 * @type Number
 */
export const ALIGN_CENTER = 0x33;

/**
 * Horizontal center and vertical top.
 * @constant
 * @type Number
 */
export const ALIGN_TOP = 0x13;

/**
 * Horizontal right and vertical top.
 * @constant
 * @type Number
 */
export const ALIGN_TOP_RIGHT = 0x12;

/**
 * Horizontal right and vertical center.
 * @constant
 * @type Number
 */
export const ALIGN_RIGHT = 0x32;

/**
 * Horizontal right and vertical bottom.
 * @constant
 * @type Number
 */
export const ALIGN_BOTTOM_RIGHT = 0x22;

/**
 * Horizontal center and vertical bottom.
 * @constant
 * @type Number
 */
export const ALIGN_BOTTOM = 0x23;

/**
 * Horizontal left and vertical bottom.
 * @constant
 * @type Number
 */
export const ALIGN_BOTTOM_LEFT = 0x21;

/**
 * Horizontal left and vertical center.
 * @constant
 * @type Number
 */
export const ALIGN_LEFT = 0x31;

/**
 * Horizontal left and vertical top.
 * @constant
 * @type Number
 */
export const ALIGN_TOP_LEFT = 0x11;

export const PIXEL_FORMAT_RGBA8888 = 2;
export const PIXEL_FORMAT_RGB888 = 3;
export const PIXEL_FORMAT_RGB565 = 4;
export const PIXEL_FORMAT_A8 = 5;
export const PIXEL_FORMAT_I8 = 6;
export const PIXEL_FORMAT_AI88 = 7;
export const PIXEL_FORMAT_RGBA4444 = 8;
export const PIXEL_FORMAT_RGB5A1 = 7;
export const PIXEL_FORMAT_PVRTC4 = 9;
export const PIXEL_FORMAT_PVRTC2 = 10;
export const PIXEL_FORMAT_DEFAULT = PIXEL_FORMAT_RGBA8888;
export const defaultPixelFormat = PIXEL_FORMAT_DEFAULT;

export const PIXEL_FORMAT_NAMES = {
  [PIXEL_FORMAT_RGBA8888]: "RGBA8888",
  [PIXEL_FORMAT_RGB888]: "RGB888",
  [PIXEL_FORMAT_RGB565]: "RGB565",
  [PIXEL_FORMAT_A8]: "A8",
  [PIXEL_FORMAT_I8]: "I8",
  [PIXEL_FORMAT_AI88]: "AI88",
  [PIXEL_FORMAT_RGBA4444]: "RGBA4444",
  [PIXEL_FORMAT_RGB5A1]: "RGB5A1",
  [PIXEL_FORMAT_PVRTC4]: "PVRTC4",
  [PIXEL_FORMAT_PVRTC2]: "PVRTC2"
};

export const PIXEL_FORMAT_BITS = {
  [PIXEL_FORMAT_RGBA8888]: 32,
  [PIXEL_FORMAT_RGB888]: 24,
  [PIXEL_FORMAT_RGB565]: 16,
  [PIXEL_FORMAT_A8]: 8,
  [PIXEL_FORMAT_I8]: 8,
  [PIXEL_FORMAT_AI88]: 16,
  [PIXEL_FORMAT_RGBA4444]: 16,
  [PIXEL_FORMAT_RGB5A1]: 16,
  [PIXEL_FORMAT_PVRTC4]: 4,
  [PIXEL_FORMAT_PVRTC2]: 3
};

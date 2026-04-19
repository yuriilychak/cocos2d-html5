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
 * Color class, please use cc.color() to construct a color
 * @class Color
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 * @see cc.color
 */
export class Color {
    constructor(r, g, b, a) {
        if (typeof r === 'object') {
            this._val = (((r.r || 0) << 24) >>> 0) + ((r.g || 0) << 16) + ((r.b || 0) << 8) + ((r.a == null) ? 255 : r.a);
        } else {
            r = r || 0;
            g = g || 0;
            b = b || 0;
            a = typeof a === 'number' ? a : 255;
            this._val = ((r << 24) >>> 0) + (g << 16) + (b << 8) + a;
        }
    }

    get r() {
        return (this._val & 0xff000000) >>> 24;
    }

    set r(value) {
        this._val = (this._val & 0x00ffffff) | ((value << 24) >>> 0);
    }

    get g() {
        return (this._val & 0x00ff0000) >> 16;
    }

    set g(value) {
        this._val = (this._val & 0xff00ffff) | (value << 16);
    }

    get b() {
        return (this._val & 0x0000ff00) >> 8;
    }

    set b(value) {
        this._val = (this._val & 0xffff00ff) | (value << 8);
    }

    get a() {
        return this._val & 0x000000ff;
    }

    set a(value) {
        this._val = (this._val & 0xffffff00) | value;
    }

    /**
     * White color (255, 255, 255, 255)
     * @returns {Color}
     */
    static get WHITE() {
        return new Color(255, 255, 255, 255);
    }

    /**
     * Yellow color (255, 255, 0, 255)
     * @returns {Color}
     */
    static get YELLOW() {
        return new Color(255, 255, 0, 255);
    }

    /**
     * Blue color (0, 0, 255, 255)
     * @returns {Color}
     */
    static get BLUE() {
        return new Color(0, 0, 255, 255);
    }

    /**
     * Green Color (0, 255, 0, 255)
     * @returns {Color}
     */
    static get GREEN() {
        return new Color(0, 255, 0, 255);
    }

    /**
     * Red Color (255, 0, 0, 255)
     * @returns {Color}
     */
    static get RED() {
        return new Color(255, 0, 0, 255);
    }

    /**
     * Magenta Color (255, 0, 255, 255)
     * @returns {Color}
     */
    static get MAGENTA() {
        return new Color(255, 0, 255, 255);
    }

    /**
     * Black Color (0, 0, 0, 255)
     * @returns {Color}
     */
    static get BLACK() {
        return new Color(0, 0, 0, 255);
    }

    /**
     * Orange Color (255, 127, 0, 255)
     * @returns {Color}
     */
    static get ORANGE() {
        return new Color(255, 127, 0, 255);
    }

    /**
     * Gray Color (166, 166, 166, 255)
     * @returns {Color}
     */
    static get GRAY() {
        return new Color(166, 166, 166, 255);
    }
}

/**
 * Generate a color object based on multiple forms of parameters
 * @example
 *
 * // 1. All channels separately as parameters
 * var color1 = cc.color(255, 255, 255, 255);
 *
 * // 2. Convert a hex string to a color
 * var color2 = cc.color("#000000");
 *
 * // 3. An color object as parameter
 * var color3 = cc.color({r: 255, g: 255, b: 255, a: 255});
 *
 * Alpha channel is optional. Default value is 255
 *
 * @param {Number|String|Color} r
 * @param {Number} [g]
 * @param {Number} [b]
 * @param {Number} [a=255]
 * @return {Color}
 */
export function color(r, g, b, a) {
    if (r === undefined)
        return new Color(0, 0, 0, 255);
    if (typeof r === 'object')
        return new Color(r.r, r.g, r.b, (r.a == null) ? 255 : r.a);
    if (typeof r === 'string')
        return hexToColor(r);
    return new Color(r, g, b, (a == null ? 255 : a));
}

/**
 * returns true if both ccColor3B are equal. Otherwise it returns false.
 * @function
 * @param {Color} color1
 * @param {Color} color2
 * @return {Boolean}  true if both ccColor3B are equal. Otherwise it returns false.
 */
export function colorEqual(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}

/**
 * convert a string of color for style to Color.
 * e.g. "#ff06ff"  to : cc.color(255,6,255)
 * @function
 * @param {String} hex
 * @return {Color}
 */
export function hexToColor(hex) {
    hex = hex.replace(/^#?/, "0x");
    var c = parseInt(hex);
    var r = c >> 16;
    var g = (c >> 8) % 256;
    var b = c % 256;
    return new Color(r, g, b);
}

/**
 * convert Color to a string of color for style.
 * e.g.  cc.color(255,6,255)  to : "#ff06ff"
 * @function
 * @param {Color} color
 * @return {String}
 */
export function colorToHex(color) {
    var hR = color.r.toString(16), hG = color.g.toString(16), hB = color.b.toString(16);
    return "#" + (color.r < 16 ? ("0" + hR) : hR) + (color.g < 16 ? ("0" + hG) : hG) + (color.b < 16 ? ("0" + hB) : hB);
}

/**
 * the device accelerometer reports values for each axis in units of g-force
 * @class Acceleration
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} timestamp
 */
export var Acceleration = function (x, y, z, timestamp) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.timestamp = timestamp || 0;
};

/**
 * text alignment : left
 * @constant
 * @type Number
 */
export const TEXT_ALIGNMENT_LEFT = 0;

/**
 * text alignment : center
 * @constant
 * @type Number
 */
export const TEXT_ALIGNMENT_CENTER = 1;

/**
 * text alignment : right
 * @constant
 * @type Number
 */
export const TEXT_ALIGNMENT_RIGHT = 2;

/**
 * text alignment : top
 * @constant
 * @type Number
 */
export const VERTICAL_TEXT_ALIGNMENT_TOP = 0;

/**
 * text alignment : center
 * @constant
 * @type Number
 */
export const VERTICAL_TEXT_ALIGNMENT_CENTER = 1;

/**
 * text alignment : bottom
 * @constant
 * @type Number
 */
export const VERTICAL_TEXT_ALIGNMENT_BOTTOM = 2;

// Forward color preset getters on the color factory function for backward compatibility
Object.defineProperties(color, {
    WHITE: { get() { return Color.WHITE; } },
    YELLOW: { get() { return Color.YELLOW; } },
    BLUE: { get() { return Color.BLUE; } },
    GREEN: { get() { return Color.GREEN; } },
    RED: { get() { return Color.RED; } },
    MAGENTA: { get() { return Color.MAGENTA; } },
    BLACK: { get() { return Color.BLACK; } },
    ORANGE: { get() { return Color.ORANGE; } },
    GRAY: { get() { return Color.GRAY; } }
});

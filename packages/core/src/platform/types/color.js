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
 * Color class, please use color() to construct a color
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 */
export class Color {
  constructor(r, g, b, a) {
    if (typeof r === "object") {
      this._val =
        (((r.r || 0) << 24) >>> 0) +
        ((r.g || 0) << 16) +
        ((r.b || 0) << 8) +
        (r.a == null ? 255 : r.a);
    } else {
      r = r || 0;
      g = g || 0;
      b = b || 0;
      a = typeof a === "number" ? a : 255;
      this._val = ((r << 24) >>> 0) + (g << 16) + (b << 8) + a;
    }
  }

  clone() {
    return new Color(this.r, this.g, this.b, this.a);
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

  get hsv() {
    const r = this.r / 255.0;
    const g = this.g / 255.0;
    const b = this.b / 255.0;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    const v = max;
    let h = 0;
    let s = 0;

    if (delta < 0.00001) {
      s = 0;
      h = 0;

      return { h, s, v };
    }

    if (max > 0.0) {
      s = delta / max;
    } else {
      s = 0;
      h = 0;

      return { h, s, v };
    }

    if (r >= max) {
      h = (g - b) / delta;
    } else if (g >= max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h *= 60;

    if (h < 0.0) {
      h += 360.0;
    }
    return { h, s, v };
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

  toArray() {
    return [this.r, this.g, this.b, this.a];
  }

  static equal(color1, color2) {
    return (
      color1.r === color2.r && color1.g === color2.g && color1.b === color2.b
    );
  }

  static fromHex(hex) {
    hex = hex.replace(/^#?/, "0x");
    var c = parseInt(hex);
    var r = c >> 16;
    var g = (c >> 8) % 256;
    var b = c % 256;
    return new Color(r, g, b);
  }

  static toHex(color) {
    var hR = color.r.toString(16),
      hG = color.g.toString(16),
      hB = color.b.toString(16);
    return (
      "#" +
      (color.r < 16 ? "0" + hR : hR) +
      (color.g < 16 ? "0" + hG : hG) +
      (color.b < 16 ? "0" + hB : hB)
    );
  }

  static toRgba(r = 255, g = 255, b = 255, a = 255) {
    const c = r instanceof Color ? r.toArray() : [r, g, b, a];
    c[3] = c[3] / 255;

    return `rgba(${c.join(",")})`;
  }

  static fromHSV({ h, s, v }) {
    var hh, p, q, t, ff;
    let i;
    let r = 0;
    let g = 0;
    let b = 0;

    if (s <= 0.0) {
      if (!h) {
        r = v;
        g = v;
        b = v;
        return new Color(0 | (r * 255), 0 | (g * 255), 0 | (b * 255));
      }
      r = 0.0;
      g = 0.0;
      b = 0.0;
      return new Color(0 | (r * 255), 0 | (g * 255), 0 | (b * 255));
    }
    hh = h;
    if (hh >= 360.0) {
      hh = 0.0;
    }
    hh /= 60.0;
    i = 0 | hh;
    ff = hh - i;
    p = v * (1.0 - s);
    q = v * (1.0 - s * ff);
    t = v * (1.0 - s * (1.0 - ff));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
      default:
        r = v;
        g = p;
        b = q;
        break;
    }

    return new Color(0 | (r * 255), 0 | (g * 255), 0 | (b * 255));
  }
}

/**
 * the device accelerometer reports values for each axis in units of g-force
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} timestamp
 */
export class Acceleration{
  constructor(x = 0, y = 0, z = 0, timestamp = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.timestamp = timestamp;
  }
}

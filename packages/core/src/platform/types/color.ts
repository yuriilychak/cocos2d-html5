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

import { isNumber, isObject } from "../../boot/utils";
import { BYTE, FULL_BYTE } from "../../constants";

export type HSV = {
  h: number;
  s: number;
  v: number;
};

export type ColorLike = {
  r: number;
  g: number;
  b: number;
  a: number;
};

/**
 * Color class, please use color() to construct a color.
 */
export class Color {
  #val = 0;

  constructor();
  constructor(color: ColorLike);
  constructor(r: number, g?: number, b?: number, a?: number);
  constructor(r: number | ColorLike = 0, g: number = 0, b: number = 0, a: number = BYTE) {
    if (Color.isLike(r)) {
      this.#initFromColor(r);
    } else {
      if (
        !isNumber(r) ||
        !isNumber(g) ||
        !isNumber(b) ||
        !isNumber(a)
      ) {
        throw new TypeError("Invalid Color constructor arguments");
      }
      this.#initFromNumber(r, g, b, a);
    }
  }

  #initFromNumber(r: number, g: number, b: number, a: number): void {
    r = r || 0;
    g = g || 0;
    b = b || 0;
    a = isNumber(a) ? a : BYTE;
    this.#val = ((r << 24) >>> 0) + (g << 16) + (b << 8) + a;
  }

  #initFromColor(color: ColorLike): void {
    this.#initFromNumber(color.r, color.g, color.b, color.a);
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  get r(): number {
    return (this.#val & 0xff000000) >>> 24;
  }

  set r(value: number) {
    this.#val = (this.#val & 0x00ffffff) | ((value << 24) >>> 0);
  }

  get g(): number {
    return (this.#val & 0x00ff0000) >> 16;
  }

  set g(value: number) {
    this.#val = (this.#val & 0xff00ffff) | (value << 16);
  }

  get b(): number {
    return (this.#val & 0x0000ff00) >> 8;
  }

  set b(value: number) {
    this.#val = (this.#val & 0xffff00ff) | (value << 8);
  }

  get a(): number {
    return this.#val & 0x000000ff;
  }

  set a(value: number) {
    this.#val = (this.#val & 0xffffff00) | value;
  }

  get hsv(): HSV {
    const r = this.r / BYTE;
    const g = this.g / BYTE;
    const b = this.b / BYTE;
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
   * White color (BYTE, BYTE, BYTE, BYTE)
   * @returns {Color}
   */
  static get WHITE(): Color {
    return new Color(BYTE, BYTE, BYTE, BYTE);
  }

  /**
   * Yellow color (BYTE, BYTE, 0, BYTE)
   * @returns {Color}
   */
  static get YELLOW(): Color {
    return new Color(BYTE, BYTE, 0, BYTE);
  }

  /**
   * Blue color (0, 0, BYTE, BYTE)
   * @returns {Color}
   */
  static get BLUE(): Color {
    return new Color(0, 0, BYTE, BYTE);
  }

  /**
   * Green Color (0, BYTE, 0, BYTE)
   * @returns {Color}
   */
  static get GREEN(): Color {
    return new Color(0, BYTE, 0, BYTE);
  }

  /**
   * Red Color (BYTE, 0, 0, BYTE)
   * @returns {Color}
   */
  static get RED(): Color {
    return new Color(BYTE, 0, 0, BYTE);
  }

  /**
   * Magenta Color (BYTE, 0, BYTE, BYTE)
   * @returns {Color}
   */
  static get MAGENTA(): Color {
    return new Color(BYTE, 0, BYTE, BYTE);
  }

  /**
   * Black Color (0, 0, 0, BYTE)
   * @returns {Color}
   */
  static get BLACK(): Color {
    return new Color(0, 0, 0, BYTE);
  }

  /**
   * Orange Color (BYTE, 127, 0, BYTE)
   * @returns {Color}
   */
  static get ORANGE(): Color {
    return new Color(BYTE, 127, 0, BYTE);
  }

  /**
   * Gray Color (166, 166, 166, BYTE)
   * @returns {Color}
   */
  static get GRAY(): Color {
    return new Color(166, 166, 166, BYTE);
  }

  toArray(): number[] {
    return [this.r, this.g, this.b, this.a];
  }

  static equal(color1: Color, color2: Color): boolean {
    return (
      color1.r === color2.r && color1.g === color2.g && color1.b === color2.b
    );
  }

  static fromHex(hex: string): Color {
    hex = hex.replace(/^#?/, "0x");
    var c = parseInt(hex);
    var r = c >> 16;
    var g = (c >> 8) % FULL_BYTE;
    var b = c % FULL_BYTE;
    return new Color(r, g, b);
  }

  static toHex(color: Color): string {
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

  static toRgba(r: Color | number = BYTE, g = BYTE, b = BYTE, a = BYTE): string {
    const c = r instanceof Color ? r.toArray() : [r, g, b, a];
    c[3] = c[3] / BYTE;

    return `rgba(${c.join(",")})`;
  }

  static fromHSV({ h, s, v }: HSV): Color {
    var hh: number, p: number, q: number, t: number, ff: number;
    let i: number;
    let r = 0;
    let g = 0;
    let b = 0;

    if (s <= 0.0) {
      if (!h) {
        r = v;
        g = v;
        b = v;
        return new Color(0 | (r * BYTE), 0 | (g * BYTE), 0 | (b * BYTE));
      }
      r = 0.0;
      g = 0.0;
      b = 0.0;
      return new Color(0 | (r * BYTE), 0 | (g * BYTE), 0 | (b * BYTE));
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

    return new Color(0 | (r * BYTE), 0 | (g * BYTE), 0 | (b * BYTE));
  }

  public static isLike(value: unknown): value is ColorLike {
    if (!isObject(value)) {
      return false;
    }

    const color = value as ColorLike;

    return (
      isNumber(color.r) &&
      isNumber(color.g) &&
      isNumber(color.b) &&
      isNumber(color.a)
    );
  }
}

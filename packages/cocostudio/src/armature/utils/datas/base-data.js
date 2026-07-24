/****************************************************************************
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

import { Color, Point } from "@aspect/core";

import { DOUBLE_PI, M_PI } from "../../animation/tween-function/constants.js";
/**
 * <p>
 *     The base data class for Armature. it contains position, zOrder, skew, scale, color datas.                                       <br/>
 *     x y skewX skewY scaleX scaleY used to calculate transform matrix                                                                <br/>
 *     skewX, skewY can have rotation effect                                                                                           <br/>
 *     To get more matrix information, you can have a look at this pape : http://www.senocular.com/flash/tutorials/transformmatrix/    <br/>
 * </p>
 *
 * @property {Number}         x                - x
 * @property {Number}         y                - y
 * @property {Number}         zOrder           - zOrder
 * @property {Number}         skewX            - skewX
 * @property {Number}         skewY            - skewY
 * @property {Number}         scaleX           - scaleX
 * @property {Number}         scaleY           - scaleY
 * @property {Number}         tweenRotate      - tween Rotate
 * @property {Number}         isUseColorInfo   - is Use Color Info
 * @property {Number}         r                - r of color
 * @property {Number}         g                - g of color
 * @property {Number}         b                - b of color
 * @property {Number}         a                - a of color
 */
export class BaseData extends Color {
  #skew = new Point();
  #scale = new Point();
  /**
   * Construction of BaseData
   */
  constructor() {
    super(255, 255, 255, 255);
    this.x = 0;
    this.y = 0;
    this.zOrder = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.tweenRotate = 0;
    this.isUseColorInfo = false;
  }

  get scale() {
    return this.#scale.x;
  }

  set scale(value) {
    if (this.#scale.x === value && this.#scale.y === value) {
      return;
    }

    this.#scale.set(value, value);
  }

  get scaleX() {
    return this.#scale.x;
  }

  set scaleX(value) {
    this.#scale.x = value;
  }

  get scaleY() {
    return this.#scale.y;
  }

  set scaleY(value) {
    this.#scale.y = value;
  }

  get skew() {
    return this.#skew.clone();
  }

  set skew(value) {
    this.#skew.set(value);
  }

  get skewX() {
    return this.#skew.x;
  }

  set skewX(value) {
    this.#skew.x = value;
  }

  get skewY() {
    return this.#skew.y;
  }

  set skewY(value) {
    this.#skew.y = value;
  }
  /**
   * Copy data from node
   * @function
   * @param {BaseData} node
   */
  copy(node) {
    this.x = node.x;
    this.y = node.y;
    this.zOrder = node.zOrder;

    this.#scale.set(node.scaleX, node.scaleY);
    this.#skew.set(node.skew);

    this.tweenRotate = node.tweenRotate;

    this.isUseColorInfo = node.isUseColorInfo;
    this.r = node.r;
    this.g = node.g;
    this.b = node.b;
    this.a = node.a;
  }

  /**
   * Sets color to base data.
   * @function
   * @param {Color} color
   */
  set color(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
  }

  /**
   * Returns the color of BaseData
   * @function
   * @returns {Color}
   */
  get color() {
    return super.clone();
  }

  /**
   * Calculate two baseData's between value(to - from) and set to self
   * @function
   * @param {BaseData} from
   * @param {BaseData} to
   * @param {Boolean} limit
   */
  subtract(from, to, limit) {
    this.x = to.x - from.x;
    this.y = to.y - from.y;
    this.scaleX = to.scaleX - from.scaleX;
    this.scaleY = to.scaleY - from.scaleY;
    this.skewX = to.skewX - from.skewX;
    this.skewY = to.skewY - from.skewY;

    if (this.isUseColorInfo || from.isUseColorInfo || to.isUseColorInfo) {
      this.a = to.a - from.a;
      this.r = to.r - from.r;
      this.g = to.g - from.g;
      this.b = to.b - from.b;
      this.isUseColorInfo = true;
    } else {
      this.a = this.r = this.g = this.b = 0;
      this.isUseColorInfo = false;
    }

    if (limit) {
      if (this.skewX > M_PI) this.skewX -= DOUBLE_PI;
      if (this.skewX < -M_PI) this.skewX += DOUBLE_PI;
      if (this.skewY > M_PI) this.skewY -= DOUBLE_PI;
      if (this.skewY < -M_PI) this.skewY += DOUBLE_PI;
    }

    if (to.tweenRotate) {
      this.skewX += to.tweenRotate * Math.PI * 2;
      this.skewY -= to.tweenRotate * Math.PI * 2;
    }
  }
};


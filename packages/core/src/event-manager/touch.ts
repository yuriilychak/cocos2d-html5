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

import { BaseClass } from "../platform/class";
import { Point, type PointLike } from "../geometry";
import { ServiceLocator } from "../service-locator";

/**
 * The touch event class
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 */
export default class Touch extends BaseClass implements PointLike {
  #curr: Point = new Point();
  #prev: Point = new Point();
  #start: Point = new Point();
  #lastModified = 0;
  #startPointCaptured = false;
  #id = 0;

  constructor(x: number, y: number, id: number) {
    super();
    this.setTouchInfo(id, x, y);
  }
  
  /**
   * Returns the previous touch location in OpenGL coordinates
   */
  get previousLocation(): Point {
    //TODO
    //return director.convertToGL(this._prevPoint);
    return this.#prev.clone();
  }

  /**
   * Returns the start touch location in OpenGL coordinates
   * @returns {Point}
   */
  get startLocation() {
    //TODO
    //return director.convertToGL(this._startPoint);
    return this.#start.clone();
  }

  /**
   * Returns the delta distance from the previous touche to the current one in screen coordinates
   * @return {Point}
   */
  get delta() {
    return Point.sub(this.#curr, this.#prev);
  }

  /**
   * Returns the current touch location in screen coordinates
   */
  get locationInView(): Point {
    return this.#curr.clone();
  }

  /**
   * Returns the previous touch location in screen coordinates
   */
  get previousLocationInView(): Point {
    return this.#prev.clone();
  }

  /**
   * Returns the start touch location in screen coordinates
   */
  get startLocationInView(): Point {
    return this.#start.clone();
  }

  /**
   * Returns the id of Touch
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Sets information to touch
   * @param {Number} id
   * @param  {Number} x
   * @param  {Number} y
   */
  setTouchInfo(id: number, x: number = 0, y: number = 0) {
    this.#prev.set(this.#curr);
    this.#curr.set(x, y);
    this.#id = id;

    if (!this.#startPointCaptured) {
      this.#start.set(this.#curr);
      ServiceLocator.eglView._convertPointWithScale(this.#start);
      this.#startPointCaptured = true;
    }
  }

  clone(): Touch {
    return new Touch(this.x, this.y, this.id);
  }

  _setPoint(): void 
  _setPoint(point: PointLike): void 
  _setPoint(x: number, y: number): void 
  _setPoint(xOrPoint: PointLike | number = 0,  y: number = 0) {
    if (Point.isLike(xOrPoint)) {
      this.#curr.set(xOrPoint);
    } else if (typeof xOrPoint === 'number' && typeof y === "number") {
      this.#curr.set(xOrPoint, y);
    }
  }

  _setPrevPoint(): void 
  _setPrevPoint(point: PointLike): void 
  _setPrevPoint(x: number, y: number): void 
  _setPrevPoint(xOrPoint: PointLike | number = 0,  y: number = 0) {
    if (Point.isLike(xOrPoint)) {
      this.#prev.set(xOrPoint);
    } else if (typeof xOrPoint === 'number' && typeof y === "number") {
      this.#prev.set(xOrPoint, y);
    }
  }

  get lastModified(): number {
    return this.#lastModified;
  }

  set lastModified(value: number) {
    this.#lastModified = value;
  } 

  get x(): number {
    return this.#curr.x;
  }

  set x(value: number) {
    this.#curr.x = value;
  }

  get y(): number {
    return this.#curr.y;
  }

  set y(value: number) {
    this.#curr.y = value;
  }
}

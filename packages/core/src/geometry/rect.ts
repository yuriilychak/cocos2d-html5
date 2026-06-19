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

import type { PointLike, RectLike, SizeLike } from "./types";
import Point from "./point";
import Size from "./size";

export default class Rect implements RectLike {
  #data: number[];

  constructor();
  constructor(rect: RectLike);
  constructor(pos: PointLike, size: SizeLike);
  constructor(x: number, y: number, width: number, height: number);
  constructor(
    xOrRectOrPos: number | PointLike | RectLike = 0,
    yOrSize: number | SizeLike = 0,
    width = 0,
    height = 0
  ) {
    this.#data = [0, 0, 0, 0];
    if (Rect.isLike(xOrRectOrPos)) {
      this.#initFromRect(xOrRectOrPos);
    } else if (Point.isLike(xOrRectOrPos) && Size.isLike(yOrSize)) {
      this.#initFromPosAndSize(xOrRectOrPos, yOrSize);
    } else {
      if (typeof xOrRectOrPos !== "number" || typeof yOrSize !== "number") {
        throw new TypeError("Invalid Rect constructor arguments");
      }
      this.#initFromNumber(xOrRectOrPos, yOrSize, width, height);
    }
  }

  get x(): number {
    return this.#data[0];
  }

  set x(value: number) {
    this.#data[0] = value;
  }

  get y(): number {
    return this.#data[1];
  }

  set y(value: number) {
    this.#data[1] = value;
  }

  get width(): number {
    return this.#data[2];
  }

  set width(value: number) {
    this.#data[2] = value;
  }

  get height(): number {
    return this.#data[3];
  }

  set height(value: number) {
    this.#data[3] = value;
  }

  get maxX(): number {
    return Rect.getMaxX(this);
  }

  get midX(): number {
    return Rect.getMidX(this);
  }

  get minX(): number {
    return Rect.getMinX(this);
  }

  get maxY(): number {
    return Rect.getMaxY(this);
  }

  get midY(): number {
    return Rect.getMidY(this);
  }

  get minY(): number {
    return Rect.getMinY(this);
  }

  clone(): Rect {
    return new Rect(this);
  }

  set(rect: RectLike): void;
  set(pos: PointLike, size: SizeLike): void;
  set(x: number, y: number, width: number, height: number): void;
  set(
    xOrRectOrPos: number | PointLike | RectLike,
    yOrSize: number | SizeLike = 0,
    width = 0,
    height = 0
  ): void {
    if (Rect.isLike(xOrRectOrPos)) {
      this.#initFromRect(xOrRectOrPos);
    } else if (Point.isLike(xOrRectOrPos) && Size.isLike(yOrSize)) {
      this.#initFromPosAndSize(xOrRectOrPos, yOrSize);
    } else {
      if (typeof xOrRectOrPos !== "number" || typeof yOrSize !== "number") {
        throw new TypeError("Invalid Rect set arguments");
      }
      this.#initFromNumber(xOrRectOrPos, yOrSize, width, height);
    }
  }

  #initFromNumber(x: number, y: number, width: number, height: number): void {
    this.#data[0] = x;
    this.#data[1] = y;
    this.#data[2] = width;
    this.#data[3] = height;
  }

  #initFromRect(rect: RectLike): void {
    this.#initFromNumber(rect.x, rect.y, rect.width, rect.height);
  }

  #initFromPosAndSize(pos: PointLike, size: SizeLike): void {
    this.#initFromNumber(pos.x, pos.y, size.width, size.height);
  }

  public static equalTo(
    rect1: RectLike | null | undefined,
    rect2: RectLike | null | undefined
  ): boolean {
    return (
      rect1 != null &&
      rect2 != null &&
      rect1.x === rect2.x &&
      rect1.y === rect2.y &&
      rect1.width === rect2.width &&
      rect1.height === rect2.height
    );
  }

  public static equalToZero(r: RectLike | null | undefined): boolean {
    return r != null && r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0;
  }

  public static contains(rect1: RectLike | null | undefined, rect2: RectLike | null | undefined): boolean {
    if (!rect1 || !rect2) return false;
    return !(
      rect1.x >= rect2.x ||
      rect1.y >= rect2.y ||
      rect1.x + rect1.width <= rect2.x + rect2.width ||
      rect1.y + rect1.height <= rect2.y + rect2.height
    );
  }

  public static getMaxX(rect: RectLike): number {
    return rect.x + rect.width;
  }

  public static getMidX(rect: RectLike): number {
    return rect.x + rect.width / 2.0;
  }

  public static getMinX(rect: RectLike): number {
    return rect.x;
  }

  public static getMaxY(rect: RectLike): number {
    return rect.y + rect.height;
  }

  public static getMidY(rect: RectLike): number {
    return rect.y + rect.height / 2.0;
  }

  public static getMinY(rect: RectLike): number {
    return rect.y;
  }

  public static containsPoint(rect: RectLike, point: PointLike): boolean {
    return (
      point.x >= Rect.getMinX(rect) &&
      point.x <= Rect.getMaxX(rect) &&
      point.y >= Rect.getMinY(rect) &&
      point.y <= Rect.getMaxY(rect)
    );
  }

  public static intersects(ra: RectLike, rb: RectLike): boolean {
    const maxax = ra.x + ra.width;
    const maxay = ra.y + ra.height;
    const maxbx = rb.x + rb.width;
    const maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
  }

  public static overlaps(rectA: RectLike, rectB: RectLike): boolean {
    return !(
      rectA.x + rectA.width < rectB.x ||
      rectB.x + rectB.width < rectA.x ||
      rectA.y + rectA.height < rectB.y ||
      rectB.y + rectB.height < rectA.y
    );
  }

  public static union(rectA: RectLike, rectB: RectLike): Rect {
    const r = new Rect(0, 0, 0, 0);
    r.x = Math.min(rectA.x, rectB.x);
    r.y = Math.min(rectA.y, rectB.y);
    r.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - r.x;
    r.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - r.y;
    return r;
  }

  public static intersection(rectA: RectLike, rectB: RectLike): Rect {
    const intersection = new Rect(
      Math.max(Rect.getMinX(rectA), Rect.getMinX(rectB)),
      Math.max(Rect.getMinY(rectA), Rect.getMinY(rectB)),
      0,
      0
    );
    intersection.width =
      Math.min(Rect.getMaxX(rectA), Rect.getMaxX(rectB)) - Rect.getMinX(intersection);
    intersection.height =
      Math.min(Rect.getMaxY(rectA), Rect.getMaxY(rectB)) - Rect.getMinY(intersection);
    return intersection;
  }

  public static isLike(value: unknown): value is RectLike {
    return Point.isLike(value) && Size.isLike(value);
  }
}

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

import type { PointLike, RectLike } from "./types";

export class Rect implements RectLike {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor();
  constructor(rect: RectLike);
  constructor(x: number, y: number, width: number, height: number);
  constructor(xOrRect: number | RectLike = 0, y = 0, width = 0, height = 0) {
    if (Rect.isLike(xOrRect)) {
      this.x = xOrRect.x;
      this.y = xOrRect.y;
      this.width = xOrRect.width;
      this.height = xOrRect.height;
    } else {
      this.x = xOrRect;
      this.y = y;
      this.width = width;
      this.height = height;
    }
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
  set(x: number, y: number, width: number, height: number): void;
  set(xOrRect: number | RectLike, y = 0, width = 0, height = 0): void {
    if (Rect.isLike(xOrRect)) {
      this.x = xOrRect.x;
      this.y = xOrRect.y;
      this.width = xOrRect.width;
      this.height = xOrRect.height;
    } else {
      this.x = xOrRect;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }

  static equalTo(
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

  static equalToZero(r: RectLike | null | undefined): boolean {
    return r != null && r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0;
  }

  static contains(rect1: RectLike | null | undefined, rect2: RectLike | null | undefined): boolean {
    if (!rect1 || !rect2) return false;
    return !(
      rect1.x >= rect2.x ||
      rect1.y >= rect2.y ||
      rect1.x + rect1.width <= rect2.x + rect2.width ||
      rect1.y + rect1.height <= rect2.y + rect2.height
    );
  }

  static getMaxX(rect: RectLike): number {
    return rect.x + rect.width;
  }

  static getMidX(rect: RectLike): number {
    return rect.x + rect.width / 2.0;
  }

  static getMinX(rect: RectLike): number {
    return rect.x;
  }

  static getMaxY(rect: RectLike): number {
    return rect.y + rect.height;
  }

  static getMidY(rect: RectLike): number {
    return rect.y + rect.height / 2.0;
  }

  static getMinY(rect: RectLike): number {
    return rect.y;
  }

  static containsPoint(rect: RectLike, point: PointLike): boolean {
    return (
      point.x >= Rect.getMinX(rect) &&
      point.x <= Rect.getMaxX(rect) &&
      point.y >= Rect.getMinY(rect) &&
      point.y <= Rect.getMaxY(rect)
    );
  }

  static intersects(ra: RectLike, rb: RectLike): boolean {
    const maxax = ra.x + ra.width;
    const maxay = ra.y + ra.height;
    const maxbx = rb.x + rb.width;
    const maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
  }

  static overlaps(rectA: RectLike, rectB: RectLike): boolean {
    return !(
      rectA.x + rectA.width < rectB.x ||
      rectB.x + rectB.width < rectA.x ||
      rectA.y + rectA.height < rectB.y ||
      rectB.y + rectB.height < rectA.y
    );
  }

  static union(rectA: RectLike, rectB: RectLike): Rect {
    const r = new Rect(0, 0, 0, 0);
    r.x = Math.min(rectA.x, rectB.x);
    r.y = Math.min(rectA.y, rectB.y);
    r.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - r.x;
    r.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - r.y;
    return r;
  }

  static intersection(rectA: RectLike, rectB: RectLike): Rect {
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

  static isLike(value: unknown): value is RectLike {
    return (
      value != null &&
      typeof (value as RectLike).x === "number" &&
      typeof (value as RectLike).y === "number" &&
      typeof (value as RectLike).width === "number" &&
      typeof (value as RectLike).height === "number"
    );
  }
}

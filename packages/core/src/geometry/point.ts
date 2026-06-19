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

import type { PointLike, SizeLike } from "./types";

export default class Point implements PointLike {
  private static EPSILON = parseFloat("1.192092896e-07F");
  #data: number[];

  constructor();
  constructor(point: PointLike);
  constructor(x: number, y: number);
  constructor(xOrPoint: number | PointLike = 0, y = 0) {
    this.#data = [0, 0];
    if (Point.isLike(xOrPoint)) {
      this.#initFromPoint(xOrPoint);
    } else {
      this.#initFromNumber(xOrPoint, y);
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

  clone(): Point {
    return new Point(this);
  }

  set(point: PointLike): void;
  set(x: number, y: number): void;
  set(xOrPoint: number | PointLike, y = 0): void {
    if (Point.isLike(xOrPoint)) {
      this.#initFromPoint(xOrPoint);
    } else {
      this.#initFromNumber(xOrPoint, y);
    }
  }

  #initFromNumber(x: number, y: number): void {
    this.#data[0] = x;
    this.#data[1] = y;
  }

  #initFromPoint(point: PointLike): void {
    this.#initFromNumber(point.x, point.y);
  }

  public static equalTo(
    point1: PointLike | null | undefined,
    point2: PointLike | null | undefined
  ): boolean {
    return !!point1 && !!point2 && point1.x === point2.x && point1.y === point2.y;
  }

  public static neg(point: PointLike): Point {
    return new Point(-point.x, -point.y);
  }

  public static add(v1: PointLike, v2: PointLike): Point {
    return new Point(v1.x + v2.x, v1.y + v2.y);
  }

  public static sub(v1: PointLike, v2: PointLike): Point {
    return new Point(v1.x - v2.x, v1.y - v2.y);
  }

  public static mult(point: PointLike, floatVar: number): Point {
    return new Point(point.x * floatVar, point.y * floatVar);
  }

  public static midpoint(v1: PointLike, v2: PointLike): Point {
    return Point.mult(Point.add(v1, v2), 0.5);
  }

  public static dot(v1: PointLike, v2: PointLike): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  public static cross(v1: PointLike, v2: PointLike): number {
    return v1.x * v2.y - v1.y * v2.x;
  }

  public static perp(point: PointLike): Point {
    return new Point(-point.y, point.x);
  }

  public static rPerp(point: PointLike): Point {
    return new Point(point.y, -point.x);
  }

  public static project(v1: PointLike, v2: PointLike): Point {
    return Point.mult(v2, Point.dot(v1, v2) / Point.dot(v2, v2));
  }

  public static rotate(v1: PointLike, v2: PointLike): Point {
    return new Point(v1.x * v2.x - v1.y * v2.y, v1.x * v2.y + v1.y * v2.x);
  }

  public static unrotate(v1: PointLike, v2: PointLike): Point {
    return new Point(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
  }

  public static vectorLengthSQ(v: PointLike): number {
    return Point.dot(v, v);
  }

  public static distanceSQ(point1: PointLike, point2: PointLike): number {
    return Point.vectorLengthSQ(Point.sub(point1, point2));
  }

  public static vectorLength(v: PointLike): number {
    return Math.sqrt(Point.vectorLengthSQ(v));
  }

  public static distance(v1: PointLike, v2: PointLike): number {
    return Point.vectorLength(Point.sub(v1, v2));
  }

  public static normalize(v: PointLike): Point {
    const n = Point.vectorLength(v);
    return n === 0 ? new Point(v) : Point.mult(v, 1.0 / n);
  }

  public static forAngle(a: number): Point {
    return new Point(Math.cos(a), Math.sin(a));
  }

  public static toAngle(v: PointLike): number {
    return Math.atan2(v.y, v.x);
  }

  public static clampf(value: number, minInclusive: number, maxInclusive: number): number {
    if (minInclusive > maxInclusive) {
      const temp = minInclusive;
      minInclusive = maxInclusive;
      maxInclusive = temp;
    }
    return value < minInclusive ? minInclusive : value < maxInclusive ? value : maxInclusive;
  }

  public static clamp(pt: PointLike, minInclusive: PointLike, maxInclusive: PointLike): Point {
    return new Point(
      Point.clampf(pt.x, minInclusive.x, maxInclusive.x),
      Point.clampf(pt.y, minInclusive.y, maxInclusive.y)
    );
  }

  public static fromSize(size: SizeLike): Point {
    return new Point(size.width, size.height);
  }

  public static compOp(pt: PointLike, opFunc: (value: number) => number): Point {
    return new Point(opFunc(pt.x), opFunc(pt.y));
  }

  public static lerp(a: PointLike, b: PointLike, alpha: number): Point {
    return Point.add(Point.mult(a, 1 - alpha), Point.mult(b, alpha));
  }

  public static fuzzyEqual(a: PointLike, b: PointLike, variance: number): boolean {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
      if (a.y - variance <= b.y && b.y <= a.y + variance) return true;
    }
    return false;
  }

  public static compMult(a: PointLike, b: PointLike): Point {
    return new Point(a.x * b.x, a.y * b.y);
  }

  public static angleSigned(a: PointLike, b: PointLike): number {
    const a2 = Point.normalize(a);
    const b2 = Point.normalize(b);
    const angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, Point.dot(a2, b2));
    if (Math.abs(angle) < Point.EPSILON) return 0.0;
    return angle;
  }

  public static angle(a: PointLike, b: PointLike): number {
    const angle = Math.acos(Point.dot(Point.normalize(a), Point.normalize(b)));
    if (Math.abs(angle) < Point.EPSILON) return 0.0;
    return angle;
  }

  public static rotateByAngle(v: PointLike, pivot: PointLike, angle: number): Point {
    const r = Point.sub(v, pivot);
    const cosa = Math.cos(angle);
    const sina = Math.sin(angle);
    const t = r.x;
    r.x = t * cosa - r.y * sina + pivot.x;
    r.y = t * sina + r.y * cosa + pivot.y;
    return r;
  }

  public static lineIntersect(
    A: PointLike,
    B: PointLike,
    C: PointLike,
    D: PointLike,
    retP: PointLike
  ): boolean {
    if ((A.x === B.x && A.y === B.y) || (C.x === D.x && C.y === D.y)) {
      return false;
    }
    const BAx = B.x - A.x;
    const BAy = B.y - A.y;
    const DCx = D.x - C.x;
    const DCy = D.y - C.y;
    const ACx = A.x - C.x;
    const ACy = A.y - C.y;
    const denom = DCy * BAx - DCx * BAy;
    retP.x = DCx * ACy - DCy * ACx;
    retP.y = BAx * ACy - BAy * ACx;
    if (denom === 0) {
      if (retP.x === 0 || retP.y === 0) return true;
      return false;
    }
    retP.x = retP.x / denom;
    retP.y = retP.y / denom;
    return true;
  }

  public static segmentIntersect(A: PointLike, B: PointLike, C: PointLike, D: PointLike): boolean {
    const retP = new Point(0, 0);
    if (Point.lineIntersect(A, B, C, D, retP)) {
      if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0) return true;
    }
    return false;
  }

  public static intersectPoint(A: PointLike, B: PointLike, C: PointLike, D: PointLike): Point {
    const retP = new Point(0, 0);
    if (Point.lineIntersect(A, B, C, D, retP)) {
      const p = new Point(0, 0);
      p.x = A.x + retP.x * (B.x - A.x);
      p.y = A.y + retP.x * (B.y - A.y);
      return p;
    }
    return new Point(0, 0);
  }

  public static sameAs(A: PointLike | null | undefined, B: PointLike | null | undefined): boolean {
    if (A != null && B != null) {
      return A.x === B.x && A.y === B.y;
    }
    return false;
  }

  public static zeroIn(v: PointLike): void {
    v.x = 0;
    v.y = 0;
  }

  public static copyIn(v1: PointLike, v2: PointLike): void {
    v1.x = v2.x;
    v1.y = v2.y;
  }

  public static multIn(point: PointLike, floatVar: number): void {
    point.x *= floatVar;
    point.y *= floatVar;
  }

  public static subIn(v1: PointLike, v2: PointLike): void {
    v1.x -= v2.x;
    v1.y -= v2.y;
  }

  public static addIn(v1: PointLike, v2: PointLike): void {
    v1.x += v2.x;
    v1.y += v2.y;
  }

  public static normalizeIn(v: PointLike): void {
    const n = Math.sqrt(v.x * v.x + v.y * v.y);
    if (n !== 0) Point.multIn(v, 1.0 / n);
  }

  public static isLike(value: unknown): value is PointLike {
    return (
      value != null &&
      typeof (value as PointLike).x === "number" &&
      typeof (value as PointLike).y === "number"
    );
  }
}

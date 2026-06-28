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

import { isNumber, isObject, isUndefined } from "../boot/utils";
import Point from "./point";
import Rect from "./rect";
import Size from "./size";
import type { AffineTransformLike, PointLike, RectLike, SizeLike } from "./types";

/**
 * AffineTransform represents an affine transform matrix composed of translation, rotation, and scale.
 */
export default class AffineTransform implements AffineTransformLike {
  #data: number[];

  constructor(transform: AffineTransformLike);
  constructor(a: number, b: number, c: number, d: number, tx: number, ty: number);
  constructor(
    transformOrA: AffineTransformLike | number,
    b = 0,
    c = 0,
    d = 0,
    tx = 0,
    ty = 0
  ) {
    this.#data = [0, 0, 0, 0, 0, 0];
    if (AffineTransform.isLike(transformOrA)) {
      this.#initFromTransform(transformOrA);
    } else {
      this.#initFromNumber(transformOrA, b, c, d, tx, ty);
    }
  }

  get a(): number {
    return this.#data[0];
  }

  set a(value: number) {
    this.#data[0] = value;
  }

  get b(): number {
    return this.#data[1];
  }

  set b(value: number) {
    this.#data[1] = value;
  }

  get c(): number {
    return this.#data[2];
  }

  set c(value: number) {
    this.#data[2] = value;
  }

  get d(): number {
    return this.#data[3];
  }

  set d(value: number) {
    this.#data[3] = value;
  }

  get tx(): number {
    return this.#data[4];
  }

  set tx(value: number) {
    this.#data[4] = value;
  }

  get ty(): number {
    return this.#data[5];
  }

  set ty(value: number) {
    this.#data[5] = value;
  }

  clone(): AffineTransform {
    return new AffineTransform(this);
  }

  set(transform: AffineTransformLike): void;
  set(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
  set(
    transformOrA: AffineTransformLike | number,
    b = 0,
    c = 0,
    d = 0,
    tx = 0,
    ty = 0
  ): void {
    if (AffineTransform.isLike(transformOrA)) {
      this.#initFromTransform(transformOrA);
    } else {
      this.#initFromNumber(transformOrA, b, c, d, tx, ty);
    }
  }

  #initFromNumber(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
    this.#data[0] = a;
    this.#data[1] = b;
    this.#data[2] = c;
    this.#data[3] = d;
    this.#data[4] = tx;
    this.#data[5] = ty;
  }

  #initFromTransform(transform: AffineTransformLike): void {
    this.#initFromNumber(
      transform.a,
      transform.b,
      transform.c,
      transform.d,
      transform.tx,
      transform.ty
    );
  }

  /** Create an AffineTransform with all matrix values. */
  public static make(a: number, b: number, c: number, d: number, tx: number, ty: number): AffineTransform {
    return new AffineTransform(a, b, c, d, tx, ty);
  }

  /** Create an identity transformation matrix. */
  public static makeIdentity(): AffineTransform {
    return new AffineTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
  }

  /** Apply the affine transformation on a point. */
  public static applyToPoint(point: PointLike, t: AffineTransformLike): Point;
  public static applyToPoint(x: number, y: number, t: AffineTransformLike): Point;
  public static applyToPoint(
    pointOrX: PointLike | number,
    transOrY: AffineTransformLike | number,
    t?: AffineTransformLike
  ): Point {
    let x: number;
    let y: number;
    let transform: AffineTransformLike;

    if (isUndefined(t)) {
      if (!Point.isLike(pointOrX) || !AffineTransform.isLike(transOrY)) {
        throw new TypeError("Invalid AffineTransform.applyToPoint arguments");
      }
      transform = transOrY;
      x = pointOrX.x;
      y = pointOrX.y;
    } else {
      if (!isNumber(pointOrX) || !isNumber(transOrY)) {
        throw new TypeError("Invalid AffineTransform.applyToPoint arguments");
      }
      transform = t;
      x = pointOrX;
      y = transOrY;
    }

    return new Point(
      transform.a * x + transform.c * y + transform.tx,
      transform.b * x + transform.d * y + transform.ty
    );
  }

  /** Apply the affine transformation on a size. */
  public static applyToSize(size: SizeLike, t: AffineTransformLike): Size {
    return new Size(
      t.a * size.width + t.c * size.height,
      t.b * size.width + t.d * size.height
    );
  }

  /** Apply the affine transformation on a rect. */
  public static applyToRect(r: RectLike, anAffineTransform: AffineTransformLike): Rect {
    const top = Rect.getMinY(r);
    const left = Rect.getMinX(r);
    const right = Rect.getMaxX(r);
    const bottom = Rect.getMaxY(r);

    const topLeft = AffineTransform.applyToPoint(left, top, anAffineTransform);
    const topRight = AffineTransform.applyToPoint(right, top, anAffineTransform);
    const bottomLeft = AffineTransform.applyToPoint(left, bottom, anAffineTransform);
    const bottomRight = AffineTransform.applyToPoint(right, bottom, anAffineTransform);

    const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  /** Apply the affine transformation on a rect, mutating it in-place. */
  public static _applyToRectIn<T extends RectLike>(r: T, anAffineTransform: AffineTransformLike): T {
    const top = Rect.getMinY(r);
    const left = Rect.getMinX(r);
    const right = Rect.getMaxX(r);
    const bottom = Rect.getMaxY(r);

    const topLeft = AffineTransform.applyToPoint(left, top, anAffineTransform);
    const topRight = AffineTransform.applyToPoint(right, top, anAffineTransform);
    const bottomLeft = AffineTransform.applyToPoint(left, bottom, anAffineTransform);
    const bottomRight = AffineTransform.applyToPoint(right, bottom, anAffineTransform);

    const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    r.x = minX;
    r.y = minY;
    r.width = maxX - minX;
    r.height = maxY - minY;
    return r;
  }

  /** Create a new transform with a translation applied. */
  public static translate(t: AffineTransformLike, tx: number, ty: number): AffineTransform {
    return new AffineTransform(
      t.a,
      t.b,
      t.c,
      t.d,
      t.tx + t.a * tx + t.c * ty,
      t.ty + t.b * tx + t.d * ty
    );
  }

  /** Create a new transform with a scale applied. */
  public static scale(t: AffineTransformLike, sx: number, sy: number): AffineTransform {
    return new AffineTransform(t.a * sx, t.b * sx, t.c * sy, t.d * sy, t.tx, t.ty);
  }

  /** Create a new transform with a rotation applied. */
  public static rotate(aTransform: AffineTransformLike, anAngle: number): AffineTransform {
    const fSin = Math.sin(anAngle);
    const fCos = Math.cos(anAngle);
    return new AffineTransform(
      aTransform.a * fCos + aTransform.c * fSin,
      aTransform.b * fCos + aTransform.d * fSin,
      aTransform.c * fCos - aTransform.a * fSin,
      aTransform.d * fCos - aTransform.b * fSin,
      aTransform.tx,
      aTransform.ty
    );
  }

  /** Concatenate two transforms: t' = t1 * t2. */
  public static concat(t1: AffineTransformLike, t2: AffineTransformLike): AffineTransform {
    return new AffineTransform(
      t1.a * t2.a + t1.b * t2.c,
      t1.a * t2.b + t1.b * t2.d,
      t1.c * t2.a + t1.d * t2.c,
      t1.c * t2.b + t1.d * t2.d,
      t1.tx * t2.a + t1.ty * t2.c + t2.tx,
      t1.tx * t2.b + t1.ty * t2.d + t2.ty
    );
  }

  /** Concatenate t2 into t1 in-place: t1 = t1 * t2. */
  public static concatIn<T extends AffineTransformLike>(t1: T, t2: AffineTransformLike): T {
    const a = t1.a;
    const b = t1.b;
    const c = t1.c;
    const d = t1.d;
    const tx = t1.tx;
    const ty = t1.ty;
    t1.a = a * t2.a + b * t2.c;
    t1.b = a * t2.b + b * t2.d;
    t1.c = c * t2.a + d * t2.c;
    t1.d = c * t2.b + d * t2.d;
    t1.tx = tx * t2.a + ty * t2.c + t2.tx;
    t1.ty = tx * t2.b + ty * t2.d + t2.ty;
    return t1;
  }

  /** Check whether two transforms are equal. */
  public static equalTo(t1: AffineTransformLike, t2: AffineTransformLike): boolean {
    return (
      t1.a === t2.a &&
      t1.b === t2.b &&
      t1.c === t2.c &&
      t1.d === t2.d &&
      t1.tx === t2.tx &&
      t1.ty === t2.ty
    );
  }

  /** Return the invert of a transform. */
  public static invert(t: AffineTransformLike): AffineTransform {
    const determinant = 1 / (t.a * t.d - t.b * t.c);
    return new AffineTransform(
      determinant * t.d,
      -determinant * t.b,
      -determinant * t.c,
      determinant * t.a,
      determinant * (t.c * t.ty - t.d * t.tx),
      determinant * (t.b * t.tx - t.a * t.ty)
    );
  }

  /** Write the invert of t into out. */
  public static invertOut<T extends AffineTransformLike>(t: AffineTransformLike, out: T): void {
    const a = t.a;
    const b = t.b;
    const c = t.c;
    const d = t.d;
    const determinant = 1 / (a * d - b * c);
    out.a = determinant * d;
    out.b = -determinant * b;
    out.c = -determinant * c;
    out.d = determinant * a;
    out.tx = determinant * (c * t.ty - d * t.tx);
    out.ty = determinant * (b * t.tx - a * t.ty);
  }

  public static isLike(value: unknown): value is AffineTransformLike {
    if (!isObject(value)) {
      return false;
    }

    const transform = value as unknown as AffineTransformLike;

    return (
      isNumber(transform.a) &&
      isNumber(transform.b) &&
      isNumber(transform.c) &&
      isNumber(transform.d) &&
      isNumber(transform.tx) &&
      isNumber(transform.ty)
    );
  }
}

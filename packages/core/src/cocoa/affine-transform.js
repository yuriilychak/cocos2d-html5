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

import { Rect } from "./geometry/rect";

/**
 * AffineTransform represents an affine transform matrix composed of translation, rotation, and scale.
 */
export class AffineTransform {
  constructor(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  /** Create an AffineTransform with all matrix values. */
  static make(a, b, c, d, tx, ty) {
    return new AffineTransform(a, b, c, d, tx, ty);
  }

  /** Create an identity transformation matrix. */
  static makeIdentity() {
    return new AffineTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
  }

  /** Apply the affine transformation on a point. */
  static applyToPoint(point, transOrY, t) {
    var x, y;
    if (t === undefined) {
      t = transOrY;
      x = point.x;
      y = point.y;
    } else {
      x = point;
      y = transOrY;
    }
    return { x: t.a * x + t.c * y + t.tx, y: t.b * x + t.d * y + t.ty };
  }

  /** Apply the affine transformation on a point (x, y form). */
  static _applyToPoint(x, y, t) {
    return AffineTransform.applyToPoint(x, y, t);
  }

  /** Apply the affine transformation on a size. */
  static applyToSize(size, t) {
    return {
      width: t.a * size.width + t.c * size.height,
      height: t.b * size.width + t.d * size.height
    };
  }

  /** Apply the affine transformation on a rect. */
  static applyToRect(r, anAffineTransform) {
    var top = Rect.getMinY(r);
    var left = Rect.getMinX(r);
    var right = Rect.getMaxX(r);
    var bottom = Rect.getMaxY(r);

    var topLeft = AffineTransform.applyToPoint(left, top, anAffineTransform);
    var topRight = AffineTransform.applyToPoint(right, top, anAffineTransform);
    var bottomLeft = AffineTransform.applyToPoint(
      left,
      bottom,
      anAffineTransform
    );
    var bottomRight = AffineTransform.applyToPoint(
      right,
      bottom,
      anAffineTransform
    );

    var minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    var maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  /** Apply the affine transformation on a rect, mutating it in-place. */
  static _applyToRectIn(r, anAffineTransform) {
    var top = Rect.getMinY(r);
    var left = Rect.getMinX(r);
    var right = Rect.getMaxX(r);
    var bottom = Rect.getMaxY(r);

    var topLeft = AffineTransform.applyToPoint(left, top, anAffineTransform);
    var topRight = AffineTransform.applyToPoint(right, top, anAffineTransform);
    var bottomLeft = AffineTransform.applyToPoint(
      left,
      bottom,
      anAffineTransform
    );
    var bottomRight = AffineTransform.applyToPoint(
      right,
      bottom,
      anAffineTransform
    );

    var minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    var maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    r.x = minX;
    r.y = minY;
    r.width = maxX - minX;
    r.height = maxY - minY;
    return r;
  }

  /** Create a new transform with a translation applied. */
  static translate(t, tx, ty) {
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
  static scale(t, sx, sy) {
    return new AffineTransform(
      t.a * sx,
      t.b * sx,
      t.c * sy,
      t.d * sy,
      t.tx,
      t.ty
    );
  }

  /** Create a new transform with a rotation applied. */
  static rotate(aTransform, anAngle) {
    var fSin = Math.sin(anAngle);
    var fCos = Math.cos(anAngle);
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
  static concat(t1, t2) {
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
  static concatIn(t1, t2) {
    var a = t1.a,
      b = t1.b,
      c = t1.c,
      d = t1.d,
      tx = t1.tx,
      ty = t1.ty;
    t1.a = a * t2.a + b * t2.c;
    t1.b = a * t2.b + b * t2.d;
    t1.c = c * t2.a + d * t2.c;
    t1.d = c * t2.b + d * t2.d;
    t1.tx = tx * t2.a + ty * t2.c + t2.tx;
    t1.ty = tx * t2.b + ty * t2.d + t2.ty;
    return t1;
  }

  /** Check whether two transforms are equal. */
  static equalTo(t1, t2) {
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
  static invert(t) {
    var determinant = 1 / (t.a * t.d - t.b * t.c);
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
  static invertOut(t, out) {
    var a = t.a,
      b = t.b,
      c = t.c,
      d = t.d;
    var determinant = 1 / (a * d - b * c);
    out.a = determinant * d;
    out.b = -determinant * b;
    out.c = -determinant * c;
    out.d = determinant * a;
    out.tx = determinant * (c * t.ty - d * t.tx);
    out.ty = determinant * (b * t.tx - a * t.ty);
  }
}


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

const POINT_EPSILON = parseFloat("1.192092896e-07F");

/**
 * Point is the class for point object.
 * @param {Number|Point} [x=0]
 * @param {Number} [y=0]
 */
export class Point {
  constructor(x, y) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
    } else if (y === undefined) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  /**
   * Check whether a point's value equals to another
   * @param {Point} point1
   * @param {Point} point2
   * @return {Boolean}
   */
  static equalTo(point1, point2) {
    return point1 && point2 && point1.x === point2.x && point1.y === point2.y;
  }

  // ─── Vector math ────────────────────────────────────────────────────────────

  /** Returns opposite of point. */
  static neg(point) {
    return new Point(-point.x, -point.y);
  }

  /** Calculates sum of two points. */
  static add(v1, v2) {
    return new Point(v1.x + v2.x, v1.y + v2.y);
  }

  /** Calculates difference of two points. */
  static sub(v1, v2) {
    return new Point(v1.x - v2.x, v1.y - v2.y);
  }

  /** Returns point multiplied by given factor. */
  static mult(point, floatVar) {
    return new Point(point.x * floatVar, point.y * floatVar);
  }

  /** Calculates midpoint between two points. */
  static midpoint(v1, v2) {
    return Point.mult(Point.add(v1, v2), 0.5);
  }

  /** Calculates dot product of two points. */
  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  /** Calculates cross product of two points. */
  static cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  /** Calculates perpendicular of v, rotated 90 degrees counter-clockwise. */
  static perp(point) {
    return new Point(-point.y, point.x);
  }

  /** Calculates perpendicular of v, rotated 90 degrees clockwise. */
  static rPerp(point) {
    return new Point(point.y, -point.x);
  }

  /** Calculates the projection of v1 over v2. */
  static project(v1, v2) {
    return Point.mult(v2, Point.dot(v1, v2) / Point.dot(v2, v2));
  }

  /** Rotates two points. */
  static rotate(v1, v2) {
    return new Point(v1.x * v2.x - v1.y * v2.y, v1.x * v2.y + v1.y * v2.x);
  }

  /** Unrotates two points. */
  static unrotate(v1, v2) {
    return new Point(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
  }

  /** Calculates the square length of a Point (without sqrt). */
  static lengthSQ(v) {
    return Point.dot(v, v);
  }

  /** Calculates the square distance between two points (without sqrt). */
  static distanceSQ(point1, point2) {
    return Point.lengthSQ(Point.sub(point1, point2));
  }

  /** Calculates distance between point and origin. */
  static length(v) {
    return Math.sqrt(Point.lengthSQ(v));
  }

  /** Calculates the distance between two points. */
  static distance(v1, v2) {
    return Point.length(Point.sub(v1, v2));
  }

  /** Returns point multiplied to a length of 1. */
  static normalize(v) {
    var n = Point.length(v);
    return n === 0 ? new Point(v) : Point.mult(v, 1.0 / n);
  }

  /** Converts radians to a normalized vector. */
  static forAngle(a) {
    return new Point(Math.cos(a), Math.sin(a));
  }

  /** Converts a vector to radians. */
  static toAngle(v) {
    return Math.atan2(v.y, v.x);
  }

  // ─── Clamp ──────────────────────────────────────────────────────────────────

  /** Clamp a value between min and max. */
  static clampf(value, min_inclusive, max_inclusive) {
    if (min_inclusive > max_inclusive) {
      var temp = min_inclusive;
      min_inclusive = max_inclusive;
      max_inclusive = temp;
    }
    return value < min_inclusive
      ? min_inclusive
      : value < max_inclusive
        ? value
        : max_inclusive;
  }

  /** Clamp a point between min and max points. */
  static clamp(pt, min_inclusive, max_inclusive) {
    return new Point(
      Point.clampf(pt.x, min_inclusive.x, max_inclusive.x),
      Point.clampf(pt.y, min_inclusive.y, max_inclusive.y)
    );
  }

  // ─── Conversions & misc ─────────────────────────────────────────────────────

  /** Quickly convert Size to a Point. */
  static fromSize(s) {
    return new Point(s.width, s.height);
  }

  /** Run a math operation function on each point component. */
  static compOp(pt, opFunc) {
    return new Point(opFunc(pt.x), opFunc(pt.y));
  }

  /** Linear Interpolation between two points a and b. */
  static lerp(a, b, alpha) {
    return Point.add(Point.mult(a, 1 - alpha), Point.mult(b, alpha));
  }

  /** Returns true if points are equal within a given variance. */
  static fuzzyEqual(a, b, variance) {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
      if (a.y - variance <= b.y && b.y <= a.y + variance) return true;
    }
    return false;
  }

  /** Multiplies components: a.x*b.x, a.y*b.y. */
  static compMult(a, b) {
    return new Point(a.x * b.x, a.y * b.y);
  }

  /** Returns the signed angle in radians between two vector directions. */
  static angleSigned(a, b) {
    var a2 = Point.normalize(a);
    var b2 = Point.normalize(b);
    var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, Point.dot(a2, b2));
    if (Math.abs(angle) < POINT_EPSILON) return 0.0;
    return angle;
  }

  /** Returns the angle in radians between two vector directions. */
  static angle(a, b) {
    var angle = Math.acos(Point.dot(Point.normalize(a), Point.normalize(b)));
    if (Math.abs(angle) < POINT_EPSILON) return 0.0;
    return angle;
  }

  /** Rotates a point counter clockwise by the angle around a pivot. */
  static rotateByAngle(v, pivot, angle) {
    var r = Point.sub(v, pivot);
    var cosa = Math.cos(angle),
      sina = Math.sin(angle);
    var t = r.x;
    r.x = t * cosa - r.y * sina + pivot.x;
    r.y = t * sina + r.y * cosa + pivot.y;
    return r;
  }

  /**
   * General line-line intersection test.
   * @param {Point} A startpoint of line P1
   * @param {Point} B endpoint of line P1
   * @param {Point} C startpoint of line P2
   * @param {Point} D endpoint of line P2
   * @param {Point} retP output: retP.x = s, retP.y = t
   * @return {Boolean}
   */
  static lineIntersect(A, B, C, D, retP) {
    if ((A.x === B.x && A.y === B.y) || (C.x === D.x && C.y === D.y)) {
      return false;
    }
    var BAx = B.x - A.x,
      BAy = B.y - A.y;
    var DCx = D.x - C.x,
      DCy = D.y - C.y;
    var ACx = A.x - C.x,
      ACy = A.y - C.y;
    var denom = DCy * BAx - DCx * BAy;
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

  /** Returns true if segment A-B intersects with segment C-D. */
  static segmentIntersect(A, B, C, D) {
    var retP = new Point(0, 0);
    if (Point.lineIntersect(A, B, C, D, retP))
      if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0)
        return true;
    return false;
  }

  /** Returns the intersection point of line A-B, C-D. */
  static intersectPoint(A, B, C, D) {
    var retP = new Point(0, 0);
    if (Point.lineIntersect(A, B, C, D, retP)) {
      var P = new Point(0, 0);
      P.x = A.x + retP.x * (B.x - A.x);
      P.y = A.y + retP.x * (B.y - A.y);
      return P;
    }
    return new Point(0, 0);
  }

  /** Check whether two points are equal. */
  static sameAs(A, B) {
    if (A != null && B != null) {
      return A.x === B.x && A.y === B.y;
    }
    return false;
  }

  // ─── In-place (high performance) ────────────────────────────────────────────

  /** Sets the position of the point to 0 (in-place). */
  static zeroIn(v) {
    v.x = 0;
    v.y = 0;
  }

  /** Copies the position of one point to another (in-place). */
  static copyIn(v1, v2) {
    v1.x = v2.x;
    v1.y = v2.y;
  }

  /** Multiplies the point with the given factor (in-place). */
  static multIn(point, floatVar) {
    point.x *= floatVar;
    point.y *= floatVar;
  }

  /** Subtracts one point from another (in-place). */
  static subIn(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
  }

  /** Adds one point to another (in-place). */
  static addIn(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
  }

  /** Normalizes the point (in-place). */
  static normalizeIn(v) {
    var n = Math.sqrt(v.x * v.x + v.y * v.y);
    if (n !== 0) Point.multIn(v, 1.0 / n);
  }
}

/**
 * Check whether a point's value equals to another
 * @function
 * @param {Point} point1
 * @param {Point} point2
 * @return {Boolean}
 */
export function pointEqualToPoint(point1, point2) {
  return point1 && point2 && point1.x === point2.x && point1.y === point2.y;
}

import { Point } from "@aspect/core";

/**
 * @function
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} t
 * @return {Number}
 */
export function bezierAt(a, b, c, d, t) {
  return (
    Math.pow(1 - t, 3) * a +
    3 * t * Math.pow(1 - t, 2) * b +
    3 * Math.pow(t, 2) * (1 - t) * c +
    Math.pow(t, 3) * d
  );
}

/**
 * @param {Number} time1
 * @return {Number}
 */
export function bounceTime(time1) {
  if (time1 < 1 / 2.75) {
    return 7.5625 * time1 * time1;
  } else if (time1 < 2 / 2.75) {
    time1 -= 1.5 / 2.75;
    return 7.5625 * time1 * time1 + 0.75;
  } else if (time1 < 2.5 / 2.75) {
    time1 -= 2.25 / 2.75;
    return 7.5625 * time1 * time1 + 0.9375;
  }

  time1 -= 2.625 / 2.75;
  return 7.5625 * time1 * time1 + 0.984375;
}

/**
 * Returns the Cardinal Spline position for a given set of control points, tension and time.
 *
 * @function
 * @param {Point} p0
 * @param {Point} p1
 * @param {Point} p2
 * @param {Point} p3
 * @param {Number} tension
 * @param {Number} t
 * @param {Point} [out]
 * @return {Point}
 */
export function cardinalSplineAt(
  p0,
  p1,
  p2,
  p3,
  tension,
  t,
  out = new Point(0, 0)
) {
  const t2 = t * t;
  const t3 = t2 * t;

  const s = (1 - tension) / 2;

  const b1 = s * (-t3 + 2 * t2 - t);
  const b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);
  const b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);
  const b4 = s * (t3 - t2);

  out.x = p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4;
  out.y = p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4;

  return out;
}

/**
 * returns a new copy of the array reversed.
 *
 * @param {Point[]} controlPoints
 * @return {Point[]}
 */
export function reverseControlPoints(controlPoints) {
  const result = [];
  for (let i = controlPoints.length - 1; i >= 0; i--) {
    result.push(new Point(controlPoints[i].x, controlPoints[i].y));
  }
  return result;
}

/**
 * returns a new clone of the controlPoints
 *
 * @param {Point[]} controlPoints
 * @returns {Point[]}
 */
export function cloneControlPoints(controlPoints) {
  const result = [];
  for (let i = 0; i < controlPoints.length; i++)
    result.push(new Point(controlPoints[i].x, controlPoints[i].y));
  return result;
}

/**
 * returns a point from the array
 *
 * @param {Array} controlPoints
 * @param {Number} pos
 * @return {Point}
 */
export function getControlPointAt(controlPoints, pos) {
  const p = Math.min(controlPoints.length - 1, Math.max(pos, 0));
  return controlPoints[p];
}

/**
 * reverse the current control point array inline, without generating a new one
 *
 * @param {Point[]} controlPoints
 */
export function reverseControlPointsInline(controlPoints) {
  const len = controlPoints.length;
  const mid = 0 | (len / 2);
  for (let i = 0; i < mid; ++i) {
    const temp = controlPoints[i];
    controlPoints[i] = controlPoints[len - i - 1];
    controlPoints[len - i - 1] = temp;
  }
}

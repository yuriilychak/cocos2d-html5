import { Point } from "./point";

/**
 * Returns the Cardinal Spline position for a given set of control points, tension and time.
 *
 * @param {Point} p0
 * @param {Point} p1
 * @param {Point} p2
 * @param {Point} p3
 * @param {Number} tension
 * @param {Number} t
 * @param {Point} [out]
 * @return {Point}
 */
export function cardinalSplineAt(p0, p1, p2, p3, tension, t, out = new Point(0, 0)) {
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
 * Returns a point from the control points array, clamped to valid indices.
 *
 * @param {Array} controlPoints
 * @param {Number} pos
 * @return {Point}
 */
export function getControlPointAt(controlPoints, pos) {
    const p = Math.min(controlPoints.length - 1, Math.max(pos, 0));
    return controlPoints[p];
}

import { Point } from "./point";
import type { PointLike } from "./types";

export function cardinalSplineAt(
  p0: PointLike,
  p1: PointLike,
  p2: PointLike,
  p3: PointLike,
  tension: number,
  t: number,
  out: PointLike = new Point(0, 0)
): PointLike {
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

export function getControlPointAt<T extends PointLike>(controlPoints: T[], pos: number): T {
  const p = Math.min(controlPoints.length - 1, Math.max(pos, 0));
  return controlPoints[p];
}

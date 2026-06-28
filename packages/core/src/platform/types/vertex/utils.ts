/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2009      Valentin Milea

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

import { Point } from "../../../geometry";
import type { PointLike } from "../../../geometry";
import { degreesToRadians } from "../../../platform/macro/utils";
import Vertex2F from "./vertex2-f";

type VertexLineIntersectResult = {
  isSuccess: boolean;
  value: number;
};

/**
 * converts a line to a polygon
 */
export function vertexLineToPolygon(
  points: Float32Array,
  stroke: number,
  vertices: Float32Array,
  offset: number,
  nuPoints: number
): void {
  nuPoints += offset;
  if (nuPoints <= 1) return;

  stroke *= 0.5;
  let idx: number;
  const nuPointsMinus = nuPoints - 1;
  let i;
  for (i = offset; i < nuPoints; i++) {
    idx = i * 2;
    const p1 = new Point(points[i * 2], points[i * 2 + 1]);
    let perpVector: Point;

    if (i === 0)
      perpVector = Point.perp(
        Point.normalize(
          Point.sub(p1, new Point(points[(i + 1) * 2], points[(i + 1) * 2 + 1]))
        )
      );
    else if (i === nuPointsMinus)
      perpVector = Point.perp(
        Point.normalize(
          Point.sub(new Point(points[(i - 1) * 2], points[(i - 1) * 2 + 1]), p1)
        )
      );
    else {
      const p0 = new Point(points[(i - 1) * 2], points[(i - 1) * 2 + 1]);
      const p2 = new Point(points[(i + 1) * 2], points[(i + 1) * 2 + 1]);

      const p2p1 = Point.normalize(Point.sub(p2, p1));
      const p0p1 = Point.normalize(Point.sub(p0, p1));

      // Calculate angle between vectors
      const angle = Math.acos(Point.dot(p2p1, p0p1));

      if (angle < degreesToRadians(70))
        perpVector = Point.perp(Point.normalize(Point.midpoint(p2p1, p0p1)));
      else if (angle < degreesToRadians(170))
        perpVector = Point.normalize(Point.midpoint(p2p1, p0p1));
      else perpVector = Point.perp(Point.normalize(Point.sub(p2, p0)));
    }
    perpVector = Point.mult(perpVector, stroke);

    vertices[idx * 2] = p1.x + perpVector.x;
    vertices[idx * 2 + 1] = p1.y + perpVector.y;
    vertices[(idx + 1) * 2] = p1.x - perpVector.x;
    vertices[(idx + 1) * 2 + 1] = p1.y - perpVector.y;
  }

  // Validate vertexes
  offset = offset === 0 ? 0 : offset - 1;
  for (i = offset; i < nuPointsMinus; i++) {
    idx = i * 2;
    const idx1 = idx + 2;

    const v1 = new Vertex2F(vertices[idx * 2], vertices[idx * 2 + 1]);
    const v2 = new Vertex2F(
      vertices[(idx + 1) * 2],
      vertices[(idx + 1) * 2 + 1]
    );
    const v3 = new Vertex2F(vertices[idx1 * 2], vertices[idx1 * 2]);
    const v4 = new Vertex2F(
      vertices[(idx1 + 1) * 2],
      vertices[(idx1 + 1) * 2 + 1]
    );

    //BOOL fixVertex = !ccpLineIntersect(ccp(p1.x, p1.y), ccp(p4.x, p4.y), ccp(p2.x, p2.y), ccp(p3.x, p3.y), &s, &t);
    const fixVertexResult = vertexLineIntersect(
      v1.x,
      v1.y,
      v4.x,
      v4.y,
      v2.x,
      v2.y,
      v3.x,
      v3.y
    );
    if (!fixVertexResult.isSuccess)
      if (fixVertexResult.value < 0.0 || fixVertexResult.value > 1.0)
        fixVertexResult.isSuccess = true;

    if (fixVertexResult.isSuccess) {
      vertices[idx1 * 2] = v4.x;
      vertices[idx1 * 2 + 1] = v4.y;
      vertices[(idx1 + 1) * 2] = v3.x;
      vertices[(idx1 + 1) * 2 + 1] = v3.y;
    }
  }
}

/**
 * returns whether or not the line intersects
 */
export function vertexLineIntersect(
  Ax: number,
  Ay: number,
  Bx: number,
  By: number,
  Cx: number,
  Cy: number,
  Dx: number,
  Dy: number
): VertexLineIntersectResult {
  let distAB: number;
  let theCos: number;
  let theSin: number;
  let newX: number;

  // FAIL: Line undefined
  if ((Ax === Bx && Ay === By) || (Cx === Dx && Cy === Dy))
    return { isSuccess: false, value: 0 };

  //  Translate system to make A the origin
  Bx -= Ax;
  By -= Ay;
  Cx -= Ax;
  Cy -= Ay;
  Dx -= Ax;
  Dy -= Ay;

  // Length of segment AB
  distAB = Math.sqrt(Bx * Bx + By * By);

  // Rotate the system so that point B is on the positive X axis.
  theCos = Bx / distAB;
  theSin = By / distAB;
  newX = Cx * theCos + Cy * theSin;
  Cy = Cy * theCos - Cx * theSin;
  Cx = newX;
  newX = Dx * theCos + Dy * theSin;
  Dy = Dy * theCos - Dx * theSin;
  Dx = newX;

  // FAIL: Lines are parallel.
  if (Cy === Dy) return { isSuccess: false, value: 0 };

  // Discover the relative position of the intersection in the line AB
  const t = (Dx + ((Cx - Dx) * Dy) / (Dy - Cy)) / distAB;

  // Success.
  return { isSuccess: true, value: t };
}

/**
 * returns wheter or not polygon defined by vertex list is clockwise
 */
export function vertexListIsClockwise(verts: PointLike[]): boolean {
  for (let i = 0, len = verts.length; i < len; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % len];
    const c = verts[(i + 2) % len];

    if (Point.cross(Point.sub(b, a), Point.sub(c, b)) > 0) return false;
  }

  return true;
}

import { Color, Point } from "@aspect/core";
import { DrawNode } from "@aspect/shape-nodes";

const DEBUG_COLOR = new Color(0, 255, 0, 255);
const SEGMENTS = 12;

/**
 * RapierDebugNode - draws all active physics colliders each frame.
 * Add it as a child of your layer and call setWorld() to connect it.
 */
export class RapierDebugNode extends DrawNode {
  constructor() {
    super();
    this._rapierWorld = null;
  }

  setWorld(world) {
    this._rapierWorld = world;
  }

  visit(parentCmd) {
    this.clear();
    if (this._rapierWorld) {
      this._rapierWorld.forEachCollider(col => this._drawCollider(col));
    }
    super.visit(parentCmd);
  }

  _drawCollider(collider) {
    const pos = collider.translation();
    const rot = collider.rotation();
    const shape = collider.shape;
    const RAPIER = window.RAPIER;
    if (!RAPIER) return;

    const type = shape.type;
    if (type === RAPIER.ShapeType.Ball) {
      this._drawBall(pos, rot, shape.radius);
    } else if (type === RAPIER.ShapeType.Cuboid) {
      this._drawCuboid(pos, rot, shape.halfExtents);
    } else if (type === RAPIER.ShapeType.Capsule) {
      this._drawCapsule(pos, rot, shape.halfHeight, shape.radius);
    } else if (type === RAPIER.ShapeType.Segment) {
      this._drawSegment(pos, rot, shape.a, shape.b);
    } else if (type === RAPIER.ShapeType.ConvexPolygon) {
      this._drawConvexPolygon(pos, rot, shape.vertices);
    } else if (type === RAPIER.ShapeType.Triangle) {
      this._drawConvexPolygon(pos, rot, shape.vertices);
    }
  }

  _drawBall(pos, rot, radius) {
    let prevX = pos.x + radius;
    let prevY = pos.y;
    for (let i = 1; i <= SEGMENTS; i++) {
      const a = 2 * Math.PI * i / SEGMENTS;
      const x = pos.x + radius * Math.cos(a);
      const y = pos.y + radius * Math.sin(a);
      this.drawSegment(new Point(prevX, prevY), new Point(x, y), 1, DEBUG_COLOR);
      prevX = x;
      prevY = y;
    }
    this.drawSegment(
      new Point(pos.x, pos.y),
      new Point(pos.x + radius * Math.cos(rot), pos.y + radius * Math.sin(rot)),
      1, DEBUG_COLOR
    );
  }

  _drawCuboid(pos, rot, halfExtents) {
    const hw = halfExtents.x;
    const hh = halfExtents.y;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const corners = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([lx, ly]) =>
      new Point(pos.x + lx * cos - ly * sin, pos.y + lx * sin + ly * cos)
    );
    for (let i = 0; i < 4; i++) {
      this.drawSegment(corners[i], corners[(i + 1) % 4], 1, DEBUG_COLOR);
    }
  }

  _drawCapsule(pos, rot, halfHeight, radius) {
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const topX = pos.x + halfHeight * cos;
    const topY = pos.y + halfHeight * sin;
    const botX = pos.x - halfHeight * cos;
    const botY = pos.y - halfHeight * sin;
    this._drawBall({ x: topX, y: topY }, rot, radius);
    this._drawBall({ x: botX, y: botY }, rot, radius);
    const px = -sin;
    const py = cos;
    this.drawSegment(
      new Point(topX + radius * px, topY + radius * py),
      new Point(botX + radius * px, botY + radius * py),
      1, DEBUG_COLOR
    );
    this.drawSegment(
      new Point(topX - radius * px, topY - radius * py),
      new Point(botX - radius * px, botY - radius * py),
      1, DEBUG_COLOR
    );
  }

  _drawSegment(pos, rot, a, b) {
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const wa = new Point(pos.x + a.x * cos - a.y * sin, pos.y + a.x * sin + a.y * cos);
    const wb = new Point(pos.x + b.x * cos - b.y * sin, pos.y + b.x * sin + b.y * cos);
    this.drawSegment(wa, wb, 1, DEBUG_COLOR);
  }

  _drawConvexPolygon(pos, rot, vertices) {
    const n = vertices.length / 2;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const lx = vertices[2 * i];
      const ly = vertices[2 * i + 1];
      pts.push(new Point(pos.x + lx * cos - ly * sin, pos.y + lx * sin + ly * cos));
    }
    for (let i = 0; i < n; i++) {
      this.drawSegment(pts[i], pts[(i + 1) % n], 1, DEBUG_COLOR);
    }
  }
}

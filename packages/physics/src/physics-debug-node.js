import { DrawNode } from "@aspect/shape-nodes";
import { RendererConfig, color, log, lerp } from "@aspect/core";

export function convertVerts(verts) {
  var ret = [];
  for (var i = 0; i < verts.length / 2; i++) {
    ret[i] = { x: verts[i * 2], y: verts[i * 2 + 1] };
  }
  return ret;
}

export function colorForBody(body) {
  if (body.isRogue() || body.isSleeping()) {
    return color(128, 128, 128, 128);
  } else if (body.nodeIdleTime > body.space.sleepTimeThreshold) {
    return color(84, 84, 84, 128);
  } else {
    return color(255, 0, 0, 128);
  }
}

export const CONSTRAINT_COLOR = color(0, 255, 0, 128);

export function drawShape(shape, renderer) {
  var body = shape.body;
  var c = colorForBody(body);
  switch (shape.collisionCode) {
    case cp.CircleShape.prototype.collisionCode:
      this.drawDot(shape.tc, Math.max(shape.r, 1.0), c);
      this.drawSegment(shape.tc, cp.v.add(shape.tc, cp.v.mult(body.rot, shape.r)), 1.0, c);
      break;
    case cp.SegmentShape.prototype.collisionCode:
      this.drawSegment(shape.ta, shape.tb, Math.max(shape.r, 2.0), c);
      break;
    case cp.PolyShape.prototype.collisionCode:
      var line = color(c.r, c.g, c.b, lerp(c.a, 255, 0.5));
      this.drawPoly(convertVerts(shape.tVerts), c, 1.0, line);
      break;
    default:
      log("drawShape(): Bad assertion in DrawShape()");
      break;
  }
}

export function drawConstraint(constraint, renderer) {
  var body_a = constraint.a;
  var body_b = constraint.b;
  var a, b;

  if (constraint instanceof cp.PinJoint) {
    a = body_a.local2World(constraint.anchr1);
    b = body_b.local2World(constraint.anchr2);
    this.drawDot(a, 3.0, CONSTRAINT_COLOR);
    this.drawDot(b, 3.0, CONSTRAINT_COLOR);
    this.drawSegment(a, b, 1.0, CONSTRAINT_COLOR);
  } else if (constraint instanceof cp.SlideJoint) {
    a = body_a.local2World(constraint.anchr1);
    b = body_b.local2World(constraint.anchr2);
    this.drawDot(a, 3.0, CONSTRAINT_COLOR);
    this.drawDot(b, 3.0, CONSTRAINT_COLOR);
    this.drawSegment(a, b, 1.0, CONSTRAINT_COLOR);
  } else if (constraint instanceof cp.PivotJoint) {
    a = body_a.local2World(constraint.anchr1);
    b = body_b.local2World(constraint.anchr2);
    this.drawDot(a, 3.0, CONSTRAINT_COLOR);
    this.drawDot(b, 3.0, CONSTRAINT_COLOR);
  } else if (constraint instanceof cp.GrooveJoint) {
    a = body_a.local2World(constraint.grv_a);
    b = body_a.local2World(constraint.grv_b);
    var c = body_b.local2World(constraint.anchr2);
    this.drawDot(c, 3.0, CONSTRAINT_COLOR);
    this.drawSegment(a, b, 1.0, CONSTRAINT_COLOR);
  } else if (constraint instanceof cp.DampedSpring) {
    // TODO
  }
}

export class PhysicsDebugNode extends DrawNode {
  constructor(space) {
    super();
    this._space = null;
    this._className = "PhysicsDebugNode";
    this._space = space;
  }

  getSpace() {
    return this._space;
  }

  setSpace(space) {
    this._space = space;
  }

  draw(context) {
    if (!this._space)
      return;
    this._space.eachShape(drawShape.bind(this));
    this._space.eachConstraint(drawConstraint.bind(this));
    super.draw(context);
    this.clear();
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas)
      return new PhysicsDebugNode.CanvasRenderCmd(this);
    else
      return new PhysicsDebugNode.WebGLRenderCmd(this);
  }
}

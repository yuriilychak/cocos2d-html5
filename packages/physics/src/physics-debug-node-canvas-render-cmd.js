import { Node } from "@aspect/core";
import { DrawNodeCanvasRenderCmd } from "@aspect/shape-nodes";
import { drawShape, drawConstraint } from "./physics-debug-node";

export class PhysicsDebugNodeCanvasRenderCmd extends Node.CanvasRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._buffer = renderableObject._buffer;
    this._needDraw = true;
  }

  rendering(ctx, scaleX, scaleY) {
    const node = this._node;
    if (!node._space)
      return;
    node._space.eachShape(drawShape.bind(node));
    node._space.eachConstraint(drawConstraint.bind(node));
    DrawNodeCanvasRenderCmd.prototype.rendering.call(this, ctx, scaleX, scaleY);
    node.clear();
  }
}

PhysicsDebugNodeCanvasRenderCmd.prototype._drawDot = DrawNodeCanvasRenderCmd.prototype._drawDot;
PhysicsDebugNodeCanvasRenderCmd.prototype._drawSegment = DrawNodeCanvasRenderCmd.prototype._drawSegment;
PhysicsDebugNodeCanvasRenderCmd.prototype._drawPoly = DrawNodeCanvasRenderCmd.prototype._drawPoly;

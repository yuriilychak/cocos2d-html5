import { Sprite } from "@aspect/core";

export class PhysicsSpriteCanvasRenderCmd extends Sprite.CanvasRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
  }

  rendering(ctx, scaleX, scaleY) {
    const node = this._node;
    node._syncPosition();
    if (!node._ignoreBodyRotation)
      node._syncRotation();
    this.transform(this.getParentRenderCmd());

    super.rendering(ctx, scaleX, scaleY);
  }
}

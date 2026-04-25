import { Sprite } from "@aspect/core";

export class PhysicsSpriteWebGLRenderCmd extends Sprite.WebGLRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
  }

  uploadData(f32buffer, ui32buffer, vertexDataOffset) {
    const node = this._node;
    node._syncPosition();
    if (!node._ignoreBodyRotation)
      node._syncRotation();
    this.transform(this.getParentRenderCmd(), true);

    return super.uploadData(f32buffer, ui32buffer, vertexDataOffset);
  }
}

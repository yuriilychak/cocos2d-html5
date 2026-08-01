import { NodeTransform, Rect, FLT_MAX } from "@aspect/core";
import { RegionAttachment, Utils } from "@esotericsoftware/spine-core";

export default class SkeletonTransform extends NodeTransform {
  get boundingBox() {
    let minX = FLT_MAX,
      minY = FLT_MAX,
      maxX = -FLT_MAX,
      maxY = -FLT_MAX;
    const { scaleX, scaleY, _skeleton: skeleton, position } = this.owner;
    const slots = skeleton.slots;

    for (let i = 0, n = slots.length; i < n; ++i) {
      const slot = slots[i];
      const attachment = slot.attachment;
      if (!attachment || !(attachment instanceof RegionAttachment)) continue;
      const vertices = Utils.setArraySize(new Array(), 8, 0);
      attachment.computeWorldVertices(slot, vertices, 0, 2);
      minX = Math.min(minX, vertices[0] * scaleX, vertices[6] * scaleX, vertices[4] * scaleX, vertices[2] * scaleX);
      minY = Math.min(minY, vertices[1] * scaleY, vertices[7] * scaleY, vertices[5] * scaleY, vertices[3] * scaleY);
      maxX = Math.max(maxX, vertices[0] * scaleX, vertices[6] * scaleX, vertices[4] * scaleX, vertices[2] * scaleX);
      maxY = Math.max(maxY, vertices[1] * scaleY, vertices[7] * scaleY, vertices[5] * scaleY, vertices[3] * scaleY);
    }
    return new Rect(position.x + minX, position.y + minY, maxX - minX, maxY - minY);
  }
}

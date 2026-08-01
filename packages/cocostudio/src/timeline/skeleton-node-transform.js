import { AffineTransform, Rect } from "@aspect/core";
import BoneNodeTransform from "./bone-node-transform.js";

export default class SkeletonNodeTransform extends BoneNodeTransform {
  get boundingBox() {
    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    const owner = this.owner;
    const boundingBox = owner.getVisibleSkinsRect();
    let first = true;

    if (boundingBox.x !== 0 || boundingBox.y !== 0 || boundingBox.width !== 0 || boundingBox.height !== 0) {
      minX = Rect.getMinX(boundingBox);
      minY = Rect.getMinY(boundingBox);
      maxX = Rect.getMaxX(boundingBox);
      maxY = Rect.getMaxY(boundingBox);
      first = false;
    }

    for (const bone of owner.getAllSubBones()) {
      const rect = AffineTransform.applyToRect(
        bone.getVisibleSkinsRect(),
        bone.nodeToAncestorTransform(bone.getRootSkeletonNode())
      );
      if (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0) continue;

      if (first) {
        minX = Rect.getMinX(rect);
        minY = Rect.getMinY(rect);
        maxX = Rect.getMaxX(rect);
        maxY = Rect.getMaxY(rect);
        first = false;
      } else {
        minX = Math.min(Rect.getMinX(rect), minX);
        minY = Math.min(Rect.getMinY(rect), minY);
        maxX = Math.max(Rect.getMaxX(rect), maxX);
        maxY = Math.max(Rect.getMaxY(rect), maxY);
      }
    }

    boundingBox.x = minX;
    boundingBox.y = minY;
    boundingBox.width = maxX - minX;
    boundingBox.height = maxY - minY;
    return AffineTransform.applyToRect(boundingBox, this.nodeToParentTransform);
  }
}

import { AffineTransform, NodeTransform } from "@aspect/core";

export default class BoneNodeTransform extends NodeTransform {
  get boundingBox() {
    return AffineTransform.applyToRect(
      this.owner.getVisibleSkinsRect(),
      this.nodeToParentTransform
    );
  }
}

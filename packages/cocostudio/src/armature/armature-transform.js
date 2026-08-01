import { AffineTransform, NodeTransform, Rect } from "@aspect/core";

export default class ArmatureTransform extends NodeTransform {
  /**
   * This boundingBox will calculate all bones' boundingBox every time.
   * @returns {Rect}
   */
  get boundingBox() {
    let minX, minY, maxX, maxY = 0;
    let first = true;
    const boundingBox = new Rect(0, 0, 0, 0);

    for (const bone of this.owner.children) {
      if (!bone) continue;
      const rect = bone.getDisplayManager().boundingBox;
      if (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0) continue;

      if (first) {
        minX = rect.x;
        minY = rect.y;
        maxX = rect.x + rect.width;
        maxY = rect.y + rect.height;
        first = false;
      } else {
        minX = rect.x < boundingBox.x ? rect.x : boundingBox.x;
        minY = rect.y < boundingBox.y ? rect.y : boundingBox.y;
        maxX = rect.x + rect.width > boundingBox.x + boundingBox.width ? rect.x + rect.width : boundingBox.x + boundingBox.width;
        maxY = rect.y + rect.height > boundingBox.y + boundingBox.height ? rect.y + rect.height : boundingBox.y + boundingBox.height;
      }

      boundingBox.x = minX;
      boundingBox.y = minY;
      boundingBox.width = maxX - minX;
      boundingBox.height = maxY - minY;
    }
    return AffineTransform.applyToRect(boundingBox, this.nodeToParentTransform);
  }
}

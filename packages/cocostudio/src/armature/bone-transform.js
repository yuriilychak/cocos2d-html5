import { AffineTransform, NodeTransform } from "@aspect/core";

export default class BoneTransform extends NodeTransform {
  get nodeToWorldTransform() {
    return AffineTransform.concat(
      this.owner._worldTransform,
      this.owner._armature.transform.nodeToWorldTransform
    );
  }
}

import { NodeTransform } from "@aspect/core";

export default class SkinTransform extends NodeTransform {
  get nodeToWorldTransform() {
    return this.owner.renderCmd.nodeToWorldTransform;
  }
}

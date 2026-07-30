import { NodeOrder } from "@aspect/core";

export class BoneOrder extends NodeOrder {
  get zIndex() {
    return super.zIndex;
  }

  set zIndex(value) {
    if (this.localZOrder === value) {
      return;
    }

    super.zIndex = value;
  }
}

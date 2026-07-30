import { NodeOrder } from "@aspect/core";

export class BoneNodeOrder extends NodeOrder {
  get zIndex() {
    return super.zIndex;
  }

  set zIndex(value) {
    if (this.localZOrder === value) return;

    super.zIndex = value;
    const bone = this.owner;
    if (bone._rootSkeleton != null) {
      bone._rootSkeleton._subBonesOrderDirty = true;
    }
  }

  sortAllChildren() {
    const bone = this.owner;
    this.#sortArray(bone._childBones);
    this.#sortArray(bone._boneSkins);
    super.sortAllChildren();
  }

  #sortArray(array) {
    if (!array) return;
    for (let i = 1; i < array.length; i++) {
      const tmp = array[i];
      let j = i - 1;
      while (j >= 0) {
        if (tmp.order.localZOrder < array[j].order.localZOrder ||
          (tmp.order.localZOrder === array[j].order.localZOrder &&
            tmp.order.arrivalOrder < array[j].order.arrivalOrder)) {
          array[j + 1] = array[j];
          j--;
        } else {
          break;
        }
      }
      array[j + 1] = tmp;
    }
  }
}

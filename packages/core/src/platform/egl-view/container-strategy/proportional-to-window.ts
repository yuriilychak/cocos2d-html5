import ProportionalToFrame from "./proportional-to-frame";

import type { SizeLike } from "../../../geometry/types";
import type { EGLViewLike } from "../types";

export default class ProportionalToWindow extends ProportionalToFrame {
  preApply(view: EGLViewLike): void {
    view.frame = document.documentElement;
  }

  apply(view: EGLViewLike, designedResolution?: SizeLike): void {
    super.apply(view, designedResolution);
    this.fixContainer();
  }
}

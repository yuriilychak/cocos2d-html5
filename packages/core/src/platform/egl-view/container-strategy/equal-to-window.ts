import EqualToFrame from "./equal-to-frame";

import type { EGLViewLike } from "../types";

export default class EqualToWindow extends EqualToFrame {
  preApply(view: EGLViewLike): void {
    view.frame = document.documentElement;
  }

  apply(view: EGLViewLike): void {
    super.apply(view);
    this.fixContainer(view);
  }
}

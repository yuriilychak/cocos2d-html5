import ContainerStrategy from "./container-strategy";

import type { EGLViewLike } from "../types";

export default class EqualToFrame extends ContainerStrategy {
  preApply(view: EGLViewLike): void {}

  apply(view: EGLViewLike): void {
    const frameH = view.frameSize.height;
    const containerStyle = view.container.style;

    view.setupContainer(view.frameSize);

    // Setup container's margin and padding
    if (view.rotated) {
      containerStyle.margin = `0 0 0 ${frameH}px`;
    } else {
      containerStyle.margin = "0px";
    }
  }

  postApply(view: EGLViewLike): void {}
}

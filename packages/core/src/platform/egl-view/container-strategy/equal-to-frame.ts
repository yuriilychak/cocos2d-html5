import { ServiceLocator } from "../../../service-locator";
import ContainerStrategy from "./container-strategy";

import type { EGLViewLike } from "../types";

export default class EqualToFrame extends ContainerStrategy {
  preApply(view: EGLViewLike): void {}

  apply(view: EGLViewLike): void {
    const frameH = view.frameSize.height;
    const containerStyle = (ServiceLocator.game.container as HTMLElement).style;

    this.setupContainer(view, view.frameSize.width, view.frameSize.height);

    // Setup container's margin and padding
    if (view.rotated) {
      containerStyle.margin = `0 0 0 ${frameH}px`;
    } else {
      containerStyle.margin = "0px";
    }
  }

  postApply(view: EGLViewLike): void {}
}

import ContainerStrategy from "./container-strategy";

import type { EGLViewLike } from "../types";

export default class OriginalContainer extends ContainerStrategy {
  preApply(view: EGLViewLike): void {

  }

  apply(view: EGLViewLike): void {
    view.setupContainer(view.canvas as HTMLCanvasElement);
  }

  postApply(view: EGLViewLike): void {}
}

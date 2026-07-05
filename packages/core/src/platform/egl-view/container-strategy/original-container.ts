import { ServiceLocator } from "../../../service-locator";
import ContainerStrategy from "./container-strategy";

import type { EGLViewLike } from "../types";

export default class OriginalContainer extends ContainerStrategy {
  preApply(view: EGLViewLike): void {}

  apply(view: EGLViewLike): void {
    const canvas = ServiceLocator.game.canvas as HTMLCanvasElement;

    this.setupContainer(view, canvas.width, canvas.height);
  }

  postApply(view: EGLViewLike): void {}
}

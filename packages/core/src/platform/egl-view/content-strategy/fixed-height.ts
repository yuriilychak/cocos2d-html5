import { ServiceLocator } from "../../../service-locator";
import ContentStrategy from "./content-strategy";

import type { SizeLike } from "../../../geometry/types";
import type { ContentStrategyResult } from "./types";
import type { EGLViewLike } from "../types";

export default class FixedHeight extends ContentStrategy {
  preApply(view: EGLViewLike): void {
    void view;
  }

  apply(
    view: EGLViewLike,
    designedResolution: SizeLike
  ): ContentStrategyResult {
    void view;

    const canvas = ServiceLocator.game.canvas as HTMLCanvasElement;
    const containerW = canvas.width;
    const containerH = canvas.height;
    const designH = designedResolution.height;
    const scale = containerH / designH;
    const contentW = containerW;
    const contentH = containerH;

    return this.buildResult(
      containerW,
      containerH,
      contentW,
      contentH,
      scale,
      scale
    );
  }

  postApply(view: EGLViewLike): void {
    ServiceLocator.director.winSizeInPoints = view.getVisibleSize();
  }
}

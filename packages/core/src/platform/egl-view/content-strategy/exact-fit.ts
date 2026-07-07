import ContentStrategy from "./content-strategy";

import type { SizeLike } from "../../../geometry/types";
import type { ContentStrategyResult } from "./types";
import type { EGLViewLike } from "../types";

export default class ExactFit extends ContentStrategy {
  preApply(view: EGLViewLike): void {
    void view;
  }

  apply(
    view: EGLViewLike,
    designedResolution: SizeLike
  ): ContentStrategyResult {
    const containerW = view.canvas.width;
    const containerH = view.canvas.height;
    const scaleX = containerW / designedResolution.width;
    const scaleY = containerH / designedResolution.height;

    return this.buildResult(
      containerW,
      containerH,
      containerW,
      containerH,
      scaleX,
      scaleY
    );
  }

  postApply(view: EGLViewLike): void {
    void view;
  }
}

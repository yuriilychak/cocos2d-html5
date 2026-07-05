import { ServiceLocator } from "../../../service-locator";
import ContentStrategy from "./content-strategy";

import type { SizeLike } from "../../../geometry/types";
import type { ContentStrategyResult } from "./types";
import type { EGLViewLike } from "../types";

export default class ShowAll extends ContentStrategy {
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
    const designW = designedResolution.width;
    const designH = designedResolution.height;
    const scaleX = containerW / designW;
    const scaleY = containerH / designH;
    let scale = 0;
    let contentW = 0;
    let contentH = 0;

    if (scaleX < scaleY) {
      scale = scaleX;
      contentW = containerW;
      contentH = designH * scale;
    } else {
      scale = scaleY;
      contentW = designW * scale;
      contentH = containerH;
    }

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
    void view;
  }
}

import DirectorRenderer from "./director-renderer";
import { Point } from "../../../geometry";
import { Color } from "../../../platform";

import type { PointLike, SizeLike } from "../../../geometry";

export default class DirectorCanvasRenderer extends DirectorRenderer {
  public get clearColor(): Color {
    return super.clearColor;
  }

  public set clearColor(clearColor: Color) {
    super.clearColor = clearColor;
    this.sys.rendererConfig.renderer.clearFillStyle = Color.toRgb(clearColor);
  }

  public get visibleSize(): SizeLike {
    return this.view.winSizeInPoints;
  }

  public get visibleOrigin(): PointLike {
    return new Point();
  }
}

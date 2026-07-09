import { DirectorRenderer } from "./director-renderer";
import { Point } from "../../geometry";

import type { PointLike, SizeLike } from "../../geometry/types";
import type { EGLViewLike } from "./types";
import type { Sys } from "../../sys";
import type { EventManager } from "../../event-manager";

type CanvasClearColor = {
  r: number;
  g: number;
  b: number;
};

type CanvasRenderer = {
  _clearColor: CanvasClearColor;
  _clearFillStyle: string;
};

export class DirectorCanvasRenderer extends DirectorRenderer {
  constructor(view: EGLViewLike, sys: Sys, eventManager: EventManager) {
    super(view, sys, eventManager);
  }

  public setClearColor(clearColor: CanvasClearColor): void {
    const renderer = this.sys.rendererConfig.renderer as CanvasRenderer;
    renderer._clearColor = clearColor;
    renderer._clearFillStyle =
      "rgb(" + clearColor.r + "," + clearColor.g + "," + clearColor.b + ")";
  }

  public setOpenGLView(openGLView: EGLViewLike): void {
    this.view.winSizeInPoints = this.view.canvas;
    this.eventManager.enabled = true;
  }

  public getVisibleSize(): SizeLike {
    return this.view.winSizeInPoints;
  }

  public getVisibleOrigin(): PointLike {
    return new Point();
  }
}

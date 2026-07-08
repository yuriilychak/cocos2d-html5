import { DirectorRenderer } from "./director-renderer";
import { ServiceLocator } from "../service-locator";
import { GLState } from "../enums";

import type { DirectorProjection } from "../enums";
import type { PointLike, SizeLike } from "../geometry/types";
import type { EGLViewLike } from "../platform/egl-view/types";
import type { Sys } from "../sys";
import type { EventManager } from "../event-manager";

type WebGLDirectorRenderer = {
  childrenOrderDirty: boolean;
  setDepthTest(on: boolean): void;
  _clearColor: unknown;
};

type DirectorWebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

export class DirectorWebGLRenderer extends DirectorRenderer {
  constructor(view: EGLViewLike, sys: Sys, eventManager: EventManager) {
    super(view, sys, eventManager);
  }

  public get projection(): DirectorProjection {
    return super.projection;
  }

  public set projection(projection: DirectorProjection) {
    this.view.setViewport();
    ServiceLocator.kmglMatrix.setDirectorProjection(
      projection,
      ServiceLocator.eglView
    );
    super.projection = projection;
    ServiceLocator.glStateCache.setProjectionMatrixDirty();
    (
      this.sys.rendererConfig.renderer as WebGLDirectorRenderer
    ).childrenOrderDirty = true;
  }

  public setDepthTest(on: boolean): void {
    (this.sys.rendererConfig.renderer as WebGLDirectorRenderer).setDepthTest(
      on
    );
  }

  public setClearColor(clearColor: unknown): void {
    (
      this.sys.rendererConfig.renderer as WebGLDirectorRenderer
    )._clearColor = clearColor;
  }

  public setOpenGLView(openGLView: EGLViewLike): void {
    this.view.winSizeInPoints = this.view.canvas;
    this.sys.configuration.gatherGPUInfo();
    this.sys.configuration.dumpInfo();

    this.setGLDefaultValues();

    ServiceLocator.eventManager.enabled = true;
  }

  public getVisibleSize(): SizeLike {
    return this.view.visibleSize;
  }

  public getVisibleOrigin(): PointLike {
    return this.view.visibleOrigin;
  }

  public setAlphaBlending(on: boolean): void {
    if (on)
      ServiceLocator.glStateCache.blendFunc(
        GLState.BLEND_SRC,
        GLState.BLEND_DST
      );
    else
      ServiceLocator.glStateCache.blendFunc(
        (ServiceLocator.sys.rendererConfig.renderContext as DirectorWebGLContext)
          .ONE,
        (ServiceLocator.sys.rendererConfig.renderContext as DirectorWebGLContext)
          .ZERO
      );
  }

  public setGLDefaultValues(): void {
    this.setAlphaBlending(true);
    this.projection = this.view.projection;
    (this.sys.rendererConfig.renderContext as DirectorWebGLContext).clearColor(
      0,
      0,
      0,
      0
    );
  }
}

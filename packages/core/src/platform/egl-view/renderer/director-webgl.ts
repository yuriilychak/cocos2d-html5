import DirectorRenderer from "./director-renderer";
import { ServiceLocator } from "../../../service-locator";
import { GLState } from "../../../enums";

import type { DirectorProjection } from "../../../enums";
import type { PointLike, SizeLike } from "../../../geometry";

export default class DirectorWebGLRenderer extends DirectorRenderer {
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
    this.sys.rendererConfig.renderer.childrenOrderDirty = true;
  }

  public get depthTest(): boolean {
    return super.depthTest;
  }

  public set depthTest(value: boolean) {
    super.depthTest = value;
    this.sys.rendererConfig.renderer.setDepthTest(value);
  }

  public get visibleSize(): SizeLike {
    return this.view.visibleSize;
  }

  public get visibleOrigin(): PointLike {
    return this.view.visibleOrigin;
  }

  public get alphaBlending(): boolean {
    return super.alphaBlending;
  }

  public set alphaBlending(value: boolean) {
    super.alphaBlending = value;

    if (value)
      ServiceLocator.glStateCache.blendFunc(
        GLState.BLEND_SRC,
        GLState.BLEND_DST
      );
    else
      ServiceLocator.glStateCache.blendFunc(
        ServiceLocator.sys.rendererConfig.renderContext.ONE,
        ServiceLocator.sys.rendererConfig.renderContext.ZERO
      );
  }

  public setGLDefaultValues(): void {
    this.alphaBlending = true;
    this.projection = this.view.projection;
    this.sys.rendererConfig.renderContext.clearColor(0, 0, 0, 0);
  }
}

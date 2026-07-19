import type { DirectorProjection } from "../../../enums";
import type { PointLike, SizeLike } from "../../../geometry";
import type { EGLViewLike } from "../types";
import type { Sys } from "../../../sys";
import type { Color } from "../../../platform";

export default abstract class DirectorRenderer {
  #view: EGLViewLike;
  #sys: Sys;
  #depthTest: boolean = false;
  #alphaBlending: boolean = false;

  constructor(view: EGLViewLike, sys: Sys) {
    this.#view = view;
    this.#sys = sys;
  }

  protected get view(): EGLViewLike {
    return this.#view;
  }

  protected get sys(): Sys {
    return this.#sys;
  }

  public get projection(): DirectorProjection {
    return this.view.projection;
  }

  public set projection(projection: DirectorProjection) {
    this.view.projection = projection;
  }

  public get depthTest(): boolean {
    return this.#depthTest;
  }

  public set depthTest(on: boolean) {
    this.#depthTest = on;
  }

  public get clearColor(): Color {
    return this.sys.rendererConfig.renderer.clearColor;
  }

  public set clearColor(clearColor: Color) {
    this.sys.rendererConfig.renderer.clearColor = clearColor;
  }

  abstract get visibleSize(): SizeLike;

  abstract get visibleOrigin(): PointLike;

  public get alphaBlending(): boolean {
    return this.#alphaBlending;
  }

  public set alphaBlending(on: boolean) {
    this.#alphaBlending = on;
  }

  public setGLDefaultValues(): void {}
}

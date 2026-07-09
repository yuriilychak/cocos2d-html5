import type { DirectorProjection } from "../../enums";
import type { PointLike, SizeLike } from "../../geometry/types";
import type { EGLViewLike } from "./types";
import type { Sys } from "../../sys";
import type { EventManager } from "../../event-manager";

export abstract class DirectorRenderer {
  #view: EGLViewLike;
  #sys: Sys;
  #eventManager: EventManager;

  constructor(view: EGLViewLike, sys: Sys, eventManager: EventManager) {
    this.#view = view;
    this.#sys = sys;
    this.#eventManager = eventManager;
  }

  protected get view(): EGLViewLike {
    return this.#view;
  }

  protected get sys(): Sys {
    return this.#sys;
  }

  protected get eventManager(): EventManager {
    return this.#eventManager;
  }

  public get projection(): DirectorProjection {
    return this.view.projection;
  }

  public set projection(projection: DirectorProjection) {
    this.view.projection = projection;
  }

  public setDepthTest(on: boolean): void {}

  public setClearColor(clearColor: unknown): void {}

  public setOpenGLView(openGLView: EGLViewLike): void {}

  abstract getVisibleSize(): SizeLike;

  abstract getVisibleOrigin(): PointLike;

  public setAlphaBlending(on: boolean): void {}

  public setGLDefaultValues(): void {}
}

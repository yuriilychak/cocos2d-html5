import type { Color } from "../../platform";
import type { AffineTransformLike, PointLike, Point } from "../../geometry";

export interface DirtyNode {
  _dirtyFlag: number;
  updateStatus(): void;
  _curLevel: number;
}

export interface CanvasContextWrapperInterface {
  resetCache(): void;
  computeRealOffsetY(): void;
  save(): void;
  restore(): void;
  setTransform(t: AffineTransformLike, scale: PointLike): void;
  switchToArmatureMode(
    enable: boolean,
    t?: AffineTransformLike,
    scale?: PointLike
  ): void;
  readonly context: CanvasRenderingContext2D;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  globalAlpha: number;
  compositeOperation: GlobalCompositeOperation;
  readonly scaleX: number;
  readonly scaleY: number;
  viewScale: Point;
  offset: Point;
}

export interface RendererInterface {
  clear(): void;
  rendering(...args: any[]): void;
  setDepthTest(on: boolean): void;
  getRenderCmd(renderableObject: { _createRenderCmd(): unknown }): unknown;
  resetFlag(): void;
  transform(): void;
  transformDirty(): boolean;
  pushDirtyNode(node: DirtyNode): void;
  clearRenderCommands(): void;
  childrenOrderDirty: boolean;
  assignedZ: number;
  assignedZStep: number;
  allNeedDraw: boolean;
  clearColor: Color;
}

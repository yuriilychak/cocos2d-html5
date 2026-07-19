import { Point, type PointLike, type AffineTransformLike } from "../../geometry";
import type { CanvasContextWrapperInterface } from "./types";

export default class CanvasContextWrapper implements CanvasContextWrapperInterface {
  #context: CanvasRenderingContext2D;
  #saveCount = 0;
  #offset = new Point();
  #realOffsetY: number;
  #armatureMode = 0;
  #scale = new Point();

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
    this.#realOffsetY = context.canvas.height;
  }

  resetCache(): void {
    //call it after resize _canvas, because context will reset.
    this.computeRealOffsetY();
  }

  computeRealOffsetY(): void {
    this.#realOffsetY = this.#context.canvas.height + this.#offset.y;
  }

  save(): void {
    this.#context.save();
    this.#saveCount++;
  }

  restore(): void {
    this.#context.restore();
    this.#saveCount--;
  }

  setTransform(t: AffineTransformLike, scale: PointLike): void {
    if (this.#armatureMode > 0) {
      //ugly for armature
      this.restore();
      this.save();
      this.#context.transform(
        t.a * scale.x,
        -t.b * scale.y,
        -t.c * scale.x,
        t.d * scale.y,
        t.tx * scale.x,
        -(t.ty * scale.y)
      );
    } else {
      this.#context.setTransform(
        t.a * scale.x,
        -t.b * scale.y,
        -t.c * scale.x,
        t.d * scale.y,
        this.#offset.x + t.tx * scale.x,
        this.#realOffsetY - t.ty * scale.y
      );
    }
  }

  switchToArmatureMode(
    enable: boolean,
    t?: AffineTransformLike,
    scale?: PointLike
  ): void {
    if (enable) {
      this.#armatureMode++;
      this.#context.setTransform(
        t!.a,
        t!.c,
        t!.b,
        t!.d,
        this.#offset.x + t!.tx * scale!.x,
        this.#realOffsetY - t!.ty * scale!.y
      );
      this.save();
    } else {
      this.#armatureMode--;
      this.restore();
    }
  }

  get context(): CanvasRenderingContext2D {
    return this.#context;
  }

  get fillStyle(): string | CanvasGradient | CanvasPattern {
    return this.#context.fillStyle;
  }

  set fillStyle(fillStyle: string | CanvasGradient | CanvasPattern) {
    if (this.#saveCount > 0) {
      this.#context.fillStyle = fillStyle;
    } else if (this.#context.fillStyle !== fillStyle) {
      this.#context.fillStyle = fillStyle;
    }
  }

  get strokeStyle(): string | CanvasGradient | CanvasPattern {
    return this.#context.strokeStyle;
  }

  set strokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern) {
    if (this.#saveCount > 0) {
      this.#context.strokeStyle = strokeStyle;
    } else if (this.#context.strokeStyle !== strokeStyle) {
      this.#context.strokeStyle = strokeStyle;
    }
  }

  get globalAlpha(): number {
    return this.#context.globalAlpha;
  }

  set globalAlpha(alpha: number) {
    if (this.#saveCount > 0) {
      this.#context.globalAlpha = alpha;
    } else if (this.#context.globalAlpha !== alpha) {
      this.#context.globalAlpha = alpha;
    }
  }

  get compositeOperation(): GlobalCompositeOperation {
    return this.#context.globalCompositeOperation;
  }

  set compositeOperation(compositionOperation: GlobalCompositeOperation) {
    if (this.#saveCount > 0) {
      this.#context.globalCompositeOperation = compositionOperation;
    } else if (this.#context.globalCompositeOperation !== compositionOperation) {
      this.#context.globalCompositeOperation = compositionOperation;
    }
  }

  get scaleX(): number {
    return this.#scale.x;
  }

  get scaleY(): number {
    return this.#scale.y;
  }

  get viewScale(): Point {
    return this.#scale.clone();
  }

  set viewScale(scale: PointLike) {
    //call it at renderCanvas.rendering
    this.#scale.set(scale);
  }

  get offset(): Point {
    return this.#offset.clone();
  }

  set offset(offset: PointLike) {
    this.#offset.set(offset);
    this.computeRealOffsetY();
  }
}

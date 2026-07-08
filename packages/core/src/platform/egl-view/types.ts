import type { PointLike, RectLike, SizeLike } from "../../geometry/types";
import type { DensityDPI, DeviceOrientation, DirectorProjection } from "../../enums";
import type { ResolutionPolicy } from "./resolution-policy";
import type { DirectorRenderer } from "../../director/director-renderer";

export type DensityDPIValue = DensityDPI | string;

export interface EGLViewRelatedPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EGLViewContentTranslate {
  left: number;
  top: number;
}


export interface EGLViewLike {
  readonly rotated: boolean;
  retinaEnabled: boolean;
  autoFullScreenEnabled: boolean;
  devicePixelRatio: number;
  frame: HTMLElement | null;
  frameSize: SizeLike;
  targetDensityDPI: DensityDPIValue;
  orientation: DeviceOrientation;
  resolutionPolicy: ResolutionPolicy | null;
  contentTranslateLeftTop: PointLike;
  viewName: string;
  resizeWithBrowserSize: boolean;
  resizeCallback: (() => void) | null;
  setDocumentPixelWidth(width: number): void;
  initialize(canvas: HTMLCanvasElement, container: HTMLElement): void;
  setupContainer(size: SizeLike): void;
  setViewport(): void;
  adjustViewPort: boolean;
  readonly openGLReady: boolean;
  readonly rendererDelegate: DirectorRenderer;
  frameZoomFactor: number;
  contentScaleFactor: number;
  winSizeInPoints: SizeLike;
  projection: DirectorProjection;
  readonly zEye: number;
  readonly canvasSize: SizeLike;
  readonly visibleSize: SizeLike;
  readonly visibleSizeInPixel: SizeLike;
  readonly visibleOrigin: PointLike;
  readonly visibleOriginInPixel: PointLike;
  readonly canSetContentScaleFactor: boolean;
  readonly canvas: HTMLCanvasElement;
  readonly container: HTMLElement;
  setDesignResolutionSize(
    size: SizeLike,
    resolutionPolicy: ResolutionPolicy
  ): void;
  readonly designResolutionSize: SizeLike;
  setRealPixelResolution(
    size: SizeLike,
    resolutionPolicy: ResolutionPolicy
  ): void;
  setScissorInPoints(x: number, y: number, w: number, h: number): void;
  readonly scissorEnabled: boolean;
  readonly scissorRect: RectLike;
  readonly viewPortRect: RectLike;
  readonly viewPortOriginInPoints: PointLike;
  convertToLocationInView(
    tx: number,
    ty: number,
    relatedPos: EGLViewRelatedPosition
  ): PointLike;
  convertMouseToLocationInView(
    point: PointLike,
    relatedPos: EGLViewRelatedPosition
  ): void;
  convertPointWithScale(point: PointLike): void;
  convertTouchesWithScale(
    touches: Array<PointLike & { previousLocation: PointLike }>
  ): void;
}

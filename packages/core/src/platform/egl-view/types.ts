import type { PointLike, RectLike, SizeLike } from "../../geometry/types";
import type {
  DensityDPI,
  DeviceOrientation,
  ResolutionPolicyType
} from "../../enums";
import type { ResolutionPolicy } from "./resolution-policy";

export type DensityDPIValue = DensityDPI | string;

export type ResolutionPolicyValue =
  | ResolutionPolicy
  | ResolutionPolicyType
  | number;

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

export interface EGLViewServices {
  director: unknown;
  eventManager: unknown;
  game: unknown;
  rendererConfig: unknown;
  screen: unknown;
  sys: unknown;
}

export interface EGLViewLike {
  readonly rotated: boolean;
  retinaEnabled: boolean;
  autoFullScreenEnabled: boolean;
  devicePixelRatio: number;
  frame: HTMLElement;
  readonly frameSize: SizeLike;
  targetDensityDPI: DensityDPIValue;
  orientation: DeviceOrientation;
  resolutionPolicy: ResolutionPolicyValue | null;
  viewName: string;
  injectServices(services: EGLViewServices): void;
  resizeWithBrowserSize: boolean;
  setResizeCallback(callback: (() => void) | null): void;
  setDocumentPixelWidth(width: number): void;
  initialize(): void;
  adjustViewPort(enabled: boolean): void;
  readonly openGLReady: boolean;
  frameZoomFactor: number;
  swapBuffers(): void;
  setIMEKeyboardState(isOpen: boolean): void;
  setContentTranslateLeftTop(offsetLeft: number, offsetTop: number): void;
  getContentTranslateLeftTop(): EGLViewContentTranslate;
  readonly canvasSize: SizeLike;
  getFrameSize(): SizeLike;
  setFrameSize(width: number, height: number): void;
  readonly visibleSize: SizeLike;
  readonly visibleSizeInPixel: SizeLike;
  readonly visibleOrigin: PointLike;
  readonly visibleOriginInPixel: PointLike;
  readonly canSetContentScaleFactor: boolean;
  setDesignResolutionSize(
    width: number,
    height: number,
    resolutionPolicy: ResolutionPolicyValue
  ): void;
  readonly designResolutionSize: SizeLike;
  setRealPixelResolution(
    width: number,
    height: number,
    resolutionPolicy: ResolutionPolicyValue
  ): void;
  setViewPortInPoints(x: number, y: number, w: number, h: number): void;
  setScissorInPoints(x: number, y: number, w: number, h: number): void;
  readonly scissorEnabled: boolean;
  readonly scissorRect: RectLike;
  readonly viewPortRect: RectLike;
  convertToLocationInView(
    tx: number,
    ty: number,
    relatedPos: EGLViewRelatedPosition
  ): PointLike;
}

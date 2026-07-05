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
  devicePixelRatio: number;
  frame: HTMLElement;
  readonly frameSize: SizeLike;
  injectServices(services: EGLViewServices): void;
  setTargetDensityDPI(densityDPI: DensityDPIValue): void;
  getTargetDensityDPI(): DensityDPIValue | null;
  resizeWithBrowserSize(enabled: boolean): void;
  setResizeCallback(callback: (() => void) | null): void;
  setOrientation(orientation: DeviceOrientation): void;
  setDocumentPixelWidth(width: number): void;
  initialize(): void;
  adjustViewPort(enabled: boolean): void;
  enableRetina(enabled: boolean): void;
  isRetinaEnabled(): boolean;
  enableAutoFullScreen(enabled: boolean): void;
  isAutoFullScreenEnabled(): boolean;
  isOpenGLReady(): unknown;
  setFrameZoomFactor(zoomFactor: number): void;
  swapBuffers(): void;
  setIMEKeyboardState(isOpen: boolean): void;
  setContentTranslateLeftTop(offsetLeft: number, offsetTop: number): void;
  getContentTranslateLeftTop(): EGLViewContentTranslate;
  getCanvasSize(): SizeLike;
  getFrameSize(): SizeLike;
  setFrameSize(width: number, height: number): void;
  getVisibleSize(): SizeLike;
  getVisibleSizeInPixel(): SizeLike;
  getVisibleOrigin(): PointLike;
  getVisibleOriginInPixel(): PointLike;
  canSetContentScaleFactor(): boolean;
  getResolutionPolicy(): ResolutionPolicy | null;
  setResolutionPolicy(resolutionPolicy: ResolutionPolicyValue): void;
  setDesignResolutionSize(
    width: number,
    height: number,
    resolutionPolicy: ResolutionPolicyValue
  ): void;
  getDesignResolutionSize(): SizeLike;
  setRealPixelResolution(
    width: number,
    height: number,
    resolutionPolicy: ResolutionPolicyValue
  ): void;
  setViewPortInPoints(x: number, y: number, w: number, h: number): void;
  setScissorInPoints(x: number, y: number, w: number, h: number): void;
  isScissorEnabled(): boolean;
  getScissorRect(): RectLike;
  setViewName(viewName: string): void;
  getViewName(): string;
  getViewPortRect(): RectLike;
  getDevicePixelRatio(): number;
  convertToLocationInView(
    tx: number,
    ty: number,
    relatedPos: EGLViewRelatedPosition
  ): PointLike;
}

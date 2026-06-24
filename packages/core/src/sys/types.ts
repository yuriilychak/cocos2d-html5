export type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;
export type BrowserNavigator = Navigator & {
  browserLanguage?: string;
  msPointerEnabled?: boolean;
};

export type BrowserWindow = Window & {
  WebGLRenderingContext?: typeof WebGLRenderingContext;
  OffscreenCanvas?: unknown;
  DeviceMotionEvent?: unknown;
  DeviceOrientationEvent?: unknown;
};

export type BrowserEnvironment = {
  window: BrowserWindow;
  document: Document;
  navigator: BrowserNavigator;
};
export type StorageLike = {
  getItem(...args: any[]): any;
  setItem(...args: any[]): any;
  removeItem(...args: any[]): any;
  clear(...args: any[]): any;
};

export type RenderContext =
  WebGLContext
  | {
      getParameter(parameter: number): number | null;
      MAX_TEXTURE_IMAGE_UNITS: number;
    }
  | null;
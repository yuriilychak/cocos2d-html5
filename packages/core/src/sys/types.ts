type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

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
import { log, warn as debugWarn } from "../boot/debugger";
import { Size } from "../geometry";
import SysCapabilities from './sys-capabilities';
import SysSpecification from './sys-specification';

import type { BrowserNavigator, BrowserEnvironment } from './types';

type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

type RendererConfigLike = {
  isWebGL: boolean;
};

type SysServices = {
  rendererConfig: RendererConfigLike;
};

type StorageLike = {
  getItem(...args: any[]): any;
  setItem(...args: any[]): any;
  removeItem(...args: any[]): any;
  clear(...args: any[]): any;
};

/**
 * System variables singleton.
 */
export default class Sys {
  static readonly #webGLContextNames = [
    "webgl2",
    "webgl",
    "experimental-webgl",
    "webkit-3d",
    "moz-webgl"
  ];

  #rendererConfig: RendererConfigLike | null = null;
  #windowPixelResolution: Size = new Size();
  #localStorage: StorageLike;
  #capabilities: SysCapabilities;
  #specification: SysSpecification;

  readonly #env: BrowserEnvironment;

  constructor() {
    this.#env = Sys.#getBrowserEnvironment();

    const win = this.#env.window,
      nav = this.#env.navigator,
      doc = this.#env.document;

    this.#specification = new SysSpecification(nav);

    const w = win.innerWidth || doc.documentElement.clientWidth;
    const h = win.innerHeight || doc.documentElement.clientHeight;
    const ratio = win.devicePixelRatio || 1;

    this.#windowPixelResolution = new Size(ratio * w, ratio * h);
    try {
      this.#localStorage = win.localStorage;
      this.#localStorage.setItem("storage", "");
      this.#localStorage.removeItem("storage");
    } catch (e) {
      const warn = () =>
        debugWarn(
          "Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option"
        );
      this.#localStorage = {
        getItem: warn,
        setItem: warn,
        removeItem: warn,
        clear: warn
      };
    }

    this.#capabilities = new SysCapabilities(win, doc, nav, this.#detectWebGLSupport());

    // Adjust mobile css settings
    if (this.#specification.isMobile) {
      const fontStyle = doc.createElement("style");
      fontStyle.type = "text/css";
      doc.body.appendChild(fontStyle);

      fontStyle.textContent =
        "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;" +
        "-webkit-tap-highlight-color:rgba(0,0,0,0);}";
    }
  }

  injectServices({ rendererConfig }: SysServices): void {
    this.#rendererConfig = rendererConfig;
  }

  toString(): string {
    return [
        this.#specification.toString(),
        `capabilities : " ${this.#capabilities.toString()}`,
        `Using ${this.#rendererConfig?.isWebGL ? "WEBGL" : "CANVAS"} renderer.`
      ].join("\r\n")
  }

  dump(): void {
    log(this.toString());
  }

  openURL(url: string): void {
    this.#env.window.open(url);
  }

  #detectWebGLSupport(): boolean {
    const win = this.#env.window;
    const doc = this.#env.document;

    if (!win.WebGLRenderingContext) {
      return false;
    }

    const tmpCanvas = doc.createElement("canvas");
    try {
      const context = Sys.create3DContext(tmpCanvas);
      return !!context && this.#specification.detectWebGLSupport(win);
    } catch (e) {
      return false;
    }
  }

  get windowPixelResolution(): Size {
    return this.#windowPixelResolution;
  }

  get localStorage(): StorageLike {
    return this.#localStorage;
  }

  get capabilities(): SysCapabilities {
    return this.#capabilities;
  }

  get specification(): SysSpecification {
    return this.#specification;
  }

  static create3DContext(
    canvas: HTMLCanvasElement,
    opt_attribs?: WebGLContextAttributes
  ): WebGLContext | null {
    for (let i = 0; i < Sys.#webGLContextNames.length; ++i) {
      try {
        const context = canvas.getContext(
          Sys.#webGLContextNames[i] as any,
          opt_attribs
        ) as WebGLContext | null;
        if (context) {
          return context;
        }
      } catch (e) {}
    }
    return null;
  }

  static #getBrowserEnvironment(): BrowserEnvironment {
    return {
      window,
      document,
      navigator: window.navigator as BrowserNavigator
    };
  }
}

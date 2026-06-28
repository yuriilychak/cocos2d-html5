import { log, warn as debugWarn } from "../boot/debugger";
import { Size } from "../geometry";
import SysCapabilities from './sys-capabilities';
import SysSpecification from './sys-specification';
import RendererConfig from './renderer-config';
import { Configuration } from './configuration';

import type { BrowserNavigator, BrowserEnvironment, BrowserWindow, WebGLContext, StorageLike } from './types';

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

  #windowPixelResolution: Size;
  #localStorage: StorageLike;
  #capabilities: SysCapabilities;
  #specification: SysSpecification;
  #rendererConfig: RendererConfig;
  #configuration: Configuration;

  readonly #env: BrowserEnvironment;

  constructor() {
    this.#env = Sys.#getBrowserEnvironment();
    this.#specification = new SysSpecification(this.#env.navigator);
    this.#capabilities = new SysCapabilities(this.#env.window, this.#env.document, this.#env.navigator, this.#detectWebGLSupport());
    this.#rendererConfig = new RendererConfig(this.#capabilities);
    this.#configuration = new Configuration(this.#rendererConfig);
    this.#localStorage = Sys.#detectLocalStorage(this.#env.window);
    this.#windowPixelResolution = Sys.#getWindowPixelResolution(this.#env.window, this.#env.document);

    // Adjust mobile css settings
    if (this.#specification.isMobile) {
      Sys.#adjustMobileCssSettings(this.#env.document);
    }
  }

  public toString(): string {
    return [
        this.#specification.toString(),
        `capabilities : " ${this.#capabilities.toString()}`,
        `Using ${this.#rendererConfig.isWebGL ? "WEBGL" : "CANVAS"} renderer.`
      ].join("\r\n")
  }

  public dump(): void {
    log(this.toString());
  }

  public openURL(url: string): void {
    this.#env.window.open(url);
  }

  public vibrate(duration: number): void {
    this.#env.navigator.vibrate?.(Math.round(duration * 1000));
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

  public get windowPixelResolution(): Size {
    return this.#windowPixelResolution;
  }

  public get localStorage(): StorageLike {
    return this.#localStorage;
  }

  public get capabilities(): SysCapabilities {
    return this.#capabilities;
  }

  public get specification(): SysSpecification {
    return this.#specification;
  }

  public get rendererConfig(): RendererConfig {
    return this.#rendererConfig;
  }

  public get configuration(): Configuration {
    return this.#configuration;
  }

  public static create3DContext(
    canvas: HTMLCanvasElement,
    optAttribs?: WebGLContextAttributes
  ): WebGLContext | null {
    for (let i = 0; i < Sys.#webGLContextNames.length; ++i) {
      try {
        const context = canvas.getContext(
          Sys.#webGLContextNames[i] as any,
          optAttribs
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

  static #getWindowPixelResolution(window: BrowserWindow, document: Document): Size {
    const w = window.innerWidth || document.documentElement.clientWidth;
    const h = window.innerHeight || document.documentElement.clientHeight;
    const ratio = window.devicePixelRatio || 1;

    return new Size(ratio * w, ratio * h);
  }

  static #detectLocalStorage(window: BrowserWindow): StorageLike {
    try {
      window.localStorage.setItem("storage", "");
      window.localStorage.removeItem("storage");

      return window.localStorage;
    } catch (e) {
      const warn = () =>
        debugWarn(
          "Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option"
        );
      return {
        getItem: warn,
        setItem: warn,
        removeItem: warn,
        clear: warn
      };
    }
  }

  static #adjustMobileCssSettings(document: Document): void {
    const fontStyle = document.createElement("style");
    fontStyle.textContent =
      "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;" +
      "-webkit-tap-highlight-color:rgba(0,0,0,0);}";

    document.body.appendChild(fontStyle);
  }
}

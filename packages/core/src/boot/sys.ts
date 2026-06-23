import { log, warn as debugWarn } from "./debugger";
import { BrowserType, Language, OperatingSystem, Platform } from "../enums";
import { Size } from "../geometry";
import { isUndefined } from "./utils";
import SysCapabilities from './sys-capabilities';

import type { BrowserWindow, BrowserNavigator } from './types';

type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

type RendererConfigLike = {
  isWebGL: boolean;
};

type SysServices = {
  rendererConfig: RendererConfigLike;
};

type BrowserEnvironment = {
  window: BrowserWindow;
  document: Document;
  navigator: BrowserNavigator;
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
  static readonly #primaryBrowserTypePattern =
    /micromessenger|mqqbrowser|sogou|qzone|liebao|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
  static readonly #secondaryBrowserTypePattern =
    /qqbrowser|qq|chrome|safari|firefox|opr|oupeng|opera/i;
  static readonly #primaryBrowserVersionPattern =
    /(mqqbrowser|micromessenger|sogou|qzone|liebao|maxthon|mxbrowser|baidu)(mobile)?(browser)?\/?([\d.]+)/i;
  static readonly #secondaryBrowserVersionPattern =
    /(msie |rv:|firefox|chrome|ucbrowser|qq|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i;

  #rendererConfig: RendererConfigLike | null = null;
  #isNative: boolean = false;
  #isMobile: boolean = false;
  #os: OperatingSystem = OperatingSystem.UNKNOWN;
  #platform: Platform = Platform.UNKNOWN;
  #language: string = Language.ENGLISH;
  #osVersion = "";
  #osMainVersion = 0;
  #browserType: BrowserType = BrowserType.UNKNOWN;
  #browserVersion = "";
  #windowPixelResolution: Size = new Size();
  #localStorage: StorageLike;
  #capabilities: SysCapabilities;

  readonly #env: BrowserEnvironment;

  constructor() {
    this.#env = Sys.#getBrowserEnvironment();

    const win = this.#env.window,
      nav = this.#env.navigator,
      doc = this.#env.document;
    const ua = nav.userAgent.toLowerCase();

    this.#isMobile = /mobile|android|iphone|ipad/.test(ua);
    this.#platform = this.isMobile
      ? Platform.MOBILE_BROWSER
      : Platform.DESKTOP_BROWSER;

    const currLanguage =
      nav.language || nav.browserLanguage || Language.ENGLISH;
    this.#language = currLanguage.split("-")[0];

    const [isIOSValue, isAndroidValue, osVersion, osMainVersionValue] =
      Sys.#detectMobileOperatingSystemVersion(ua, nav.platform);
    const isIOS = isIOSValue === "true";
    const isAndroid = isAndroidValue === "true";

    this.#os = Sys.#detectOperatingSystem(nav.appVersion, isAndroid, isIOS);
    this.#osVersion = osVersion;
    this.#osMainVersion = parseInt(osMainVersionValue) || 0;
    this.#browserType = Sys.#detectBrowserType(ua, isAndroid);
    this.#browserVersion = Sys.#detectBrowserVersion(ua);

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
    if (this.isMobile) {
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
        `isMobile : ${this.#isMobile}`,
        `language : ${this.#language}`,
        `browserType : ${this.#browserType}`,
        `browserVersion : ${this.#browserVersion}`,
        `capabilities : " ${this.#capabilities.toString()}`,
        `os : ${this.#os}`,
        `osVersion : ${this.#osVersion}`,
        `platform : ${this.#platform}`,
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
      if (!context) {
        return false;
      }

      if (
        this.os === OperatingSystem.IOS &&
        this.osMainVersion === 9 &&
        !win.indexedDB
      ) {
        return false;
      }

      if (this.os !== OperatingSystem.ANDROID) {
        return true;
      }

      const browserVer = parseFloat(this.browserVersion);
      switch (this.browserType) {
        case BrowserType.MOBILE_QQ:
        case BrowserType.BAIDU:
        case BrowserType.BAIDU_APP:
          return browserVer >= 6.2;
        case BrowserType.CHROME:
          return browserVer >= 30.0;
        case BrowserType.UNKNOWN:
        case BrowserType.BROWSER_360:
        case BrowserType.MIUI:
        case BrowserType.UC:
          return false;
        case BrowserType.ANDROID:
        default:
          return true;
      }
    } catch (e) {
      return false;
    }
  }

  get isNative(): boolean {
    return this.#isNative;
  }

  get isMobile(): boolean {
    return this.#isMobile;
  }

  get os(): OperatingSystem {
    return this.#os;
  }

  get platform(): Platform {
    return this.#platform;
  }

  get language(): string {
    return this.#language;
  }

  get osVersion(): string {
    return this.#osVersion;
  }

  get osMainVersion(): number {
    return this.#osMainVersion;
  }

  get browserType(): BrowserType {
    return this.#browserType;
  }

  get browserVersion(): string {
    return this.#browserVersion;
  }

  get windowPixelResolution(): Size {
    return this.#windowPixelResolution;
  }

  get supportCanvasNewBlendModes(): boolean {
    return this.capabilities.newBlendModes;
  }

  get localStorage(): StorageLike {
    return this.#localStorage;
  }

  get capabilities(): SysCapabilities {
    return this.#capabilities;
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

  static #detectOperatingSystem(
    appVersion: string,
    isAndroid: boolean,
    isIOS: boolean
  ): OperatingSystem {
    switch (true) {
      case isIOS:
        return OperatingSystem.IOS;
      case isAndroid:
        return OperatingSystem.ANDROID;
      case appVersion.indexOf("Win") !== -1:
        return OperatingSystem.WINDOWS;
      case appVersion.indexOf("Mac") !== -1:
        return OperatingSystem.OSX;
      case appVersion.indexOf("Linux") !== -1:
        return OperatingSystem.LINUX;
      case appVersion.indexOf("X11") !== -1:
      default:
        return OperatingSystem.UNKNOWN;
    }
  }

  static #detectMobileOperatingSystemVersion(
    userAgent: string,
    platform: string
  ): string[] {
    const androidVersion =
      /android (\d+(?:\.\d+)+)/i.exec(userAgent) ||
      /android (\d+(?:\.\d+)+)/i.exec(platform);
    const iosVersion = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(userAgent);

    switch (true) {
      case !!androidVersion: {
        const osVersion = androidVersion![1] || "";
        return ["false", "true", osVersion, String(parseInt(osVersion) || 0)];
      }
      case !!iosVersion: {
        const osVersion = iosVersion![2] || "";
        return ["true", "false", osVersion, String(parseInt(osVersion) || 0)];
      }
      case /(iPhone|iPad|iPod)/.test(platform):
        return ["true", "false", "", "0"];
      default:
        return ["false", "false", "", "0"];
    }
  }

  static #detectBrowserType(
    userAgent: string,
    isAndroid: boolean
  ): BrowserType {
    const browserTypes =
      Sys.#primaryBrowserTypePattern.exec(userAgent) ||
      Sys.#secondaryBrowserTypePattern.exec(userAgent) ||
      [];
    const browserType = browserTypes[0] || BrowserType.UNKNOWN;

    switch (browserType) {
      case "micromessenger":
        return BrowserType.WECHAT;
      case "safari":
        return isAndroid ? BrowserType.ANDROID : BrowserType.SAFARI;
      case "trident":
        return BrowserType.IE;
      case "360 aphone":
        return BrowserType.BROWSER_360;
      case "mxbrowser":
        return BrowserType.MAXTHON;
      case "opr":
        return BrowserType.OPERA;
      default:
        return browserType as BrowserType;
    }
  }

  static #detectBrowserVersion(userAgent: string): string {
    const browserVersion =
      userAgent.match(Sys.#primaryBrowserVersionPattern) ||
      userAgent.match(Sys.#secondaryBrowserVersionPattern);

    return browserVersion ? browserVersion[4] : "";
  }
}

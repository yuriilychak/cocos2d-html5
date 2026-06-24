import { BrowserType, Language, OperatingSystem, Platform } from "../enums";

import type { BrowserNavigator, BrowserWindow } from './types';

/**
 * System variables singleton.
 */
export default class SysSpecification {
  static readonly #primaryBrowserTypePattern =
    /micromessenger|mqqbrowser|sogou|qzone|liebao|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
  static readonly #secondaryBrowserTypePattern =
    /qqbrowser|qq|chrome|safari|firefox|opr|oupeng|opera/i;
  static readonly #primaryBrowserVersionPattern =
    /(mqqbrowser|micromessenger|sogou|qzone|liebao|maxthon|mxbrowser|baidu)(mobile)?(browser)?\/?([\d.]+)/i;
  static readonly #secondaryBrowserVersionPattern =
    /(msie |rv:|firefox|chrome|ucbrowser|qq|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i;

  #isNative: boolean = false;
  #isMobile: boolean = false;
  #os: OperatingSystem = OperatingSystem.UNKNOWN;
  #platform: Platform = Platform.UNKNOWN;
  #language: string = Language.ENGLISH;
  #osVersion = "";
  #osMainVersion = 0;
  #browserType: BrowserType = BrowserType.UNKNOWN;
  #browserVersion = "";

  constructor(nav: BrowserNavigator) {
    const ua = nav.userAgent.toLowerCase();

    this.#isMobile = /mobile|android|iphone|ipad/.test(ua);
    this.#platform = this.isMobile
      ? Platform.MOBILE_BROWSER
      : Platform.DESKTOP_BROWSER;

    const currLanguage =
      nav.language || nav.browserLanguage || Language.ENGLISH;
    this.#language = currLanguage.split("-")[0];

    const [isIOSValue, isAndroidValue, osVersion, osMainVersionValue] =
      SysSpecification.#detectMobileOperatingSystemVersion(ua, nav.platform);
    const isIOS = isIOSValue === "true";
    const isAndroid = isAndroidValue === "true";

    this.#os = SysSpecification.#detectOperatingSystem(nav.appVersion, isAndroid, isIOS);
    this.#osVersion = osVersion;
    this.#osMainVersion = parseInt(osMainVersionValue) || 0;
    this.#browserType = SysSpecification.#detectBrowserType(ua, isAndroid);
    this.#browserVersion = SysSpecification.#detectBrowserVersion(ua);
  }

  public toString(): string {
    return [
        `isMobile : ${this.#isMobile}`,
        `language : ${this.#language}`,
        `browserType : ${this.#browserType}`,
        `browserVersion : ${this.#browserVersion}`,
        `os : ${this.#os}`,
        `osVersion : ${this.#osVersion}`,
        `platform : ${this.#platform}`,
      ].join("\r\n")
  }

  public detectWebGLSupport(win: BrowserWindow): boolean {
    try {
      if (
        this.#os === OperatingSystem.IOS &&
        this.#osMainVersion === 9 &&
        !win.indexedDB
      ) {
        return false;
      }

      if (this.#os !== OperatingSystem.ANDROID) {
        return true;
      }

      const browserVer = parseFloat(this.#browserVersion);
      switch (this.#browserType) {
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
      SysSpecification.#primaryBrowserTypePattern.exec(userAgent) ||
      SysSpecification.#secondaryBrowserTypePattern.exec(userAgent) ||
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
      userAgent.match(SysSpecification.#primaryBrowserVersionPattern) ||
      userAgent.match(SysSpecification.#secondaryBrowserVersionPattern);

    return browserVersion ? browserVersion[4] : "";
  }
}

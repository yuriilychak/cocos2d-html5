import { log, warn } from "./debugger";
import { BrowserType, Language, OperatingSystem, Platform } from "../enums";

export function create3DContext(canvas, opt_attribs) {
  var names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch (e) {}
    if (context) {
      break;
    }
  }
  return context;
}

/**
 * System variables singleton.
 */
export default class Sys {
  _rendererConfig = null;

  injectServices({ rendererConfig }) {
    this._rendererConfig = rendererConfig;
  }

  constructor() {
    this.isNative = false;

    var win = window,
      nav = win.navigator,
      doc = document,
      docEle = doc.documentElement;
    var ua = nav.userAgent.toLowerCase();

    this.isMobile = /mobile|android|iphone|ipad/.test(ua);
    this.platform = this.isMobile ? Platform.MOBILE_BROWSER : Platform.DESKTOP_BROWSER;

    var currLanguage = nav.language;
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    currLanguage = currLanguage
      ? currLanguage.split("-")[0]
      : Language.ENGLISH;
    this.language = currLanguage;

    // Detect OS
    var isAndroid = false,
      iOS = false,
      osVersion = "",
      osMainVersion = 0;
    var uaResult =
      /android (\d+(?:\.\d+)+)/i.exec(ua) ||
      /android (\d+(?:\.\d+)+)/i.exec(nav.platform);
    if (uaResult) {
      isAndroid = true;
      osVersion = uaResult[1] || "";
      osMainVersion = parseInt(osVersion) || 0;
    }
    uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);
    if (uaResult) {
      iOS = true;
      osVersion = uaResult[2] || "";
      osMainVersion = parseInt(osVersion) || 0;
    } else if (/(iPhone|iPad|iPod)/.exec(nav.platform)) {
      iOS = true;
      osVersion = "";
      osMainVersion = 0;
    }

    var osName = OperatingSystem.UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) osName = OperatingSystem.WINDOWS;
    else if (iOS) osName = OperatingSystem.IOS;
    else if (nav.appVersion.indexOf("Mac") !== -1) osName = OperatingSystem.OSX;
    else if (
      nav.appVersion.indexOf("X11") !== -1 &&
      nav.appVersion.indexOf("Linux") === -1
    )
      osName = OperatingSystem.UNKNOWN;
    else if (isAndroid) osName = OperatingSystem.ANDROID;
    else if (nav.appVersion.indexOf("Linux") !== -1) osName = OperatingSystem.LINUX;

    this.os = osName;
    this.osVersion = osVersion;
    this.osMainVersion = osMainVersion;

    // Detect browser type
    this.browserType = BrowserType.UNKNOWN;
    var self = this;
    (function () {
      var typeReg1 =
        /micromessenger|mqqbrowser|sogou|qzone|liebao|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
      var typeReg2 = /qqbrowser|qq|chrome|safari|firefox|opr|oupeng|opera/i;
      var browserTypes = typeReg1.exec(ua);
      if (!browserTypes) browserTypes = typeReg2.exec(ua);
      let browserType = browserTypes
        ? browserTypes[0]
        : BrowserType.UNKNOWN;
      if (browserType === "micromessenger")
        browserType = BrowserType.WECHAT;
      else if (browserType === "safari" && isAndroid)
        browserType = BrowserType.ANDROID;
      else if (browserType === "trident") browserType = BrowserType.IE;
      else if (browserType === "360 aphone")
        browserType = BrowserType.BROWSER_360;
      else if (browserType === "mxbrowser")
        browserType = BrowserType.MAXTHON;
      else if (browserType === "opr") browserType = BrowserType.OPERA;
      self.browserType = browserType;
    })();

    // Detect browser version
    this.browserVersion = "";
    (function () {
      var versionReg1 =
        /(mqqbrowser|micromessenger|sogou|qzone|liebao|maxthon|mxbrowser|baidu)(mobile)?(browser)?\/?([\d.]+)/i;
      var versionReg2 =
        /(msie |rv:|firefox|chrome|ucbrowser|qq|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i;
      var tmp = ua.match(versionReg1);
      if (!tmp) tmp = ua.match(versionReg2);
      self.browserVersion = tmp ? tmp[4] : "";
    })();

    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;

    this.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };

    this._checkWebGLRenderMode = () => {
      if (!this._rendererConfig.isWebGL)
        throw new Error("This feature supports WebGL render mode only.");
    };

    // Test Canvas BlendModes support
    var _tmpCanvas1 = document.createElement("canvas");
    var _tmpCanvas2 = document.createElement("canvas");

    this._supportCanvasNewBlendModes = (function () {
      var canvas = _tmpCanvas1;
      canvas.width = 1;
      canvas.height = 1;
      var context = canvas.getContext("2d");
      context.fillStyle = "#000";
      context.fillRect(0, 0, 1, 1);
      context.globalCompositeOperation = "multiply";

      var canvas2 = _tmpCanvas2;
      canvas2.width = 1;
      canvas2.height = 1;
      var context2 = canvas2.getContext("2d");
      context2.fillStyle = "#fff";
      context2.fillRect(0, 0, 1, 1);
      context.drawImage(canvas2, 0, 0, 1, 1);

      return context.getImageData(0, 0, 1, 1).data[0] === 0;
    })();

    // Adjust mobile css settings
    if (this.isMobile) {
      var fontStyle = document.createElement("style");
      fontStyle.type = "text/css";
      document.body.appendChild(fontStyle);

      fontStyle.textContent =
        "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;" +
        "-webkit-tap-highlight-color:rgba(0,0,0,0);}";
    }

    try {
      var localStorage = (this.localStorage = win.localStorage);
      localStorage.setItem("storage", "");
      localStorage.removeItem("storage");
      localStorage = null;
    } catch (e) {
      var warn = function () {
        warn(
          "Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option"
        );
      };
      this.localStorage = {
        getItem: warn,
        setItem: warn,
        removeItem: warn,
        clear: warn
      };
    }

    var _supportCanvas = !!_tmpCanvas1.getContext("2d");
    var _supportWebGL = false;
    if (win.WebGLRenderingContext) {
      var tmpCanvas = document.createElement("CANVAS");
      try {
        var context = create3DContext(tmpCanvas);
        if (context) {
          _supportWebGL = true;
        }

        if (
          _supportWebGL &&
          this.os === OperatingSystem.IOS &&
          this.osMainVersion === 9
        ) {
          if (!window.indexedDB) {
            _supportWebGL = false;
          }
        }

        if (_supportWebGL && this.os === OperatingSystem.ANDROID) {
          var browserVer = parseFloat(this.browserVersion);
          switch (this.browserType) {
            case BrowserType.MOBILE_QQ:
            case BrowserType.BAIDU:
            case BrowserType.BAIDU_APP:
              if (browserVer >= 6.2) {
                _supportWebGL = true;
              } else {
                _supportWebGL = false;
              }
              break;
            case BrowserType.CHROME:
              if (browserVer >= 30.0) {
                _supportWebGL = true;
              } else {
                _supportWebGL = false;
              }
              break;
            case BrowserType.ANDROID:
              if (this.osMainVersion && this.osMainVersion >= 5) {
                _supportWebGL = true;
              }
              break;
            case BrowserType.UNKNOWN:
            case BrowserType.BROWSER_360:
            case BrowserType.MIUI:
            case BrowserType.UC:
              _supportWebGL = false;
          }
        }
      } catch (e) {}
      tmpCanvas = null;
    }

    var capabilities = (this.capabilities = {
      canvas: _supportCanvas,
      opengl: _supportWebGL
    });
    if (
      docEle["ontouchstart"] !== undefined ||
      doc["ontouchstart"] !== undefined ||
      nav.msPointerEnabled
    )
      capabilities["touches"] = true;
    if (docEle["onmouseup"] !== undefined) capabilities["mouse"] = true;
    if (docEle["onkeyup"] !== undefined) capabilities["keyboard"] = true;
    if (win.DeviceMotionEvent || win.DeviceOrientationEvent)
      capabilities["accelerometer"] = true;
  }

  isObjectValid(obj) {
    if (obj) return true;
    else return false;
  }

  dump() {
    var str = "";
    str += "isMobile : " + this.isMobile + "\r\n";
    str += "language : " + this.language + "\r\n";
    str += "browserType : " + this.browserType + "\r\n";
    str += "browserVersion : " + this.browserVersion + "\r\n";
    str += "capabilities : " + JSON.stringify(this.capabilities) + "\r\n";
    str += "os : " + this.os + "\r\n";
    str += "osVersion : " + this.osVersion + "\r\n";
    str += "platform : " + this.platform + "\r\n";
    str +=
      "Using " +
      (this._rendererConfig.isWebGL ? "WEBGL" : "CANVAS") +
      " renderer." +
      "\r\n";
    log(str);
  }

  openURL(url) {
    window.open(url);
  }

  now() {
    if (Date.now) {
      return Date.now();
    } else {
      return +new Date();
    }
  }
}

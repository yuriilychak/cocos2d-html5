import Game from './game';

export function create3DContext(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
        try {
            context = canvas.getContext(names[ii], opt_attribs);
        } catch (e) {
        }
        if (context) {
            break;
        }
    }
    return context;
}

/**
 * System variables singleton.
 * @class
 */
export default class Sys {
    static _instance = null;

    static getInstance() {
        if (!Sys._instance) {
            Sys._instance = new Sys();
        }
        return Sys._instance;
    }

    constructor() {
        this.LANGUAGE_ENGLISH = "en";
        this.LANGUAGE_CHINESE = "zh";
        this.LANGUAGE_FRENCH = "fr";
        this.LANGUAGE_ITALIAN = "it";
        this.LANGUAGE_GERMAN = "de";
        this.LANGUAGE_SPANISH = "es";
        this.LANGUAGE_DUTCH = "du";
        this.LANGUAGE_RUSSIAN = "ru";
        this.LANGUAGE_KOREAN = "ko";
        this.LANGUAGE_JAPANESE = "ja";
        this.LANGUAGE_HUNGARIAN = "hu";
        this.LANGUAGE_PORTUGUESE = "pt";
        this.LANGUAGE_ARABIC = "ar";
        this.LANGUAGE_NORWEGIAN = "no";
        this.LANGUAGE_POLISH = "pl";
        this.LANGUAGE_UNKNOWN = "unkonwn";

        this.OS_IOS = "iOS";
        this.OS_ANDROID = "Android";
        this.OS_WINDOWS = "Windows";
        this.OS_MARMALADE = "Marmalade";
        this.OS_LINUX = "Linux";
        this.OS_BADA = "Bada";
        this.OS_BLACKBERRY = "Blackberry";
        this.OS_OSX = "OS X";
        this.OS_WP8 = "WP8";
        this.OS_WINRT = "WINRT";
        this.OS_UNKNOWN = "Unknown";

        this.UNKNOWN = -1;
        this.WIN32 = 0;
        this.LINUX = 1;
        this.MACOS = 2;
        this.ANDROID = 3;
        this.IPHONE = 4;
        this.IPAD = 5;
        this.BLACKBERRY = 6;
        this.NACL = 7;
        this.EMSCRIPTEN = 8;
        this.TIZEN = 9;
        this.WINRT = 10;
        this.WP8 = 11;
        this.MOBILE_BROWSER = 100;
        this.DESKTOP_BROWSER = 101;

        this.BROWSER_TYPE_WECHAT = "wechat";
        this.BROWSER_TYPE_ANDROID = "androidbrowser";
        this.BROWSER_TYPE_IE = "ie";
        this.BROWSER_TYPE_QQ_APP = "qq";
        this.BROWSER_TYPE_QQ = "qqbrowser";
        this.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
        this.BROWSER_TYPE_UC = "ucbrowser";
        this.BROWSER_TYPE_360 = "360browser";
        this.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
        this.BROWSER_TYPE_BAIDU = "baidubrowser";
        this.BROWSER_TYPE_MAXTHON = "maxthon";
        this.BROWSER_TYPE_OPERA = "opera";
        this.BROWSER_TYPE_OUPENG = "oupeng";
        this.BROWSER_TYPE_MIUI = "miuibrowser";
        this.BROWSER_TYPE_FIREFOX = "firefox";
        this.BROWSER_TYPE_SAFARI = "safari";
        this.BROWSER_TYPE_CHROME = "chrome";
        this.BROWSER_TYPE_LIEBAO = "liebao";
        this.BROWSER_TYPE_QZONE = "qzone";
        this.BROWSER_TYPE_SOUGOU = "sogou";
        this.BROWSER_TYPE_UNKNOWN = "unknown";

        this.isNative = false;

        var win = window, nav = win.navigator, doc = document, docEle = doc.documentElement;
        var ua = nav.userAgent.toLowerCase();

        this.isMobile = /mobile|android|iphone|ipad/.test(ua);
        this.platform = this.isMobile ? this.MOBILE_BROWSER : this.DESKTOP_BROWSER;

        var currLanguage = nav.language;
        currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
        currLanguage = currLanguage ? currLanguage.split("-")[0] : this.LANGUAGE_ENGLISH;
        this.language = currLanguage;

        // Detect OS
        var isAndroid = false, iOS = false, osVersion = '', osMainVersion = 0;
        var uaResult = /android (\d+(?:\.\d+)+)/i.exec(ua) || /android (\d+(?:\.\d+)+)/i.exec(nav.platform);
        if (uaResult) {
            isAndroid = true;
            osVersion = uaResult[1] || '';
            osMainVersion = parseInt(osVersion) || 0;
        }
        uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);
        if (uaResult) {
            iOS = true;
            osVersion = uaResult[2] || '';
            osMainVersion = parseInt(osVersion) || 0;
        }
        else if (/(iPhone|iPad|iPod)/.exec(nav.platform)) {
            iOS = true;
            osVersion = '';
            osMainVersion = 0;
        }

        var osName = this.OS_UNKNOWN;
        if (nav.appVersion.indexOf("Win") !== -1) osName = this.OS_WINDOWS;
        else if (iOS) osName = this.OS_IOS;
        else if (nav.appVersion.indexOf("Mac") !== -1) osName = this.OS_OSX;
        else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = this.OS_UNIX;
        else if (isAndroid) osName = this.OS_ANDROID;
        else if (nav.appVersion.indexOf("Linux") !== -1) osName = this.OS_LINUX;

        this.os = osName;
        this.osVersion = osVersion;
        this.osMainVersion = osMainVersion;

        // Detect browser type
        this.browserType = this.BROWSER_TYPE_UNKNOWN;
        var self = this;
        (function(){
            var typeReg1 = /micromessenger|mqqbrowser|sogou|qzone|liebao|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
            var typeReg2 = /qqbrowser|qq|chrome|safari|firefox|opr|oupeng|opera/i;
            var browserTypes = typeReg1.exec(ua);
            if(!browserTypes) browserTypes = typeReg2.exec(ua);
            var browserType = browserTypes ? browserTypes[0] : self.BROWSER_TYPE_UNKNOWN;
            if (browserType === 'micromessenger')
                browserType = self.BROWSER_TYPE_WECHAT;
            else if (browserType === "safari" && isAndroid)
                browserType = self.BROWSER_TYPE_ANDROID;
            else if (browserType === "trident")
                browserType = self.BROWSER_TYPE_IE;
            else if (browserType === "360 aphone")
                browserType = self.BROWSER_TYPE_360;
            else if (browserType === "mxbrowser")
                browserType = self.BROWSER_TYPE_MAXTHON;
            else if (browserType === "opr")
                browserType = self.BROWSER_TYPE_OPERA;
            self.browserType = browserType;
        })();

        // Detect browser version
        this.browserVersion = "";
        (function(){
            var versionReg1 = /(mqqbrowser|micromessenger|sogou|qzone|liebao|maxthon|mxbrowser|baidu)(mobile)?(browser)?\/?([\d.]+)/i;
            var versionReg2 = /(msie |rv:|firefox|chrome|ucbrowser|qq|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i;
            var tmp = ua.match(versionReg1);
            if(!tmp) tmp = ua.match(versionReg2);
            self.browserVersion = tmp ? tmp[4] : "";
        })();

        var w = window.innerWidth || document.documentElement.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight;
        var ratio = window.devicePixelRatio || 1;

        this.windowPixelResolution = {
            width: ratio * w,
            height: ratio * h
        };

        this._checkWebGLRenderMode = function () {
            if (cc._renderType !== Game.RENDER_TYPE_WEBGL)
                throw new Error("This feature supports WebGL render mode only.");
        };

        // Test Canvas BlendModes support
        var _tmpCanvas1 = document.createElement("canvas");
        var _tmpCanvas2 = document.createElement("canvas");

        this._supportCanvasNewBlendModes = (function(){
            var canvas = _tmpCanvas1;
            canvas.width = 1;
            canvas.height = 1;
            var context = canvas.getContext('2d');
            context.fillStyle = '#000';
            context.fillRect(0, 0, 1, 1);
            context.globalCompositeOperation = 'multiply';

            var canvas2 = _tmpCanvas2;
            canvas2.width = 1;
            canvas2.height = 1;
            var context2 = canvas2.getContext('2d');
            context2.fillStyle = '#fff';
            context2.fillRect(0, 0, 1, 1);
            context.drawImage(canvas2, 0, 0, 1, 1);

            return context.getImageData(0, 0, 1, 1).data[0] === 0;
        })();

        // Adjust mobile css settings
        if (this.isMobile) {
            var fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            document.body.appendChild(fontStyle);

            fontStyle.textContent = "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;"
                                    + "-webkit-tap-highlight-color:rgba(0,0,0,0);}";
        }

        try {
            var localStorage = this.localStorage = win.localStorage;
            localStorage.setItem("storage", "");
            localStorage.removeItem("storage");
            localStorage = null;
        } catch (e) {
            var warn = function () {
                cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
            };
            this.localStorage = {
                getItem : warn,
                setItem : warn,
                removeItem : warn,
                clear : warn
            };
        }

        var _supportCanvas = !!_tmpCanvas1.getContext("2d");
        var _supportWebGL = false;
        if (win.WebGLRenderingContext) {
            var tmpCanvas = document.createElement("CANVAS");
            try{
                var context = create3DContext(tmpCanvas);
                if (context) {
                    _supportWebGL = true;
                }

                if (_supportWebGL && this.os === this.OS_IOS && this.osMainVersion === 9) {
                    if (!window.indexedDB) {
                        _supportWebGL = false;
                    }
                }

                if (_supportWebGL && this.os === this.OS_ANDROID) {
                    var browserVer = parseFloat(this.browserVersion);
                    switch (this.browserType) {
                    case this.BROWSER_TYPE_MOBILE_QQ:
                    case this.BROWSER_TYPE_BAIDU:
                    case this.BROWSER_TYPE_BAIDU_APP:
                        if (browserVer >= 6.2) {
                            _supportWebGL = true;
                        }
                        else {
                            _supportWebGL = false;
                        }
                        break;
                    case this.BROWSER_TYPE_CHROME:
                        if(browserVer >= 30.0) {
                          _supportWebGL = true;
                        } else {
                          _supportWebGL = false;
                        }
                        break;
                    case this.BROWSER_TYPE_ANDROID:
                        if (this.osMainVersion && this.osMainVersion >= 5) {
                            _supportWebGL = true;
                        }
                        break;
                    case this.BROWSER_TYPE_UNKNOWN:
                    case this.BROWSER_TYPE_360:
                    case this.BROWSER_TYPE_MIUI:
                    case this.BROWSER_TYPE_UC:
                        _supportWebGL = false;
                    }
                }
            }
            catch (e) {}
            tmpCanvas = null;
        }

        var capabilities = this.capabilities = {
            "canvas": _supportCanvas,
            "opengl": _supportWebGL
        };
        if (docEle['ontouchstart'] !== undefined || doc['ontouchstart'] !== undefined || nav.msPointerEnabled)
            capabilities["touches"] = true;
        if (docEle['onmouseup'] !== undefined)
            capabilities["mouse"] = true;
        if (docEle['onkeyup'] !== undefined)
            capabilities["keyboard"] = true;
        if (win.DeviceMotionEvent || win.DeviceOrientationEvent)
            capabilities["accelerometer"] = true;
    }

    garbageCollect() {
        // N/A in cocos2d-html5
    }

    dumpRoot() {
        // N/A in cocos2d-html5
    }

    restartVM() {
        // N/A in cocos2d-html5
    }

    cleanScript(jsfile) {
        // N/A in cocos2d-html5
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
        str += "Using " + (cc._renderType === Game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer." + "\r\n";
        cc.log(str);
    }

    openURL(url) {
        window.open(url);
    }

    now() {
        if (Date.now) {
            return Date.now();
        }
        else {
            return +(new Date);
        }
    }
}

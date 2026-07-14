import LoaderStrategy from "./loader-strategy";

const _isNodeJs =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export default class TextLoaderStrategy extends LoaderStrategy {
  get supportedTypes() {
    return ["txt", "xml", "vsh", "fsh", "atlas"];
  }

  get tileMapTypes() {
    return ["tmx", "tsx"];
  }

  constructor(loader) {
    super(loader);
  }

  load(realUrl, url, res, cb) {
    if (!_isNodeJs) {
      var xhr = this.loader.XMLHttpRequest;
      var errInfo = "load " + realUrl + " failed!";
      xhr.open("GET", realUrl, true);
      if (
        /msie/i.test(navigator.userAgent) &&
        !/opera/i.test(navigator.userAgent)
      ) {
        xhr.setRequestHeader("Accept-Charset", "utf-8");
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4)
            xhr.status === 200 || xhr.status === 0
              ? cb(null, xhr.responseText)
              : cb({ status: xhr.status, errorMessage: errInfo }, null);
        };
      } else {
        if (xhr.overrideMimeType)
          xhr.overrideMimeType("text\\/plain; charset=utf-8");
        var loadCallback = () => {
          xhr.removeEventListener("load", loadCallback);
          xhr.removeEventListener("error", errorCallback);
          if (xhr._timeoutId >= 0) clearTimeout(xhr._timeoutId);
          else xhr.removeEventListener("timeout", timeoutCallback);
          if (xhr.readyState === 4) {
            xhr.status === 200 || xhr.status === 0
              ? cb(null, xhr.responseText)
              : cb({ status: xhr.status, errorMessage: errInfo }, null);
          }
        };
        var errorCallback = () => {
          xhr.removeEventListener("load", loadCallback);
          xhr.removeEventListener("error", errorCallback);
          if (xhr._timeoutId >= 0) clearTimeout(xhr._timeoutId);
          else xhr.removeEventListener("timeout", timeoutCallback);
          cb({ status: xhr.status, errorMessage: errInfo }, null);
        };
        var timeoutCallback = () => {
          xhr.removeEventListener("load", loadCallback);
          xhr.removeEventListener("error", errorCallback);
          if (xhr._timeoutId >= 0) clearTimeout(xhr._timeoutId);
          else xhr.removeEventListener("timeout", timeoutCallback);
          cb(
            { status: xhr.status, errorMessage: "Request timeout: " + errInfo },
            null
          );
        };
        xhr.addEventListener("load", loadCallback);
        xhr.addEventListener("error", errorCallback);
        if (xhr.ontimeout === undefined)
          xhr._timeoutId = setTimeout(timeoutCallback, xhr.timeout);
        else xhr.addEventListener("timeout", timeoutCallback);
      }
      xhr.send(null);
    } else {
      var fs = require("fs");
      fs.readFile(realUrl, (err, data) => {
        err ? cb(err) : cb(null, data.toString());
      });
    }
  }
}

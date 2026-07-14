import LoaderStrategy from "./loader-strategy";
import { LoaderStrategyKey } from "../../enums";

export default class CsbLoaderStrategy extends LoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.CSB;
  }
  get supportedTypes() {
    return ["csb"];
  }

  constructor(loader) {
    super(loader);
  }

  load(url, cb) {
    var xhr = this.loader.XMLHttpRequest;
    var errInfo = "load " + url + " failed!";
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    var loadCallback = () => {
      xhr.removeEventListener("load", loadCallback);
      xhr.removeEventListener("error", errorCallback);
      if (xhr._timeoutId >= 0) clearTimeout(xhr._timeoutId);
      else xhr.removeEventListener("timeout", timeoutCallback);
      var arrayBuffer = xhr.response;
      if (arrayBuffer) window.msg = arrayBuffer;
      if (xhr.readyState === 4) {
        xhr.status === 200 || xhr.status === 0
          ? cb(null, xhr.response)
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
    xhr.send(null);
  }
}

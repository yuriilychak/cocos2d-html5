import { log } from "../debugger";
import LoaderStrategy from "./loader-strategy";
import { LoaderStrategyKey } from "../../enums";

export default class BinaryLoaderStrategy extends LoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.BINARY;
  }

  constructor(loader) {
    super(loader);
  }

  load(realUrl, url, res, cb) {
    var xhr = this.loader.XMLHttpRequest;
    var errInfo = "load " + realUrl + " failed!";
    xhr.open("GET", realUrl, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? cb(null, new Uint8Array(xhr.response))
        : cb(errInfo);
    };
    xhr.send(null);
  }

  loadSync(url) {
    var req = this.loader.XMLHttpRequest;
    req.timeout = 0;
    var errInfo = "load " + url + " failed!";
    req.open("GET", url, false);
    req.send(null);
    if (req.status !== 200) {
      log(errInfo);
      return null;
    }
    return this.#str2Uint8Array(req.responseText);
  }

  #str2Uint8Array(strData) {
    if (!strData) return null;

    var arrData = new Uint8Array(strData.length);
    for (var i = 0; i < strData.length; i++) {
      arrData[i] = strData.charCodeAt(i) & 0xff;
    }
    return arrData;
  }
}

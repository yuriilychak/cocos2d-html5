import Path from "../path";
import { isString } from "../utils";
import LoaderStrategy from "./loader-strategy";
import { LoaderStrategyKey } from "../../enums";

export default class FontLoaderStrategy extends LoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.FONT;
  }
  get supportedTypes() {
    return ["font", "eot", "ttf", "woff", "svg", "ttc"];
  }

  constructor(loader) {
    super(loader);
  }

  #type = {
    ".eot": "embedded-opentype",
    ".ttf": "truetype",
    ".ttc": "truetype",
    ".woff": "woff",
    ".svg": "svg"
  };

  #loadFont(name, srcs, type) {
    var doc = document;
    var fontStyle = document.createElement("style");
    fontStyle.type = "text/css";
    doc.body.appendChild(fontStyle);

    var fontStr = "";
    if (isNaN(name - 0))
      fontStr += "@font-face { font-family:" + name + "; src:";
    else fontStr += "@font-face { font-family:'" + name + "'; src:";
    if (srcs instanceof Array) {
      for (var i = 0, li = srcs.length; i < li; i++) {
        var src = srcs[i];
        type = Path.extname(src).toLowerCase();
        fontStr += "url('" + srcs[i] + "') format('" + this.#type[type] + "')";
        fontStr += i === li - 1 ? ";" : ",";
      }
    } else {
      type = type.toLowerCase();
      fontStr += "url('" + srcs + "') format('" + this.#type[type] + "');";
    }
    fontStyle.textContent += fontStr + "}";

    var preloadDiv = document.createElement("div");
    var divStyle = preloadDiv.style;
    divStyle.fontFamily = name;
    preloadDiv.innerHTML = ".";
    divStyle.position = "absolute";
    divStyle.left = "-100px";
    divStyle.top = "-100px";
    doc.body.appendChild(preloadDiv);
  }

  load(realUrl, url, res, cb) {
    var type = res.type;
    var name = res.name;
    var srcs = res.srcs;
    if (isString(res)) {
      type = Path.extname(res);
      name = Path.basename(res, type);
      this.#loadFont(name, res, type);
    } else {
      this.#loadFont(name, srcs);
    }
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load("1em " + name).then(
        () => cb(null, true),
        (err) => cb(err)
      );
    } else {
      cb(null, true);
    }
  }
}

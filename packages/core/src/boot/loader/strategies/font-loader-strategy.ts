import Path from "../../path";
import { isString } from "../../utils";
import LoaderStrategy from "./loader-strategy";
import { LoaderStrategyKey } from "../../../enums";
import type { LoaderCallback, LoaderInterface } from "../types";

export default class FontLoaderStrategy extends LoaderStrategy<boolean> {
  constructor(loader: LoaderInterface) {
    super(loader, LoaderStrategyKey.FONT, ["font", "eot", "ttf", "woff", "svg", "ttc"]);
  }

  #type: Record<string, string> = {
    ".eot": "embedded-opentype",
    ".ttf": "truetype",
    ".ttc": "truetype",
    ".woff": "woff",
    ".svg": "svg"
  };

  #loadFont(name: string, res: string, type: string): void;
  #loadFont(name: string, srcs: string[]): void;
  #loadFont(name: string, srcsOrRes: string[] | string, type?: string): void {
    var doc = document;
    var fontStyle = document.createElement("style");
    fontStyle.type = "text/css";
    doc.body.appendChild(fontStyle);

    let fontStr = Number.isNaN(Number(name))
      ? `@font-face { font-family:${name}; src:`
      : `@font-face { font-family:'${name}'; src:`;
      
    if (srcsOrRes instanceof Array) {
      for (let i = 0, li = srcsOrRes.length; i < li; i++) {
        const src = srcsOrRes[i];
        const fontType = Path.extname(src).toLowerCase();
        fontStr += `url('${srcsOrRes[i]}') format('${this.#type[fontType]}')`;
        fontStr += i === li - 1 ? ";" : ",";
      }
    } else {
      const fontType = type!.toLowerCase();
      fontStr += `url('${srcsOrRes}') format('${this.#type[fontType]}');`;
    }
    fontStyle.textContent += fontStr + "}";

    const preloadDiv = document.createElement("div");
    const divStyle = preloadDiv.style;
    divStyle.fontFamily = name;
    preloadDiv.innerHTML = ".";
    divStyle.position = "absolute";
    divStyle.left = "-100px";
    divStyle.top = "-100px";
    doc.body.appendChild(preloadDiv);
  }

  load(realUrl: string, url: string, res: { type: string, name: string, srcs: string[] } | string, cb: LoaderCallback<boolean>) {
    let type: string;
    let name: string;
    let srcs: string[];

    if (isString(res)) {
      type = Path.extname(res);
      name = Path.basename(res, type);
      this.#loadFont(name, res, type);
    } else {
      type = res.type;
      name = res.name;
      srcs = res.srcs;
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

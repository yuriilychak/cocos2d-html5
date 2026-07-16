import FileLoaderStrategy from "./file-loader-strategy";
import { plistParser } from "../../../platform/sax-parser";
import { LoaderStrategyKey } from "../../../enums";

import type { LoaderInterface } from "../types";

export default class PlistLoaderStrategy extends FileLoaderStrategy<object> {
  constructor(loader: LoaderInterface) {
    super(loader, LoaderStrategyKey.PLIST, ["plist"]);
  }

  protected resultMiddleware(request: XMLHttpRequest): object {
    return plistParser.parse(request.responseText) as object;
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.overrideMimeType("text\\/plain; charset=utf-8");
  }
}

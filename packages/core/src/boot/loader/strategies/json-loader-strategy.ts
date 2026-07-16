import { LoaderStrategyKey } from "../../../enums";
import FileLoaderStrategy from "./file-loader-strategy";

import type { LoaderInterface } from "../types";

export default class JsonLoaderStrategy extends FileLoaderStrategy<object> {
  constructor(loader: LoaderInterface) {
    super(loader, LoaderStrategyKey.JSON, ["json", "ExportJson"]);
  }

  protected resultMiddleware(request: XMLHttpRequest): object {
      return JSON.parse(request.responseText);
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.overrideMimeType("text\\/plain; charset=utf-8");
  }
}

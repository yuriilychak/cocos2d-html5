import { LoaderStrategyKey } from "../../../enums";
import FileLoaderStrategy from "./file-loader-strategy";
export default class JsonLoaderStrategy extends FileLoaderStrategy<object> {
  constructor() {
    super(LoaderStrategyKey.JSON, ["json", "ExportJson"]);
  }

  protected resultMiddleware(request: XMLHttpRequest): object {
      return JSON.parse(request.responseText);
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.overrideMimeType("text\\/plain; charset=utf-8");
  }
}

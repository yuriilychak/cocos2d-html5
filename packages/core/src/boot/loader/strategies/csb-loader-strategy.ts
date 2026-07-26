import { LoaderStrategyKey } from "../../../enums";
import FileLoaderStrategy from "./file-loader-strategy";

export default class CsbLoaderStrategy extends FileLoaderStrategy<ArrayBuffer> {
  constructor() {
    super(LoaderStrategyKey.CSB, ["csb"]);
  }

  protected resultMiddleware(request: XMLHttpRequest): ArrayBuffer {
    return request.response;
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.responseType = "arraybuffer";
  }
}

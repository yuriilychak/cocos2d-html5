import { LoaderStrategyKey } from "../../enums";
import type { LoaderInterface } from "../types";
import FileLoaderStrategy from "./file-loader-strategy";

export default class CsbLoaderStrategy extends FileLoaderStrategy<ArrayBuffer> {
  constructor(loader: LoaderInterface) {
    super(loader, LoaderStrategyKey.CSB, ["csb"]);
  }

  protected resultMiddleware(request: XMLHttpRequest): ArrayBuffer {
    return request.response;
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.responseType = "arraybuffer";
  }
}

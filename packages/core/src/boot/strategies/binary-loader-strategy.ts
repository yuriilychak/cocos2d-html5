import { log } from "../debugger";
import { LoaderStrategyKey } from "../../enums";
import FileLoaderStrategy from "./file-loader-strategy";

import type { LoaderInterface } from "../types";

export default class BinaryLoaderStrategy extends FileLoaderStrategy<Uint8Array> {
  constructor(loader: LoaderInterface) {
    super(loader, LoaderStrategyKey.BINARY);
  }

  protected resultMiddleware(request: XMLHttpRequest): Uint8Array {
    return new Uint8Array(request.response);
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.responseType = "arraybuffer";
  }

  public loadSync(url: string): Uint8Array | null {
   const request = this.loader.XMLHttpRequest;

    request.timeout = 0;
    request.open("GET", url, false);
    request.send(null);

    if (request.status !== 200) {
      log( `load ${url} failed!`);
      return null;
    }

    const rawBinary = request.responseText;

    if (!rawBinary) {
      return null;
    }

    const charCount = rawBinary.length;
    const result = new Uint8Array(charCount);

    for (let i = 0; i < charCount; ++i) {
      result[i] = rawBinary.charCodeAt(i) & 0xff;
    }
    return result;
  }
}

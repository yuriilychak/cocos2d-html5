import { LoaderStrategyKey } from "../../enums";
import FileLoaderStrategy from "./file-loader-strategy";

import type { LoaderInterface } from '../types';

export default class TextLoaderStrategy extends FileLoaderStrategy<string> {
  constructor(loader: LoaderInterface) {
    super(loader, LoaderStrategyKey.TEXT , ["txt", "xml", "vsh", "fsh", "atlas"]);
  }

  protected resultMiddleware(request: XMLHttpRequest): string {
    return request.responseText;
  }

  protected prepareRequest(request: XMLHttpRequest): void {
    request.overrideMimeType("text\\/plain; charset=utf-8");
  }

  get tileMapTypes(): string[] {
    return ["tmx", "tsx"];
  }
}

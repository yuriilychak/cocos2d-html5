import ImageLoaderStrategy from "./image-loader-strategy";
import { LoaderStrategyKey } from "../../enums";
import type { LoaderCallback, LoaderInterface } from "../types";
import type { Texture2D } from "../../textures";
import type { Sys } from "../../sys";

export default class ServerImageLoaderStrategy extends ImageLoaderStrategy {
  constructor(sys: Sys, loader: LoaderInterface) {
    super(sys, loader, LoaderStrategyKey.SERVER_IMAGE, ["serverImg"]);
  }

  load(realUrl: string, url: string, res: HTMLImageElement, cb: LoaderCallback<Texture2D>) {
    return super.load(res.src, url, res, cb);
  }
}

import ImageLoaderStrategy from "./image-loader-strategy";
import { LoaderStrategyKey } from "../../enums";

export default class ServerImageLoaderStrategy extends ImageLoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.SERVER_IMAGE;
  }
  get supportedTypes() {
    return ["serverImg"];
  }

  constructor(sys, loader) {
    super(sys, loader);
  }

  load(realUrl, url, res, cb) {
    return super.load(res.src, url, res, cb);
  }
}

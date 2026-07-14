import TextLoaderStrategy from "./text-loader-strategy";
import { LoaderStrategyKey } from "../../enums";

export default class JsonLoaderStrategy extends TextLoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.JSON;
  }
  get supportedTypes() {
    return ["json", "ExportJson"];
  }

  load(realUrl, url, res, cb) {
    super.load(realUrl, (err, txt) => {
      if (err) {
        cb(err);
      } else {
        try {
          var result = JSON.parse(txt);
        } catch (e) {
          throw new Error("parse json [" + realUrl + "] failed : " + e);
        }
        cb(null, result);
      }
    });
  }
}

import TextLoaderStrategy from "./text-loader-strategy";
import { plistParser } from "../../platform/sax-parser";
import { LoaderStrategyKey } from "../../enums";

export default class PlistLoaderStrategy extends TextLoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.PLIST;
  }
  get supportedTypes() {
    return ["plist"];
  }

  load(realUrl, url, res, cb) {
    super.load(realUrl, url, res, (err, txt) =>
      err ? cb(err) : cb(null, plistParser.parse(txt))
    );
  }
}

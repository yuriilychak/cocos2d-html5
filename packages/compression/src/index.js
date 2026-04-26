import { inflate } from "pako";
import { GZip } from "./gzip";
import { CodecBase64, uint8ArrayToUint32Array } from "./codec-base64";
import {
  Codec,
  unzip,
  unzipBase64,
  unzipBase64AsArray,
  unzipAsArray,
  stringToArray
} from "./zip-utils";

// Wire up Codec sub-objects
Codec.GZip = GZip;
Codec.Base64 = CodecBase64;

// cc globals
cc.Codec = Codec;
cc.unzip = unzip;
cc.unzipBase64 = unzipBase64;
cc.unzipBase64AsArray = unzipBase64AsArray;
cc.unzipAsArray = unzipAsArray;
cc.StringToArray = stringToArray;
cc.uint8ArrayToUint32Array = uint8ArrayToUint32Array;
cc.inflate = inflate;

export {
  GZip,
  CodecBase64,
  Codec,
  unzip,
  unzipBase64,
  unzipBase64AsArray,
  unzipAsArray,
  stringToArray,
  uint8ArrayToUint32Array,
  inflate
};

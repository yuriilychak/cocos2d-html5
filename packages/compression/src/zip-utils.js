import { GZip } from "./gzip";
import { CodecBase64 } from "./codec-base64";

export const Codec = { name: 'Jacob__Codec' };

export function unzip() {
  return GZip.gunzip.apply(GZip, arguments);
}

export function unzipBase64() {
  var tmpInput = CodecBase64.decode.apply(CodecBase64, arguments);
  return GZip.gunzip.apply(GZip, [tmpInput]);
}

export function unzipBase64AsArray(input, bytes) {
  bytes = bytes || 1;

  var dec = unzipBase64(input),
    ar = [], i, j, len;
  for (i = 0, len = dec.length / bytes; i < len; i++) {
    ar[i] = 0;
    for (j = bytes - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
    }
  }
  return ar;
}

export function unzipAsArray(input, bytes) {
  bytes = bytes || 1;

  var dec = unzip(input),
    ar = [], i, j, len;
  for (i = 0, len = dec.length / bytes; i < len; i++) {
    ar[i] = 0;
    for (j = bytes - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
    }
  }
  return ar;
}

export function stringToArray(input) {
  var tmp = input.split(","), ar = [], i;
  for (i = 0; i < tmp.length; i++) {
    ar.push(parseInt(tmp[i]));
  }
  return ar;
}

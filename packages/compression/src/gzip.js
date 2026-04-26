import { ungzip } from "pako";

/**
 * Thin wrapper around pako.ungzip. Accepts and returns a binary string
 * (same contract as the legacy Jacob__GZip implementation).
 */
export const GZip = {
  gunzip(string) {
    const bytes = new Uint8Array(string.length);
    for (let i = 0; i < string.length; i++) {
      bytes[i] = string.charCodeAt(i);
    }
    const result = ungzip(bytes);
    let out = "";
    for (let i = 0; i < result.length; i++) {
      out += String.fromCharCode(result[i]);
    }
    return out;
  }
};


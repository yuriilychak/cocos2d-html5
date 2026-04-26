export const CodecBase64 = {
  name: "Jacob__Codec__Base64",

  decode(input) {
    // Strip non-Base64 characters (e.g. whitespace) then decode via native atob()
    return atob(input.replace(/[^A-Za-z0-9+/=]/g, ""));
  },

  decodeAsArray(input, bytes) {
    var dec = this.decode(input),
      ar = [],
      i,
      j,
      len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
      ar[i] = 0;
      for (j = bytes - 1; j >= 0; --j) {
        ar[i] += dec.charCodeAt(i * bytes + j) << (j * 8);
      }
    }

    return ar;
  }
};

export function uint8ArrayToUint32Array(uint8Arr) {
  if (uint8Arr.length % 4 !== 0) return null;

  var arrLen = uint8Arr.length / 4;
  var retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];
  for (var i = 0; i < arrLen; i++) {
    var offset = i * 4;
    retArr[i] =
      uint8Arr[offset] +
      uint8Arr[offset + 1] * (1 << 8) +
      uint8Arr[offset + 2] * (1 << 16) +
      uint8Arr[offset + 3] * (1 << 24);
  }
  return retArr;
}

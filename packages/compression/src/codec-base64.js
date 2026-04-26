export const CodecBase64 = {
  name: 'Jacob__Codec__Base64',

  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  decode(input) {
    var output = [],
      chr1, chr2, chr3,
      enc1, enc2, enc3, enc4,
      i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output.push(String.fromCharCode(chr1));

      if (enc3 !== 64) {
        output.push(String.fromCharCode(chr2));
      }
      if (enc4 !== 64) {
        output.push(String.fromCharCode(chr3));
      }
    }

    output = output.join('');

    return output;
  },

  decodeAsArray(input, bytes) {
    var dec = this.decode(input),
      ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
      ar[i] = 0;
      for (j = bytes - 1; j >= 0; --j) {
        ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
      }
    }

    return ar;
  }
};

export function uint8ArrayToUint32Array(uint8Arr) {
  if (uint8Arr.length % 4 !== 0)
    return null;

  var arrLen = uint8Arr.length / 4;
  var retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];
  for (var i = 0; i < arrLen; i++) {
    var offset = i * 4;
    retArr[i] = uint8Arr[offset] + uint8Arr[offset + 1] * (1 << 8) + uint8Arr[offset + 2] * (1 << 16) + uint8Arr[offset + 3] * (1 << 24);
  }
  return retArr;
}

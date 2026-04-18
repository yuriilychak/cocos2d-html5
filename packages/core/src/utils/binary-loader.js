/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Helper to convert from responseBody to a "responseText" like thing (IE compat).
 * @function
 * @param {Object} binary
 * @return {String}
 */
export function _convertResponseBodyToText(binary) {
    var byteMapping = {};
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            byteMapping[ String.fromCharCode(i + j * 256) ] =
                String.fromCharCode(i) + String.fromCharCode(j);
        }
    }
    var rawBytes = IEBinaryToArray_ByteStr(binary);
    var lastChr = IEBinaryToArray_ByteStr_Last(binary);
    return rawBytes.replace(/[\s\S]/g,
        function (match) {
            return byteMapping[match];
        }) + lastChr;
}

/**
 * Load binary data by url.
 * @function
 * @param {String} url
 * @param {Function} [cb]
 */
export function loadBinary(url, cb) {
    var self = cc.loader;
    var xhr = self.getXMLHttpRequest(),
        errInfo = "load " + url + " failed!";
    xhr.open("GET", url, true);
    xhr.responseType = 'arraybuffer';
    if (_IEFilter) {
        // IE-specific logic here
        xhr.setRequestHeader("Accept-Charset", "x-user-defined");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var fileContents = cc._convertResponseBodyToText(xhr["responseBody"]);
                cb(null, _str2Uint8Array(fileContents));
            } else cb(errInfo);
        };
    } else {
        if (xhr.overrideMimeType) xhr.overrideMimeType("text\/plain; charset=x-user-defined");
        xhr.onload = function () {
            xhr.readyState === 4 && xhr.status === 200 ? cb(null, new Uint8Array(xhr.response)) : cb(errInfo);
        };
    }
    xhr.send(null);
}

var _IEFilter = (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) && window.IEBinaryToArray_ByteStr && window.IEBinaryToArray_ByteStr_Last);

export function _str2Uint8Array(strData) {
    if (!strData)
        return null;

    var arrData = new Uint8Array(strData.length);
    for (var i = 0; i < strData.length; i++) {
        arrData[i] = strData.charCodeAt(i) & 0xff;
    }
    return arrData;
}

/**
 * Load binary data by url synchronously
 * @function
 * @param {String} url
 * @return {Uint8Array}
 */
export function loadBinarySync(url) {
    var self = cc.loader;
    var req = self.getXMLHttpRequest();
    req.timeout = 0;
    var errInfo = "load " + url + " failed!";
    req.open('GET', url, false);
    var arrayInfo = null;
    if (_IEFilter) {
        req.setRequestHeader("Accept-Charset", "x-user-defined");
        req.send(null);
        if (req.status !== 200) {
            cc.log(errInfo);
            return null;
        }

        var fileContents = cc._convertResponseBodyToText(req["responseBody"]);
        if (fileContents) {
            arrayInfo = _str2Uint8Array(fileContents);
        }
    } else {
        if (req.overrideMimeType)
            req.overrideMimeType('text\/plain; charset=x-user-defined');
        req.send(null);
        if (req.status !== 200) {
            cc.log(errInfo);
            return null;
        }

        arrayInfo = _str2Uint8Array(req.responseText);
    }
    return arrayInfo;
}

/**
 * Initialize binary loader by attaching methods to cc.loader and
 * injecting IE VBScript compatibility if needed.
 * @function
 */
export function initBinaryLoader() {
    cc.loader.loadBinary = loadBinary;
    cc.loader.loadBinary._IEFilter = _IEFilter;
    cc.loader._str2Uint8Array = _str2Uint8Array;
    cc.loader.loadBinarySync = loadBinarySync;

    //Compatibility with IE9
    window.Uint8Array = window.Uint8Array || window.Array;

    if (_IEFilter) {
        var IEBinaryToArray_ByteStr_Script =
            "<!-- IEBinaryToArray_ByteStr -->\r\n" +
                "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
                "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
                "End Function\r\n" +
                "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
                "   Dim lastIndex\r\n" +
                "   lastIndex = LenB(Binary)\r\n" +
                "   if lastIndex mod 2 Then\r\n" +
                "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
                "   Else\r\n" +
                "       IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
                "   End If\r\n" +
                "End Function\r\n";

        // inject VBScript
        var myVBScript = document.createElement('script');
        myVBScript.type = "text/vbscript";
        myVBScript.textContent = IEBinaryToArray_ByteStr_Script;
        document.body.appendChild(myVBScript);

        cc._convertResponseBodyToText = _convertResponseBodyToText;
    }
}

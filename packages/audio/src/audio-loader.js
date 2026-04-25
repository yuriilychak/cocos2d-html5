import { audioSupport } from "./audio-support.js";

// Detect which audio formats the browser supports
const supportedFormats = [];
(function () {
  const audio = document.createElement("audio");
  if (audio.canPlayType) {
    const ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
    if (ogg && ogg !== "") supportedFormats.push(".ogg");
    const mp3 = audio.canPlayType("audio/mpeg");
    if (mp3 && mp3 !== "") supportedFormats.push(".mp3");
    const wav = audio.canPlayType('audio/wav; codecs="1"');
    if (wav && wav !== "") supportedFormats.push(".wav");
    const mp4 = audio.canPlayType("audio/mp4");
    if (mp4 && mp4 !== "") supportedFormats.push(".mp4");
    const m4a = audio.canPlayType("audio/x-m4a");
    if (m4a && m4a !== "") supportedFormats.push(".m4a");
  }
})();

// Create Web Audio context and attach to cc.Audio
try {
  if (audioSupport.WEB_AUDIO) {
    let context = new (
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext
    )();
    cc.Audio._context = context;
    // check context integrity
    if (
      !context["createBufferSource"] ||
      !context["createGain"] ||
      !context["destination"] ||
      !context["decodeAudioData"]
    ) {
      throw "context is incomplete";
    }
    if (audioSupport.DELAY_CREATE_CTX) {
      setTimeout(function () {
        context = new (
          window.AudioContext ||
          window.webkitAudioContext ||
          window.mozAudioContext
        )();
        cc.Audio._context = context;
      }, 0);
    }
  }
} catch (error) {
  audioSupport.WEB_AUDIO = false;
  cc.log("browser don't support web audio");
}

class AudioLoader {
  constructor() {
    this.cache = {};
    this.useWebAudio = true;
  }

  loadBuffer(url, cb) {
    if (!audioSupport.WEB_AUDIO) return; // WebAudio Buffer

    const request = cc.loader.getXMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function () {
      if (request._timeoutId >= 0) {
        clearTimeout(request._timeoutId);
      }
      cc.Audio._context["decodeAudioData"](
        request.response,
        //success
        (buffer) => cb(null, buffer),
        //error
        () => cb("decode error - " + url)
      );
    };

    request.onerror = function () {
      cb("request error - " + url);
    };
    if (request.ontimeout === undefined) {
      request._timeoutId = setTimeout(function () {
        request.ontimeout();
      }, request.timeout);
    }
    request.ontimeout = function () {
      cb("request timeout - " + url);
    };

    request.send();
  }

  load(realUrl, url, res, cb) {
    if (supportedFormats.length === 0) return cb("can not support audio!");

    let audio = cc.loader.getRes(url);
    if (audio) return cb(null, audio);

    if (cc.loader.audioPath)
      realUrl = cc.path.join(cc.loader.audioPath, realUrl);

    const extname = cc.path.extname(realUrl);

    const typeList = [extname];
    for (let i = 0; i < supportedFormats.length; i++) {
      if (extname !== supportedFormats[i]) {
        typeList.push(supportedFormats[i]);
      }
    }

    audio = new cc.Audio(realUrl);
    cc.loader.cache[url] = audio;
    this.loadAudioFromExtList(realUrl, typeList, audio, cb);
    return audio;
  }

  loadAudioFromExtList(realUrl, typeList, audio, cb) {
    if (typeList.length === 0) {
      let ERRSTR = "can not found the resource of audio! Last match url is : ";
      ERRSTR += realUrl.replace(/\.(.*)?$/, "(");
      supportedFormats.forEach(function (ext) {
        ERRSTR += ext + "|";
      });
      ERRSTR = ERRSTR.replace(/\|$/, ")");
      return cb({ status: 520, errorMessage: ERRSTR }, null);
    }

    if (audioSupport.WEB_AUDIO && this.useWebAudio) {
      this.loadBuffer(realUrl, function (error, buffer) {
        if (error) cc.log(error);

        if (buffer) audio.setBuffer(buffer);

        cb(null, audio);
      });
      return;
    }

    const num = audioSupport.ONE_SOURCE ? 1 : typeList.length;

    // 加载统一使用dom
    const dom = document.createElement("audio");
    for (let i = 0; i < num; i++) {
      const source = document.createElement("source");
      source.src = cc.path.changeExtname(realUrl, typeList[i]);
      dom.appendChild(source);
    }

    audio.setElement(dom);

    const timer = setTimeout(function () {
      if (dom.readyState === 0) {
        failure();
      } else {
        success();
      }
    }, 8000);

    const success = function () {
      dom.removeEventListener("canplaythrough", success, false);
      dom.removeEventListener("error", failure, false);
      dom.removeEventListener("emptied", success, false);
      if (audioSupport.USE_LOADER_EVENT)
        dom.removeEventListener(audioSupport.USE_LOADER_EVENT, success, false);
      clearTimeout(timer);
      cb(null, audio);
    };
    const failure = function () {
      cc.log("load audio failure - " + realUrl);
      success();
    };
    dom.addEventListener("canplaythrough", success, false);
    dom.addEventListener("error", failure, false);
    if (audioSupport.USE_LOADER_EVENT)
      dom.addEventListener(audioSupport.USE_LOADER_EVENT, success, false);
  }
}

export const loader = new AudioLoader();
cc.loader.register(["mp3", "ogg", "wav", "mp4", "m4a"], loader);

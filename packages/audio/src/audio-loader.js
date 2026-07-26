import {
  Path,
  log,
  LoaderStrategy,
  LoaderStrategyKey
} from "@aspect/core";
import Audio from "./audio";
export default class AudioLoader extends LoaderStrategy {
  #useWebAudio = true;
  #audioSupport;

  constructor(audioSupport) {
    super(LoaderStrategyKey.AUDIO, ["mp3", "ogg", "wav", "mp4", "m4a"]);
    this.#audioSupport = audioSupport;

  }

  get useWebAudio() {
    return this.#useWebAudio;
  }

  set useWebAudio(value) {
    this.#useWebAudio = value;
  }

  getBasePath() {
    return this.loader.audioPath || this.loader.resPath;
  }

  loadBuffer(url, cb) {
    if (!this.#audioSupport.webAudio) {
      return; // WebAudio Buffer
    }

    const request = this.loader.XMLHttpRequest;
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload =  () => {
      if (request._timeoutId >= 0) {
        clearTimeout(request._timeoutId);
      }
      this.#audioSupport.audioContext["decodeAudioData"](
        request.response,
        //success
        (buffer) => cb(null, buffer),
        //error
        () => cb("decode error - " + url)
      );
    };

    request.onerror = () => cb("request error - " + url);
    request.ontimeout = () => cb("request timeout - " + url);

    if (request.ontimeout === undefined) {
      request._timeoutId = setTimeout( () => request.ontimeout(), request.timeout);
    }

    request.send();
  }

  load(realUrl, url, res, cb) {
    if (!this.#audioSupport.supportAudio) {
      return cb("can not support audio!");
    }

    let audio = this.loader.get(url);

    if (audio) {
      return cb(null, audio);
    }

    const extname = Path.extname(realUrl);

    const typeList = this.#audioSupport.supportedFormats.slice();
    const index = typeList.indexOf(extname);

    if (index !== 0) {
      if(index !== -1) {
        typeList.splice(index, 1);
      }

      typeList.unshift(extname);
    }

    audio = new Audio(realUrl);
    this.loader.set(url, audio);
    this.loadAudioFromExtList(realUrl, typeList, audio, cb);
    return audio;
  }

  loadAudioFromExtList(realUrl, typeList, audio, cb) {
    if (typeList.length === 0) {
      const errorMessage = [
        "can not found the resource of audio! Last match url is : ",
        realUrl.replace(/\.(.*)?$/, "("),
        this.#audioSupport.supportedFormats.join("|"),
        ")"
      ].join("");

      return cb({ status: 520, errorMessage }, null);
    }

    if (this.#audioSupport.webAudio && this.useWebAudio) {
      this.loadBuffer(realUrl, function (error, buffer) {
        if (error) log(error);

        if (buffer) audio.setBuffer(buffer);

        cb(null, audio);
      });
      return;
    }

    const num = this.#audioSupport.oneSource ? 1 : typeList.length;

    const dom = document.createElement("audio");
    for (let i = 0; i < num; i++) {
      const source = document.createElement("source");
      source.src = Path.changeExtname(realUrl, typeList[i]);
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

    const success = () => {
      dom.removeEventListener("canplaythrough", success, false);
      dom.removeEventListener("error", failure, false);
      dom.removeEventListener("emptied", success, false);
      if (this.#audioSupport.useLoaderEvent)
        dom.removeEventListener(this.#audioSupport.useLoaderEvent, success, false);
      clearTimeout(timer);
      cb(null, audio);
    };
    const failure = function () {
      log("load audio failure - " + realUrl);
      success();
    };
    dom.addEventListener("canplaythrough", success, false);
    dom.addEventListener("error", failure, false);
    if (this.#audioSupport.useLoaderEvent)
      dom.addEventListener(this.#audioSupport.useLoaderEvent, success, false);
  }
}

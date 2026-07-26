/**
 * Audio support in the browser
 *
 * MULTI_CHANNEL        : Multiple audio while playing - If it doesn't, you can only play background music
 * WEB_AUDIO            : Support for WebAudio - Support W3C WebAudio standards, all of the audio can be played
 * AUTOPLAY             : Supports auto-play audio - if Don't support it, On a touch detecting background music canvas, and then replay
 * REPLAY_AFTER_TOUCH   : The first music will fail, must be replay after touchstart
 * USE_EMPTIED_EVENT    : Whether to use the emptied event to replace load callback
 * DELAY_CREATE_CTX     : delay created the context object - only webAudio
 * NEED_MANUAL_LOOP     : loop attribute failure, need to perform loop manually
 *
 * May be modifications for a few browser version
 */

import { BrowserType, OperatingSystem } from "@aspect/core";
import { AUDIO_FORMATS } from "./constants.ts";

export default class AudioSupport {
  #onlyOne = false;
  #webAudio = !!(
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext
  );
  #delayCreateContext = false;
  #oneSource = false;
  #useLoaderEvent = "";
  #supportedFormats = [];
  #audioContext = null;

  constructor() {
    const audio = document.createElement("audio");
    if (audio.canPlayType) {
      for (const { mimeType, extension } of AUDIO_FORMATS) {
        if (audio.canPlayType(mimeType)) {
          this.#supportedFormats.push(extension);
        }
      }
    }
  }

  init(sys) {
    if (sys.specification.browserType === BrowserType.FIREFOX) {
      this.#delayCreateContext = true;
      this.#useLoaderEvent = "canplay";
    }

    if (sys.specification.os === OperatingSystem.IOS) {
      this.#useLoaderEvent = "loadedmetadata";
    }

    if (
      sys.specification.os === OperatingSystem.ANDROID &&
      sys.specification.browserType === BrowserType.UC
    ) {
      this.#oneSource = true;
    }

    try {
      if (audioSupport.WEB_AUDIO) {
        let context = new (
          window.AudioContext ||
          window.webkitAudioContext ||
          window.mozAudioContext
        )();
        this.#audioContext = context;
        // check context integrity
        if (
          !context["createBufferSource"] ||
          !context["createGain"] ||
          !context["destination"] ||
          !context["decodeAudioData"]
        ) {
          throw new Error("context is incomplete");
        }
        if (audioSupport.DELAY_CREATE_CTX) {
          setTimeout( () => {
            context = new (
              window.AudioContext ||
              window.webkitAudioContext ||
              window.mozAudioContext
            )();
            this.#audioContext = context;
          }, 0);
        }
      }
    } catch (error) {
      this.#webAudio = false;
      log("browser don't support web audio");
    }
  }

  get supportAudio() {
    return this.#supportedFormats.length !== 0;
  }

  get supportedFormats() {
    return this.#supportedFormats;
  }

  get onlyOne() {
    return this.#onlyOne;
  }

  get webAudio() {
    return this.#webAudio;
  }

  get delayCreateContext() {
    return this.#delayCreateContext;
  }

  get oneSouce() {
    return this.#oneSource;
  }

  get useLoaderEvent() {
    return this.#useLoaderEvent;
  }

  get audioContext() {
    return this.#audioContext;
  }
}

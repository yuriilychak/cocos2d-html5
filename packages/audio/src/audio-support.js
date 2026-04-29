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

import { Sys } from "@aspect/core";

const sys = Sys.getInstance();

// check if browser supports Web Audio
const supportWebAudio = !!(
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext
);

export const audioSupport = {
  ONLY_ONE: false,
  WEB_AUDIO: supportWebAudio,
  DELAY_CREATE_CTX: false,
  ONE_SOURCE: false
};

if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
  audioSupport.DELAY_CREATE_CTX = true;
  audioSupport.USE_LOADER_EVENT = "canplay";
}

if (sys.os === sys.OS_IOS) {
  audioSupport.USE_LOADER_EVENT = "loadedmetadata";
}

if (sys.os === sys.OS_ANDROID) {
  if (sys.browserType === sys.BROWSER_TYPE_UC) {
    audioSupport.ONE_SOURCE = true;
  }
}

// keep legacy global for any external code that reads it
window.__audioSupport = audioSupport;

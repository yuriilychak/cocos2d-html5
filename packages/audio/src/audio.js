import { NewClass, Game } from "@aspect/core";

/**
 * Encapsulate DOM and webAudio
 */
export class Audio extends NewClass {
  static touchPlayList = [
    //{ offset: 0, audio: audio }
  ];

  static bindTouch = false;

  static touchStart() {
    const list = Audio.touchPlayList;
    let item = null;
    while ((item = list.pop())) {
      item.audio.loop = !!item.loop;
      item.audio.play(item.offset);
    }
  }

  interruptPlay = false;
  src = null;
  _element = null;
  _AUDIO_TYPE = "AUDIO";

  constructor(url) {
    super();
    this.src = url;
  }

  setBuffer(buffer) {
    this._AUDIO_TYPE = "WEBAUDIO";
    this._element = new Audio.WebAudio(buffer);
  }

  setElement(element) {
    this._AUDIO_TYPE = "AUDIO";
    this._element = element;

    // Prevent partial browser from playing after the end does not reset the paused tag
    // Will cause the player to judge the status of the error
    element.addEventListener("ended", function () {
      if (!element.loop) {
        element.pause();
      }
    });
  }

  play(offset, loop) {
    if (!this._element) {
      this.interruptPlay = false;
      return;
    }
    this._element.loop = loop;
    this._element.play();
    if (this._AUDIO_TYPE === "AUDIO" && this._element.paused) {
      this.stop();
      Audio.touchPlayList.push({ loop, offset, audio: this._element });
    }

    if (Audio.bindTouch === false) {
      Audio.bindTouch = true;
      // Listen to the touchstart body event and play the audio when necessary.
      Game.getInstance().canvas.addEventListener("touchstart", Audio.touchStart);
    }
  }

  getPlaying() {
    if (!this._element) return true;
    return !this._element.paused;
  }

  stop() {
    if (!this._element) {
      this.interruptPlay = true;
      return;
    }
    this._element.pause();
    try {
      this._element.currentTime = 0;
    } catch (err) {}
  }

  pause() {
    if (!this._element) {
      this.interruptPlay = true;
      return;
    }
    this._element.pause();
  }

  resume() {
    if (!this._element) {
      this.interruptPlay = false;
      return;
    }
    this._element.play();
  }

  setVolume(volume) {
    if (!this._element) return;
    this._element.volume = volume;
  }

  getVolume() {
    if (!this._element) return;
    return this._element.volume;
  }

  cloneNode() {
    const audio = new Audio(this.src);
    if (this._AUDIO_TYPE === "AUDIO") {
      const elem = document.createElement("audio");
      const sources = elem.getElementsByTagName("source");
      for (let i = 0; i < sources.length; i++) {
        elem.appendChild(sources[i]);
      }
      elem.src = this.src;
      audio.setElement(elem);
    } else {
      audio.setBuffer(this._element.buffer);
    }
    return audio;
  }
}

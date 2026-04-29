import { Audio } from "./audio.js";

export class WebAudio {
  constructor(buffer) {
    this.buffer = buffer;
    this.context = Audio._context;

    const volume = this.context["createGain"]();
    volume["gain"].value = 1;
    volume["connect"](this.context["destination"]);
    this._volume = volume;

    this._loop = false;

    // The time stamp on the audio time axis when the recording begins to play.
    this._startTime = -1;
    // Record the currently playing Source
    this._currentSource = null;
    // Record the time has been played
    this.playedLength = 0;

    this._currextTimer = null;
  }

  get paused() {
    // If the current audio is a loop, then paused is false
    if (this._currentSource && this._currentSource.loop) return false;

    // StartTime does not have value, as the default -1, it does not begin to play
    if (this._startTime === -1) return true;

    // currentTime - startTime > durationTime
    return this.context.currentTime - this._startTime > this.buffer.duration;
  }
  set paused(bool) {}

  get loop() {
    return this._loop;
  }
  set loop(bool) {
    return (this._loop = bool);
  }

  get volume() {
    return this._volume["gain"].value;
  }
  set volume(num) {
    return (this._volume["gain"].value = num);
  }

  get currentTime() {
    return this.playedLength;
  }
  set currentTime(num) {
    return (this.playedLength = num);
  }

  play(offset) {
    // If repeat play, you need to stop before an audio
    if (this._currentSource && !this.paused) {
      this._currentSource.stop(0);
      this.playedLength = 0;
    }

    const audio = this.context["createBufferSource"]();
    audio.buffer = this.buffer;
    audio["connect"](this._volume);
    audio.loop = this._loop;

    this._startTime = this.context.currentTime;
    offset = offset || this.playedLength;

    const duration = this.buffer.duration;
    if (!this._loop) {
      if (audio.start) audio.start(0, offset, duration - offset);
      else if (audio["notoGrainOn"])
        audio["noteGrainOn"](0, offset, duration - offset);
      else audio["noteOn"](0, offset, duration - offset);
    } else {
      if (audio.start) audio.start(0);
      else if (audio["notoGrainOn"]) audio["noteGrainOn"](0);
      else audio["noteOn"](0);
    }

    this._currentSource = audio;

    // If the current audio context time stamp is 0
    // There may be a need to touch events before you can actually start playing audio
    // So here to add a timer to determine whether the real start playing audio, if not, then the incoming touchPlay queue
    if (this.context.currentTime === 0) {
      clearTimeout(this._currextTimer);
      this._currextTimer = setTimeout(() => {
        if (this.context.currentTime === 0) {
          Audio.touchPlayList.push({ offset, audio: this });
        }
      }, 10);
    }
  }

  pause() {
    // Record the time the current has been played
    this.playedLength = this.context.currentTime - this._startTime;
    //If the duration of playedLendth exceeds the audio, you should take the remainder
    this.playedLength %= this.buffer.duration;
    const audio = this._currentSource;
    this._currentSource = null;
    this._startTime = -1;
    if (audio) audio.stop(0);
  }
}

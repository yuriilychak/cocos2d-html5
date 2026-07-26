import { log, ServiceLocator } from "@aspect/core";
import Audio from "./audio";
import AudioSupport from "./audio-support";
import AudioLoader from "./audio-loader";

/**
 * audioEngine is the singleton object, it provide simple audio APIs.
 * @namespace
 */
export default class AudioEngine {
  #loader;
  #audioPool = new Map();
  #audioSupport = new AudioSupport();

  constructor() {
    this.#loader = new AudioLoader(this.#audioSupport);
    this._currMusic = null;
    this._musicVolume = 1;
    this._maxAudioInstance = 10;
    this._effectVolume = 1;
    this._pauseCache = [];
  }

  init(sys) {
    this.#audioSupport.init(sys);
  }

  get loader() {
    return this.#loader;
  }

  /**
   * Indicates whether any background music can be played or not.
   * @returns {boolean} <i>true</i> if the background music is playing, otherwise <i>false</i>
   */
  willPlayMusic() {
    return false;
  }

  /**
   * Play music.
   * @param {String} url The path of the music file without filename extension.
   * @param {Boolean} loop Whether the music loop or not.
   * @example

   * audioEngine.playMusic(path, false);
   */
  playMusic(url, loop) {
    const bgMusic = this._currMusic;
    if (bgMusic && bgMusic.getPlaying()) {
      bgMusic.stop();
    }
    const musicVolume = this._musicVolume;
    let audio = ServiceLocator.loader.get(url);
    if (!audio) {
      ServiceLocator.loader.load(url, function () {
        if (!audio.getPlaying() && !audio.interruptPlay) {
          audio.setVolume(musicVolume);
          audio.play(0, loop || false);
        }
      });
      audio = ServiceLocator.loader.get(url);
    }
    audio.setVolume(musicVolume);
    audio.play(0, loop || false);

    this._currMusic = audio;
  }

  /**
   * Stop playing music.
   * @param {Boolean} [releaseData] If release the music data or not.As default value is false.
   * @example

   * audioEngine.stopMusic();
   */
  stopMusic(releaseData) {
    const audio = this._currMusic;
    if (audio) {
      const list = Audio.touchPlayList;
      for (let i = list.length - 1; i >= 0; --i) {
        if (this[i] && this[i].audio === audio._element) list.splice(i, 1);
      }

      audio.stop();
      this._currMusic = null;
      if (releaseData) ServiceLocator.loader.release(audio.src);
    }
  }

  /**
   * Pause playing music.
   * @example
   * audioEngine.pauseMusic();
   */
  pauseMusic() {
    const audio = this._currMusic;
    if (audio) audio.pause();
  }

  /**
   * Resume playing music.
   * @example
   * audioEngine.resumeMusic();
   */
  resumeMusic() {
    const audio = this._currMusic;
    if (audio) audio.resume();
  }

  /**
   * Rewind playing music.
   * @example
   * audioEngine.rewindMusic();
   */
  rewindMusic() {
    const audio = this._currMusic;
    if (audio) {
      audio.stop();
      audio.play();
    }
  }

  /**
   * The volume of the music max value is 1.0,the min value is 0.0 .
   * @return {Number}
   * @example

   * var volume = audioEngine.getMusicVolume();
   */
  getMusicVolume() {
    return this._musicVolume;
  }

  /**
   * Set the volume of music.
   * @param {Number} volume Volume must be in 0.0~1.0 .
   * @example

   * audioEngine.setMusicVolume(0.5);
   */
  setMusicVolume(volume) {
    volume = volume - 0;
    if (isNaN(volume)) volume = 1;
    if (volume > 1) volume = 1;
    if (volume < 0) volume = 0;

    this._musicVolume = volume;
    const audio = this._currMusic;
    if (audio) {
      audio.setVolume(volume);
    }
  }

  /**
   * Whether the music is playing.
   * @return {Boolean} If is playing return true,or return false.
   * @example
   *  if (audioEngine.isMusicPlaying()) {
   *      log("music is playing");
   *  }
   *  else {
   *      log("music is not playing");
   *  }
   */
  isMusicPlaying() {
    const audio = this._currMusic;
    if (audio) {
      return audio.getPlaying();
    } else {
      return false;
    }
  }

  /**
   * Play sound effect.
   * @param {String} url The path of the sound effect with filename extension.
   * @param {Boolean} loop Whether to loop the effect playing, default value is false
   * @return {Number|null} the audio id
   * @example
   * var soundId = audioEngine.playEffect(path);
   */
  playEffect(url, loop) {
    if (
      this.#audioSupport.onlyOne &&
      this._currMusic &&
      this._currMusic.getPlaying()
    ) {
      log("Browser is only allowed to play one audio");
      return null;
    }

    let effectList = this.#audioPool.get(url);
    if (!effectList) {
      effectList = [];
      this.#audioPool.set(url, effectList);
    }

    for (var i = 0; i < effectList.length; i++) {
      if (!effectList[i].getPlaying()) {
        break;
      }
    }

    if (!this.#audioSupport.webAudio && i > this._maxAudioInstance) {
      const first = effectList.shift();
      first.stop();
      effectList.push(first);
      i = effectList.length - 1;
    }

    let audio;
    if (effectList[i]) {
      audio = effectList[i];
      audio.setVolume(this._effectVolume);
      audio.play(0, loop || false);
      return audio;
    }

    audio = ServiceLocator.loader.get(url);

    if (audio && this.#audioSupport.webAudio && audio._AUDIO_TYPE === "AUDIO") {
      ServiceLocator.loader.release(url);
      audio = null;
    }

    if (audio) {
      if (this.#audioSupport.webAudio && audio._AUDIO_TYPE === "AUDIO") {
        this.#loader.loadBuffer(url, function (error, buffer) {
          audio.setBuffer(buffer);
          audio.setVolume(this._effectVolume);
          if (!audio.getPlaying()) audio.play(0, loop || false);
        });
      } else {
        audio = audio.cloneNode();
        audio.setVolume(this._effectVolume);
        audio.play(0, loop || false);
        effectList.push(audio);
        return audio;
      }
    }

    const cache = this.#loader.useWebAudio;
    this.#loader.useWebAudio = true;
    ServiceLocator.loader.load(url, (audio) => {
      audio = ServiceLocator.loader.get(url);
      audio = audio.cloneNode();
      audio.setVolume(this._effectVolume);
      audio.play(0, loop || false);
      effectList.push(audio);
    });
    this.#loader.useWebAudio = cache;

    return audio;
  }

  /**
   * Set the volume of sound effects.
   * @param {Number} volume Volume must be in 0.0~1.0 .
   * @example
   * audioEngine.setEffectsVolume(0.5);
   */
  setEffectsVolume(volume) {
    volume = volume - 0;
    if (isNaN(volume)) volume = 1;
    if (volume > 1) volume = 1;
    if (volume < 0) volume = 0;

    this._effectVolume = volume;
    for (const audioList of this.#audioPool.values()) {
      for (let i = 0; i < audioList.length; i++) {
        audioList[i].setVolume(volume);
      }
    }
  }

  /**
   * The volume of the effects max value is 1.0,the min value is 0.0 .
   * @return {Number}
   * @example
   * var effectVolume = audioEngine.getEffectsVolume();
   */
  getEffectsVolume() {
    return this._effectVolume;
  }

  /**
   * Pause playing sound effect.
   * @param {Number} audio The return value of function playEffect.
   * @example
   * audioEngine.pauseEffect(audioID);
   */
  pauseEffect(audio) {
    if (audio) {
      audio.pause();
    }
  }

  /**
   * Pause all playing sound effect.
   * @example
   * audioEngine.pauseAllEffects();
   */
  pauseAllEffects() {
    for (const list of this.#audioPool.values()) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].getPlaying()) {
          list[i].pause();
        }
      }
    }
  }

  /**
   * Resume playing sound effect.
   * @param {Number} audio The return value of function playEffect.
   * @audioID
   * audioEngine.resumeEffect(audioID);
   */
  resumeEffect(audio) {
    if (audio) audio.resume();
  }

  /**
   * Resume all playing sound effect
   * @example
   * audioEngine.resumeAllEffects();
   */
  resumeAllEffects() {
    for (const list of this.#audioPool.values()) {
      for (let i = 0; i < list.length; i++) {
        list[i].resume();
      }
    }
  }

  /**
   * Stop playing sound effect.
   * @param {Number} audio The return value of function playEffect.
   * @example
   * audioEngine.stopEffect(audioID);
   */
  stopEffect(audio) {
    if (audio) {
      audio.stop();
    }
  }

  /**
   * Stop all playing sound effects.
   * @example
   * audioEngine.stopAllEffects();
   */
  stopAllEffects() {
    for (const list of this.#audioPool.values()) {
      for (let i = 0; i < list.length; i++) {
        list[i].stop();
      }
    }
    this.#audioPool.clear();
  }

  /**
   * Unload the preloaded effect from internal buffer
   * @param {String} url
   * @example
   * audioEngine.unloadEffect(EFFECT_FILE);
   */
  unloadEffect(url) {
    if (!url) {
      return;
    }

    ServiceLocator.loader.release(url);
    const pool = this.#audioPool.get(url);
    if (pool) {
      for (let i = 0; i < pool.length; i++) {
        pool[i].stop();
      }
      pool.length = 0;
    }
    this.#audioPool.delete(url);
  }

  /**
   * End music and effects.
   */
  end() {
    this.stopMusic();
    this.stopAllEffects();
  }

  _pausePlaying() {
    const bgMusic = this._currMusic;
    if (bgMusic && bgMusic.getPlaying()) {
      bgMusic.pause();
      this._pauseCache.push(bgMusic);
    }
    for (const list of this.#audioPool.values()) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].getPlaying()) {
          list[i].pause();
          this._pauseCache.push(list[i]);
        }
      }
    }
  }

  _resumePlaying() {
    const list = this._pauseCache;
    for (let i = 0; i < list.length; i++) {
      list[i].resume();
    }
    list.length = 0;
  }
}

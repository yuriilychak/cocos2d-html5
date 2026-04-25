import { audioSupport } from "./audio-support.js";
import { loader } from "./audio-loader.js";

/**
 * cc.audioEngine is the singleton object, it provide simple audio APIs.
 * @namespace
 */
export class AudioEngine {
  constructor() {
    this._currMusic = null;
    this._musicVolume = 1;
    this.features = audioSupport;
    this._audioPool = {};
    this._maxAudioInstance = 10;
    this._effectVolume = 1;
    this._pauseCache = [];
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
   * //example
   * cc.audioEngine.playMusic(path, false);
   */
  playMusic(url, loop) {
    const bgMusic = this._currMusic;
    if (bgMusic && bgMusic.getPlaying()) {
      bgMusic.stop();
    }
    const musicVolume = this._musicVolume;
    let audio = cc.loader.getRes(url);
    if (!audio) {
      cc.loader.load(url, function () {
        if (!audio.getPlaying() && !audio.interruptPlay) {
          audio.setVolume(musicVolume);
          audio.play(0, loop || false);
        }
      });
      audio = cc.loader.getRes(url);
    }
    audio.setVolume(musicVolume);
    audio.play(0, loop || false);

    this._currMusic = audio;
  }

  /**
   * Stop playing music.
   * @param {Boolean} [releaseData] If release the music data or not.As default value is false.
   * @example
   * //example
   * cc.audioEngine.stopMusic();
   */
  stopMusic(releaseData) {
    const audio = this._currMusic;
    if (audio) {
      const list = cc.Audio.touchPlayList;
      for (let i = list.length - 1; i >= 0; --i) {
        if (this[i] && this[i].audio === audio._element) list.splice(i, 1);
      }

      audio.stop();
      this._currMusic = null;
      if (releaseData) cc.loader.release(audio.src);
    }
  }

  /**
   * Pause playing music.
   * @example
   * //example
   * cc.audioEngine.pauseMusic();
   */
  pauseMusic() {
    const audio = this._currMusic;
    if (audio) audio.pause();
  }

  /**
   * Resume playing music.
   * @example
   * //example
   * cc.audioEngine.resumeMusic();
   */
  resumeMusic() {
    const audio = this._currMusic;
    if (audio) audio.resume();
  }

  /**
   * Rewind playing music.
   * @example
   * //example
   * cc.audioEngine.rewindMusic();
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
   * //example
   * var volume = cc.audioEngine.getMusicVolume();
   */
  getMusicVolume() {
    return this._musicVolume;
  }

  /**
   * Set the volume of music.
   * @param {Number} volume Volume must be in 0.0~1.0 .
   * @example
   * //example
   * cc.audioEngine.setMusicVolume(0.5);
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
   * //example
   *  if (cc.audioEngine.isMusicPlaying()) {
   *      cc.log("music is playing");
   *  }
   *  else {
   *      cc.log("music is not playing");
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
   * //example
   * var soundId = cc.audioEngine.playEffect(path);
   */
  playEffect(url, loop) {
    if (
      audioSupport.ONLY_ONE &&
      this._currMusic &&
      this._currMusic.getPlaying()
    ) {
      cc.log("Browser is only allowed to play one audio");
      return null;
    }

    let effectList = this._audioPool[url];
    if (!effectList) {
      effectList = this._audioPool[url] = [];
    }

    for (var i = 0; i < effectList.length; i++) {
      if (!effectList[i].getPlaying()) {
        break;
      }
    }

    if (!audioSupport.WEB_AUDIO && i > this._maxAudioInstance) {
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

    audio = cc.loader.getRes(url);

    if (audio && audioSupport.WEB_AUDIO && audio._AUDIO_TYPE === "AUDIO") {
      cc.loader.release(url);
      audio = null;
    }

    if (audio) {
      if (audioSupport.WEB_AUDIO && audio._AUDIO_TYPE === "AUDIO") {
        loader.loadBuffer(url, function (error, buffer) {
          audio.setBuffer(buffer);
          audio.setVolume(cc.audioEngine._effectVolume);
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

    const cache = loader.useWebAudio;
    loader.useWebAudio = true;
    cc.loader.load(url, function (audio) {
      audio = cc.loader.getRes(url);
      audio = audio.cloneNode();
      audio.setVolume(cc.audioEngine._effectVolume);
      audio.play(0, loop || false);
      effectList.push(audio);
    });
    loader.useWebAudio = cache;

    return audio;
  }

  /**
   * Set the volume of sound effects.
   * @param {Number} volume Volume must be in 0.0~1.0 .
   * @example
   * //example
   * cc.audioEngine.setEffectsVolume(0.5);
   */
  setEffectsVolume(volume) {
    volume = volume - 0;
    if (isNaN(volume)) volume = 1;
    if (volume > 1) volume = 1;
    if (volume < 0) volume = 0;

    this._effectVolume = volume;
    const audioPool = this._audioPool;
    for (const p in audioPool) {
      const audioList = audioPool[p];
      if (Array.isArray(audioList))
        for (let i = 0; i < audioList.length; i++) {
          audioList[i].setVolume(volume);
        }
    }
  }

  /**
   * The volume of the effects max value is 1.0,the min value is 0.0 .
   * @return {Number}
   * @example
   * //example
   * var effectVolume = cc.audioEngine.getEffectsVolume();
   */
  getEffectsVolume() {
    return this._effectVolume;
  }

  /**
   * Pause playing sound effect.
   * @param {Number} audio The return value of function playEffect.
   * @example
   * //example
   * cc.audioEngine.pauseEffect(audioID);
   */
  pauseEffect(audio) {
    if (audio) {
      audio.pause();
    }
  }

  /**
   * Pause all playing sound effect.
   * @example
   * //example
   * cc.audioEngine.pauseAllEffects();
   */
  pauseAllEffects() {
    const ap = this._audioPool;
    for (const p in ap) {
      const list = ap[p];
      for (let i = 0; i < ap[p].length; i++) {
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
   * //example
   * cc.audioEngine.resumeEffect(audioID);
   */
  resumeEffect(audio) {
    if (audio) audio.resume();
  }

  /**
   * Resume all playing sound effect
   * @example
   * //example
   * cc.audioEngine.resumeAllEffects();
   */
  resumeAllEffects() {
    const ap = this._audioPool;
    for (const p in ap) {
      const list = ap[p];
      for (let i = 0; i < ap[p].length; i++) {
        list[i].resume();
      }
    }
  }

  /**
   * Stop playing sound effect.
   * @param {Number} audio The return value of function playEffect.
   * @example
   * //example
   * cc.audioEngine.stopEffect(audioID);
   */
  stopEffect(audio) {
    if (audio) {
      audio.stop();
    }
  }

  /**
   * Stop all playing sound effects.
   * @example
   * //example
   * cc.audioEngine.stopAllEffects();
   */
  stopAllEffects() {
    const ap = this._audioPool;
    for (const p in ap) {
      const list = ap[p];
      for (let i = 0; i < list.length; i++) {
        list[i].stop();
      }
      list.length = 0;
    }
    ap.length = 0;
  }

  /**
   * Unload the preloaded effect from internal buffer
   * @param {String} url
   * @example
   * //example
   * cc.audioEngine.unloadEffect(EFFECT_FILE);
   */
  unloadEffect(url) {
    if (!url) {
      return;
    }

    cc.loader.release(url);
    const pool = this._audioPool[url];
    if (pool) {
      for (let i = 0; i < pool.length; i++) {
        pool[i].stop();
      }
      pool.length = 0;
    }
    delete this._audioPool[url];
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
    const ap = this._audioPool;
    for (const p in ap) {
      const list = ap[p];
      for (let i = 0; i < ap[p].length; i++) {
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

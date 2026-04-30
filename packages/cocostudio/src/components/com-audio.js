/****************************************************************************
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
 * The audio component for Cocostudio.
 */
import { Loader, Component } from "@aspect/core";
import { audioEngine } from "@aspect/audio";

export class ComAudio extends Component {

    /**
     * Construction of ComAudio
     */
    constructor () {
        super();
        this._filePath = "";
        this._loop = false;
        this._name = "Audio";
        this.init();
    }

    /**
     * Initializes a ComAudio.
     * @returns {boolean}
     */
    init () {
        return true;
    }

    /**
     * The callback calls when a audio component enter stage.
     * @override
     */
    onExit () {
        this.stopBackgroundMusic(true);
        this.stopAllEffects();
    }

    /**
     * Stops all audios.
     */
    end () {
        audioEngine.end();
    }

    /**
     * Preload background music resource
     * @param {String} pszFilePath
     */
    preloadBackgroundMusic (pszFilePath) {
        Loader.getInstance().load(pszFilePath);
    }

    /**
     * Play background music
     * @param {String} [pszFilePath]
     * @param {Boolean} [loop]
     */
    playBackgroundMusic (pszFilePath, loop) {
        if(pszFilePath){
            audioEngine.playMusic(pszFilePath, loop);
        }else{
            audioEngine.playMusic(this._filePath, this._loop);
        }
    }

    /**
     * Stop background music
     * @param {String} releaseData
     */
    stopBackgroundMusic (releaseData) {
        audioEngine.stopMusic(releaseData);
    }

    /**
     * Pause background music
     */
    pauseBackgroundMusic () {
        audioEngine.pauseMusic();
    }

    /**
     * Resume background music
     */
    resumeBackgroundMusic () {
        audioEngine.resumeMusic();
    }

    /**
     * Rewind background music
     */
    rewindBackgroundMusic () {
        audioEngine.rewindMusic();
    }

    /**
     * Indicates whether any background music can be played or not.
     * @returns {boolean}
     */
    willPlayBackgroundMusic () {
        return audioEngine.willPlayMusic();
    }

    /**
     * Whether the music is playing.
     * @returns {Boolean}
     */
    isBackgroundMusicPlaying () {
        return audioEngine.isMusicPlaying();
    }

    /**
     * The volume of the music max value is 1.0,the min value is 0.0 .
     * @returns {Number}
     */
    getBackgroundMusicVolume () {
        return audioEngine.getMusicVolume();
    }

    /**
     * Set the volume of music.
     * @param {Number} volume   must be in 0.0~1.0 .
     */
    setBackgroundMusicVolume (volume) {
        audioEngine.setMusicVolume(volume);
    }

    /**
     * The volume of the effects max value is 1.0,the min value is 0.0 .
     * @returns {Number}
     */
    getEffectsVolume () {
        return audioEngine.getEffectsVolume();
    }

    /**
     * Set the volume of sound effects.
     * @param {Number} volume
     */
    setEffectsVolume (volume) {
        audioEngine.setEffectsVolume(volume);
    }

    /**
     * Play sound effect.
     * @param {String} [pszFilePath]
     * @param {Boolean} [loop]
     * @returns {Boolean}
     */
    playEffect (pszFilePath, loop) {
        if (pszFilePath)
            return audioEngine.playEffect(pszFilePath, loop);
         else
            return audioEngine.playEffect(this._filePath, this._loop);
    }

    /**
     * Pause playing sound effect.
     * @param {Number} soundId
     */
    pauseEffect (soundId) {
        audioEngine.pauseEffect(soundId);
    }

    /**
     * Pause all effects
     */
    pauseAllEffects () {
        audioEngine.pauseAllEffects();
    }

    /**
     * Resume effect
     * @param {Number} soundId
     */
    resumeEffect (soundId) {
        audioEngine.resumeEffect(soundId);
    }

    /**
     * Resume all effects
     */
    resumeAllEffects () {
        audioEngine.resumeAllEffects();
    }

    /**
     * Stop effect
     * @param {Number} soundId
     */
    stopEffect (soundId) {
        audioEngine.stopEffect(soundId);
    }

    /**
     * stop all effects
     */
    stopAllEffects () {
        audioEngine.stopAllEffects();
    }

    /**
     * Preload effect
     * @param {String} pszFilePath
     */
    preloadEffect (pszFilePath) {
        Loader.getInstance().getRes(pszFilePath);
        this.setFile(pszFilePath);
        this.setLoop(false);
    }

    /**
     * Unload effect
     * @param {String} pszFilePath
     */
    unloadEffect (pszFilePath) {
        audioEngine.unloadEffect(pszFilePath);
    }

    /**
     * File path setter
     * @param {String} pszFilePath
     */
    setFile (pszFilePath) {
        this._filePath = pszFilePath;
    }

    /**
     * Sets audio component whether plays loop
     * @param {Boolean} loop
     */
    setLoop (loop) {
        this._loop = loop;
    }

    /**
     * Returns the file path of audio component.
     * @returns {string}
     */
    getFile () {
        return this._filePath;
    }

    /**
     * Returns audio component whether plays loop
     * @returns {boolean}
     */
    isLoop () {
        return this._loop;
    }
};


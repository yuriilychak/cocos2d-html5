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
 * @class
 * @extends ccs.Component
 */
ccs.ComAudio = class ComAudio extends ccs.Component {

    /**
     * Construction of ccs.ComAudio
     */
    constructor () {
        super();
        this._filePath = "";
        this._loop = false;
        this._name = "Audio";
        this.init();
    }

    /**
     * Initializes a ccs.ComAudio.
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
        cc.audioEngine.end();
    }

    /**
     * Preload background music resource
     * @param {String} pszFilePath
     */
    preloadBackgroundMusic (pszFilePath) {
        cc.loader.load(pszFilePath);
    }

    /**
     * Play background music
     * @param {String} [pszFilePath]
     * @param {Boolean} [loop]
     */
    playBackgroundMusic (pszFilePath, loop) {
        if(pszFilePath){
            cc.audioEngine.playMusic(pszFilePath, loop);
        }else{
            cc.audioEngine.playMusic(this._filePath, this._loop);
        }
    }

    /**
     * Stop background music
     * @param {String} releaseData
     */
    stopBackgroundMusic (releaseData) {
        cc.audioEngine.stopMusic(releaseData);
    }

    /**
     * Pause background music
     */
    pauseBackgroundMusic () {
        cc.audioEngine.pauseMusic();
    }

    /**
     * Resume background music
     */
    resumeBackgroundMusic () {
        cc.audioEngine.resumeMusic();
    }

    /**
     * Rewind background music
     */
    rewindBackgroundMusic () {
        cc.audioEngine.rewindMusic();
    }

    /**
     * Indicates whether any background music can be played or not.
     * @returns {boolean}
     */
    willPlayBackgroundMusic () {
        return cc.audioEngine.willPlayMusic();
    }

    /**
     * Whether the music is playing.
     * @returns {Boolean}
     */
    isBackgroundMusicPlaying () {
        return cc.audioEngine.isMusicPlaying();
    }

    /**
     * The volume of the music max value is 1.0,the min value is 0.0 .
     * @returns {Number}
     */
    getBackgroundMusicVolume () {
        return cc.audioEngine.getMusicVolume();
    }

    /**
     * Set the volume of music.
     * @param {Number} volume   must be in 0.0~1.0 .
     */
    setBackgroundMusicVolume (volume) {
        cc.audioEngine.setMusicVolume(volume);
    }

    /**
     * The volume of the effects max value is 1.0,the min value is 0.0 .
     * @returns {Number}
     */
    getEffectsVolume () {
        return cc.audioEngine.getEffectsVolume();
    }

    /**
     * Set the volume of sound effects.
     * @param {Number} volume
     */
    setEffectsVolume (volume) {
        cc.audioEngine.setEffectsVolume(volume);
    }

    /**
     * Play sound effect.
     * @param {String} [pszFilePath]
     * @param {Boolean} [loop]
     * @returns {Boolean}
     */
    playEffect (pszFilePath, loop) {
        if (pszFilePath)
            return cc.audioEngine.playEffect(pszFilePath, loop);
         else
            return cc.audioEngine.playEffect(this._filePath, this._loop);
    }

    /**
     * Pause playing sound effect.
     * @param {Number} soundId
     */
    pauseEffect (soundId) {
        cc.audioEngine.pauseEffect(soundId);
    }

    /**
     * Pause all effects
     */
    pauseAllEffects () {
        cc.audioEngine.pauseAllEffects();
    }

    /**
     * Resume effect
     * @param {Number} soundId
     */
    resumeEffect (soundId) {
        cc.audioEngine.resumeEffect(soundId);
    }

    /**
     * Resume all effects
     */
    resumeAllEffects () {
        cc.audioEngine.resumeAllEffects();
    }

    /**
     * Stop effect
     * @param {Number} soundId
     */
    stopEffect (soundId) {
        cc.audioEngine.stopEffect(soundId);
    }

    /**
     * stop all effects
     */
    stopAllEffects () {
        cc.audioEngine.stopAllEffects();
    }

    /**
     * Preload effect
     * @param {String} pszFilePath
     */
    preloadEffect (pszFilePath) {
        cc.loader.getRes(pszFilePath);
        this.setFile(pszFilePath);
        this.setLoop(false);
    }

    /**
     * Unload effect
     * @param {String} pszFilePath
     */
    unloadEffect (pszFilePath) {
        cc.audioEngine.unloadEffect(pszFilePath);
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

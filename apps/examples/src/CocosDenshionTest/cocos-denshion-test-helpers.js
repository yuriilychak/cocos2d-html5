/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { EFFECT_FILE, MUSIC_FILE } from "./cocos-denshion-test-constants.js";

;

;

export var soundId = null;

export function playMusic() {
    cc.log("play background music");
    var musicFile = MUSIC_FILE;
    audioEngine.playMusic(musicFile, false);
}

;

export function stopMusic() {
    cc.log("stop background music");
    audioEngine.stopMusic();
}

;

export function pauseMusic() {
    cc.log("pause background music");
    audioEngine.pauseMusic();
}

;

export function resumeMusic() {
    cc.log("resume background music");
    audioEngine.resumeMusic();
}

;

export function rewindMusic() {
    cc.log("rewind background music");
    audioEngine.rewindMusic();
}

;

// is background music playing
export function isMusicPlaying() {
    if (audioEngine.isMusicPlaying()) {
        cc.log("background music is playing");
    }
    else {
        cc.log("background music is not playing");
    }
}

;

export function playEffect() {
    cc.log("play effect");
    soundId = audioEngine.playEffect(EFFECT_FILE);
}

;

export function playEffectRepeatly() {
    cc.log("play effect repeatly");
    soundId = audioEngine.playEffect(EFFECT_FILE, true);
}

;

export function stopEffect() {
    cc.log("stop effect");
    audioEngine.stopEffect(soundId);
}

;

export function unloadEffect() {
    cc.log("unload effect");
    audioEngine.unloadEffect(EFFECT_FILE);
}

;

export function addMusicVolume() {
    cc.log("add bakcground music volume");
    audioEngine.setMusicVolume(audioEngine.getMusicVolume() + 0.1);
}

;

export function subMusicVolume() {
    cc.log("sub backgroud music volume");
    audioEngine.setMusicVolume(audioEngine.getMusicVolume() - 0.1);
}

;

export function addEffectsVolume() {
    cc.log("add effects volume");
    audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() + 0.1);
}

;

export function subEffectsVolume() {
    cc.log("sub effects volume");
    audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() - 0.1);
}

;

export function pauseEffect() {
    cc.log("pause effect");
    audioEngine.pauseEffect(soundId);
}

;

export function resumeEffect() {
    cc.log("resume effect");
    audioEngine.resumeEffect(soundId);
}

;

export function pauseAllEffects() {
    cc.log("pause all effects");
    audioEngine.pauseAllEffects();
}

;

export function resumeAllEffects() {
    cc.log("resume all effects");
    audioEngine.resumeAllEffects();
}

;

export function stopAllEffects() {
    cc.log("stop all effects");
    audioEngine.stopAllEffects();
}

;

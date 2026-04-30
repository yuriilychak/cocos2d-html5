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

var MUSIC_FILE = cc.sys.os == cc.sys.OS_WINRT ? "background.wav" : "background.mp3";

var EFFECT_FILE = cc.sys.os == cc.sys.OS_WINRT ? "effect1.wav" : "effect2.mp3";

var _DenshionTests = [
    'Music Test'
];

var DenshionTests = [
    {
        title:"Play Music",
        playFunc:function () {
            return new playMusic();
        }
    },
    {
        title:"Stop Music",
        playFunc:function () {
            return new stopMusic();
        }
    },
    {
        title:"Pause Music",
        playFunc:function () {
            return new pauseMusic();
        }
    },
    {
        title:"Resume Music",
        playFunc:function () {
            return new resumeMusic();
        }
    },
    {
        title:"Rewind Music",
        playFunc:function () {
            return new rewindMusic();
        }
    },
    {
        title:"is Music Playing",
        playFunc:function () {
            return new isMusicPlaying();
        }
    },
    {
        title:"Increase Music Volume",
        playFunc:function () {
            return new addMusicVolume();
        }
    },
    {
        title:"Decrease Music Volume",
        playFunc:function () {
            return new subMusicVolume();
        }
    },
    {
        title:"Play Sound Effect",
        playFunc:function () {
            return new playEffect();
        }
    },
    {
        title:"Repeat Sound Effect",
        playFunc:function () {
            return new playEffectRepeatly();
        }
    },
    {
        title:"Stop Sound Effect",
        playFunc:function () {
            return new stopEffect();
        }
    },
    {
        title:"Unload Sound Effect",
        playFunc:function () {
            return new unloadEffect();
        }
    },
    {
        title:"Increase Sound Effect Volume",
        playFunc:function () {
            return new addEffectsVolume();
        }
    },
    {
        title:"Decrease Sound Effect Volume",
        playFunc:function () {
            return new subEffectsVolume();
        }
    },
    {
        title:"Pause Sound Effect",
        playFunc:function () {
            return new pauseEffect();
        }
    },
    {
        title:"Resume Sound Effect",
        playFunc:function () {
            return new resumeEffect();
        }
    },
    {
        title:"Pause All Sound Effects",
        playFunc:function () {
            return new pauseAllEffects();
        }
    },
    {
        title:"Resume All Sound Effects",
        playFunc:function () {
            return new resumeAllEffects();
        }
    },
    {
        title:"Stop All Sound Effects",
        playFunc:function () {
            return new stopAllEffects();
        }
    }
];

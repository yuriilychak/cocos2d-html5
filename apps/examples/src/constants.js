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

// globals (lazy-init in _initGlobals; live bindings let importers see updates)
export let director = null;

export let winSize = null;

export function _initGlobals() {
    director = cc.director;
    winSize = cc.director.getWinSize();
}

export var PLATFORM_JSB = 1 << 0;

export var PLATFORM_HTML5 = 1 << 1;

export var PLATFORM_HTML5_WEBGL = 1 << 2;

export var PLATFROM_ANDROID = 1 << 3;

export var PLATFROM_IOS = 1 << 4;

export var PLATFORM_MAC = 1 << 5;

export var PLATFORM_JSB_AND_WEBGL =  PLATFORM_JSB | PLATFORM_HTML5_WEBGL;

export var PLATFORM_ALL = PLATFORM_JSB | PLATFORM_HTML5 | PLATFORM_HTML5_WEBGL | PLATFROM_ANDROID | PLATFROM_IOS;

export var PLATFROM_APPLE = PLATFROM_IOS | PLATFORM_MAC;

// automation vars (read window globals if set externally, else default)
export let autoTestEnabled = (typeof window !== "undefined" && window.autoTestEnabled) || false;

export let autoTestCurrentTestName = (typeof window !== "undefined" && window.autoTestCurrentTestName) || "N/A";

export function _setAutoTestEnabled(v) { autoTestEnabled = v; }
export function _setAutoTestCurrentTestName(v) { autoTestCurrentTestName = v; }

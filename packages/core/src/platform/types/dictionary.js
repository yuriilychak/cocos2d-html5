/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

import { NewClass } from '../class';

export class _Dictionary extends NewClass {
    constructor() {
        super();
        this._keyMapTb = {};
        this._valueMapTb = {};
        this.__currId = 2 << (0 | (Math.random() * 10));
    }

    __getKey() {
        this.__currId++;
        return "key_" + this.__currId;
    }

    setObject(value, key) {
        if (key == null)
            return;

        var keyId = this.__getKey();
        this._keyMapTb[keyId] = key;
        this._valueMapTb[keyId] = value;
    }

    objectForKey(key) {
        if (key == null)
            return null;

        var locKeyMapTb = this._keyMapTb;
        for (var keyId in locKeyMapTb) {
            if (locKeyMapTb[keyId] === key)
                return this._valueMapTb[keyId];
        }
        return null;
    }

    valueForKey(key) {
        return this.objectForKey(key);
    }

    removeObjectForKey(key) {
        if (key == null)
            return;

        var locKeyMapTb = this._keyMapTb;
        for (var keyId in locKeyMapTb) {
            if (locKeyMapTb[keyId] === key) {
                delete this._valueMapTb[keyId];
                delete locKeyMapTb[keyId];
                return;
            }
        }
    }

    removeObjectsForKeys(keys) {
        if (keys == null)
            return;

        for (var i = 0; i < keys.length; i++)
            this.removeObjectForKey(keys[i]);
    }

    allKeys() {
        var keyArr = [], locKeyMapTb = this._keyMapTb;
        for (var key in locKeyMapTb)
            keyArr.push(locKeyMapTb[key]);
        return keyArr;
    }

    removeAllObjects() {
        this._keyMapTb = {};
        this._valueMapTb = {};
    }

    count() {
        return this.allKeys().length;
    }
}

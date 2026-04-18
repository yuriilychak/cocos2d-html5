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

import EventListener from './event-listener';

export default class _EventListenerCustom extends EventListener {
    constructor(listenerId, callback, target) {
        super(EventListener.CUSTOM, listenerId, null);
        this._onCustomEvent = null;
        this._target = undefined;

        this._onCustomEvent = callback;
        this._target = target;
        this._onEvent = this._callback;
    }

    _callback(event) {
        if (this._onCustomEvent !== null)
            this._onCustomEvent.call(this._target, event);
    }

    checkAvailable() {
        return (super.checkAvailable() && this._onCustomEvent !== null);
    }

    clone() {
        return new _EventListenerCustom(this._listenerID, this._onCustomEvent);
    }
}

_EventListenerCustom.create = function (eventName, callback) {
    return new _EventListenerCustom(eventName, callback);
};

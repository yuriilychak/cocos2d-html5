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

export default class _EventListenerTouchOneByOne extends EventListener {
    constructor() {
        super(EventListener.TOUCH_ONE_BY_ONE, _EventListenerTouchOneByOne.LISTENER_ID, null);
        this._claimedTouches = null;
        this.swallowTouches = false;
        this.onTouchBegan = null;
        this.onTouchMoved = null;
        this.onTouchEnded = null;
        this.onTouchCancelled = null;

        this._claimedTouches = [];
    }

    setSwallowTouches(needSwallow) {
        this.swallowTouches = needSwallow;
    }

    isSwallowTouches() {
        return this.swallowTouches;
    }

    clone() {
        var eventListener = new _EventListenerTouchOneByOne();
        eventListener.onTouchBegan = this.onTouchBegan;
        eventListener.onTouchMoved = this.onTouchMoved;
        eventListener.onTouchEnded = this.onTouchEnded;
        eventListener.onTouchCancelled = this.onTouchCancelled;
        eventListener.swallowTouches = this.swallowTouches;
        return eventListener;
    }

    checkAvailable() {
        if(!this.onTouchBegan){
            cc.log(cc._LogInfos._EventListenerTouchOneByOne_checkAvailable);
            return false;
        }
        return true;
    }
}

_EventListenerTouchOneByOne.LISTENER_ID = "__cc_touch_one_by_one";

_EventListenerTouchOneByOne.create = function () {
    return new _EventListenerTouchOneByOne();
};

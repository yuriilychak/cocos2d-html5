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
import { log, _LogInfos } from '../../boot/debugger';
import { EventListenerType, TouchEvent } from '../../enums';

import type Touch from '../touch';
import type { EventTouch } from '../event';
import type { TouchBeganCallback, TouchCallback } from './types';

export default class _EventListenerTouchOneByOne extends EventListener {
    #claimedTouches: Touch[] = [];
    #swallowTouches: boolean = false;
    onTouchBegan: TouchBeganCallback | null = null;
    onTouchMoved: TouchCallback | null = null;
    onTouchEnded: TouchCallback | null = null;
    onTouchCancelled: TouchCallback | null = null;

    constructor() {
        super(EventListenerType.TOUCH_ONE_BY_ONE);
    }

    clone(): _EventListenerTouchOneByOne {
        const eventListener = new _EventListenerTouchOneByOne();
        eventListener.onTouchBegan = this.onTouchBegan;
        eventListener.onTouchMoved = this.onTouchMoved;
        eventListener.onTouchEnded = this.onTouchEnded;
        eventListener.onTouchCancelled = this.onTouchCancelled;
        eventListener.swallowTouches = this.swallowTouches;
        return eventListener;
    }

    set swallowTouches(needSwallow: boolean) {
        this.#swallowTouches = needSwallow;
    }

    get swallowTouches(): boolean {
        return this.#swallowTouches;
    }

    get claimedTouches(): Touch[] {
        return this.#claimedTouches;
    }

    public handleTouchEvent(touch: Touch, event: EventTouch): boolean {
        event.currentTarget = this.sceneGraphPriority;

        const eventCode = event.eventCode;

        if (eventCode === TouchEvent.BEGAN) {
            const isClaimed = this.#handleTouch(this.onTouchBegan, touch, event);
            if (!isClaimed) {
                return false;
            }

            if (this.registered) {
                this.#claimedTouches.push(touch);
            }

            return isClaimed;
        }

        const removedIdx = this.#claimedTouches.indexOf(touch);

        if (removedIdx === -1) {
            return false;
        }

        switch (eventCode) {
            case TouchEvent.MOVED:
                this.#handleTouch(this.onTouchMoved, touch, event);
                break;
            case TouchEvent.ENDED:
                this.#handleTouch(this.onTouchEnded, touch, event);
                this.#removeClaimedTouch(removedIdx);
                break;
            case TouchEvent.CANCELLED:
                this.#handleTouch(this.onTouchCancelled, touch, event);
                this.#removeClaimedTouch(removedIdx);
                break;
        }

        return true;
    }

    #handleTouch<T>(
        callback: ((touch: Touch, event: EventTouch) => T) | null,
        touch: Touch,
        event: EventTouch
    ): T | false {
        if (!callback) {
            return false;
        }

        return callback.call(this, touch, event);
    }

    #removeClaimedTouch(index: number): void {
        if (this.registered) {
            this.#claimedTouches.splice(index, 1);
        }
    }

    get available(): boolean {
        if(!this.onTouchBegan){
            log(_LogInfos._EventListenerTouchOneByOne_available);
            return false;
        }
        return true;
    }

    static LISTENER_ID = "__cc_touch_one_by_one";
}

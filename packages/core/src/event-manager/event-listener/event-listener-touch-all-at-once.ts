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
import type { TouchesCallback } from './types';

export default class _EventListenerTouchAllAtOnce extends EventListener {
    onTouchesBegan: TouchesCallback | null = null;
    onTouchesMoved: TouchesCallback | null = null;
    onTouchesEnded: TouchesCallback | null = null;
    onTouchesCancelled: TouchesCallback | null = null;

    constructor() {
        super(EventListenerType.TOUCH_ALL_AT_ONCE);
    }

    clone(): _EventListenerTouchAllAtOnce {
        const eventListener = new _EventListenerTouchAllAtOnce();
        eventListener.onTouchesBegan = this.onTouchesBegan;
        eventListener.onTouchesMoved = this.onTouchesMoved;
        eventListener.onTouchesEnded = this.onTouchesEnded;
        eventListener.onTouchesCancelled = this.onTouchesCancelled;
        return eventListener;
    }

    public handleTouchEvent(touches: Touch[], event: EventTouch): void {
        event.currentTarget = this.sceneGraphPriority;

        switch (event.eventCode) {
            case TouchEvent.BEGAN:
                this.#handleTouches(this.onTouchesBegan, touches, event);
                break;
            case TouchEvent.MOVED:
                this.#handleTouches(this.onTouchesMoved, touches, event);
                break;
            case TouchEvent.ENDED:
                this.#handleTouches(this.onTouchesEnded, touches, event);
                break;
            case TouchEvent.CANCELLED:
                this.#handleTouches(this.onTouchesCancelled, touches, event);
                break;
        }
    }

    #handleTouches(
        callback: TouchesCallback | null,
        touches: Touch[],
        event: EventTouch
    ): void {
        if (callback) {
            callback.call(this, touches, event);
        }
    }

    get available(): boolean {
        if (this.onTouchesBegan === null && this.onTouchesMoved === null
            && this.onTouchesEnded === null && this.onTouchesCancelled === null) {
            log(_LogInfos._EventListenerTouchAllAtOnce_available);
            return false;
        }
        return true;
    }

    static LISTENER_ID = "__cc_touch_all_at_once";
}

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
import { EventListenerType, MouseEvent } from '../../enums';

import type { EventMouse } from '../event';
import type { MouseEventCallback } from './types';

export default class _EventListenerMouse extends EventListener<EventMouse> {
    onMouseDown: MouseEventCallback | null = null;
    onMouseUp: MouseEventCallback | null = null;
    onMouseMove: MouseEventCallback | null = null;
    onMouseScroll: MouseEventCallback | null = null;

    constructor() {
        super(EventListenerType.MOUSE);
        this.setEvent(this.#handleEvent.bind(this));
    }

    #handleEvent(event: EventMouse): void {
        switch (event.eventType) {
            case MouseEvent.DOWN:
                if (this.onMouseDown)
                    this.onMouseDown(event);
                break;
            case MouseEvent.UP:
                if (this.onMouseUp)
                    this.onMouseUp(event);
                break;
            case MouseEvent.MOVE:
                if (this.onMouseMove)
                    this.onMouseMove(event);
                break;
            case MouseEvent.SCROLL:
                if (this.onMouseScroll)
                    this.onMouseScroll(event);
                break;
            default:
                break;
        }
    }

    clone(): _EventListenerMouse {
        var eventListener = new _EventListenerMouse();
        eventListener.onMouseDown = this.onMouseDown;
        eventListener.onMouseUp = this.onMouseUp;
        eventListener.onMouseMove = this.onMouseMove;
        eventListener.onMouseScroll = this.onMouseScroll;
        return eventListener;
    }

    get available(): boolean {
        return true;
    }

    static LISTENER_ID = "__cc_mouse";
}

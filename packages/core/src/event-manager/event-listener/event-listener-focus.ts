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
import { log } from '../../boot/debugger';
import { EventListenerType } from '../../enums';

import type { EventFocus } from '../event';
import type { FocusChangedCallback } from './types';

export default class _EventListenerFocus extends EventListener<EventFocus> {
    onFocusChanged: FocusChangedCallback | null = null;

    constructor() {
        super(EventListenerType.FOCUS);
        this.setEvent(this.#handleEvent.bind(this));
    }

    clone(): _EventListenerFocus {
        var listener = new _EventListenerFocus();
        listener.onFocusChanged = this.onFocusChanged;
        return listener;
    }

    #handleEvent(event: EventFocus): void {
        if (this.onFocusChanged) {
            this.onFocusChanged(event._widgetLoseFocus, event._widgetGetFocus);
        }
    }

    get available(): boolean {
        if(!this.onFocusChanged){
            log("Invalid EventListenerFocus!");
            return false;
        }
        return true;
    }

    static LISTENER_ID = "__cc_focus_event";
}

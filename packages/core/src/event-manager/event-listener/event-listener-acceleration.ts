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
import { assert, _LogInfos } from '../../boot/debugger';
import { EventListenerType } from '../../enums';
import type { EventAcceleration } from '../event';
import type { AccelerationEventCallback } from './types';

export default class _EventListenerAcceleration extends EventListener<EventAcceleration> {
  #onAccelerationEvent: AccelerationEventCallback;

  constructor(callback: AccelerationEventCallback) {
    super(EventListenerType.ACCELERATION);
    this.setEvent(this.#handleEvent.bind(this));
    this.#onAccelerationEvent = callback;
  }

  clone(): _EventListenerAcceleration {
    return new _EventListenerAcceleration(this.#onAccelerationEvent);
  }

  #handleEvent(event: EventAcceleration): void {
    this.#onAccelerationEvent(event.value, event);
  }

  get available(): boolean {
    assert(
      this.#onAccelerationEvent,
      _LogInfos._EventListenerAcceleration_available
    );

    return true;
  }

  static LISTENER_ID = "__cc_acceleration";
}

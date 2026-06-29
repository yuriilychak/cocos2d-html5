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
import { EventListenerType } from '../../enums';

import type { EventCustom } from '../event';
import type { CustomEventCallback } from './types';

export default class _EventListenerCustom<T = unknown> extends EventListener<EventCustom<T>> {
  #onCustomEvent: CustomEventCallback<T> | null;
  #target: unknown;

  constructor(id: string, callback: CustomEventCallback<T> | null, target?: unknown) {
    super(EventListenerType.CUSTOM, id);
    this.#onCustomEvent = callback;
    this.#target = target;
    this.setEvent(this.#handleEvent.bind(this));
  }

  clone(): _EventListenerCustom<T> {
    return new _EventListenerCustom<T>(this.id, this.#onCustomEvent, this.#target);
  }

  #handleEvent(event: EventCustom<T>): void {
    if (this.#onCustomEvent !== null)
      this.#onCustomEvent.call(this.#target, event);
  }

  get onCustomEvent(): CustomEventCallback<T> | null {
    return this.#onCustomEvent;
  }

  get target(): unknown {
    return this.#target;
  }

  get available(): boolean {
    return super.available && this.#onCustomEvent !== null;
  }
}

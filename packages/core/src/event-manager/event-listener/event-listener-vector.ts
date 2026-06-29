/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2015 Chukong Technologies Inc.

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

import { BaseClass } from "../../platform/class";
import { arrayRemoveObject } from "../../platform/macro/utils";
import EventListener from "./event-listener";

/**
 * @ignore
 */
export default class _EventListenerVector extends BaseClass {
  #fixedListeners: EventListener[] = [];
  #sceneGraphListeners: EventListener[] = [];
  #firstNaturalFixedPriorityIndex: number = 0;

  static #sortListenersOfFixedPriorityAsc(
    l1: EventListener,
    l2: EventListener
  ): number {
    return l1.fixedPriority - l2.fixedPriority;
  }

  push(listener: EventListener): void {
    if (listener.fixedPriority === 0) this.#sceneGraphListeners.push(listener);
    else this.#fixedListeners.push(listener);
  }

  public sortFixedPriorityListeners(): void {
    if (this.#fixedListeners.length === 0) return;

    // After sort: priority < 0, > 0
    this.#fixedListeners.sort(
      _EventListenerVector.#sortListenersOfFixedPriorityAsc
    );

    // FIXME: Should use binary search
    let index = 0;
    for (const len = this.#fixedListeners.length; index < len; ) {
      if (this.#fixedListeners[index].fixedPriority >= 0) break;
      ++index;
    }
    this.#firstNaturalFixedPriorityIndex = index;
  }

  public updateListeners(toRemovedListeners: EventListener[]): void {
    this.#removeUnregisteredListeners(
      this.#sceneGraphListeners,
      toRemovedListeners
    );
    this.#removeUnregisteredListeners(this.#fixedListeners, toRemovedListeners);

    if (this.#sceneGraphListeners.length === 0) {
      this.clearSceneGraphListeners();
    }

    if (this.#fixedListeners.length === 0) {
      this.clearFixedListeners();
    }
  }

  public removeListener(listener: EventListener): void {
    arrayRemoveObject(this.#sceneGraphListeners, listener);
    arrayRemoveObject(this.#fixedListeners, listener);
  }

  public dispatchEvent(
    onEvent: (listener: EventListener, eventOrArgs: unknown) => boolean,
    eventOrArgs: unknown
  ): void {
    let shouldStopPropagation = false;
    let i = 0;

    if (this.#fixedListeners.length !== 0) {
      // priority < 0
      for (; i < this.#firstNaturalFixedPriorityIndex; ++i) {
        if (
          this.#dispatchEventToListener(
            this.#fixedListeners[i],
            onEvent,
            eventOrArgs
          )
        ) {
          shouldStopPropagation = true;
          break;
        }
      }
    }

    if (this.#sceneGraphListeners.length !== 0 && !shouldStopPropagation) {
      // priority == 0, scene graph priority
      for (let j = 0; j < this.#sceneGraphListeners.length; j++) {
        if (
          this.#dispatchEventToListener(
            this.#sceneGraphListeners[j],
            onEvent,
            eventOrArgs
          )
        ) {
          shouldStopPropagation = true;
          break;
        }
      }
    }

    if (this.#fixedListeners.length !== 0 && !shouldStopPropagation) {
      // priority > 0
      for (; i < this.#fixedListeners.length; ++i) {
        if (
          this.#dispatchEventToListener(
            this.#fixedListeners[i],
            onEvent,
            eventOrArgs
          )
        ) {
          break;
        }
      }
    }
  }

  #dispatchEventToListener(
    listener: EventListener,
    onEvent: (listener: EventListener, eventOrArgs: unknown) => boolean,
    eventOrArgs: unknown
  ): boolean {
    return (
      listener.enabled &&
      !listener.paused &&
      listener.registered &&
      onEvent(listener, eventOrArgs)
    );
  }

  #removeUnregisteredListeners(
    listeners: EventListener[],
    toRemovedListeners: EventListener[]
  ): void {
    for (let i = 0; i < listeners.length; ) {
      const listener = listeners[i];
      if (!listener.registered) {
        arrayRemoveObject(listeners, listener);
        const idx = toRemovedListeners.indexOf(listener);
        if (idx !== -1) toRemovedListeners.splice(idx, 1);
      } else {
        ++i;
      }
    }
  }

  clearSceneGraphListeners(): void {
    this.#sceneGraphListeners.length = 0;
  }

  clearFixedListeners(): void {
    this.#fixedListeners.length = 0;
  }

  clear(): void {
    this.#sceneGraphListeners.length = 0;
    this.#fixedListeners.length = 0;
  }

  get size(): number {
    return this.#fixedListeners.length + this.#sceneGraphListeners.length;
  }

  get empty(): boolean {
    return (
      this.#fixedListeners.length === 0 &&
      this.#sceneGraphListeners.length === 0
    );
  }

  get fixedPriorityListeners(): EventListener[] {
    return this.#fixedListeners;
  }

  get sceneGraphPriorityListeners(): EventListener[] {
    return this.#sceneGraphListeners;
  }

  get firstNaturalFixedPriorityIndex(): number {
    return this.#firstNaturalFixedPriorityIndex;
  }

  set firstNaturalFixedPriorityIndex(index: number) {
    this.#firstNaturalFixedPriorityIndex = index;
  }
}

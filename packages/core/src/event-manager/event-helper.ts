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

type Constructor<T = object> = new (...args: any[]) => T;

export type EventHelperListener = (this: unknown, sender?: unknown) => void;

class EventListenerEntry {
  #listener: EventHelperListener;
  #target: unknown;

  constructor(
    listener: EventHelperListener,
    target: unknown
  ) {
    this.#listener = listener;
    this.#target = target;
  }

  dispatch(data?: unknown): void {
    this.#listener.call(this.#target, data);
  }

  matches(target: unknown, listener?: EventHelperListener): boolean {
    return this.#target === target && (!listener || this.#listener === listener);
  }
}

type LoadableEventTarget = {
  _textureLoaded?: boolean;
  loaded?: boolean;
};

export interface EventHelperInterface {
  addEventListener(
    type: string,
    listener: EventHelperListener,
    target?: unknown
  ): void;
  hasEventListener(
    type: string,
    listener: EventHelperListener,
    target?: unknown
  ): boolean;
  removeEventListener(
    type: string,
    listener: EventHelperListener,
    target?: unknown
  ): void;
  removeEventTarget(type: string, target: unknown): void;
  dispatchEvent(event: string, clearAfterDispatch?: boolean): void;
}

export type EventHelperClass<TBase extends Constructor> = TBase &
  Constructor<InstanceType<TBase> & EventHelperInterface>;

/**
 * EventHelper mixin - adds event listener methods to a class.
 */
const EventHelper = <TBase extends Constructor>(
  Base: TBase
): EventHelperClass<TBase> => {
  class EventHelperMixin extends Base implements EventHelperInterface {
    #listeners = new Map<string, EventListenerEntry[]>();

    addEventListener(
      type: string,
      listener: EventHelperListener,
      target?: unknown
    ): void {
      const loadable = this as LoadableEventTarget;
      if (type === "load" && (loadable._textureLoaded || loadable.loaded === true)) {
        setTimeout(() => listener.call(target), 0);
        return;
      }

      if (!this.#listeners.has(type)) {
        this.#listeners.set(type, []);
      }

      
      if (!this.hasEventListener(type, listener, target)) {
        const listeners = this.#listeners.get(type)!;
        listeners.push(new EventListenerEntry(listener, target));
      }
    }

    hasEventListener(
      type: string,
      listener: EventHelperListener,
      target?: unknown
    ): boolean {
      if (!this.#listeners.has(type)) {
        return false;
      }

      const listeners: EventListenerEntry[] = this.#listeners.get(type)!;

      for (let i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i].matches(target, listener)) {
          return true;
        }
      }

      return false;
    }

    removeEventListener(
      type: string,
      listener: EventHelperListener,
      target?: unknown
    ): void {
      if (!this.#listeners.has(type)) {
        return;
      }

      const listeners: EventListenerEntry[] = this.#listeners.get(type)!;

      for (let i = 0; i < listeners.length;) {
        if (listeners[i].matches(target, listener)) {
          listeners.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    removeEventTarget(type: string, target: unknown): void {
      if (!this.#listeners.has(type)) {
        return;
      }

      const listeners: EventListenerEntry[] = this.#listeners.get(type)!;

      for (let i = 0; i < listeners.length;) {
        if (listeners[i].matches(target)) {
          listeners.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    dispatchEvent(event: string, clearAfterDispatch = true): void {
      if (!this.#listeners.has(event)) {
        return;
      }

      const listeners = this.#listeners.get(event)!;
      const listenersCopy = listeners.slice();

      for (let i = 0; i < listeners.length; ++i) {
        listenersCopy[i].dispatch(this);
      }

      if (clearAfterDispatch) {
        listeners.length = 0;
      }
    }
  }

  return EventHelperMixin as EventHelperClass<TBase>;
};

export default EventHelper;

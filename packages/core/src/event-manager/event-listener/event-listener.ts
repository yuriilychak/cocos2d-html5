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

import { BaseClass } from "../../platform/class";
import { EventListenerType } from "../../enums";
import { log, _LogInfos } from "../../boot/debugger";

import type { EventCallback } from "./types";
import type { Event } from "../event";
export type { EventCallback } from "./types";

/**
 * <p>
 *     The base class of event listener.                                                                        <br/>
 *     If you need custom listener which with different callback, you need to inherit this class.               <br/>
 *     For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
 *      EventListenerTouchOneByOne, EventListenerCustom.
 * </p>
 */
export default abstract class EventListener<TEvent extends Event = Event> extends BaseClass {
  #onEvent: EventCallback<TEvent> | null;
  #type: EventListenerType;
  #id: string;
  #fixedPriority: number = 0;
  #node: unknown = null;
  #paused: boolean = true;
  #registered: boolean = false;
  #enabled: boolean = true;

  /**
   * Initializes event with type and callback function
   */
  constructor(
    type: EventListenerType = EventListenerType.UNKNOWN,
    id?: string,
    callback: EventCallback<TEvent> | null = null
  ) {
    super();
    this.#onEvent = callback;
    this.#type = type;
    this.#id = id ?? (this.constructor as typeof EventListener).LISTENER_ID;
  }

  setEvent(value: EventCallback<TEvent> | null): void {
    this.#onEvent = value;
  }

  get onEvent(): EventCallback<TEvent> | null {
    return this.#onEvent;
  }

  static handleEventCallback(listener: EventListener, event: Event): boolean {
    return listener.handleEvent(event);
  }

  public handleEvent(event: TEvent): boolean {
    event.currentTarget = this.sceneGraphPriority;
    this.#onEvent!(event);
    return event.stopped;
  }

  /**
   * Clones the listener, its subclasses have to override this method.
   */
  abstract clone(): EventListener<TEvent>;

  /**
   * <p>
   *     Sets paused state for the listener
   *     The paused state is only used for scene graph priority listeners.
   *     `EventDispatcher::resumeAllEventListenersForTarget(node)` will set the paused state to `true`,
   *     while `EventDispatcher::pauseAllEventListenersForTarget(node)` will set it to `false`.
   *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,
   *              call `enabled = false` instead.
   *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners which associated with that node will be automatically updated.
   * </p>
   */
  set paused(paused: boolean) {
    this.#paused = paused;
  }

  /**
   * Checks whether the listener is paused
   */
  get paused(): boolean {
    return this.#paused;
  }

  /**
   * Marks the listener was registered by EventDispatcher
   */
  set registered(registered: boolean) {
    this.#registered = registered;
  }

  /**
   * Checks whether the listener was registered by EventDispatcher
   */
  get registered(): boolean {
    return this.#registered;
  }

  /**
   * Gets the type of this listener
   * @note It's different from `EventType`, e.g. TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce
   */
  get type(): EventListenerType {
    return this.#type;
  }

  /**
   *  Gets the listener ID of this listener
   *  When event is being dispatched, listener ID is used as key for searching listeners according to event type.
   */
  get id(): string {
    return this.#id;
  }

  /**
   * Sets the fixed priority for this listener
   *  @note This method is only used for `fixed priority listeners`, it needs to access a non-zero value. 0 is reserved for scene graph priority listeners
   */
  set fixedPriority(fixedPriority: number) {
    this.#fixedPriority = fixedPriority;
  }

  /**
   * Gets the fixed priority of this listener
   * @returns 0 if it's a scene graph priority listener, non-zero for fixed priority listener
   */
  get fixedPriority(): number {
    return this.#fixedPriority;
  }

  public updateFixedPriority(fixedPriority: number): boolean {
    if (this.sceneGraphPriority !== null) {
      log(_LogInfos.eventManager_setPriority);
    }

    if (this.#fixedPriority === fixedPriority) {
      return false;
    }

    this.#fixedPriority = fixedPriority;
    return true;
  }

  /**
   * Sets scene graph priority for this listener
   * @param {Node} node
   * @private
   */
  set sceneGraphPriority(node: unknown) {
    this.#node = node;
  }

  /**
   * Gets scene graph priority of this listener
   * @returns {Node} if it's a fixed priority listener, non-null for scene graph priority listener
   * @private
   */
  get sceneGraphPriority(): unknown {
    return this.#node;
  }

  /**
   * Checks whether the listener is available.
   */
  get available(): boolean {
    return this.#onEvent !== null;
  }

  /**
   *  Enables or disables the listener
   *  @note Only listeners with `enabled` state will be able to receive events.
   *          When an listener was initialized, it's enabled by default.
   *          An event listener can receive events when it is enabled and is not paused.
   *          paused state is always false when it is a fixed priority listener.
   */
  set enabled(enabled: boolean) {
    this.#enabled = enabled;
  }

  /**
   * Checks whether the listener is enabled
   */
  get enabled(): boolean {
    return this.#enabled;
  }

  static LISTENER_ID: string = "";
}

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

import { Node } from "../../base-nodes/node";
import { EventCustom } from "../event";
import {
  EventListenerType,
  EventType,
  GameEvent
} from "../../enums";
import { isNumber } from "../../boot/utils";
import {
  EventListener,
  _EventListenerCustom,
  _EventListenerMouse,
  _EventListenerTouchOneByOne,
  _EventListenerTouchAllAtOnce,
  _EventListenerFocus,
  _EventListenerAcceleration,
  _EventListenerKeyboard
} from "../event-listener";
import { log, assert, _LogInfos } from "../../boot/debugger";
import { ToAddedListeners } from "./to-added-listeners";
import EventManagerListeners from "./event-manager-listeners";
import NodeListeners from "./node-listeners";
import NodePriorities from "./node-priorities";

import type { Event, EventTouch } from "../event";
import type { _EventListenerVector } from "../event-listener";
import type {
  CustomEventCallback,
  ListenerCreateOptions
} from "../event-listener/types";
import type {
  DeprecatedEventListenerFactory,
  DirectorLike,
  TouchEventCallbackArgs,
  TouchesEventCallbackArgs
} from "./types";

/**
 * <p>
 *  EventManager is a singleton class which manages event listener subscriptions and event dispatching. <br/>
 *                                                                                                              <br/>
 *  The EventListener list is managed in such way so that event listeners can be added and removed          <br/>
 *  while events are being dispatched.
 * </p>
 */
export default class EventManager {
  static #eventListenerIDByType = new Map<EventType, string>([
    [EventType.ACCELERATION, _EventListenerAcceleration.LISTENER_ID],
    [EventType.KEYBOARD, _EventListenerKeyboard.LISTENER_ID],
    [EventType.MOUSE, _EventListenerMouse.LISTENER_ID],
    [EventType.FOCUS, _EventListenerFocus.LISTENER_ID]
  ]);

  static #listenerIDByType = new Map<EventListenerType, string>([
    [
      EventListenerType.TOUCH_ONE_BY_ONE,
      _EventListenerTouchOneByOne.LISTENER_ID
    ],
    [
      EventListenerType.TOUCH_ALL_AT_ONCE,
      _EventListenerTouchAllAtOnce.LISTENER_ID
    ],
    [EventListenerType.MOUSE, _EventListenerMouse.LISTENER_ID],
    [EventListenerType.ACCELERATION, _EventListenerAcceleration.LISTENER_ID],
    [EventListenerType.KEYBOARD, _EventListenerKeyboard.LISTENER_ID]
  ]);

  #listeners = new EventManagerListeners();
  #nodeListeners = new NodeListeners();
  #nodePriorities = new NodePriorities();
  #toAddedListeners = new ToAddedListeners();
  #inDispatch = 0;
  #isEnabled = false;
  #internalCustomListenerIDs: string[] = [GameEvent.HIDE, GameEvent.SHOW];
  #director: DirectorLike;

  constructor(director: DirectorLike) {
    this.#director = director;
  }

  _setDirtyForNode(node: Node): void {
    this.#nodeListeners.setDirtyForNode(node);
  }

  frameUpdateListeners(): void {
    this.#listeners.frameUpdate();

    this.#flushToAddedListeners();
  }

  /**
   * <p>
   * Adds a event listener for a specified event.                                                                                                            <br/>
   * if the parameter "nodeOrPriority" is a node, it means to add a event listener for a specified event with the priority of scene graph.                   <br/>
   * if the parameter "nodeOrPriority" is a Number, it means to add a event listener for a specified event with the fixed priority.                          <br/>
   * </p>
   */
  addListener<TEvent extends Event>(
    listener: EventListener<TEvent>,
    nodeOrPriority: Node | number
  ): EventListener<TEvent> | undefined;
  addListener(
    listener: ListenerCreateOptions,
    nodeOrPriority: Node | number
  ): EventListener | undefined;
  addListener(
    listener: EventListener | ListenerCreateOptions,
    nodeOrPriority: Node | number
  ): EventListener | undefined {
    assert(listener && nodeOrPriority, _LogInfos.eventManager_addListener_2);
    let eventListener: EventListener | null = null;

    if (!(listener instanceof EventListener)) {
      assert(!isNumber(nodeOrPriority), _LogInfos.eventManager_addListener_3);
      eventListener = (EventListener as DeprecatedEventListenerFactory).create(
        listener
      );
    } else {
      eventListener = listener;
    }

    if (!eventListener) {
      return;
    }

    if (eventListener.registered) {
      log(_LogInfos.eventManager_addListener_4);
      return;
    }

    if (!eventListener.available) return;

    if (isNumber(nodeOrPriority)) {
      if (nodeOrPriority === 0) {
        log(_LogInfos.eventManager_addListener);
        return;
      }

      eventListener.setRegisteredPriority(nodeOrPriority);
      eventListener.paused = false;
    } else {
      eventListener.setRegisteredPriority(nodeOrPriority);
    }

    if (this.#inDispatch === 0) {
      this.#forceAddEventListener(eventListener);
    } else {
      this.#toAddedListeners.add(eventListener);
    }

    return eventListener;
  }

  /**
   * Adds a Custom event listener. It will use a fixed priority of 1.
   */
  addCustomListener<T = unknown>(
    eventName: string,
    callback: CustomEventCallback<T> | null,
    target?: unknown
  ): _EventListenerCustom<T> {
    const listener = new _EventListenerCustom<T>(eventName, callback, target);
    this.addListener(listener, 1);
    return listener;
  }

  /**
   * Remove a listener
   */
  removeListener(listener: EventListener | null): void {
    if (listener == null) return;

    const isFound = this.#listeners.removeFromListeners(
      listener,
      this.#removeListenerInner.bind(this)
    );

    if (!isFound) {
      this.#toAddedListeners.remove(listener);
    }
  }

  /**
   * Removes all listeners with the same event listener type or removes all listeners of a node
   */
  removeListeners(
    listenerType: EventListenerType | Node,
    recursive: boolean = false
  ): void {
    if (listenerType instanceof Node) {
      // Ensure the node is removed from these immediately also.
      // Don't want any dangling pointers or the possibility of dealing with deleted objects..
      this.#nodePriorities.deletePriority(listenerType);
      const listeners = this.#nodeListeners.getNodeListenersCopy(listenerType);

      let i;
      if (listeners.length) {
        for (i = 0; i < listeners.length; i++)
          this.removeListener(listeners[i]);
      }

      // Bug fix: ensure there are no references to the node in the list of listeners to be added.
      // If we find any listeners associated with the destroyed node in this list then remove them.
      // This is to catch the scenario where the node gets destroyed before it's listener
      // is added into the event dispatcher fully. This could happen if a node registers a listener
      // and gets destroyed while we are dispatching an event (touch etc.)
      this.#toAddedListeners.removeForNode(listenerType);

      if (recursive === true) {
        const locChildren = listenerType.children;
        let len;
        for (i = 0, len = locChildren.length; i < len; i++)
          this.removeListeners(locChildren[i], true);
      }
    } else if (EventManager.#listenerIDByType.has(listenerType)) {
      this.#removeListenersForListenerID(
        EventManager.#listenerIDByType.get(listenerType)!
      );
    } else {
      log(_LogInfos.eventManager_removeListeners);
    }
  }

  /**
   * Removes all custom listeners with the same event name
   */
  removeCustomListeners(customEventName: string): void {
    this.#removeListenersForListenerID(customEventName);
  }

  /**
   * Removes all listeners
   */
  removeAllListeners(): void {
    const ids = this.#listeners.keys;
    for (const id of ids) {
      if (!this.#internalCustomListenerIDs.includes(id)) {
        this.#removeListenersForListenerID(id);
      }
    }
  }

  /**
   * Sets listener's priority with fixed value.
   */
  setPriority(listener: EventListener | null, fixedPriority: number): void {
    this.#listeners.setPriority(listener, fixedPriority);
  }

  /**
   * Whether to enable dispatching events
   */
  set enabled(enabled: boolean) {
    this.#isEnabled = enabled;
  }

  /**
   * Checks whether dispatching events is enabled
   */
  get enabled(): boolean {
    return this.#isEnabled;
  }

  /**
   * Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
   */
  dispatchEvent(event: Event): void {
    if (!this.#isEnabled) return;

    this.#nodeListeners.updateDirtyFlagForSceneGraph(
      this.#listeners.priorityDirtyFlags
    );
    this.#inDispatch++;
    if (!event || event.type === EventType.NONE)
      throw new Error("event is undefined");
    if (event.type === EventType.TOUCH) {
      this.#dispatchTouchEvent(event as EventTouch);
      this.#inDispatch--;
      return;
    }

    const listenerID = EventManager.#getListenerID(event);
    this.#sortEventListeners(listenerID);
    this.#listeners.dispatchEvent(listenerID, event);

    this.#inDispatch--;
  }

  /**
   * Pauses all listeners which are associated the specified target.
   */
  pauseTarget(node: Node, recursive = false): void {
    this.#nodeListeners.setTargetPaused(node, recursive, true);
  }

  /**
   * Resumes all listeners which are associated the specified target.
   */
  resumeTarget(node: Node, recursive = false): void {
    this.#nodeListeners.setTargetPaused(node, recursive, false);
  }

  /**
   * Dispatches a Custom Event with a event name an optional user data
   */
  dispatchCustomEvent<T = unknown>(
    eventName: string,
    optionalUserData: T | null = null
  ): void {
    this.dispatchEvent(new EventCustom<T>(eventName, optionalUserData));
  }

  static #getListenerID(event: Event | EventCustom): string {
    if (EventManager.#eventListenerIDByType.has(event.type)) {
      return EventManager.#eventListenerIDByType.get(event.type)!;
    }

    switch (event.type) {
      case EventType.CUSTOM:
        return (event as EventCustom).eventName;
      case EventType.TOUCH:
        // Touch listener is very special, it contains two kinds of listeners, EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
        // return UNKNOWN instead.
        log(_LogInfos.__getListenerID);
        return "";
      default:
        return "";
    }
  }

  #forceAddEventListener(listener: EventListener): void {
    this.#listeners.addToVector(listener);

    if (listener.fixedPriority === 0) {
      this.#nodeListeners.associateNodeAndEventListener(listener);
    }
  }

  #removeAllListenersInVector(listenerVector: EventListener[] | null): void {
    if (!listenerVector || !listenerVector.length) {
      return;
    }

    for (let i = 0; i < listenerVector.length; ) {
      if (!this.#dissociateNodeAndEventListener(listenerVector, i)) {
        ++i;
      }
    }
  }

  #removeListenersForListenerID(listenerID: string): void {
    const listeners = this.#listeners.get(listenerID);

    if (listeners) {
      this.#removeAllListenersInVector(listeners.sceneGraphPriorityListeners);
      this.#removeAllListenersInVector(listeners.fixedPriorityListeners);

      // Remove the dirty flag according the 'listenerID'.
      // No need to check whether the dispatcher is dispatching event.
      if (!this.#inDispatch) {
        listeners.clear();
      }
      this.#listeners.delete(listenerID);
    }

    this.#toAddedListeners.removeForListenerID(listenerID);
  }

  #sortEventListeners(listenerID: string): void {
    const rootNode = this.#director.getRunningScene();

    if (this.#listeners.sortEventListeners(listenerID, Boolean(rootNode))) {
      this.#sortListenersOfSceneGraphPriority(listenerID, rootNode!);
    }
  }

  #sortListenersOfSceneGraphPriority(
    listenerID: string,
    rootNode: Node
  ): void {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners || listeners.sceneGraphPriorityListenersEmpty) {
      return;
    }

    this.#nodePriorities.sortSceneGraphListeners(
      listeners,
      rootNode,
      this.#nodeListeners
    );
  }

  #updateTouchListeners(): void {
    if (this.#listeners.updateTouchListeners(this.#inDispatch)) {
      this.#flushToAddedListeners();
    }
  }

  #flushToAddedListeners(): void {
    const listeners = this.#toAddedListeners.apply();
    if (listeners.length !== 0) {
      for (let i = 0, len = listeners.length; i < len; i++) {
        this.#forceAddEventListener(listeners[i]);
      }
    }
  }

  #onTouchEventCallback(
    listener: _EventListenerTouchOneByOne,
    argsObj: TouchEventCallbackArgs
  ): boolean {
    // Skip if the listener was removed.
    if (!listener.registered) return false;

    const event = argsObj.event;
    const isClaimed = listener.handleTouchEvent(argsObj.selTouch, event);

    // If the event was stopped, return directly.
    if (event.stopped) {
      this.#updateTouchListeners();
      return true;
    }

    const shouldSwallowTouch =
      isClaimed && listener.registered && listener.swallowTouches;

    if (shouldSwallowTouch && argsObj.needsMutableSet) {
      argsObj.touches.splice(argsObj.selTouch as unknown as number, 1);
    }

    return shouldSwallowTouch;
  }

  #dispatchTouchEvent(event: EventTouch): void {
    this.#sortEventListeners(_EventListenerTouchOneByOne.LISTENER_ID);
    this.#sortEventListeners(_EventListenerTouchAllAtOnce.LISTENER_ID);

    if (
      this.#listeners.dispatchTouchEvent(
        event,
        this.#onTouchEventCallback.bind(this),
        this.#onTouchesEventCallback.bind(this)
      )
    ) {
      this.#updateTouchListeners();
    }
  }

  #onTouchesEventCallback(
    listener: _EventListenerTouchAllAtOnce,
    callbackParams: TouchesEventCallbackArgs
  ): boolean {
    const event = callbackParams.event;
    // If the event was stopped, return directly.
    if (listener.handleTouchEvent(callbackParams.touches, event)) {
      this.#updateTouchListeners();
      return true;
    }

    return false;
  }

  #dissociateNodeAndEventListener(
    listeners: EventListener[],
    index: number,
    shouldTrackRemoved = false
  ): boolean {
    const listener = listeners[index];
    listener.registered = false;

    if (listener.sceneGraphPriority !== null) {
      this.#nodeListeners.dissociateListenerFromNode(listener);
    }

    if (this.#inDispatch === 0) {
      listeners.splice(index, 1);
      return true;
    }

    if (shouldTrackRemoved) {
      this.#listeners.addToRemove(listener);
    }

    return false;
  }

  #removeListenerTemp(
    listener: EventListener,
    listeners: _EventListenerVector,
    isSceneGraph: boolean
  ): boolean {
    const listenersToCheck = isSceneGraph
      ? listeners.sceneGraphPriorityListeners
      : listeners.fixedPriorityListeners;

    const index =
      listenersToCheck !== null ? listenersToCheck.indexOf(listener) : -1;

    if (index !== -1) {
      this.#dissociateNodeAndEventListener(listenersToCheck, index, true);
      this.#listeners.setDirty(listener.id, isSceneGraph);

      return true;
    }

    return false;
  }

  #removeListenerInner(
    listener: EventListener,
    listeners: _EventListenerVector,
    listenerID: string
  ): boolean {
    const isFound =
      this.#removeListenerTemp(listener, listeners, true) ||
      this.#removeListenerTemp(listener, listeners, false);

    if (listeners.empty) {
      this.#listeners.delete(listenerID);
    }

    return isFound;
  }
}

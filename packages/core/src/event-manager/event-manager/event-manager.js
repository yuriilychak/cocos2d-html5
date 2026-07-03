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
  EventManagerDirtyFlag,
  EventType,
  GameEvent
} from "../../enums";
import { copyArray } from "../../platform/macro/utils";
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

/**
 * <p>
 *  EventManager is a singleton class which manages event listener subscriptions and event dispatching. <br/>
 *                                                                                                              <br/>
 *  The EventListener list is managed in such way so that event listeners can be added and removed          <br/>
 *  while events are being dispatched.
 * </p>
 */
export default class EventManager {
  static #eventListenerIDByType = new Map([
    [EventType.ACCELERATION, _EventListenerAcceleration.LISTENER_ID],
    [EventType.KEYBOARD, _EventListenerKeyboard.LISTENER_ID],
    [EventType.MOUSE, _EventListenerMouse.LISTENER_ID],
    [EventType.FOCUS, _EventListenerFocus.LISTENER_ID]
  ]);

  static #listenerIDByType = new Map([
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
  #internalCustomListenerIDs = [GameEvent.HIDE, GameEvent.SHOW];
  #director = null;

  static __getListenerID(event) {
    if (EventManager.#eventListenerIDByType.has(event.type)) {
      return EventManager.#eventListenerIDByType.get(event.type);
    }

    switch (event.type) {
      case EventType.CUSTOM:
        return event.eventName;
      case EventType.TOUCH:
        // Touch listener is very special, it contains two kinds of listeners, EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
        // return UNKNOWN instead.
        log(_LogInfos.__getListenerID);
        return "";
      default:
        return "";
    }
  }

  injectServices({ director }) {
    this.#director = director;
  }

  _setDirtyForNode(node) {
    this.#nodeListeners.setDirtyForNode(node);
  }

  _forceAddEventListener(listener) {
    this.#listeners.addToVector(listener);

    if (listener.fixedPriority === 0) {
      this.#nodeListeners.associateNodeAndEventListener(listener);
    }
  }

  _removeAllListenersInVector(listenerVector) {
    if (!listenerVector || !listenerVector.length) {
      return;
    }

    for (let i = 0; i < listenerVector.length; ) {
      if (!this._dissociateNodeAndEventListener(listenerVector, i)) {
        ++i;
      }
    }
  }

  _removeListenersForListenerID(listenerID) {
    const listeners = this.#listeners.get(listenerID);

    if (listeners) {
      this._removeAllListenersInVector(listeners.sceneGraphPriorityListeners);
      this._removeAllListenersInVector(listeners.fixedPriorityListeners);

      // Remove the dirty flag according the 'listenerID'.
      // No need to check whether the dispatcher is dispatching event.
      if (!this.#inDispatch) {
        listeners.clear();
      }
      this.#listeners.delete(listenerID);
    }

    this.#toAddedListeners.removeForListenerID(listenerID);
  }

  _sortEventListeners(listenerID) {
    const rootNode = this.#director.getRunningScene();

    if (this.#listeners.sortEventListeners(listenerID, Boolean(rootNode))) {
      this._sortListenersOfSceneGraphPriority(listenerID, rootNode);
    }
  }

  _sortListenersOfSceneGraphPriority(listenerID, rootNode) {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners || listeners.sceneGraphPriorityListenersEmpty) {
      return;
    }

    this.#nodePriorities.sortSceneGraphListeners(listeners, rootNode, this.#nodeListeners);
  }

  frameUpdateListeners() {
    this.#listeners.deleteEmpty();

    this._flushToAddedListeners();
  }

  _updateTouchListeners(event) {
    const locInDispatch = this.#inDispatch;
    assert(locInDispatch > 0, _LogInfos.EventManager__updateListeners);

    if (locInDispatch > 1) return;

    this.#listeners.update(_EventListenerTouchOneByOne.LISTENER_ID);
    this.#listeners.update(_EventListenerTouchAllAtOnce.LISTENER_ID);

    assert(locInDispatch === 1, _LogInfos.EventManager__updateListeners_2);

    this._flushToAddedListeners();
  }

  _flushToAddedListeners() {
    const listeners = this.#toAddedListeners.apply();
    if (listeners.length === 0) {
      return;
    }

    for (let i = 0, len = listeners.length; i < len; i++) {
      this._forceAddEventListener(listeners[i]);
    }
    this.#listeners.cleanRemoved();
  }

  _onTouchEventCallback(listener, argsObj) {
    // Skip if the listener was removed.
    if (!listener.registered) return false;

    const event = argsObj.event;
    const isClaimed = listener.handleTouchEvent(argsObj.selTouch, event);

    // If the event was stopped, return directly.
    if (event.stopped) {
      this._updateTouchListeners(event);
      return true;
    }

    const shouldSwallowTouch =
      isClaimed && listener.registered && listener.swallowTouches;

    if (shouldSwallowTouch && argsObj.needsMutableSet) {
      argsObj.touches.splice(argsObj.selTouch, 1);
    }

    return shouldSwallowTouch;
  }

  _dispatchTouchEvent(event) {
    this._sortEventListeners(_EventListenerTouchOneByOne.LISTENER_ID);
    this._sortEventListeners(_EventListenerTouchAllAtOnce.LISTENER_ID);

    const oneByOneListeners = this.#listeners.get(
      _EventListenerTouchOneByOne.LISTENER_ID
    );
    const allAtOnceListeners = this.#listeners.get(
      _EventListenerTouchAllAtOnce.LISTENER_ID
    );

    // If there aren't any touch listeners, return directly.
    if (null === oneByOneListeners && null === allAtOnceListeners) return;

    const originalTouches = event.touches,
      mutableTouches = copyArray(originalTouches);
    const oneByOneArgsObj = {
      event: event,
      needsMutableSet: oneByOneListeners && allAtOnceListeners,
      touches: mutableTouches,
      selTouch: null
    };

    //
    // process the target handlers 1st
    //
    if (oneByOneListeners) {
      for (let i = 0; i < originalTouches.length; i++) {
        oneByOneArgsObj.selTouch = originalTouches[i];
        oneByOneListeners.dispatchEvent(
          this._onTouchEventCallback.bind(this),
          oneByOneArgsObj
        );
        if (event.stopped) return;
      }
    }

    //
    // process standard handlers 2nd
    //
    if (allAtOnceListeners && mutableTouches.length > 0) {
      allAtOnceListeners.dispatchEvent(
        this._onTouchesEventCallback.bind(this),
        { event: event, touches: mutableTouches }
      );
      if (event.stopped) return;
    }
    this._updateTouchListeners(event);
  }

  _onTouchesEventCallback(listener, callbackParams) {
    // Skip if the listener was removed.
    if (!listener.registered) return false;

    const event = callbackParams.event;
    listener.handleTouchEvent(callbackParams.touches, event);

    const stopped = event.stopped;
    // If the event was stopped, return directly.
    if (event.stopped) {
      this._updateTouchListeners(event);
    }

    return stopped;
  }

  _dissociateNodeAndEventListener(
    listeners,
    index,
    shouldTrackRemoved = false
  ) {
    if (listeners === null || index === -1) {
      return false;
    }

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

  /**
   * <p>
   * Adds a event listener for a specified event.                                                                                                            <br/>
   * if the parameter "nodeOrPriority" is a node, it means to add a event listener for a specified event with the priority of scene graph.                   <br/>
   * if the parameter "nodeOrPriority" is a Number, it means to add a event listener for a specified event with the fixed priority.                          <br/>
   * </p>
   * @param {EventListener} listener The listener of a specified event or a object of some event parameters.
   * @param {Node|Number} nodeOrPriority The priority of the listener is based on the draw order of this node or fixedPriority The fixed priority of the listener.
   * @note  The priority of scene graph will be fixed value 0. So the order of listener item in the vector will be ' <0, scene graph (0 priority), >0'.
   *         A lower priority will be called before the ones that have a higher value. 0 priority is forbidden for fixed priority since it's used for scene graph based priority.
   *         The listener must be a EventListener object when adding a fixed priority listener, because we can't remove a fixed priority listener without the listener handler,
   *         except calls removeAllListeners().
   * @return {EventListener} Return the listener. Needed in order to remove the event from the dispatcher.
   */
  addListener(listener, nodeOrPriority) {
    assert(listener && nodeOrPriority, _LogInfos.eventManager_addListener_2);
    if (!(listener instanceof EventListener)) {
      assert(!isNumber(nodeOrPriority), _LogInfos.eventManager_addListener_3);
      listener = EventListener.create(listener);
    } else if (listener.registered) {
      log(_LogInfos.eventManager_addListener_4);
      return;
    }

    if (!listener.available) return;

    const isFixedPriority = isNumber(nodeOrPriority);
    if (isFixedPriority && nodeOrPriority === 0) {
      log(_LogInfos.eventManager_addListener);
      return;
    }

    listener.setRegisteredPriority(nodeOrPriority);

    if (isFixedPriority) {
      listener.paused = false;
    }

    if (this.#inDispatch === 0) {
      this._forceAddEventListener(listener);
    } else {
      this.#toAddedListeners.add(listener);
    }

    return listener;
  }

  /**
   * Adds a Custom event listener. It will use a fixed priority of 1.
   * @param {string} eventName
   * @param {function} callback
   * @return {EventListener} the generated event. Needed in order to remove the event from the dispatcher
   */
  addCustomListener(eventName, callback, target) {
    const listener = new _EventListenerCustom(eventName, callback, target);
    this.addListener(listener, 1);
    return listener;
  }

  _removeListenerTemp(listener, listeners, isSceneGraph) {
    const listenersToCheck = isSceneGraph
      ? listeners.sceneGraphPriorityListeners
      : listeners.fixedPriorityListeners;

    if (!this._removeListenerInVector(listenersToCheck, listener)) {
      return false;
    }

    const flag = isSceneGraph
      ? EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY
      : EventManagerDirtyFlag.FIXED_PRIORITY;
    this.#listeners.priorityDirtyFlags.setDirty(listener.id, flag);

    return true;
  }

  _removeListenerInner(listener, listeners, listenerID) {
    const isFound =
      this._removeListenerTemp(listener, listeners, true) ||
      this._removeListenerTemp(listener, listeners, false);

    if (listeners.empty) {
      this.#listeners.delete(listenerID);
    }

    return isFound;
  }

  /**
   * Remove a listener
   * @param {EventListener} listener an event listener or a registered node target
   */
  removeListener(listener) {
    if (listener == null) return;

    const isFound = this.#listeners.removeFromListeners(
      listener,
      this._removeListenerInner.bind(this)
    );

    if (!isFound) {
      this.#toAddedListeners.remove(listener);
    }
  }

  _removeListenerInCallback(listeners, callback) {
    const index =
      listeners !== null
        ? listeners.findIndex(
            (listener) =>
              listener.onCustomEvent === callback ||
              listener.onEvent === callback
          )
        : -1;

    this._dissociateNodeAndEventListener(listeners, index);

    return index !== -1;
  }

  _removeListenerInVector(listeners, listener) {
    const index = listeners !== null ? listeners.indexOf(listener) : -1;

    this._dissociateNodeAndEventListener(listeners, index, true);

    return index !== -1;
  }

  /**
   * Removes all listeners with the same event listener type or removes all listeners of a node
   * @param {Number|Node} listenerType listenerType or a node
   * @param {Boolean} [recursive=false]
   */
  removeListeners(listenerType, recursive) {
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
      this._removeListenersForListenerID(
        EventManager.#listenerIDByType.get(listenerType)
      );
    } else {
      log(_LogInfos.eventManager_removeListeners);
    }
  }

  /**
   * Removes all custom listeners with the same event name
   * @param {string} customEventName
   */
  removeCustomListeners(customEventName) {
    this._removeListenersForListenerID(customEventName);
  }

  /**
   * Removes all listeners
   */
  removeAllListeners() {
    const ids = this.#listeners.keys;
    for (const id of ids) {
      if (!this.#internalCustomListenerIDs.includes(id)) {
        this._removeListenersForListenerID(id);
      }
    }
  }

  /**
   * Sets listener's priority with fixed value.
   * @param {EventListener} listener
   * @param {Number} fixedPriority
   */
  setPriority(listener, fixedPriority) {
    this.#listeners.setPriority(listener, fixedPriority);
  }

  /**
   * Whether to enable dispatching events
   * @param {boolean} enabled
   */
  set enabled(enabled) {
    this.#isEnabled = enabled;
  }

  /**
   * Checks whether dispatching events is enabled
   * @returns {boolean}
   */
  get enabled() {
    return this.#isEnabled;
  }

  /**
   * Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
   * @param {Event} event
   */
  dispatchEvent(event) {
    if (!this.#isEnabled) return;

    this.#nodeListeners.updateDirtyFlagForSceneGraph(
      this.#listeners.priorityDirtyFlags
    );
    this.#inDispatch++;
    if (!event || event.type === EventType.NONE)
      throw new Error("event is undefined");
    if (event.type === EventType.TOUCH) {
      this._dispatchTouchEvent(event);
      this.#inDispatch--;
      return;
    }

    const listenerID = EventManager.__getListenerID(event);
    this._sortEventListeners(listenerID);
    this.#listeners.dispatchEvent(listenerID, event);

    this.#inDispatch--;
  }

  /**
   * Pauses all listeners which are associated the specified target.
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  pauseTarget(node, recursive = false) {
    this.#nodeListeners.setTargetPaused(node, recursive, true);
  }

  /**
   * Resumes all listeners which are associated the specified target.
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  resumeTarget(node, recursive = false) {
    this.#nodeListeners.setTargetPaused(node, recursive, false);
  }

  /**
   * Dispatches a Custom Event with a event name an optional user data
   * @param {string} eventName
   * @param {*} optionalUserData
   */
  dispatchCustomEvent(eventName, optionalUserData) {
    this.dispatchEvent(new EventCustom(eventName, optionalUserData));
  }

}

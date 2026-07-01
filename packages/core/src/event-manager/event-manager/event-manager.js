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
import { arrayRemoveObject, copyArray } from "../../platform/macro/utils";
import { isNumber } from "../../boot/utils";
import {
  EventListener,
  _EventListenerCustom,
  _EventListenerMouse,
  _EventListenerTouchOneByOne,
  _EventListenerTouchAllAtOnce,
  _EventListenerFocus,
  _EventListenerAcceleration,
  _EventListenerKeyboard,
  _EventListenerVector
} from "../event-listener";
import { log, assert, _LogInfos } from "../../boot/debugger";
import { ToAddedListeners } from "./to-added-listeners";

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

  #listeners = new Map();
  #priorityDirtyFlags = new Map();
  #nodeListeners = new Map();
  #nodePriorities = new Map();
  #globalZOrderNodes = new Map();
  #toAddedListeners;
  #toRemovedListeners = [];
  #dirtyNodes = [];
  #inDispatch = 0;
  #isEnabled = false;
  #nodePriorityIndex = 0;
  #internalCustomListenerIDs = [GameEvent.HIDE, GameEvent.SHOW];
  #director = null;

  constructor() {
    this.#toAddedListeners = new ToAddedListeners();
  }

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
    // Mark the node dirty only when there is an event listener associated with it.
    if (this.#nodeListeners.has(node.__instanceId)) this.#dirtyNodes.push(node);
    const _children = node.children;
    for (let i = 0, len = _children.length; i < len; i++)
      this._setDirtyForNode(_children[i]);
  }

  /**
   * Pauses all listeners which are associated the specified target.
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  pauseTarget(node, recursive = false) {
    const listeners = this.#nodeListeners.get(node.__instanceId);
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i++)
        listeners[i].paused = true;
    }
    if (recursive === true) {
      const locChildren = node.children;
      for (let i = 0, len = locChildren.length; i < len; i++)
        this.pauseTarget(locChildren[i], true);
    }
  }

  /**
   * Resumes all listeners which are associated the specified target.
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  resumeTarget(node, recursive) {
    const listeners = this.#nodeListeners.get(node.__instanceId);
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i++)
        listeners[i].paused = false;
    }
    this._setDirtyForNode(node);
    if (recursive === true) {
      const locChildren = node.children;
      for (let i = 0, len = locChildren.length; i < len; i++)
        this.resumeTarget(locChildren[i], true);
    }
  }

  _forceAddEventListener(listener) {
    const listenerID = listener.id;
    let listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      listeners = new _EventListenerVector();
      this.#listeners.set(listenerID, listeners);
    }
    listeners.push(listener);

    if (listener.fixedPriority === 0) {
      this._setDirty(listenerID, EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY);

      const node = listener.sceneGraphPriority;
      if (node === null) log(_LogInfos.eventManager__forceAddEventListener);

      this._associateNodeAndEventListener(node, listener);
      if (node.isRunning()) this.resumeTarget(node);
    } else this._setDirty(listenerID, EventManagerDirtyFlag.FIXED_PRIORITY);
  }

  _updateDirtyFlagForSceneGraph() {
    if (this.#dirtyNodes.length === 0) return;

    const locDirtyNodes = this.#dirtyNodes,
      locNodeListeners = this.#nodeListeners;
    let selListeners, selListener;
    for (let i = 0, len = locDirtyNodes.length; i < len; i++) {
      selListeners = locNodeListeners.get(locDirtyNodes[i].__instanceId);
      if (selListeners) {
        for (
          let j = 0, listenersLen = selListeners.length;
          j < listenersLen;
          j++
        ) {
          selListener = selListeners[j];
          if (selListener)
            this._setDirty(
              selListener.id,
              EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY
            );
        }
      }
    }
    this.#dirtyNodes.length = 0;
  }

  _removeAllListenersInVector(listenerVector) {
    if (!listenerVector) {
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
      this.#priorityDirtyFlags.delete(listenerID);

      if (!this.#inDispatch) {
        listeners.clear();
      }
      this.#listeners.delete(listenerID);
    }

    this.#toAddedListeners.removeForListenerID(listenerID);
  }

  _sortEventListeners(listenerID) {
    const dirtyFlag = this.#priorityDirtyFlags.has(listenerID)
      ? this.#priorityDirtyFlags.get(listenerID)
      : EventManagerDirtyFlag.NONE;

    if (dirtyFlag === EventManagerDirtyFlag.NONE) {
      return;
    }

    // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
    this.#priorityDirtyFlags.set(listenerID, EventManagerDirtyFlag.NONE);

    if (dirtyFlag & EventManagerDirtyFlag.FIXED_PRIORITY)
      this._sortListenersOfFixedPriority(listenerID);

    if (dirtyFlag & EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY) {
      const rootNode = this.#director.getRunningScene();
      if (rootNode)
        this._sortListenersOfSceneGraphPriority(listenerID, rootNode);
      else
        this.#priorityDirtyFlags.set(
          listenerID,
          EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY
        );
    }
  }

  _sortListenersOfSceneGraphPriority(listenerID, rootNode) {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners || listeners.sceneGraphPriorityListenersEmpty) {
      return;
    }

    // Reset priority index
    this.#nodePriorityIndex = 0;
    this.#nodePriorities.clear();

    this._visitTarget(rootNode, true);

    listeners.sortSceneGraphPriorityListeners(this.#nodePriorities);
  }

  _sortListenersOfFixedPriority(listenerID) {
    if (!this.#listeners.has(listenerID)) {
      return;
    }

    const listeners = this.#listeners.get(listenerID);
    listeners.sortFixedPriorityListeners();
  }

  _onUpdateListeners(listenerID) {
    if (!this.#listeners.has(listenerID)) {
      return;
    }

    const listeners = this.#listeners.get(listenerID);
    listeners.updateListeners(this.#toRemovedListeners);
  }

  frameUpdateListeners() {
    for (const [id, listeners] of this.#listeners) {
      if (listeners.empty) {
        this.#priorityDirtyFlags.delete(id);
        this.#listeners.delete(id);
      }
    }

    this._flushToAddedListeners();
    this._cleanToRemovedListeners();
  }

  _updateTouchListeners(event) {
    const locInDispatch = this.#inDispatch;
    assert(locInDispatch > 0, _LogInfos.EventManager__updateListeners);

    if (locInDispatch > 1) return;

    this._onUpdateListeners(_EventListenerTouchOneByOne.LISTENER_ID);
    this._onUpdateListeners(_EventListenerTouchAllAtOnce.LISTENER_ID);

    assert(locInDispatch === 1, _LogInfos.EventManager__updateListeners_2);

    this._flushToAddedListeners();
    this._cleanToRemovedListeners();
  }

  _flushToAddedListeners() {
    const listeners = this.#toAddedListeners.apply();
    if (listeners.length === 0) {
      return;
    }

    for (let i = 0, len = listeners.length; i < len; i++) {
      this._forceAddEventListener(listeners[i]);
    }
  }

  //Remove all listeners in _toRemoveListeners list and cleanup
  _cleanToRemovedListeners() {
    if (this.#toRemovedListeners.length === 0) {
      return;
    }

    for (let i = 0; i < this.#toRemovedListeners.length; i++) {
      const selListener = this.#toRemovedListeners[i];
      if (!this.#listeners.has(selListener.id)) continue;

      const listeners = this.#listeners.get(selListener.id);
      listeners.removeListener(selListener);
    }
    this.#toRemovedListeners.length = 0;
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

  _associateNodeAndEventListener(node, listener) {
    let listeners = this.#nodeListeners.get(node.__instanceId);
    if (!listeners) {
      listeners = [];
      this.#nodeListeners.set(node.__instanceId, listeners);
    }
    listeners.push(listener);
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
      const node = listener.sceneGraphPriority;
      const listeners = this.#nodeListeners.get(node.__instanceId);

      if (listeners) {
        arrayRemoveObject(listeners, listener);

        if (listeners.length === 0) {
          this.#nodeListeners.delete(node.__instanceId);
        }
      }

      listener.sceneGraphPriority = null; // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
    }

    if (this.#inDispatch === 0) {
      listeners.splice(index, 1);
      return true;
    }

    if (shouldTrackRemoved) {
      this.#toRemovedListeners.push(listener);
    }

    return false;
  }

  _setDirty(listenerID, flag) {
    const locDirtyFlags = this.#priorityDirtyFlags;
    if (!locDirtyFlags.has(listenerID)) locDirtyFlags.set(listenerID, flag);
    else locDirtyFlags.set(listenerID, flag | locDirtyFlags.get(listenerID));
  }

  _visitTarget(node, isRootNode) {
    const children = node.children;
    let i = 0,
      globalZOrder;
    const childrenCount = children.length,
      locGlobalZOrderNodes = this.#globalZOrderNodes,
      locNodeListeners = this.#nodeListeners;

    if (childrenCount > 0) {
      let child;
      // visit children zOrder < 0
      for (; i < childrenCount; i++) {
        child = children[i];
        if (child && child.zIndex < 0) this._visitTarget(child, false);
        else break;
      }

      if (locNodeListeners.has(node.__instanceId)) {
        globalZOrder = node.getGlobalZOrder();
        if (!locGlobalZOrderNodes.has(globalZOrder))
          locGlobalZOrderNodes.set(globalZOrder, []);
        locGlobalZOrderNodes.get(globalZOrder).push(node.__instanceId);
      }

      for (; i < childrenCount; i++) {
        child = children[i];
        if (child) this._visitTarget(child, false);
      }
    } else {
      if (locNodeListeners.has(node.__instanceId)) {
        globalZOrder = node.getGlobalZOrder();
        if (!locGlobalZOrderNodes.has(globalZOrder))
          locGlobalZOrderNodes.set(globalZOrder, []);
        locGlobalZOrderNodes.get(globalZOrder).push(node.__instanceId);
      }
    }

    if (isRootNode) {
      const globalZOrders = Array.from(locGlobalZOrderNodes.keys());
      globalZOrders.sort(this._sortNumberAsc);

      const zOrdersLen = globalZOrders.length,
        locNodePriorities = this.#nodePriorities;
      let selZOrders, j;
      for (i = 0; i < zOrdersLen; i++) {
        selZOrders = locGlobalZOrderNodes.get(globalZOrders[i]);
        for (j = 0; j < selZOrders.length; j++)
          locNodePriorities.set(selZOrders[j], ++this.#nodePriorityIndex);
      }
      this.#globalZOrderNodes.clear();
    }
  }

  _sortNumberAsc(a, b) {
    return a - b;
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

  /**
   * Remove a listener
   * @param {EventListener} listener an event listener or a registered node target
   */
  removeListener(listener) {
    if (listener == null) return;

    let isFound;
    const locListeners = this.#listeners;
    for (const [listenerID, listeners] of locListeners) {
      const fixedPriorityListeners = listeners.fixedPriorityListeners,
        sceneGraphPriorityListeners = listeners.sceneGraphPriorityListeners;

      isFound = this._removeListenerInVector(
        sceneGraphPriorityListeners,
        listener
      );
      if (isFound) {
        // fixed #4160: Dirty flag need to be updated after listeners were removed.
        this._setDirty(listener.id, EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY);
      } else {
        isFound = this._removeListenerInVector(
          fixedPriorityListeners,
          listener
        );
        if (isFound)
          this._setDirty(listener.id, EventManagerDirtyFlag.FIXED_PRIORITY);
      }

      if (listeners.empty) {
        this.#priorityDirtyFlags.delete(listenerID);
        locListeners.delete(listenerID);
      }

      if (isFound) break;
    }

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
      this.#nodePriorities.delete(listenerType.__instanceId);
      arrayRemoveObject(this.#dirtyNodes, listenerType);
      const listeners = this.#nodeListeners.get(listenerType.__instanceId);
      let i;
      if (listeners) {
        const listenersCopy = copyArray(listeners);
        for (i = 0; i < listenersCopy.length; i++)
          this.removeListener(listenersCopy[i]);
        listenersCopy.length = 0;
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
    const ids = this.#listeners.keys();
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
    if (listener == null) {
      return;
    }

    const listeners = this.#listeners.values();

    for (const selListeners of listeners) {
      if (!selListeners.fixedPriorityListeners.includes(listener)) {
        continue;
      }

      if (listener.updateFixedPriority(fixedPriority)) {
        this._setDirty(listener.id, EventManagerDirtyFlag.FIXED_PRIORITY);
      }
      return;
    }
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

    this._updateDirtyFlagForSceneGraph();
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
    if (this.#listeners.has(listenerID)) {
      const selListeners = this.#listeners.get(listenerID);
      selListeners.dispatchEvent(EventListener.handleEventCallback, event);
      this._onUpdateListeners(listenerID);
    }

    this.#inDispatch--;
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

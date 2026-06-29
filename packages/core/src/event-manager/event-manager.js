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

import { Node } from "../base-nodes/node";
import { EventCustom } from "./event";
import {
  EventListenerType,
  EventManagerDirtyFlag,
  EventType,
  GameEvent
} from "../enums";
import { arrayRemoveObject, copyArray } from "../platform/macro/utils";
import { isNumber } from "../boot/utils";
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
} from "./event-listener";
import { log, assert, _LogInfos } from "../boot/debugger";

/**
 * <p>
 *  EventManager is a singleton class which manages event listener subscriptions and event dispatching. <br/>
 *                                                                                                              <br/>
 *  The EventListener list is managed in such way so that event listeners can be added and removed          <br/>
 *  while events are being dispatched.
 * </p>
 */
export default class EventManager {
  #listeners = new Map();
  #priorityDirtyFlags = new Map();
  #nodeListeners = new Map();
  #nodePriorities = new Map();
  #globalZOrderNodes = new Map();
  #toAddedListeners = [];
  #toRemovedListeners = [];
  #dirtyNodes = [];
  #inDispatch = 0;
  #isEnabled = false;
  #nodePriorityIndex = 0;
  #internalCustomListenerIDs = [GameEvent.HIDE, GameEvent.SHOW];
  #director = null;

  static __getListenerID(event) {
    switch (event.type) {
      case EventType.ACCELERATION:
        return _EventListenerAcceleration.LISTENER_ID;
      case EventType.CUSTOM:
        return event.eventName;
      case EventType.KEYBOARD:
        return _EventListenerKeyboard.LISTENER_ID;
      case EventType.MOUSE:
        return _EventListenerMouse.LISTENER_ID;
      case EventType.FOCUS:
        return _EventListenerFocus.LISTENER_ID;
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
    if (this.#nodeListeners.has(node.__instanceId))
      this.#dirtyNodes.push(node);
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

  _addListener(listener) {
    if (this.#inDispatch === 0) this._forceAddEventListener(listener);
    else this.#toAddedListeners.push(listener);
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

  _getListeners(listenerID) {
    return this.#listeners.get(listenerID);
  }

  _updateDirtyFlagForSceneGraph() {
    if (this.#dirtyNodes.length === 0) return;

    const locDirtyNodes = this.#dirtyNodes,
      locNodeListeners = this.#nodeListeners;
    let selListeners,
      selListener;
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
    if (!listenerVector) return;
    let selListener;
    for (let i = 0; i < listenerVector.length; ) {
      selListener = listenerVector[i];
      selListener.registered = false;
      if (selListener.sceneGraphPriority !== null) {
        this._dissociateNodeAndEventListener(
          selListener.sceneGraphPriority,
          selListener
        );
        selListener.sceneGraphPriority = null; // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
      }

      if (this.#inDispatch === 0)
        arrayRemoveObject(listenerVector, selListener);
      else ++i;
    }
  }

  _removeListenersForListenerID(listenerID) {
    const listeners = this.#listeners.get(listenerID);
    if (listeners) {
      const fixedPriorityListeners = listeners.fixedPriorityListeners;
      const sceneGraphPriorityListeners =
        listeners.sceneGraphPriorityListeners;

      this._removeAllListenersInVector(sceneGraphPriorityListeners);
      this._removeAllListenersInVector(fixedPriorityListeners);

      // Remove the dirty flag according the 'listenerID'.
      // No need to check whether the dispatcher is dispatching event.
      this.#priorityDirtyFlags.delete(listenerID);

      if (!this.#inDispatch) {
        listeners.clear();
      }
      this.#listeners.delete(listenerID);
    }

    const locToAddedListeners = this.#toAddedListeners;
    let i,
      listener;
    for (i = 0; i < locToAddedListeners.length; ) {
      listener = locToAddedListeners[i];
      if (listener && listener.id === listenerID)
        arrayRemoveObject(locToAddedListeners, listener);
      else ++i;
    }
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
    const listeners = this._getListeners(listenerID);
    if (!listeners) return;

    const sceneGraphListener = listeners.sceneGraphPriorityListeners;
    if (!sceneGraphListener || sceneGraphListener.length === 0) return;

    // Reset priority index
    this.#nodePriorityIndex = 0;
    this.#nodePriorities.clear();

    this._visitTarget(rootNode, true);

    // After sort: priority < 0, > 0
    listeners
      .sceneGraphPriorityListeners
      .sort(this._sortEventListenersOfSceneGraphPriorityDes.bind(this));
  }

  _sortEventListenersOfSceneGraphPriorityDes(l1, l2) {
    const locNodePriorities = this.#nodePriorities,
      node1 = l1.sceneGraphPriority,
      node2 = l2.sceneGraphPriority;
    if (!l2 || !node2 || !locNodePriorities.has(node2.__instanceId)) return -1;
    else if (!l1 || !node1 || !locNodePriorities.has(node1.__instanceId))
      return 1;
    return (
      locNodePriorities.get(node2.__instanceId) -
      locNodePriorities.get(node1.__instanceId)
    );
  }

  _sortListenersOfFixedPriority(listenerID) {
    if (!this.#listeners.has(listenerID)) {
      return;
    }

    const listeners = this.#listeners.get(listenerID);
    listeners.sortFixedPriorityListeners();
  }

  _onUpdateListeners(listeners) {
    const fixedPriorityListeners = listeners.fixedPriorityListeners;
    const sceneGraphPriorityListeners =
      listeners.sceneGraphPriorityListeners;
    let i,
      selListener,
      idx,
      toRemovedListeners = this.#toRemovedListeners;

    if (sceneGraphPriorityListeners) {
      for (i = 0; i < sceneGraphPriorityListeners.length; ) {
        selListener = sceneGraphPriorityListeners[i];
        if (!selListener.registered) {
          arrayRemoveObject(sceneGraphPriorityListeners, selListener);
          // if item in toRemove list, remove it from the list
          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        } else ++i;
      }
    }

    if (fixedPriorityListeners) {
      for (i = 0; i < fixedPriorityListeners.length; ) {
        selListener = fixedPriorityListeners[i];
        if (!selListener.registered) {
          arrayRemoveObject(fixedPriorityListeners, selListener);
          // if item in toRemove list, remove it from the list
          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        } else ++i;
      }
    }

    if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0)
      listeners.clearSceneGraphListeners();

    if (fixedPriorityListeners && fixedPriorityListeners.length === 0)
      listeners.clearFixedListeners();
  }

  frameUpdateListeners() {
    const locListeners = this.#listeners,
      locDirtyFlags = this.#priorityDirtyFlags;
    for (const [listenerID, listeners] of locListeners) {
      if (listeners.empty) {
        locDirtyFlags.delete(listenerID);
        locListeners.delete(listenerID);
      }
    }

    const locToAddedListeners = this.#toAddedListeners;
    if (locToAddedListeners.length !== 0) {
      for (let i = 0, len = locToAddedListeners.length; i < len; i++)
        this._forceAddEventListener(locToAddedListeners[i]);
      locToAddedListeners.length = 0;
    }
    if (this.#toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  }

  _updateTouchListeners(event) {
    const locInDispatch = this.#inDispatch;
    assert(locInDispatch > 0, _LogInfos.EventManager__updateListeners);

    if (locInDispatch > 1) return;

    let listeners;
    listeners = this.#listeners.get(_EventListenerTouchOneByOne.LISTENER_ID);
    if (listeners) {
      this._onUpdateListeners(listeners);
    }
    listeners = this.#listeners.get(_EventListenerTouchAllAtOnce.LISTENER_ID);
    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    assert(locInDispatch === 1, _LogInfos.EventManager__updateListeners_2);

    const locToAddedListeners = this.#toAddedListeners;
    if (locToAddedListeners.length !== 0) {
      for (let i = 0, len = locToAddedListeners.length; i < len; i++)
        this._forceAddEventListener(locToAddedListeners[i]);
      locToAddedListeners.length = 0;
    }
    if (this.#toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  }

  //Remove all listeners in _toRemoveListeners list and cleanup
  _cleanToRemovedListeners() {
    const toRemovedListeners = this.#toRemovedListeners;
    for (let i = 0; i < toRemovedListeners.length; i++) {
      const selListener = toRemovedListeners[i];
      const listeners = this.#listeners.get(selListener.id);
      if (!listeners) continue;

      let idx;
      const fixedPriorityListeners = listeners.fixedPriorityListeners,
        sceneGraphPriorityListeners =
          listeners.sceneGraphPriorityListeners;

      if (sceneGraphPriorityListeners) {
        idx = sceneGraphPriorityListeners.indexOf(selListener);
        if (idx !== -1) {
          sceneGraphPriorityListeners.splice(idx, 1);
        }
      }
      if (fixedPriorityListeners) {
        idx = fixedPriorityListeners.indexOf(selListener);
        if (idx !== -1) {
          fixedPriorityListeners.splice(idx, 1);
        }
      }
    }
    toRemovedListeners.length = 0;
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

    const oneByOneListeners = this._getListeners(
      _EventListenerTouchOneByOne.LISTENER_ID
    );
    const allAtOnceListeners = this._getListeners(
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
        this._dispatchEventToListeners(
          oneByOneListeners,
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
      this._dispatchEventToListeners(
        allAtOnceListeners,
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

    // If the event was stopped, return directly.
    if (event.stopped) {
      this._updateTouchListeners(event);
      return true;
    }
    return false;
  }

  _associateNodeAndEventListener(node, listener) {
    let listeners = this.#nodeListeners.get(node.__instanceId);
    if (!listeners) {
      listeners = [];
      this.#nodeListeners.set(node.__instanceId, listeners);
    }
    listeners.push(listener);
  }

  _dissociateNodeAndEventListener(node, listener) {
    const listeners = this.#nodeListeners.get(node.__instanceId);
    if (listeners) {
      arrayRemoveObject(listeners, listener);
      if (listeners.length === 0) this.#nodeListeners.delete(node.__instanceId);
    }
  }

  _dispatchEventToListeners(listeners, onEvent, eventOrArgs) {
    let shouldStopPropagation = false;
    const fixedPriorityListeners = listeners.fixedPriorityListeners;
    const sceneGraphPriorityListeners =
      listeners.sceneGraphPriorityListeners;

    let i = 0,
      j,
      selListener;
    if (fixedPriorityListeners) {
      // priority < 0
      if (fixedPriorityListeners.length !== 0) {
        for (; i < listeners.firstNaturalFixedPriorityIndex; ++i) {
          selListener = fixedPriorityListeners[i];
          if (
            selListener.enabled &&
            !selListener.paused &&
            selListener.registered &&
            onEvent(selListener, eventOrArgs)
          ) {
            shouldStopPropagation = true;
            break;
          }
        }
      }
    }

    if (sceneGraphPriorityListeners && !shouldStopPropagation) {
      // priority == 0, scene graph priority
      for (j = 0; j < sceneGraphPriorityListeners.length; j++) {
        selListener = sceneGraphPriorityListeners[j];
        if (
          selListener.enabled &&
          !selListener.paused &&
          selListener.registered &&
          onEvent(selListener, eventOrArgs)
        ) {
          shouldStopPropagation = true;
          break;
        }
      }
    }

    if (fixedPriorityListeners && !shouldStopPropagation) {
      // priority > 0
      for (; i < fixedPriorityListeners.length; ++i) {
        selListener = fixedPriorityListeners[i];
        if (
          selListener.enabled &&
          !selListener.paused &&
          selListener.registered &&
          onEvent(selListener, eventOrArgs)
        ) {
          shouldStopPropagation = true;
          break;
        }
      }
    }
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
      let selZOrders,
        j;
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
   * @param {EventListener|Object} listener The listener of a specified event or a object of some event parameters.
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
    } else {
      if (listener.registered) {
        log(_LogInfos.eventManager_addListener_4);
        return;
      }
    }

    if (!listener.available) return;

    if (isNumber(nodeOrPriority)) {
      if (nodeOrPriority === 0) {
        log(_LogInfos.eventManager_addListener);
        return;
      }

      listener.sceneGraphPriority = null;
      listener.fixedPriority = nodeOrPriority;
      listener.registered = true;
      listener.paused = false;
      this._addListener(listener);
    } else {
      listener.sceneGraphPriority = nodeOrPriority;
      listener.fixedPriority = 0;
      listener.registered = true;
      this._addListener(listener);
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
        sceneGraphPriorityListeners =
          listeners.sceneGraphPriorityListeners;

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
      const locToAddedListeners = this.#toAddedListeners;
      for (let i = 0, len = locToAddedListeners.length; i < len; i++) {
        const selListener = locToAddedListeners[i];
        if (selListener === listener) {
          arrayRemoveObject(locToAddedListeners, selListener);
          selListener.registered = false;
          break;
        }
      }
    }
  }

  _removeListenerInCallback(listeners, callback) {
    if (listeners == null) return false;

    for (let i = 0, len = listeners.length; i < len; i++) {
      const selListener = listeners[i];
      if (
        selListener.onCustomEvent === callback ||
        selListener.onEvent === callback
      ) {
        selListener.registered = false;
        if (selListener.sceneGraphPriority != null) {
          this._dissociateNodeAndEventListener(
            selListener.sceneGraphPriority,
            selListener
          );
          selListener.sceneGraphPriority = null; // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
        }

        if (this.#inDispatch === 0) arrayRemoveObject(listeners, selListener);
        return true;
      }
    }
    return false;
  }

  _removeListenerInVector(listeners, listener) {
    if (listeners == null) return false;

    for (let i = 0, len = listeners.length; i < len; i++) {
      const selListener = listeners[i];
      if (selListener === listener) {
        selListener.registered = false;
        if (selListener.sceneGraphPriority != null) {
          this._dissociateNodeAndEventListener(
            selListener.sceneGraphPriority,
            selListener
          );
          selListener.sceneGraphPriority = null; // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
        }

        if (this.#inDispatch === 0) arrayRemoveObject(listeners, selListener);
        else this.#toRemovedListeners.push(selListener);
        return true;
      }
    }
    return false;
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
      const locToAddedListeners = this.#toAddedListeners;
      for (i = 0; i < locToAddedListeners.length; ) {
        const listener = locToAddedListeners[i];
        if (listener.sceneGraphPriority === listenerType) {
          listener.sceneGraphPriority = null; // Ensure no dangling ptr to the target node.
          listener.registered = false;
          locToAddedListeners.splice(i, 1);
        } else ++i;
      }

      if (recursive === true) {
        const locChildren = listenerType.children;
        let len;
        for (i = 0, len = locChildren.length; i < len; i++)
          this.removeListeners(locChildren[i], true);
      }
    } else {
      switch (listenerType) {
        case EventListenerType.TOUCH_ONE_BY_ONE:
          this._removeListenersForListenerID(
            _EventListenerTouchOneByOne.LISTENER_ID
          );
          break;
        case EventListenerType.TOUCH_ALL_AT_ONCE:
          this._removeListenersForListenerID(
            _EventListenerTouchAllAtOnce.LISTENER_ID
          );
          break;
        case EventListenerType.MOUSE:
          this._removeListenersForListenerID(_EventListenerMouse.LISTENER_ID);
          break;
        case EventListenerType.ACCELERATION:
          this._removeListenersForListenerID(
            _EventListenerAcceleration.LISTENER_ID
          );
          break;
        case EventListenerType.KEYBOARD:
          this._removeListenersForListenerID(
            _EventListenerKeyboard.LISTENER_ID
          );
          break;
        default:
          log(_LogInfos.eventManager_removeListeners);
          break;
      }
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
    const locListeners = this.#listeners,
      locInternalCustomEventIDs = this.#internalCustomListenerIDs;
    for (const listenerID of locListeners.keys()) {
      if (locInternalCustomEventIDs.indexOf(listenerID) === -1)
        this._removeListenersForListenerID(listenerID);
    }
  }

  /**
   * Sets listener's priority with fixed value.
   * @param {EventListener} listener
   * @param {Number} fixedPriority
   */
  setPriority(listener, fixedPriority) {
    if (listener == null) return;

    const locListeners = this.#listeners;
    for (const selListeners of locListeners.values()) {
      const fixedPriorityListeners = selListeners.fixedPriorityListeners;
      if (fixedPriorityListeners) {
        const found = fixedPriorityListeners.indexOf(listener);
        if (found !== -1) {
          if (listener.sceneGraphPriority != null)
            log(_LogInfos.eventManager_setPriority);
          if (listener.fixedPriority !== fixedPriority) {
            listener.fixedPriority = fixedPriority;
            this._setDirty(listener.id, EventManagerDirtyFlag.FIXED_PRIORITY);
          }
          return;
        }
      }
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
    const selListeners = this.#listeners.get(listenerID);
    if (selListeners) {
      this._dispatchEventToListeners(
        selListeners,
        this._onListenerCallback,
        event
      );
      this._onUpdateListeners(selListeners);
    }

    this.#inDispatch--;
  }

  _onListenerCallback(listener, event) {
    event.currentTarget = listener.sceneGraphPriority;
    listener.onEvent(event);
    return event.stopped;
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

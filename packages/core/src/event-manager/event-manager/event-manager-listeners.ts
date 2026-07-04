import {
  EventListener,
  _EventListenerTouchAllAtOnce,
  _EventListenerTouchOneByOne,
  _EventListenerVector
} from "../event-listener";
import { EventManagerDirtyFlag } from "../../enums";
import { assert, _LogInfos } from "../../boot/debugger";
import { copyArray } from "../../platform/macro/utils";
import ToRemovedListeners from "./to-removed-listeners";
import PriorityDirtyFlags from "./priority-dirty-flags";
import type { Event, EventTouch } from "../event";
import type {
  AllAtOnceTouchArgs,
  OneByOneTouchArgs,
  OneByOneTouchDispatchArgs,
  RemoveCheck,
  TouchDispatchCallback,
  TouchesDispatchCallback
} from "./types";

export default class EventManagerListeners {
  #listeners = new Map<string, _EventListenerVector>();
  #toRemovedListeners = new ToRemovedListeners();
  #priorityDirtyFlags = new PriorityDirtyFlags();

  get priorityDirtyFlags(): PriorityDirtyFlags {
    return this.#priorityDirtyFlags;
  }

  setDirty(listenerID: string, isSceneGraph: boolean): void {
    const flag = isSceneGraph
      ? EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY
      : EventManagerDirtyFlag.FIXED_PRIORITY;
    this.#priorityDirtyFlags.setDirty(listenerID, flag);
  }

  removeFromListeners(listener: EventListener, removeCheck: RemoveCheck): boolean {
    for (const [listenerID, listeners] of this.#listeners) {
      if (removeCheck(listener, listeners, listenerID)) {
        return true;
      }
    }

    return false;
  }

  delete(id: string): void {
    this.#priorityDirtyFlags.delete(id);
    this.#listeners.delete(id);
  }

  get(id: string): _EventListenerVector | undefined {
    return this.#listeners.get(id);
  }

  addToRemove(listener: EventListener): void {
    this.#toRemovedListeners.add(listener);
  }

  get keys(): IterableIterator<string> {
    return this.#listeners.keys();
  }

  addToVector(listener: EventListener): void {
    const listenerID = listener.id;
    let listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      listeners = new _EventListenerVector();
      this.#listeners.set(listenerID, listeners);
    }
    listeners.push(listener);

    this.#priorityDirtyFlags.setDirty(
      listenerID,
      listener.fixedPriority === 0
        ? EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY
        : EventManagerDirtyFlag.FIXED_PRIORITY
    );
  }

  sortEventListeners(listenerID: string, hasRootNode: boolean): boolean {
    const dirtyFlag = this.#priorityDirtyFlags.getAndClear(listenerID);

    if (dirtyFlag === EventManagerDirtyFlag.NONE) {
      return false;
    }

    if (dirtyFlag & EventManagerDirtyFlag.FIXED_PRIORITY) {
      const listeners = this.#listeners.get(listenerID);
      if (listeners) {
        listeners.sortFixedPriorityListeners();
      }
    }

    if (!(dirtyFlag & EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY)) {
      return false;
    }

    if (!hasRootNode) {
      this.#priorityDirtyFlags.setSceneGraphPriority(listenerID);
      return false;
    }

    return true;
  }

  updateTouchListeners(locInDispatch: number): boolean {
    assert(locInDispatch > 0, _LogInfos.EventManager__updateListeners);

    if (locInDispatch > 1) {
      return false;
    }

    this.#update(_EventListenerTouchOneByOne.LISTENER_ID);
    this.#update(_EventListenerTouchAllAtOnce.LISTENER_ID);

    assert(locInDispatch === 1, _LogInfos.EventManager__updateListeners_2);
    this.#cleanRemoved();

    return true;
  }

  frameUpdate(): void {
    for (const [id, listeners] of this.#listeners) {
      if (listeners.empty) {
        this.delete(id);
      }
    }

    this.#cleanRemoved();
  }

  dispatchEvent(listenerID: string, event: Event): void {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      return;
    }

    listeners.dispatchEvent(
      (listener, eventOrArgs) =>
        EventListener.handleEventCallback(listener, eventOrArgs as Event),
      event
    );
    this.#update(listenerID);
  }

  dispatchTouchEvent(
    event: EventTouch,
    onTouchEvent: TouchDispatchCallback,
    onTouchesEvent: TouchesDispatchCallback
  ): boolean {
    const oneByOneListeners = this.#listeners.get(
      _EventListenerTouchOneByOne.LISTENER_ID
    );
    const allAtOnceListeners = this.#listeners.get(
      _EventListenerTouchAllAtOnce.LISTENER_ID
    );

    if (!oneByOneListeners && !allAtOnceListeners) {
      return false;
    }

    const originalTouches = event.touches;
    const mutableTouches = copyArray(originalTouches);

    if (oneByOneListeners) {
      const oneByOneArgsObj: OneByOneTouchArgs = {
        event,
        needsMutableSet: oneByOneListeners && allAtOnceListeners,
        touches: mutableTouches,
        selTouch: null
      };
      for (let i = 0; i < originalTouches.length; i++) {
        oneByOneArgsObj.selTouch = originalTouches[i];
        oneByOneListeners.dispatchEvent(
          (listener, eventOrArgs) =>
            onTouchEvent(
              listener as _EventListenerTouchOneByOne,
              eventOrArgs as OneByOneTouchDispatchArgs
            ),
          oneByOneArgsObj
        );
        if (event.stopped) {
          return false;
        }
      }
    }

    if (allAtOnceListeners && mutableTouches.length > 0) {
      allAtOnceListeners.dispatchEvent(
        (listener, eventOrArgs) =>
          onTouchesEvent(
            listener as _EventListenerTouchAllAtOnce,
            eventOrArgs as AllAtOnceTouchArgs
          ),
        {
          event,
          touches: mutableTouches
        }
      );
      if (event.stopped) {
        return false;
      }
    }

    return true;
  }

  setPriority(listener: EventListener | null, fixedPriority: number): void {
    if (listener == null) {
      return;
    }

    const listenerID = this.#getFixedPriorityListenerID(listener);
    if (listenerID !== null && listener.updateFixedPriority(fixedPriority)) {
      this.#priorityDirtyFlags.setDirty(
        listenerID,
        EventManagerDirtyFlag.FIXED_PRIORITY
      );
    }
  }

  #cleanRemoved(): void {
    const listenersToRemove = this.#toRemovedListeners.apply();
    if (listenersToRemove.length === 0) {
      return;
    }

    for (let i = 0; i < listenersToRemove.length; i++) {
      const selListener = listenersToRemove[i];
      const listeners = this.#listeners.get(selListener.id);

      if (!listeners) {
        continue;
      }

      listeners.removeListener(selListener);
    }
  }

  #getFixedPriorityListenerID(listener: EventListener): string | null {
    const listeners = this.#listeners.values();

    for (const selListeners of listeners) {
      if (selListeners.fixedPriorityListeners.includes(listener)) {
        return listener.id;
      }
    }

    return null;
  }

  #update(listenerID: string): void {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      return;
    }

    this.#toRemovedListeners.update(listeners);
  }
}

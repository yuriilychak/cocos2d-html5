import {
  EventListener,
  _EventListenerVector
} from "../event-listener";
import { EventManagerDirtyFlag } from "../../enums";
import ToRemovedListeners from "./to-removed-listeners";
import PriorityDirtyFlags from "./priority-dirty-flags";
import type { Event } from "../event";

type RemoveCheck = (
  listener: EventListener,
  listeners: _EventListenerVector,
  listenerID: string
) => boolean;

export default class EventManagerListeners {
  #listeners = new Map<string, _EventListenerVector>();
  #toRemovedListeners = new ToRemovedListeners();
  #priorityDirtyFlags = new PriorityDirtyFlags();

  get priorityDirtyFlags(): PriorityDirtyFlags {
    return this.#priorityDirtyFlags;
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

  sortFixedPriority(listenerID: string): void {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      return;
    }

    listeners.sortFixedPriorityListeners();
  }

  sortEventListeners(listenerID: string, hasRootNode: boolean): boolean {
    const dirtyFlag = this.#priorityDirtyFlags.getAndClear(listenerID);

    if (dirtyFlag === EventManagerDirtyFlag.NONE) {
      return false;
    }

    if (dirtyFlag & EventManagerDirtyFlag.FIXED_PRIORITY) {
      this.sortFixedPriority(listenerID);
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

  update(listenerID: string): void {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      return;
    }

    this.#toRemovedListeners.update(listeners);
  }

  cleanRemoved(): void {
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
    this.update(listenerID);
  }

  setPriority(listener: EventListener | null, fixedPriority: number): void {
    if (listener == null) {
      return;
    }

    const listenerID = this.getFixedPriorityListenerID(listener);
    if (listenerID !== null && listener.updateFixedPriority(fixedPriority)) {
      this.#priorityDirtyFlags.setDirty(
        listenerID,
        EventManagerDirtyFlag.FIXED_PRIORITY
      );
    }
  }

  getFixedPriorityListenerID(listener: EventListener): string | null {
    const listeners = this.#listeners.values();

    for (const selListeners of listeners) {
      if (selListeners.fixedPriorityListeners.includes(listener)) {
        return listener.id;
      }
    }

    return null;
  }

  deleteEmpty(): void {
    for (const [id, listeners] of this.#listeners) {
      if (listeners.empty) {
        this.delete(id);
      }
    }
  }
}

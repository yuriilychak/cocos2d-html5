import {
  EventListener,
  _EventListenerVector
} from "../event-listener";
import ToRemovedListeners from "./to-removed-listeners";
import type { Event } from "../event";

type RemoveCheck = (
  listener: EventListener,
  listeners: _EventListenerVector,
  listenerID: string
) => boolean;

export default class EventManagerListeners {
  #listeners = new Map<string, _EventListenerVector>();
  #toRemovedListeners = new ToRemovedListeners();

  removeFromListeners(listener: EventListener, removeCheck: RemoveCheck): boolean {
    for (const [listenerID, listeners] of this.#listeners) {
      if (removeCheck(listener, listeners, listenerID)) {
        return true;
      }
    }

    return false;
  }

  delete(id: string): void {
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
  }

  sortFixedPriority(listenerID: string): void {
    const listeners = this.#listeners.get(listenerID);
    if (!listeners) {
      return;
    }

    listeners.sortFixedPriorityListeners();
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

  getFixedPriorityListenerID(listener: EventListener): string | null {
    const listeners = this.#listeners.values();

    for (const selListeners of listeners) {
      if (selListeners.fixedPriorityListeners.includes(listener)) {
        return listener.id;
      }
    }

    return null;
  }

  get emptyIDs(): string[] {
    const listenerIDs = [];

    for (const [id, listeners] of this.#listeners) {
      if (listeners.empty) {
        listenerIDs.push(id);
      }
    }

    return listenerIDs;
  }
}

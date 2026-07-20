import type { EventListener } from "../event-listener";
import type { Event } from "../event";

export default class ListenersQueue<T extends Event = Event> {
  #listeners: EventListener<T>[] = [];

  protected get listeners(): EventListener<T>[] {
    return this.#listeners;
  }

  add(listener: EventListener<T>): void {
    this.#listeners.push(listener);
  }

  apply(): EventListener<T>[] {
    const result = this.#listeners.slice();
    this.#listeners.length = 0;

    return result;
  }
}

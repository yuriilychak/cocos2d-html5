import type { EventListener } from "../event-listener";

export default class ListenersQueue {
  #listeners: EventListener[] = [];

  protected get listeners(): EventListener[] {
    return this.#listeners;
  }

  add(listener: EventListener): void {
    this.#listeners.push(listener);
  }

  apply(): EventListener[] {
    const result = this.#listeners.slice();
    this.#listeners.length = 0;

    return result;
  }
}

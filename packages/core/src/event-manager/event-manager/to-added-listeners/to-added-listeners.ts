import RemoveForListenerIDStrategy from "./remove-for-listener-id-strategy";
import RemoveForNodeStrategy from "./remove-for-node-strategy";
import RemoveListenerStrategy from "./remove-listener-strategy";
import ListenersQueue from "../listeners-queue";

import type { EventListener } from "../../event-listener";
import type { Event } from '../../event';
import type { ToAddedListenersRemoveStrategy } from "./types";

export default class ToAddedListeners<T extends Event> extends ListenersQueue<T> {
  #removeForListenerIDStrategy: RemoveForListenerIDStrategy<T>;
  #removeForNodeStrategy: RemoveForNodeStrategy<T>;
  #removeListenerStrategy: RemoveListenerStrategy<T>;

  constructor() {
    super();
    this.#removeForListenerIDStrategy = new RemoveForListenerIDStrategy<T>();
    this.#removeForNodeStrategy = new RemoveForNodeStrategy<T>();
    this.#removeListenerStrategy = new RemoveListenerStrategy<T>();
  }

  removeForListenerID(listenerID: string): void {
    this.#removeForListenerIDStrategy.value = listenerID;
    this.#remove(this.#removeForListenerIDStrategy);
  }

  removeForNode(node: unknown): void {
    this.#removeForNodeStrategy.value = node;
    this.#remove(this.#removeForNodeStrategy);
  }

  remove(listener: EventListener<T>): void {
    this.#removeListenerStrategy.value = listener;
    this.#remove(this.#removeListenerStrategy);
  }

  #remove<TValue>(
    strategy: ToAddedListenersRemoveStrategy<EventListener<T>, TValue>
  ): void {
    for (let i = 0; i < this.listeners.length; ) {
      if (strategy.shouldRemove(this.listeners[i])) {
        this.listeners.splice(i, 1);
        if (strategy.stopAfterRemove) {
          break;
        }
      } else {
        ++i;
      }
    }
  }
}

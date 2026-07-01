import RemoveForListenerIDStrategy from "./remove-for-listener-id-strategy";
import RemoveForNodeStrategy from "./remove-for-node-strategy";
import RemoveListenerStrategy from "./remove-listener-strategy";

import type { EventListener } from "../../event-listener";
import type { ToAddedListenersRemoveStrategy } from "./types";

export default class ToAddedListeners {
  #listeners: EventListener[];
  #removeForListenerIDStrategy: RemoveForListenerIDStrategy;
  #removeForNodeStrategy: RemoveForNodeStrategy;
  #removeListenerStrategy: RemoveListenerStrategy;

  constructor() {
    this.#listeners = [];
    this.#removeForListenerIDStrategy = new RemoveForListenerIDStrategy();
    this.#removeForNodeStrategy = new RemoveForNodeStrategy();
    this.#removeListenerStrategy = new RemoveListenerStrategy();
  }

  add(listener: EventListener): void {
    this.#listeners.push(listener);
  }

  apply(): EventListener[] {
    const result = this.#listeners.slice();
    this.#listeners.length = 0;

    return result;
  }

  removeForListenerID(listenerID: string): void {
    this.#removeForListenerIDStrategy.value = listenerID;
    this.#remove(this.#removeForListenerIDStrategy);
  }

  removeForNode(node: unknown): void {
    this.#removeForNodeStrategy.value = node;
    this.#remove(this.#removeForNodeStrategy);
  }

  remove(listener: EventListener): void {
    this.#removeListenerStrategy.value = listener;
    this.#remove(this.#removeListenerStrategy);
  }

  #remove(strategy: ToAddedListenersRemoveStrategy): void {
    for (let i = 0; i < this.#listeners.length; ) {
      if (strategy.shouldRemove(this.#listeners[i])) {
        this.#listeners.splice(i, 1);
        if (strategy.stopAfterRemove) {
          break;
        }
      } else {
        ++i;
      }
    }
  }
}

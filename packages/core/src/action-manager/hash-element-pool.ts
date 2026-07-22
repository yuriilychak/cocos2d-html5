import HashElement from "./hash-element";
import type { ActionTarget } from "./types";

export default class HashElementPool {
  #elements: HashElement[] = [];

  get(target: ActionTarget, paused: boolean = false): HashElement {
    if (!this.#elements.length) {
      return new HashElement(target, paused);
    }
    const element = this.#elements.pop()!;
    element.init(target, paused);
    return element;
  }

  put(element: HashElement): void {
    element.clear();
    this.#elements.push(element);
  }
}

import type { EventListener } from "../../event-listener";
import RemoveStrategy from "./remove-strategy";

export default class RemoveListenerStrategy extends RemoveStrategy<EventListener> {
  get stopAfterRemove() {
    return true;
  }

  shouldRemove(listener: EventListener): boolean {
    if (listener !== this.value) {
      return false;
    }

    listener.registered = false;
    return true;
  }
}

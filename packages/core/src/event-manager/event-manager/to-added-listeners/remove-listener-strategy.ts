import type { EventListener } from "../../event-listener";
import type { Event } from '../../event';
import RemoveStrategy from "./remove-strategy";

export default class RemoveListenerStrategy<T extends Event>
  extends RemoveStrategy<EventListener<T>, EventListener<T>> {
  get stopAfterRemove() {
    return true;
  }

  shouldRemove(listener: EventListener<T>): boolean {
    if (listener !== this.value) {
      return false;
    }

    listener.registered = false;
    return true;
  }
}

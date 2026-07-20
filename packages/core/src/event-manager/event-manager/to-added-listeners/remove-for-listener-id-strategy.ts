import type { EventListener } from "../../event-listener";
import type { Event } from "../../event";
import RemoveStrategy from "./remove-strategy";

export default class RemoveForListenerIDStrategy<T extends Event = Event>
  extends RemoveStrategy<EventListener<T>, string> {
  shouldRemove(listener: EventListener<T>): boolean {
    return listener.id === this.value;
  }
}

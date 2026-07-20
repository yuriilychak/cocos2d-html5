import type { EventListener } from "../../event-listener";
import type { Event } from "../../event";
import RemoveStrategy from "./remove-strategy";

export default class RemoveForNodeStrategy<T extends Event = Event>
  extends RemoveStrategy<EventListener<T>, unknown> {
  shouldRemove(listener: EventListener<T>): boolean {
    if (listener.sceneGraphPriority !== this.value) {
      return false;
    }

    listener.sceneGraphPriority = null; // Ensure no dangling ptr to the target node.
    listener.registered = false;
    return true;
  }
}

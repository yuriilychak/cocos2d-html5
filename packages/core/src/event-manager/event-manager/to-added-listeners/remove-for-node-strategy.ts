import type { EventListener } from "../../event-listener";
import RemoveStrategy from "./remove-strategy";

export default class RemoveForNodeStrategy extends RemoveStrategy<unknown> {
  shouldRemove(listener: EventListener): boolean {
    if (listener.sceneGraphPriority !== this.value) {
      return false;
    }

    listener.sceneGraphPriority = null; // Ensure no dangling ptr to the target node.
    listener.registered = false;
    return true;
  }
}

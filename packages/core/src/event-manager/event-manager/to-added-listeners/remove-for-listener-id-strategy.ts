import type { EventListener } from "../../event-listener";
import RemoveStrategy from "./remove-strategy";

export default class RemoveForListenerIDStrategy extends RemoveStrategy<string> {
  shouldRemove(listener: EventListener): boolean {
    return listener.id === this.value;
  }
}

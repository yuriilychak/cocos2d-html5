import type { EventListener } from "../../event-listener";
import type { ToAddedListenersRemoveStrategy } from "./types";

export default abstract class RemoveStrategy<TValue>
  implements ToAddedListenersRemoveStrategy<TValue> {
  value: TValue | null = null;

  get stopAfterRemove(): boolean {
    return false;
  }

  abstract shouldRemove(listener: EventListener): boolean;
}

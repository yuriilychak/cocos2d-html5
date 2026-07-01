import type { EventListener } from "../../event-listener";

export interface ToAddedListenersRemoveStrategy<TValue = unknown> {
  value: TValue | null;

  readonly stopAfterRemove: boolean;

  shouldRemove(listener: EventListener): boolean;
}

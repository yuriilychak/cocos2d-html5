import type { EventListener } from "../../event-listener";

export interface ToAddedListenersRemoveStrategy<TListener, TValue = TListener> {
  value: TValue | null;

  readonly stopAfterRemove: boolean;

  shouldRemove(listener: TListener): boolean;
}

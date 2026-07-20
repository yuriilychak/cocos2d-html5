import type { ToAddedListenersRemoveStrategy } from "./types";

export default abstract class RemoveStrategy<TListener, TValue = TListener>
  implements ToAddedListenersRemoveStrategy<TListener, TValue> {
  value: TValue | null = null;

  get stopAfterRemove(): boolean {
    return false;
  }

  abstract shouldRemove(listener: TListener): boolean;
}

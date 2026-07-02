import ListenersQueue from "./listeners-queue";
import type { _EventListenerVector } from "../event-listener";

export default class ToRemovedListeners extends ListenersQueue {
  update(listeners: _EventListenerVector): void {
    listeners.updateListeners(this.listeners);
  }
}

import { EventManagerDirtyFlag } from "../../enums";
import { log, _LogInfos } from "../../boot/debugger";
import { arrayRemoveObject, copyArray } from "../../platform/macro/utils";
import type { Node } from "../../base-nodes/node";
import type { EventListener } from "../event-listener";
import type PriorityDirtyFlags from "./priority-dirty-flags";

export default class NodeListeners {
  #nodeListeners = new Map<number, EventListener[]>();
  #dirtyNodes: Node[] = [];

  associateNodeAndEventListener(listener: EventListener): void {
    const node = listener.sceneGraphPriority;
    if (node === null) {
      log(_LogInfos.eventManager__forceAddEventListener);
      return;
    }

    let listeners = this.#nodeListeners.get(node.instanceId);
    if (!listeners) {
      listeners = [];
      this.#nodeListeners.set(node.instanceId, listeners);
    }
    listeners.push(listener);

    if (node.running) {
      this.setTargetPaused(node, false, false);
    }
  }

  setTargetPaused(node: Node, recursive: boolean, paused: boolean): void {
    const listeners = this.#nodeListeners.get(node.instanceId);
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i++)
        listeners[i].paused = paused;
    }

    if (!paused) {
      this.setDirtyForNode(node);
    }

    if (recursive === true) {
      const locChildren = node.children;
      for (let i = 0, len = locChildren.length; i < len; i++)
        this.setTargetPaused(locChildren[i], true, paused);
    }
  }

  hasNodeListener(node: Node): boolean {
    return this.#nodeListeners.has(node.instanceId);
  }

  setDirtyForNode(node: Node): void {
    // Mark the node dirty only when there is an event listener associated with it.
    if (this.#nodeListeners.has(node.instanceId)) this.#dirtyNodes.push(node);
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++)
      this.setDirtyForNode(children[i]);
  }

  updateDirtyFlagForSceneGraph(priorityDirtyFlags: PriorityDirtyFlags): void {
    if (this.#dirtyNodes.length === 0) return;
    let selListeners, selListener;
    for (let i = 0, len = this.#dirtyNodes.length; i < len; i++) {
      selListeners = this.#nodeListeners.get(this.#dirtyNodes[i].instanceId);
      if (selListeners) {
        for (
          let j = 0, listenersLen = selListeners.length;
          j < listenersLen;
          j++
        ) {
          selListener = selListeners[j];
          if (selListener)
            priorityDirtyFlags.setDirty(
              selListener.id,
              EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY
            );
        }
      }
    }
    this.#dirtyNodes.length = 0;
  }

  dissociateListenerFromNode(listener: EventListener): void {
    const node = listener.sceneGraphPriority;
    if (node === null) {
      return;
    }

    const listeners = this.#nodeListeners.get(node.instanceId);

    if (listeners) {
      arrayRemoveObject(listeners, listener);

      if (listeners.length === 0) {
        this.#nodeListeners.delete(node.instanceId);
      }
    }

    listener.sceneGraphPriority = null; // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
  }

  getNodeListenersCopy(node: Node): EventListener[] {
    arrayRemoveObject(this.#dirtyNodes, node);
    const listeners = this.#nodeListeners.get(node.instanceId);

    return listeners ? copyArray(listeners) : [];
  }
}

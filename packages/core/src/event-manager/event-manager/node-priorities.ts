import type { Node } from "../../base-nodes/node";
import type _EventListenerVector from "../event-listener/event-listener-vector";
import type NodeListeners from "./node-listeners";

export default class NodePriorities {
  #nodePriorityIndex = 0;
  #nodePriorities = new Map<number, number>();
  #globalZOrderNodes = new Map<number, number[]>();

  constructor() {
  }

  deletePriority(node: Node): void {
    this.#nodePriorities.delete(node.__instanceId);
  }

  sortSceneGraphListeners(
    listeners: _EventListenerVector,
    rootNode: Node,
    nodeListeners: NodeListeners
  ): void {
    // Reset priority index
    this.#nodePriorityIndex = 0;
    this.#nodePriorities.clear();

    this.#visitTarget(rootNode, true, nodeListeners);

    listeners.sortSceneGraphPriorityListeners(this.#nodePriorities);
  }

  #recordNodeGlobalZOrder(node: Node, listeners: NodeListeners): void {
    if (!listeners.hasNodeListener(node)) {
      return;
    }

    const globalZOrder = node.globalZOrder;
    if (!this.#globalZOrderNodes.has(globalZOrder))
      this.#globalZOrderNodes.set(globalZOrder, []);
    this.#globalZOrderNodes.get(globalZOrder)!.push(node.__instanceId);
  }

  #visitTarget(node: Node, isRootNode: boolean, listeners: NodeListeners): void {
    const children = node.children;
    let i = 0;
    const childrenCount = children.length;

    if (childrenCount > 0) {
      let child;
      // visit children zOrder < 0
      for (; i < childrenCount; i++) {
        child = children[i];
        if (child && child.zIndex < 0) {
          this.#visitTarget(child, false, listeners);
        } else break;
      }

      this.#recordNodeGlobalZOrder(node, listeners);

      for (; i < childrenCount; i++) {
        child = children[i];
        if (child) {
          this.#visitTarget(child, false, listeners);
        }
      }
    } else {
      this.#recordNodeGlobalZOrder(node, listeners);
    }

    if (isRootNode) {
      const globalZOrders = Array.from(this.#globalZOrderNodes.keys());
      globalZOrders.sort(NodePriorities.#sortNumberAsc);

      const zOrdersLen = globalZOrders.length;
      let selZOrders, j;
      for (i = 0; i < zOrdersLen; i++) {
        selZOrders = this.#globalZOrderNodes.get(globalZOrders[i])!;
        for (j = 0; j < selZOrders.length; j++)
          this.#nodePriorities.set(selZOrders[j], ++this.#nodePriorityIndex);
      }
      this.#globalZOrderNodes.clear();
    }
  }

  static #sortNumberAsc(a: number, b: number): number {
    return a - b;
  }
}

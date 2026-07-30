import { Component } from "../../../components";
import { ServiceLocator } from "../../../service-locator";
import { NodeComponentName } from "../../../enums";
import { assert, log, _LogInfos } from "../../../boot/debugger";
import { dirtyFlags } from "../node-canvas-render-cmd";
import { s_globalOrderOfArrival, setGlobalOrderOfArrival } from "../node";

/**
 * Owns a node's draw-order state. Access it through {@link Node#order}.
 *
 * @property {Number} zIndex - Z order in depth which controls drawing order.
 * @property {Number} localZOrder - Local Z order within the parent.
 * @property {Number} globalZOrder - Global Z order used for event priority.
 * @property {Number} vertexZ - WebGL vertex Z; z ordering works when nodes use the same OpenGL Z vertex.
 * @property {Number} arrivalOrder - Order in which the node was added to its parent.
 * @property {Boolean} hasCustomVertexZ - Whether `vertexZ` was explicitly set.
 */
export default class NodeOrder extends Component {
  #localZOrder = 0;
  #globalZOrder = 0;
  #vertexZ = 0;
  #hasCustomVertexZ = false;
  #arrivalOrder = 0;
  #reorderChildDirty = false;

  constructor() {
    super(NodeComponentName.Order);
  }

  get localZOrder() { return this.#localZOrder; }
  set localZOrder(value) {
    if (this.#localZOrder === value) return;
    this.#localZOrder = value;
  }

  set zIndex(value) {
    if (this.#localZOrder === value) return;

    const node = this.owner;
    if (!node) return;

    if (node.parent) node.parent.order.reorderChild(node, value);
    else this.localZOrder = value;
    ServiceLocator.eventManager._setDirtyForNode(node);
  }

  get zIndex() { return this.#localZOrder; }

  /**
   * Reorders a child according to a new Z value. The child must already be
   * added to the owning node.
   *
   * @param {Node} child An already added child node.
   * @param {Number} zOrder Z order for drawing priority.
   */
  reorderChild(child, zOrder) {
    const node = this.owner;
    assert(child, _LogInfos.Node_reorderChild);
    if (node.children.indexOf(child) === -1) {
      log(_LogInfos.Node_reorderChild_2);
      return;
    }

    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty =
      this.#reorderChildDirty = true;
    child.order.arrivalOrder = s_globalOrderOfArrival;
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);
    child.order.localZOrder = zOrder;
    node.renderCmd.setDirtyFlag(dirtyFlags.orderDirty);
  }

  /**
   * Sorts the owning node's children by local Z and arrival order once before
   * drawing, rather than when every child is added or reordered.
   *
   * @note Do not call this manually unless a child added needs to be removed
   * in the same frame.
   */
  sortAllChildren() {
    if (!this.#reorderChildDirty) return;

    const children = this.owner.children;
    for (let i = 1; i < children.length; i++) {
      const tmp = children[i];
      let j = i - 1;
      while (j >= 0) {
        if (tmp.order.localZOrder < children[j].order.localZOrder ||
          (tmp.order.localZOrder === children[j].order.localZOrder &&
            tmp.order.arrivalOrder < children[j].order.arrivalOrder)) {
          children[j + 1] = children[j];
          j--;
        } else {
          break;
        }
      }
      children[j + 1] = tmp;
    }

    this.#reorderChildDirty = false;
  }

  get reorderChildDirty() { return this.#reorderChildDirty; }
  set reorderChildDirty(value) { this.#reorderChildDirty = value; }

  get globalZOrder() { return this.#globalZOrder; }
  set globalZOrder(value) {
    if (this.#globalZOrder === value) return;
    this.#globalZOrder = value;
    ServiceLocator.eventManager._setDirtyForNode(this.owner.renderCmd._node);
  }

  get vertexZ() { return this.#vertexZ; }
  set vertexZ(value) {
    if (this.#vertexZ === value && this.#hasCustomVertexZ) return;
    this.#vertexZ = value;
    this.#hasCustomVertexZ = true;
  }

  set assignedVertexZ(value) {
    if (this.#vertexZ === value) return;
    this.#vertexZ = value;
  }

  get hasCustomVertexZ() { return this.#hasCustomVertexZ; }

  get arrivalOrder() { return this.#arrivalOrder; }
  set arrivalOrder(value) {
    if (this.#arrivalOrder === value) return;
    this.#arrivalOrder = value;
  }
}

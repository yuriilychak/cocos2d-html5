import { ServiceLocator } from "../service-locator";

export class NodeOrder {
  #renderCmd;
  #localZOrder = 0;
  #globalZOrder = 0;
  #vertexZ = 0;
  #hasCustomVertexZ = false;
  #arrivalOrder = 0;

  constructor(renderCmd) {
    this.#renderCmd = renderCmd;
  }

  get localZOrder() { return this.#localZOrder; }
  set localZOrder(value) {
    if (this.#localZOrder === value) return;
    this.#localZOrder = value;
  }

  get globalZOrder() { return this.#globalZOrder; }
  set globalZOrder(value) {
    if (this.#globalZOrder === value) return;
    this.#globalZOrder = value;
    ServiceLocator.eventManager._setDirtyForNode(this.#renderCmd._node);
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

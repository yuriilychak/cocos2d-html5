import { EventManagerDirtyFlag } from "../../enums";

export default class PriorityDirtyFlags {
  #flags = new Map<string, EventManagerDirtyFlag>();

  setSceneGraphPriority(listenerID: string): void {
    this.#flags.set(listenerID, EventManagerDirtyFlag.SCENE_GRAPH_PRIORITY);
  }

  delete(listenerID: string): void {
    this.#flags.delete(listenerID);
  }

  setDirty(listenerID: string, flag: EventManagerDirtyFlag): void {
    const dirtyFlag = this.#flags.has(listenerID)
      ? flag | this.#flags.get(listenerID)!
      : flag;
    this.#flags.set(listenerID, dirtyFlag);
  }

  getAndClear(listenerID: string): EventManagerDirtyFlag {
    const dirtyFlag = this.#flags.has(listenerID)
      ? this.#flags.get(listenerID)!
      : EventManagerDirtyFlag.NONE;

    // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
    this.#flags.set(listenerID, EventManagerDirtyFlag.NONE);

    return dirtyFlag;
  }
}

import type { ActionLike, ActionTarget } from "./types";

export default class HashElement {
  #action: ActionLike | null = null;
  #target: ActionTarget | null = null;
  #lock: boolean = false;
  #paused: boolean = false;

  constructor(target: ActionTarget, paused: boolean = false) {
    this.#target = target;
    this.#paused = paused;
  }

  init(target: ActionTarget, paused: boolean = false): void {
    this.#target = target;
    this.#paused = paused;
  }

  clear(): void {
    this.removeAction();
    this.#paused = false;
    this.#target = null;
    this.#lock = false;
  }

  addAction(action: ActionLike): void {
    this.#action = action;
    action.startWithTarget(this.#target!);
  }

  removeAction(action: ActionLike | null = null): void {
    if (action === null || this.#action === action) {
      this.#action = null;
    }
  }

  getActionByTag(tag: number): ActionLike | null {
    return this.#action?.tag === tag ? this.#action : null;
  }

  removeActionByTag(tag: number, target: ActionTarget): void {
    if (
      this.#action &&
      this.#action.tag === tag &&
      this.#action.getOriginalTarget() === target
    ) {
      this.#action = null;
    }
  }

  update(dt: number): void {
    if (this.#paused || !this.#action) {
      return;
    }

    this.#lock = true;
    const action = this.#action;
    action.step(
      dt *
      (action._speedMethod
        ? action._speed ?? 1
        : 1)
    );

    if (action.isDone()) {
      action.stop();
      this.removeAction(action);
    }
    this.#lock = false;
  }

    get target(): ActionTarget | null {
    return this.#target;
  }

  get lock(): boolean {
    return this.#lock;
  }

  get paused(): boolean {
    return this.#paused;
  }

  set paused(value: boolean) {
    this.#paused = !!value;
  }

  get targetId(): number | null {
    return this.#target ? this.#target.__instanceId : null;
  }

  get numberOfRunningActions(): number {
    return this.#action ? 1 : 0;
  }

  get hasActions(): boolean {
    return this.#action !== null;
  }
}

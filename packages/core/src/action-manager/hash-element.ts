import type { ActionLike, ActionTarget } from "./types";

export default class HashElement {
  #actions: ActionLike[] = [];
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
    this.#actions.push(action);
    action.startWithTarget(this.#target!);
  }

  removeAction(action: ActionLike | null = null): void {
    if (action === null) {
      this.#actions.length = 0;
      return;
    }

    const index = this.#actions.indexOf(action);
    if (index !== -1) {
      this.#actions.splice(index, 1);
    }
  }

  getActionByTag(tag: number): ActionLike | null {
    return this.#actions.find((action) => action.tag === tag) || null;
  }

  removeActionByTag(tag: number, target: ActionTarget): void {
    const action = this.#actions.find(
      (candidate) =>
        candidate.tag === tag && candidate.getOriginalTarget() === target
    );
    if (action) {
      this.removeAction(action);
    }
  }

  update(dt: number): void {
    if (this.#paused || !this.#actions.length) {
      return;
    }

    this.#lock = true;
    for (let i = 0; i < this.#actions.length; ++i) {
      const action = this.#actions[i];
      action.step(dt * (action._speedMethod ? action._speed ?? 1 : 1));

      if (action.isDone()) {
        action.stop();
        // An action may remove itself or another action from inside step().
        // Only remove the action we just updated if it is still at this slot.
        if (this.#actions[i] === action) {
          this.#actions.splice(i, 1);
        }
      }

      if (this.#actions[i] !== action) {
        // The current action was removed during step(). Keep the loop index
        // aligned with the item that shifted into this position.
        --i;
      }
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
    return this.#actions.length;
  }

  get hasActions(): boolean {
    return this.#actions.length > 0;
  }
}

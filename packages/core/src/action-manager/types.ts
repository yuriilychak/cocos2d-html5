export interface ActionTarget {
  __instanceId: number;
}

export interface ActionLike {
  tag: number;
  _speedMethod?: boolean;
  _speed?: number;
  startWithTarget(target: ActionTarget): void;
  step(dt: number): void;
  isDone(): boolean;
  stop(): void;
  getOriginalTarget(): ActionTarget;
}

export interface ComponentOwnerLike {
  scheduleUpdate?(): void;
  unscheduleUpdate?(): void;
}

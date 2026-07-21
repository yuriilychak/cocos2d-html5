import type { Node } from "../../base-nodes/node";
import type { EventTouch, Event } from "../event";
import type {
  EventListener,
  _EventListenerTouchAllAtOnce,
  _EventListenerTouchOneByOne,
  _EventListenerVector
} from "../event-listener";
import type Touch from "../touch";
import type { ListenerCreateOptions } from "../event-listener/types";

export type DirectorLike = {
  readonly runningScene: Node | null;
};

export type DeprecatedEventListenerFactory = typeof EventListener & {
  create: (argObj: ListenerCreateOptions) => EventListener | null;
};

export type RemoveCheck<T extends Event> = (
  listener: EventListener<T>,
  listeners: _EventListenerVector,
  listenerID: string
) => boolean;

export type OneByOneTouchArgs = {
  event: EventTouch;
  needsMutableSet?: _EventListenerVector;
  touches: Touch[];
  selTouch: Touch | null;
};

export type OneByOneTouchDispatchArgs = OneByOneTouchArgs & {
  selTouch: Touch;
};

export type AllAtOnceTouchArgs = {
  event: EventTouch;
  touches: Touch[];
};

export type TouchDispatchCallback = (
  listener: _EventListenerTouchOneByOne,
  eventOrArgs: OneByOneTouchDispatchArgs
) => boolean;

export type TouchesDispatchCallback = (
  listener: _EventListenerTouchAllAtOnce,
  eventOrArgs: AllAtOnceTouchArgs
) => boolean;

export type TouchEventCallbackArgs = OneByOneTouchDispatchArgs;

export type TouchesEventCallbackArgs = AllAtOnceTouchArgs;

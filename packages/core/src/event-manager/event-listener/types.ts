import { EventListenerType } from "../../enums";
import type {
  Event,
  EventAcceleration,
  EventCustom,
  EventKeyboard,
  EventMouse,
  EventTouch
} from "../event";
import type Touch from "../touch";
import type { Acceleration } from "../../platform";

export type EventCallback<TEvent extends Event = Event> = (event: TEvent) => void;

export type CustomEventCallback<T = unknown> = (event: EventCustom<T>) => void;

export type AccelerationEventCallback = (
  value: Acceleration,
  event: EventAcceleration
) => void;

export type KeyboardEventCallback = (
  keyCode: number,
  event: EventKeyboard
) => void;

export type MouseEventCallback = (event: EventMouse) => void;

export type FocusChangedCallback = (
  widgetLoseFocus: unknown,
  widgetGetFocus: unknown
) => void;

export type TouchBeganCallback = (touch: Touch, event: EventTouch) => boolean;

export type TouchCallback = (touch: Touch, event: EventTouch) => void;

export type TouchesCallback = (touches: Touch[], event: EventTouch) => void;

export type ListenerCreateOptions = Record<string, unknown> & {
  event?: EventListenerType;
  eventName?: string;
  callback?: CustomEventCallback | AccelerationEventCallback;
};

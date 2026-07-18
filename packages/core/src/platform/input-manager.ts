/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { Point, Rect, type PointLike } from "../geometry";
import { log, _LogInfos } from "../boot/debugger";
import {
  EventTouch,
  EventMouse,
  EventAcceleration,
  EventKeyboard,
  Touch,
  type EventManager
} from "../event-manager";
import { Acceleration } from "../platform";
import { isFunction } from "../boot/utils";
import {
  BrowserType,
  MouseButton,
  MouseEvent,
  TouchEvent,
  UIInterfaceOrientation
} from "../enums";
import type { Sys } from "../sys";
import type Scheduler from "../scheduler/scheduler";
import type { EGLViewLike } from "./egl-view";

/**
 * <p>
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard                                       <br/>
 * </p>
 */
export class InputManager {
  readonly TOUCH_TIMEOUT: number = 5000;

  #mousePressed: boolean = false;

  #isRegisterEvent: boolean = false;

  #preTouchPoint = new Point();
  #prevMousePoint = new Point();

  #preTouchPool: Touch[] = [];
  #preTouchPoolPointer: number = 0;

  #touches: Touch[] = [];
  #touchesIntegerDict: Map<number, number> = new Map();

  #indexBitsUsed: number = 0;
  #maxTouches: number = 5;

  #accelEnabled: boolean = false;
  #accelInterval: number = 1 / 30;
  #accelMinus: number = 1;
  #accelCurTime: number = 0;
  #acceleration: Acceleration | null = null;
  #accelDeviceEvent:
    | typeof DeviceMotionEvent
    | typeof DeviceOrientationEvent
    | null = null;
  #didAccelerateCallback: (event: Event) => void;
  #element: HTMLElement | null = null;
  #eglView: EGLViewLike;
  #eventManager: EventManager;
  #sys: Sys;
  #scheduler: Scheduler;

  constructor(
    sys: Sys,
    eglView: EGLViewLike,
    eventManager: EventManager,
    scheduler: Scheduler
  ) {
    this.#sys = sys;
    this.#eglView = eglView;
    this.#eventManager = eventManager;
    this.#scheduler = scheduler;
    this.#didAccelerateCallback = this.didAccelerate.bind(this) as (
      event: Event
    ) => void;
  }

  handleTouchesBegin(touches: Touch[]): void {
    let selTouch,
      index,
      curTouch,
      touchID,
      handleTouches = [],
      locTouchIntDict = this.#touchesIntegerDict;
    const now = Date.now();
    for (let i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = locTouchIntDict.get(touchID);

      if (index == null) {
        const unusedIndex = this.#uniqueUsedIndex;
        if (unusedIndex === -1) {
          log(_LogInfos.inputManager_handleTouchesBegin, unusedIndex);
          continue;
        }
        //curTouch = this.#touches[unusedIndex] = selTouch;
        curTouch = this.#touches[unusedIndex] = selTouch.clone();
        curTouch.lastModified = now;
        curTouch.setPrev(selTouch.previousLocation);
        locTouchIntDict.set(touchID, unusedIndex);
        handleTouches.push(curTouch);
      }
    }
    this.#dispatchTouchEvent(handleTouches, TouchEvent.BEGAN);
  }

  handleTouchesMove(touches: Touch[]): void {
    let selTouch,
      index,
      touchID,
      handleTouches = [];
    const now = Date.now();
    for (let i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = this.#touchesIntegerDict.get(touchID);

      if (index == null) {
        //log("if the index doesn't exist, it is an error");
        continue;
      }
      if (this.#touches[index]) {
        this.#touches[index].set(selTouch);
        this.#touches[index].setPrev(selTouch.previousLocation);
        this.#touches[index].lastModified = now;
        handleTouches.push(this.#touches[index]);
      }
    }
    this.#dispatchTouchEvent(handleTouches, TouchEvent.MOVED);
  }

  handleTouchesEnd(touches: Touch[]): void {
    const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
    this.#dispatchTouchEvent(handleTouches, TouchEvent.ENDED);
  }

  handleTouchesCancel(touches: Touch[]): void {
    const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
    this.#dispatchTouchEvent(handleTouches, TouchEvent.CANCELLED);
  }

  getSetOfTouchesEndOrCancel(touches: Touch[]): Touch[] {
    let selTouch,
      index,
      touchID,
      handleTouches: Touch[] = [],
      locTouches = this.#touches;
    for (let i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = this.#touchesIntegerDict.get(touchID);

      if (index == null) {
        continue; //log("if the index doesn't exist, it is an error");
      }
      if (locTouches[index]) {
        locTouches[index].set(selTouch);
        locTouches[index].setPrev(selTouch.previousLocation);
        handleTouches.push(locTouches[index]);
        this.#removeUsedIndexBit(index);
        this.#touchesIntegerDict.delete(touchID);
      }
    }
    return handleTouches;
  }

  getPreTouch(touch: Touch): Touch {
    let preTouch: Touch | null = null;
    const locPreTouchPool = this.#preTouchPool;
    const id = touch.id;
    for (let i = locPreTouchPool.length - 1; i >= 0; i--) {
      if (locPreTouchPool[i].id === id) {
        preTouch = locPreTouchPool[i];
        break;
      }
    }
    if (!preTouch) preTouch = touch;
    return preTouch;
  }

  setPreTouch(touch: Touch): void {
    const id = touch.id;
    for (let i = this.#preTouchPool.length - 1; i >= 0; i--) {
      if (this.#preTouchPool[i].id === id) {
        this.#preTouchPool[i] = touch;
        return;
      }
    }

    if (this.#preTouchPool.length <= 50) {
      this.#preTouchPool.push(touch);
      return;
    }

    this.#preTouchPool[this.#preTouchPoolPointer] = touch;
    this.#preTouchPoolPointer = (this.#preTouchPoolPointer + 1) % 50;
  }

  getTouchByXY(point: PointLike, pos: Rect): Touch {
    const location = this.#eglView.convertToLocationInView(point, pos);
    const touch = new Touch(location);
    touch.setPrev(this.#preTouchPoint);
    this.#preTouchPoint.set(location);
    return touch;
  }

  getMouseEvent(
    location: Point,
    pos: Rect,
    eventType: MouseEvent
  ): EventMouse {
    this.#eglView.convertMouseToLocationInView(location, pos);
    const mouseEvent = new EventMouse(
      eventType,
      location,
      this.#prevMousePoint
    );
    this.#prevMousePoint.set(location);

    return mouseEvent;
  }

  getTouchesByEvent(
    event: globalThis.TouchEvent,
    pos: Rect
  ): Touch[] {
    const touchArr: Touch[] = [],
      locView = this.#eglView;
    let touch_event: globalThis.Touch;
    let touch: Touch;
    let preTouch: Touch;

    const length = event.changedTouches.length;
    for (let i = 0; i < length; i++) {
      touch_event = event.changedTouches[i];
      if (touch_event) {
        const point =
          BrowserType.FIREFOX === this.#sys.specification.browserType
            ? Point.fromEvent(touch_event)
            : Point.fromClientEvent(touch_event);
        const location = locView.convertToLocationInView(point, pos);
        if (touch_event.identifier != null) {
          touch = new Touch(location, touch_event.identifier);
          //use Touch Pool
          preTouch = this.getPreTouch(touch);
          touch.setPrev(preTouch);
          this.setPreTouch(touch);
        } else {
          touch = new Touch(location);
          touch.setPrev(this.#preTouchPoint);
        }
        this.#preTouchPoint.set(location);
        touchArr.push(touch);
      }
    }
    return touchArr;
  }

  registerSystemEvent(element: HTMLElement): void {
    if (this.#isRegisterEvent) {
      return;
    }
    this.#element = element;

    //register touch event
    if (this.#sys.capabilities.mouse) {
      this.#addEventListeners(window, {
        mousedown: this.#onMouseDown,
        mouseup: this.#onMouseUp
      });

      //register canvas mouse event
      this.#addEventListeners(element, {
        mousedown: this.#onElementMouseDown,
        mouseup: this.#onElementMouseUp,
        mousemove: this.#onMouseMove,
        mousewheel: this.#onMouseWheel,
        // firefox fix
        DOMMouseScroll: this.#onDOMMouseScroll
      });
    }

    if (this.#sys.capabilities.touches) {
      //register canvas touch event
      this.#addEventListeners(element, {
        touchstart: this.#onTouchStart,
        touchmove: this.#onTouchMove,
        touchend: this.#onTouchEnd,
        touchcancel: this.#onTouchCancel
      });
    }

    //register keyboard event
    this.#addEventListeners(this.#eglView.canvas, {
      keydown: this.#onKeyDown,
      keyup: this.#onKeyUp
    });

    this.#isRegisterEvent = true;
  }

  didAccelerate(eventData: Event): void {
    if (!this.#accelEnabled || !this.#acceleration) {
      return;
    }

    if (this.#accelDeviceEvent === window.DeviceMotionEvent) {
      const eventAcceleration = (
        eventData as DeviceMotionEvent
      ).accelerationIncludingGravity;
      if (!eventAcceleration) {
        return;
      }

      this.#acceleration.set(
        this.#accelMinus * (eventAcceleration.x ?? 0) * 0.1,
        this.#accelMinus * (eventAcceleration.y ?? 0) * 0.1,
        (eventAcceleration.z ?? 0) * 0.1
      );
    } else {
      const orientationEvent = eventData as DeviceOrientationEvent;
      this.#acceleration.set(
        ((orientationEvent.gamma ?? 0) / 90) * 0.981,
        -((orientationEvent.beta ?? 0) / 90) * 0.981,
        ((orientationEvent.alpha ?? 0) / 90) * 0.981
      );
    }

    this.#acceleration.timestamp = eventData.timeStamp || Date.now();

    switch (window.orientation) {
      case UIInterfaceOrientation.LANDSCAPE_RIGHT:
        this.#acceleration.set(-this.#acceleration.y, this.#acceleration.x);
        break;
      case UIInterfaceOrientation.LANDSCAPE_LEFT:
        this.#acceleration.set(this.#acceleration.y, -this.#acceleration.x);
        break;
      case UIInterfaceOrientation.PORTRAIT_UPSIDE_DOWN:
        this.#acceleration.set(-this.#acceleration.x, -this.#acceleration.y);
        break;
    }
  }

  /**
   * @function
   * @param {Number} dt
   */
  update(dt: number): void {
    if (this.#accelCurTime > this.#accelInterval) {
      this.#accelCurTime -= this.#accelInterval;
      this.#eventManager.dispatchEvent(
        new EventAcceleration(this.#acceleration!)
      );
    }
    this.#accelCurTime += dt;
  }

  #getPointByEvent(
    event: globalThis.MouseEvent
  ): Point {
    return event.pageX != null ? Point.fromEvent(event): Point.fromClientEvent(event);
  }

  #getHTMLElementPosition(
    element: HTMLElement,
    adjustForScroll: boolean = false
  ): Rect {
    const docElem = document.documentElement;
    const scrollLeft = adjustForScroll ? document.body.scrollLeft : 0;
    const scrollTop = adjustForScroll ? document.body.scrollTop : 0;
    const { left, top, width, height } = isFunction(element.getBoundingClientRect)
      ? element.getBoundingClientRect()
      : {
        left: 0,
        top: 0,
        width: parseInt(element.style.width),
        height: parseInt(element.style.height)
      };
    return new Rect(
      left + window.pageXOffset - docElem.clientLeft - scrollLeft,
      top + window.pageYOffset - docElem.clientTop - scrollTop,
      width,
      height
    );
  }

  #addEventListeners(
    target: EventTarget,
    listeners: Record<string, (event: any) => void>
  ): void {
    for (const listenerId in listeners) {
      target.addEventListener(
        listenerId,
        listeners[listenerId].bind(this),
        false
      );
    }
  }

  #dispatchTouchEvent(touches: Touch[], eventType: TouchEvent): void {
    if (touches.length === 0) return;

    this.#eglView.convertTouchesWithScale(touches);
    this.#eventManager.dispatchEvent(new EventTouch(touches, eventType));
  }

  #removeUsedIndexBit(index: number): void {
    if (index < 0 || index >= this.#maxTouches) {
      return;
    }

    let temp = 1 << index;
    temp = ~temp;
    this.#indexBitsUsed &= temp;
  }

  #onMouseDown(): void {
    this.#mousePressed = true;
  }

  #onMouseUp(event: globalThis.MouseEvent): void {
    if (this.#sys.specification.isMobile) return;
    const savePressed = this.#mousePressed;
    this.#mousePressed = false;

    if (!savePressed) return;

    const pos = this.#getHTMLElementPosition(
      this.#element!,
      event.pageX == null
    );
    const location = this.#getPointByEvent(event);

    if (
      !Rect.containsPoint(
        pos,
        location
      )
    ) {
      this.handleTouchesEnd([this.getTouchByXY(location, pos)]);

      const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.UP);
      mouseEvent.button = event.button;
      this.#eventManager.dispatchEvent(mouseEvent);
    }
  }

  #onElementMouseDown(event: globalThis.MouseEvent): void {
    if (this.#sys.specification.isMobile) return;
    this.#mousePressed = true;

    const pos = this.#getHTMLElementPosition(
      this.#element!,
      event.pageX == null
    );
    const location = this.#getPointByEvent(event);

    this.handleTouchesBegin([this.getTouchByXY(location, pos)]);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.DOWN);
    mouseEvent.button = event.button;
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
    this.#element!.focus();
  }

  #onElementMouseUp(event: globalThis.MouseEvent): void {
    if (this.#sys.specification.isMobile) return;
    this.#mousePressed = false;

    const pos = this.#getHTMLElementPosition(
      this.#element!,
      event.pageX == null
    );
    const location = this.#getPointByEvent(event);

    this.handleTouchesEnd([this.getTouchByXY(location, pos)]);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.UP);
    mouseEvent.button = event.button;
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onMouseMove(event: globalThis.MouseEvent): void {
    if (this.#sys.specification.isMobile) return;

    const pos = this.#getHTMLElementPosition(
      this.#element!,
      event.pageX == null
    );
    const location = this.#getPointByEvent(event);

    this.handleTouchesMove([this.getTouchByXY(location, pos)]);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.MOVE);
    mouseEvent.button = this.#mousePressed ? event.button : MouseButton.NONE;
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onMouseWheel(event: globalThis.MouseEvent): void {
    const pos = this.#getHTMLElementPosition(
      this.#element!,
      event.pageX == null
    );
    const location = this.#getPointByEvent(event);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.SCROLL);
    mouseEvent.button = event.button;
    mouseEvent.scrollData =
      new Point(
        0,
        (event as globalThis.WheelEvent & { wheelDelta?: number }).wheelDelta ??
        0
      );
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onDOMMouseScroll(event: globalThis.WheelEvent): void {
    const pos = this.#getHTMLElementPosition(
      this.#element!,
      event.pageX == null
    );
    const location = this.#getPointByEvent(event);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.SCROLL);
    mouseEvent.button = event.button;
    mouseEvent.scrollData = new Point(0, event.detail * -120);
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onTouchStart(event: globalThis.TouchEvent): void {
    if (!event.changedTouches) return;

    const pos = this.#getHTMLElementPosition(this.#element!, true);
    this.handleTouchesBegin(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
    this.#element!.focus();
  }

  #onTouchMove(event: globalThis.TouchEvent): void {
    if (!event.changedTouches) return;

    const pos = this.#getHTMLElementPosition(this.#element!, true);
    this.handleTouchesMove(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
  }

  #onTouchEnd(event: globalThis.TouchEvent): void {
    if (!event.changedTouches) return;

    const pos = this.#getHTMLElementPosition(this.#element!, true);
    this.handleTouchesEnd(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
  }

  #onTouchCancel(event: globalThis.TouchEvent): void {
    if (!event.changedTouches) return;

    const pos = this.#getHTMLElementPosition(this.#element!, true);
    this.handleTouchesCancel(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
  }

  #onKeyDown(event: globalThis.KeyboardEvent): void {
    this.#eventManager.dispatchEvent(new EventKeyboard(event.keyCode, true));
    event.stopPropagation();
    event.preventDefault();
  }

  #onKeyUp(event: globalThis.KeyboardEvent): void {
    this.#eventManager.dispatchEvent(new EventKeyboard(event.keyCode, false));
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Whether accelerometer events are enabled.
   */
  get accelerometerEnabled(): boolean {
    return this.#accelEnabled;
  }

  /**
   * Enable or disable accelerometer events.
   */
  set accelerometerEnabled(isEnable: boolean) {
    if (this.#accelEnabled === isEnable) {
      return;
    }

    this.#accelEnabled = isEnable;
    this.#accelCurTime = 0;
    const deviceEventType =
      this.#accelDeviceEvent === window.DeviceMotionEvent
        ? "devicemotion"
        : "deviceorientation";

    if (this.#accelEnabled) {
      this.#acceleration = new Acceleration();
      this.#accelDeviceEvent =
        window.DeviceMotionEvent || window.DeviceOrientationEvent;
      //TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
      if (this.#sys.specification.browserType === BrowserType.MOBILE_QQ)
        this.#accelDeviceEvent = window.DeviceOrientationEvent;
      this.#accelMinus = this.#sys.specification.isAccelerometerNegative
        ? -1
        : 1;

      window.addEventListener(
        deviceEventType,
        this.#didAccelerateCallback,
        false
      );
      this.#scheduler.scheduleUpdate(this);
    } else {
      this.#acceleration = null;
      window.removeEventListener(
        deviceEventType,
        this.#didAccelerateCallback,
        false
      );
      this.#scheduler.unscheduleUpdate(this);
    }
  }

  /**
   * Accelerometer interval value.
   */
  get accelerometerInterval(): number {
    return this.#accelInterval;
  }

  /**
   * Set the accelerometer interval value.
   */
  set accelerometerInterval(interval: number) {
    if (this.#accelInterval !== interval) {
      this.#accelInterval = interval;
    }
  }

  get #uniqueUsedIndex(): number {
    let temp = this.#indexBitsUsed;
    const now = Date.now();

    for (let i = 0; i < this.#maxTouches; i++) {
      if (!(temp & 0x00000001)) {
        this.#indexBitsUsed |= 1 << i;
        return i;
      } else {
        const touch = this.#touches[i];
        if (now - touch.lastModified > this.TOUCH_TIMEOUT) {
          this.#removeUsedIndexBit(i);
          this.#touchesIntegerDict.delete(touch.id);
          return i;
        }
      }
      temp = temp >> 1;
    }

    // all bits are used
    return -1;
  }
}

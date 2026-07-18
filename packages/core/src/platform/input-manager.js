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

import { Point, Rect } from "../geometry";
import { log, _LogInfos } from "../boot/debugger";
import {
  EventTouch,
  EventMouse,
  EventAcceleration,
  EventKeyboard,
  Touch
} from "../event-manager";
import { Acceleration } from "../platform/types/acceleration";
import { isFunction } from "../boot/utils";
import { BrowserType, MouseEvent, TouchEvent } from "../enums";

/**
 * <p>
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard                                       <br/>
 * </p>
 * @name inputManager
 */
export class InputManager {
  /**
   * @constant
   * @type {number}
   */
  static UIInterfaceOrientationLandscapeLeft = -90;
  /**
   * @constant
   * @type {number}
   */
  static UIInterfaceOrientationLandscapeRight = 90;
  /**
   * @constant
   * @type {number}
   */
  static UIInterfaceOrientationPortraitUpsideDown = 180;
  /**
   * @constant
   * @type {number}
   */
  static UIInterfaceOrientationPortrait = 0;

  TOUCH_TIMEOUT = 5000;

  #mousePressed = false;

  #isRegisterEvent = false;

  #preTouchPoint = new Point();
  #prevMousePoint = new Point();

  #preTouchPool = [];
  #preTouchPoolPointer = 0;

  #touches = [];
  #touchesIntegerDict = new Map();

  #indexBitsUsed = 0;
  #maxTouches = 5;

  #accelEnabled = false;
  #accelInterval = 1 / 30;
  #accelMinus = 1;
  #accelCurTime = 0;
  #acceleration = null;
  #accelDeviceEvent = null;
  #didAccelerateCallback = this.didAccelerate.bind(this);

  #director = null;
  #eglView = null;
  #eventManager = null;
  #sys = null;
  #element = null;

  injectServices({ director, eglView, eventManager, sys }) {
    this.#director = director;
    this.#eglView = eglView;
    this.#eventManager = eventManager;
    this.#sys = sys;
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesBegin(touches) {
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
        curTouch._setPrevPoint(selTouch.previousLocation);
        locTouchIntDict.set(touchID, unusedIndex);
        handleTouches.push(curTouch);
      }
    }
    if (handleTouches.length > 0) {
      this.#eglView.convertTouchesWithScale(handleTouches);
      const touchEvent = new EventTouch(handleTouches);
      touchEvent.eventCode = TouchEvent.BEGAN;
      this.#eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesMove(touches) {
    let selTouch,
      index,
      touchID,
      handleTouches = [],
      locTouches = this.#touches;
    const now = Date.now();
    for (let i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = this.#touchesIntegerDict.get(touchID);

      if (index == null) {
        //log("if the index doesn't exist, it is an error");
        continue;
      }
      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch);
        locTouches[index]._setPrevPoint(selTouch.previousLocation);
        locTouches[index].lastModified = now;
        handleTouches.push(locTouches[index]);
      }
    }
    if (handleTouches.length > 0) {
      this.#eglView.convertTouchesWithScale(handleTouches);
      const touchEvent = new EventTouch(handleTouches);
      touchEvent.eventCode = TouchEvent.MOVED;
      this.#eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesEnd(touches) {
    const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
    if (handleTouches.length > 0) {
      this.#eglView.convertTouchesWithScale(handleTouches);
      const touchEvent = new EventTouch(handleTouches);
      touchEvent.eventCode = TouchEvent.ENDED;
      this.#eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesCancel(touches) {
    const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
    if (handleTouches.length > 0) {
      this.#eglView.convertTouchesWithScale(handleTouches);
      const touchEvent = new EventTouch(handleTouches);
      touchEvent.eventCode = TouchEvent.CANCELLED;
      this.#eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   * @returns {Array}
   */
  getSetOfTouchesEndOrCancel(touches) {
    let selTouch,
      index,
      touchID,
      handleTouches = [],
      locTouches = this.#touches,
      locTouchesIntDict = this.#touchesIntegerDict;
    for (let i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = locTouchesIntDict.get(touchID);

      if (index == null) {
        continue; //log("if the index doesn't exist, it is an error");
      }
      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch);
        locTouches[index]._setPrevPoint(selTouch.previousLocation);
        handleTouches.push(locTouches[index]);
        this.#removeUsedIndexBit(index);
        locTouchesIntDict.delete(touchID);
      }
    }
    return handleTouches;
  }

  /**
   * @function
   * @param {HTMLElement} element
   * @return {Object}
   */
  getHTMLElementPosition(element) {
    const docElem = document.documentElement;
    const win = window;
    let box = null;
    if (isFunction(element.getBoundingClientRect)) {
      box = element.getBoundingClientRect();
    } else {
      box = {
        left: 0,
        top: 0,
        width: parseInt(element.style.width),
        height: parseInt(element.style.height)
      };
    }
    return {
      left: box.left + win.pageXOffset - docElem.clientLeft,
      top: box.top + win.pageYOffset - docElem.clientTop,
      width: box.width,
      height: box.height
    };
  }

  /**
   * @function
   * @param {Touch} touch
   * @return {Touch}
   */
  getPreTouch(touch) {
    let preTouch = null;
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

  /**
   * @function
   * @param {Touch} touch
   */
  setPreTouch(touch) {
    let find = false;
    const locPreTouchPool = this.#preTouchPool;
    const id = touch.id;
    for (let i = locPreTouchPool.length - 1; i >= 0; i--) {
      if (locPreTouchPool[i].id === id) {
        locPreTouchPool[i] = touch;
        find = true;
        break;
      }
    }
    if (!find) {
      if (locPreTouchPool.length <= 50) {
        locPreTouchPool.push(touch);
      } else {
        locPreTouchPool[this.#preTouchPoolPointer] = touch;
        this.#preTouchPoolPointer = (this.#preTouchPoolPointer + 1) % 50;
      }
    }
  }

  /**
   * @function
   * @param {Number} tx
   * @param {Number} ty
   * @param {Point} pos
   * @return {Touch}
   */
  getTouchByXY(tx, ty, pos) {
    const locPreTouch = this.#preTouchPoint;
    const location = this.#eglView.convertToLocationInView(tx, ty, pos);
    const touch = new Touch(location.x, location.y);
    touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
    locPreTouch.x = location.x;
    locPreTouch.y = location.y;
    return touch;
  }

  /**
   * @function
   * @param {Point} location
   * @param {Point} pos
   * @param {Number} eventType
   * @returns {EventMouse}
   */
  getMouseEvent(location, pos, eventType) {
    const locPreMouse = this.#prevMousePoint;
    this.#eglView.convertMouseToLocationInView(location, pos);
    const mouseEvent = new EventMouse(eventType);
    mouseEvent.setLocation(location.x, location.y);
    mouseEvent._setPrevCursor(locPreMouse.x, locPreMouse.y);
    locPreMouse.x = location.x;
    locPreMouse.y = location.y;
    return mouseEvent;
  }

  /**
   * @function
   * @param {Touch} event
   * @param {Point} pos
   * @return {Point}
   */
  getPointByEvent(event, pos) {
    if (event.pageX != null)
      //not available in <= IE8
      return new Point(event.pageX, event.pageY);

    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    return new Point(event.clientX, event.clientY);
  }

  /**
   * @function
   * @param {Touch} event
   * @param {Point} pos
   * @returns {Array}
   */
  getTouchesByEvent(event, pos) {
    const touchArr = [],
      locView = this.#eglView;
    let touch_event, touch, preTouch;
    const locPreTouch = this.#preTouchPoint;

    const length = event.changedTouches.length;
    for (let i = 0; i < length; i++) {
      touch_event = event.changedTouches[i];
      if (touch_event) {
        let location;
        if (BrowserType.FIREFOX === this.#sys.specification.browserType)
          location = locView.convertToLocationInView(
            touch_event.pageX,
            touch_event.pageY,
            pos
          );
        else
          location = locView.convertToLocationInView(
            touch_event.clientX,
            touch_event.clientY,
            pos
          );
        if (touch_event.identifier != null) {
          touch = new Touch(location.x, location.y, touch_event.identifier);
          //use Touch Pool
          preTouch = this.getPreTouch(touch);
          touch._setPrevPoint(preTouch.x, preTouch.y);
          this.setPreTouch(touch);
        } else {
          touch = new Touch(location.x, location.y);
          touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
        }
        locPreTouch.x = location.x;
        locPreTouch.y = location.y;
        touchArr.push(touch);
      }
    }
    return touchArr;
  }

  /**
   * @function
   * @param {HTMLElement} element
   */
  registerSystemEvent(element) {
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

  /**
   * Whether accelerometer events are enabled.
   * @returns {Boolean}
   */
  get accelerometerEnabled() {
    return this.#accelEnabled;
  }

  /**
   * Enable or disable accelerometer events.
   * @param {Boolean} isEnable
   */
  set accelerometerEnabled(isEnable) {
    if (this.#accelEnabled === isEnable) {
      return;
    }

    this.#accelEnabled = isEnable;
    const scheduler = this.#director.scheduler;
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
      const ua = navigator.userAgent;
      if (
        /Android/.test(ua) ||
        (/Adr/.test(ua) &&
          this.#sys.specification.browserType === BrowserType.UC)
      ) {
        this.#accelMinus = -1;
      }

      window.addEventListener(
        deviceEventType,
        this.#didAccelerateCallback,
        false
      );
      scheduler.scheduleUpdate(this);
    } else {
      this.#acceleration = null;
      window.removeEventListener(
        deviceEventType,
        this.#didAccelerateCallback,
        false
      );
      scheduler.unscheduleUpdate(this);
    }
  }

  /**
   * Accelerometer interval value.
   * @returns {Number}
   */
  get accelerometerInterval() {
    return this.#accelInterval;
  }

  /**
   * Set the accelerometer interval value.
   * @param {Number} interval
   */
  set accelerometerInterval(interval) {
    if (this.#accelInterval !== interval) {
      this.#accelInterval = interval;
    }
  }

  didAccelerate(eventData) {
    if (!this.#accelEnabled) return;

    let x, y, z;

    if (this.#accelDeviceEvent === window.DeviceMotionEvent) {
      const eventAcceleration = eventData["accelerationIncludingGravity"];
      x = this.#accelMinus * eventAcceleration.x * 0.1;
      y = this.#accelMinus * eventAcceleration.y * 0.1;
      z = eventAcceleration.z * 0.1;
    } else {
      x = (eventData["gamma"] / 90) * 0.981;
      y = -(eventData["beta"] / 90) * 0.981;
      z = (eventData["alpha"] / 90) * 0.981;
    }

    this.#acceleration.x = x;
    this.#acceleration.y = y;
    this.#acceleration.z = z;

    this.#acceleration.timestamp = eventData.timeStamp || Date.now();

    const tmpX = this.#acceleration.x;
    if (
      window.orientation === InputManager.UIInterfaceOrientationLandscapeRight
    ) {
      this.#acceleration.x = -this.#acceleration.y;
      this.#acceleration.y = tmpX;
    } else if (
      window.orientation === InputManager.UIInterfaceOrientationLandscapeLeft
    ) {
      this.#acceleration.x = this.#acceleration.y;
      this.#acceleration.y = -tmpX;
    } else if (
      window.orientation ===
      InputManager.UIInterfaceOrientationPortraitUpsideDown
    ) {
      this.#acceleration.x = -this.#acceleration.x;
      this.#acceleration.y = -this.#acceleration.y;
    }
  }

  /**
   * @function
   * @param {Number} dt
   */
  update(dt) {
    if (this.#accelCurTime > this.#accelInterval) {
      this.#accelCurTime -= this.#accelInterval;
      this.#eventManager.dispatchEvent(
        new EventAcceleration(this.#acceleration)
      );
    }
    this.#accelCurTime += dt;
  }

  #addEventListeners(target, listeners) {
    for (const listenerId in listeners) {
      target.addEventListener(
        listenerId,
        listeners[listenerId].bind(this),
        false
      );
    }
  }

  get #uniqueUsedIndex() {
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
      temp >>= 1;
    }

    // all bits are used
    return -1;
  }

  #removeUsedIndexBit(index) {
    if (index < 0 || index >= this.#maxTouches) {
      return;
    }

    let temp = 1 << index;
    temp = ~temp;
    this.#indexBitsUsed &= temp;
  }

  #onMouseDown() {
    this.#mousePressed = true;
  }

  #onMouseUp(event) {
    if (this.#sys.specification.isMobil) return;
    const savePressed = this.#mousePressed;
    this.#mousePressed = false;

    if (!savePressed) return;

    const pos = this.getHTMLElementPosition(this.#element);
    const location = this.getPointByEvent(event, pos);
    if (
      !Rect.containsPoint(
        new Rect(pos.left, pos.top, pos.width, pos.height),
        location
      )
    ) {
      this.handleTouchesEnd([this.getTouchByXY(location.x, location.y, pos)]);

      const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.UP);
      mouseEvent.button = event.button;
      this.#eventManager.dispatchEvent(mouseEvent);
    }
  }

  #onElementMouseDown(event) {
    if (this.#sys.specification.isMobil) return;
    this.#mousePressed = true;

    const pos = this.getHTMLElementPosition(this.#element);
    const location = this.getPointByEvent(event, pos);

    this.handleTouchesBegin([this.getTouchByXY(location.x, location.y, pos)]);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.DOWN);
    mouseEvent.button = event.button;
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
    this.#element.focus();
  }

  #onElementMouseUp(event) {
    if (this.#sys.specification.isMobil) return;
    this.#mousePressed = false;

    const pos = this.getHTMLElementPosition(this.#element);
    const location = this.getPointByEvent(event, pos);

    this.handleTouchesEnd([this.getTouchByXY(location.x, location.y, pos)]);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.UP);
    mouseEvent.button = event.button;
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onMouseMove(event) {
    if (this.#sys.specification.isMobil) return;

    const pos = this.getHTMLElementPosition(this.#element);
    const location = this.getPointByEvent(event, pos);

    this.handleTouchesMove([this.getTouchByXY(location.x, location.y, pos)]);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.MOVE);
    if (this.#mousePressed) mouseEvent.button = event.button;
    else mouseEvent.button = -1;
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onMouseWheel(event) {
    const pos = this.getHTMLElementPosition(this.#element);
    const location = this.getPointByEvent(event, pos);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.SCROLL);
    mouseEvent.button = event.button;
    mouseEvent.setScrollData(0, event.wheelDelta);
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onDOMMouseScroll(event) {
    const pos = this.getHTMLElementPosition(this.#element);
    const location = this.getPointByEvent(event, pos);

    const mouseEvent = this.getMouseEvent(location, pos, MouseEvent.SCROLL);
    mouseEvent.button = event.button;
    mouseEvent.setScrollData(0, event.detail * -120);
    this.#eventManager.dispatchEvent(mouseEvent);

    event.stopPropagation();
    event.preventDefault();
  }

  #onTouchStart(event) {
    if (!event.changedTouches) return;

    const pos = this.getHTMLElementPosition(this.#element);
    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    this.handleTouchesBegin(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
    this.#element.focus();
  }

  #onTouchMove(event) {
    if (!event.changedTouches) return;

    const pos = this.getHTMLElementPosition(this.#element);
    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    this.handleTouchesMove(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
  }

  #onTouchEnd(event) {
    if (!event.changedTouches) return;

    const pos = this.getHTMLElementPosition(this.#element);
    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    this.handleTouchesEnd(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
  }

  #onTouchCancel(event) {
    if (!event.changedTouches) return;

    const pos = this.getHTMLElementPosition(this.#element);
    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    this.handleTouchesCancel(this.getTouchesByEvent(event, pos));
    event.stopPropagation();
    event.preventDefault();
  }

  #onKeyDown(event) {
    this.#eventManager.dispatchEvent(new EventKeyboard(event.keyCode, true));
    event.stopPropagation();
    event.preventDefault();
  }

  #onKeyUp(event) {
    this.#eventManager.dispatchEvent(new EventKeyboard(event.keyCode, false));
    event.stopPropagation();
    event.preventDefault();
  }
}

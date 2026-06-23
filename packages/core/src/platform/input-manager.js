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
import Touch from "../event-manager/touch";
import { EventTouch, EventMouse } from "../event-manager/event/index";
import { EventAcceleration } from "../event-manager/event-extension/index";
import EventKeyboard from "../event-manager/event-extension/event-keyboard";
import { Acceleration } from "../platform/types/color";
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

  _mousePressed = false;

  _isRegisterEvent = false;

  _preTouchPoint = new Point();
  _prevMousePoint = new Point();

  _preTouchPool = [];
  _preTouchPoolPointer = 0;

  _touches = [];
  _touchesIntegerDict = {};

  _indexBitsUsed = 0;
  _maxTouches = 5;

  _accelEnabled = false;
  _accelInterval = 1 / 30;
  _accelMinus = 1;
  _accelCurTime = 0;
  _acceleration = null;
  _accelDeviceEvent = null;
  didAccelerateCallback = null;

  _getUnUsedIndex() {
    var temp = this._indexBitsUsed;
    var now = Date.now();

    for (var i = 0; i < this._maxTouches; i++) {
      if (!(temp & 0x00000001)) {
        this._indexBitsUsed |= 1 << i;
        return i;
      } else {
        var touch = this._touches[i];
        if (now - touch.lastModified > this.TOUCH_TIMEOUT) {
          this._removeUsedIndexBit(i);
          delete this._touchesIntegerDict[touch.id];
          return i;
        }
      }
      temp >>= 1;
    }

    // all bits are used
    return -1;
  }

  _removeUsedIndexBit(index) {
    if (index < 0 || index >= this._maxTouches) return;

    var temp = 1 << index;
    temp = ~temp;
    this._indexBitsUsed &= temp;
  }

  _glView = null;

  _director = null;
  _eglView = null;
  _eventManager = null;
  _game = null;
  _sys = null;

  injectServices({ director, eglView, eventManager, game, sys }) {
    this._director = director;
    this._eglView = eglView;
    this._eventManager = eventManager;
    this._game = game;
    this._sys = sys;
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesBegin(touches) {
    var selTouch,
      index,
      curTouch,
      touchID,
      handleTouches = [],
      locTouchIntDict = this._touchesIntegerDict,
      now = Date.now();
    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = locTouchIntDict[touchID];

      if (index == null) {
        var unusedIndex = this._getUnUsedIndex();
        if (unusedIndex === -1) {
          log(_LogInfos.inputManager_handleTouchesBegin, unusedIndex);
          continue;
        }
        //curTouch = this._touches[unusedIndex] = selTouch;
        curTouch = this._touches[unusedIndex] = selTouch.clone();
        curTouch.lastModified = now;
        curTouch._setPrevPoint(selTouch.previousLocation);
        locTouchIntDict[touchID] = unusedIndex;
        handleTouches.push(curTouch);
      }
    }
    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);
      var touchEvent = new EventTouch(handleTouches);
      touchEvent._setEventCode(TouchEvent.BEGAN);
      this._eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesMove(touches) {
    var selTouch,
      index,
      touchID,
      handleTouches = [],
      locTouches = this._touches,
      now = Date.now();
    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = this._touchesIntegerDict[touchID];

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
      this._glView._convertTouchesWithScale(handleTouches);
      var touchEvent = new EventTouch(handleTouches);
      touchEvent._setEventCode(TouchEvent.MOVED);
      this._eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesEnd(touches) {
    var handleTouches = this.getSetOfTouchesEndOrCancel(touches);
    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);
      var touchEvent = new EventTouch(handleTouches);
      touchEvent._setEventCode(TouchEvent.ENDED);
      this._eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   */
  handleTouchesCancel(touches) {
    var handleTouches = this.getSetOfTouchesEndOrCancel(touches);
    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);
      var touchEvent = new EventTouch(handleTouches);
      touchEvent._setEventCode(TouchEvent.CANCELLED);
      this._eventManager.dispatchEvent(touchEvent);
    }
  }

  /**
   * @function
   * @param {Array} touches
   * @returns {Array}
   */
  getSetOfTouchesEndOrCancel(touches) {
    var selTouch,
      index,
      touchID,
      handleTouches = [],
      locTouches = this._touches,
      locTouchesIntDict = this._touchesIntegerDict;
    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.id;
      index = locTouchesIntDict[touchID];

      if (index == null) {
        continue; //log("if the index doesn't exist, it is an error");
      }
      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch);
        locTouches[index]._setPrevPoint(selTouch.previousLocation);
        handleTouches.push(locTouches[index]);
        this._removeUsedIndexBit(index);
        delete locTouchesIntDict[touchID];
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
    var docElem = document.documentElement;
    var win = window;
    var box = null;
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
    var preTouch = null;
    var locPreTouchPool = this._preTouchPool;
    var id = touch.id;
    for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
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
    var find = false;
    var locPreTouchPool = this._preTouchPool;
    var id = touch.id;
    for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
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
        locPreTouchPool[this._preTouchPoolPointer] = touch;
        this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50;
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
    var locPreTouch = this._preTouchPoint;
    var location = this._glView.convertToLocationInView(tx, ty, pos);
    var touch = new Touch(location.x, location.y);
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
    var locPreMouse = this._prevMousePoint;
    this._glView._convertMouseToLocationInView(location, pos);
    var mouseEvent = new EventMouse(eventType);
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
      return { x: event.pageX, y: event.pageY };

    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    return { x: event.clientX, y: event.clientY };
  }

  /**
   * @function
   * @param {Touch} event
   * @param {Point} pos
   * @returns {Array}
   */
  getTouchesByEvent(event, pos) {
    var touchArr = [],
      locView = this._glView;
    var touch_event, touch, preTouch;
    var locPreTouch = this._preTouchPoint;

    var length = event.changedTouches.length;
    for (var i = 0; i < length; i++) {
      touch_event = event.changedTouches[i];
      if (touch_event) {
        var location;
        if (BrowserType.FIREFOX === this._sys.browserType)
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
    if (this._isRegisterEvent) return;

    var locView = (this._glView = this._eglView);
    var selfPointer = this;
    var supportMouse = "mouse" in this._sys.capabilities,
      supportTouches = "touches" in this._sys.capabilities;

    //HACK
    //  - At the same time to trigger the ontouch event and onmouse event
    //  - The function will execute 2 times
    //The known browser:
    //  liebiao
    //  miui
    //  WECHAT
    var prohibition = false;
    if (this._sys.isMobile) prohibition = true;

    //register touch event
    if (supportMouse) {
      window.addEventListener(
        "mousedown",
        function () {
          selfPointer._mousePressed = true;
        },
        false
      );

      window.addEventListener(
        "mouseup",
        function (event) {
          if (prohibition) return;
          var savePressed = selfPointer._mousePressed;
          selfPointer._mousePressed = false;

          if (!savePressed) return;

          var pos = selfPointer.getHTMLElementPosition(element);
          var location = selfPointer.getPointByEvent(event, pos);
          if (
            !Rect.containsPoint(
              new Rect(pos.left, pos.top, pos.width, pos.height),
              location
            )
          ) {
            selfPointer.handleTouchesEnd([
              selfPointer.getTouchByXY(location.x, location.y, pos)
            ]);

            var mouseEvent = selfPointer.getMouseEvent(
              location,
              pos,
              MouseEvent.UP
            );
            mouseEvent.button = event.button;
            selfPointer._eventManager.dispatchEvent(mouseEvent);
          }
        },
        false
      );

      //register canvas mouse event
      element.addEventListener(
        "mousedown",
        function (event) {
          if (prohibition) return;
          selfPointer._mousePressed = true;

          var pos = selfPointer.getHTMLElementPosition(element);
          var location = selfPointer.getPointByEvent(event, pos);

          selfPointer.handleTouchesBegin([
            selfPointer.getTouchByXY(location.x, location.y, pos)
          ]);

          var mouseEvent = selfPointer.getMouseEvent(
            location,
            pos,
            MouseEvent.DOWN
          );
          mouseEvent.button = event.button;
          selfPointer._eventManager.dispatchEvent(mouseEvent);

          event.stopPropagation();
          event.preventDefault();
          element.focus();
        },
        false
      );

      element.addEventListener(
        "mouseup",
        function (event) {
          if (prohibition) return;
          selfPointer._mousePressed = false;

          var pos = selfPointer.getHTMLElementPosition(element);
          var location = selfPointer.getPointByEvent(event, pos);

          selfPointer.handleTouchesEnd([
            selfPointer.getTouchByXY(location.x, location.y, pos)
          ]);

          var mouseEvent = selfPointer.getMouseEvent(
            location,
            pos,
            MouseEvent.UP
          );
          mouseEvent.button = event.button;
          selfPointer._eventManager.dispatchEvent(mouseEvent);

          event.stopPropagation();
          event.preventDefault();
        },
        false
      );

      element.addEventListener(
        "mousemove",
        function (event) {
          if (prohibition) return;

          var pos = selfPointer.getHTMLElementPosition(element);
          var location = selfPointer.getPointByEvent(event, pos);

          selfPointer.handleTouchesMove([
            selfPointer.getTouchByXY(location.x, location.y, pos)
          ]);

          var mouseEvent = selfPointer.getMouseEvent(
            location,
            pos,
            MouseEvent.MOVE
          );
          if (selfPointer._mousePressed) mouseEvent.button = event.button;
          else mouseEvent.button = -1;
          selfPointer._eventManager.dispatchEvent(mouseEvent);

          event.stopPropagation();
          event.preventDefault();
        },
        false
      );

      element.addEventListener(
        "mousewheel",
        function (event) {
          var pos = selfPointer.getHTMLElementPosition(element);
          var location = selfPointer.getPointByEvent(event, pos);

          var mouseEvent = selfPointer.getMouseEvent(
            location,
            pos,
            MouseEvent.SCROLL
          );
          mouseEvent.button = event.button;
          mouseEvent.setScrollData(0, event.wheelDelta);
          selfPointer._eventManager.dispatchEvent(mouseEvent);

          event.stopPropagation();
          event.preventDefault();
        },
        false
      );

      /* firefox fix */
      element.addEventListener(
        "DOMMouseScroll",
        function (event) {
          var pos = selfPointer.getHTMLElementPosition(element);
          var location = selfPointer.getPointByEvent(event, pos);

          var mouseEvent = selfPointer.getMouseEvent(
            location,
            pos,
            MouseEvent.SCROLL
          );
          mouseEvent.button = event.button;
          mouseEvent.setScrollData(0, event.detail * -120);
          selfPointer._eventManager.dispatchEvent(mouseEvent);

          event.stopPropagation();
          event.preventDefault();
        },
        false
      );
    }

    if (window.navigator.msPointerEnabled) {
      var _pointerEventsMap = {
        MSPointerDown: selfPointer.handleTouchesBegin,
        MSPointerMove: selfPointer.handleTouchesMove,
        MSPointerUp: selfPointer.handleTouchesEnd,
        MSPointerCancel: selfPointer.handleTouchesCancel
      };

      for (var eventName in _pointerEventsMap) {
        (function (_pointerEvent, _touchEvent) {
          element.addEventListener(
            _pointerEvent,
            function (event) {
              var pos = selfPointer.getHTMLElementPosition(element);
              pos.left -= document.documentElement.scrollLeft;
              pos.top -= document.documentElement.scrollTop;

              _touchEvent.call(selfPointer, [
                selfPointer.getTouchByXY(event.clientX, event.clientY, pos)
              ]);
              event.stopPropagation();
            },
            false
          );
        })(eventName, _pointerEventsMap[eventName]);
      }
    }

    if (supportTouches) {
      //register canvas touch event
      element.addEventListener(
        "touchstart",
        function (event) {
          if (!event.changedTouches) return;

          var pos = selfPointer.getHTMLElementPosition(element);
          pos.left -= document.body.scrollLeft;
          pos.top -= document.body.scrollTop;
          selfPointer.handleTouchesBegin(
            selfPointer.getTouchesByEvent(event, pos)
          );
          event.stopPropagation();
          event.preventDefault();
          element.focus();
        },
        false
      );

      element.addEventListener(
        "touchmove",
        function (event) {
          if (!event.changedTouches) return;

          var pos = selfPointer.getHTMLElementPosition(element);
          pos.left -= document.body.scrollLeft;
          pos.top -= document.body.scrollTop;
          selfPointer.handleTouchesMove(
            selfPointer.getTouchesByEvent(event, pos)
          );
          event.stopPropagation();
          event.preventDefault();
        },
        false
      );

      element.addEventListener(
        "touchend",
        function (event) {
          if (!event.changedTouches) return;

          var pos = selfPointer.getHTMLElementPosition(element);
          pos.left -= document.body.scrollLeft;
          pos.top -= document.body.scrollTop;
          selfPointer.handleTouchesEnd(
            selfPointer.getTouchesByEvent(event, pos)
          );
          event.stopPropagation();
          event.preventDefault();
        },
        false
      );

      element.addEventListener(
        "touchcancel",
        function (event) {
          if (!event.changedTouches) return;

          var pos = selfPointer.getHTMLElementPosition(element);
          pos.left -= document.body.scrollLeft;
          pos.top -= document.body.scrollTop;
          selfPointer.handleTouchesCancel(
            selfPointer.getTouchesByEvent(event, pos)
          );
          event.stopPropagation();
          event.preventDefault();
        },
        false
      );
    }

    //register keyboard event
    this._registerKeyboardEvent();

    //register Accelerometer event
    // this._registerAccelerometerEvent();

    this._isRegisterEvent = true;
  }

  /**
   * whether enable accelerometer event
   * @function
   * @param {Boolean} isEnable
   */
  setAccelerometerEnabled(isEnable) {
    var _t = this;
    if (_t._accelEnabled === isEnable) return;

    _t._accelEnabled = isEnable;
    var scheduler = this._director.getScheduler();
    if (_t._accelEnabled) {
      _t._accelCurTime = 0;
      _t._registerAccelerometerEvent();
      scheduler.scheduleUpdate(_t);
    } else {
      _t._accelCurTime = 0;
      _t._unregisterAccelerometerEvent();
      scheduler.unscheduleUpdate(_t);
    }
  }

  /**
   * set accelerometer interval value
   * @function
   * @param {Number} interval
   */
  setAccelerometerInterval(interval) {
    if (this._accelInterval !== interval) {
      this._accelInterval = interval;
    }
  }

  _registerKeyboardEvent() {
    var self = this;
    self._game.canvas.addEventListener(
      "keydown",
      function (e) {
        self._eventManager.dispatchEvent(new EventKeyboard(e.keyCode, true));
        e.stopPropagation();
        e.preventDefault();
      },
      false
    );
    self._game.canvas.addEventListener(
      "keyup",
      function (e) {
        self._eventManager.dispatchEvent(new EventKeyboard(e.keyCode, false));
        e.stopPropagation();
        e.preventDefault();
      },
      false
    );
  }

  /**
   * Register Accelerometer event
   * @function
   */
  _registerAccelerometerEvent() {
    var w = window,
      _t = this;
    _t._acceleration = new Acceleration();
    _t._accelDeviceEvent = w.DeviceMotionEvent || w.DeviceOrientationEvent;

    //TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
    if (this._sys.browserType === BrowserType.MOBILE_QQ)
      _t._accelDeviceEvent = window.DeviceOrientationEvent;

    var _deviceEventType =
      _t._accelDeviceEvent === w.DeviceMotionEvent
        ? "devicemotion"
        : "deviceorientation";
    var ua = navigator.userAgent;
    if (
      /Android/.test(ua) ||
      (/Adr/.test(ua) && this._sys.browserType === BrowserType.UC)
    ) {
      _t._minus = -1;
    }

    _t.didAccelerateCallback = _t.didAccelerate.bind(_t);
    w.addEventListener(_deviceEventType, _t.didAccelerateCallback, false);
  }

  _unregisterAccelerometerEvent() {
    this._acceleration = null;
    var _deviceEventType =
      this._accelDeviceEvent === window.DeviceMotionEvent
        ? "devicemotion"
        : "deviceorientation";
    window.removeEventListener(
      _deviceEventType,
      this.didAccelerateCallback,
      false
    );
  }

  didAccelerate(eventData) {
    var _t = this,
      w = window;
    if (!_t._accelEnabled) return;

    var mAcceleration = _t._acceleration;

    var x, y, z;

    if (_t._accelDeviceEvent === window.DeviceMotionEvent) {
      var eventAcceleration = eventData["accelerationIncludingGravity"];
      x = _t._accelMinus * eventAcceleration.x * 0.1;
      y = _t._accelMinus * eventAcceleration.y * 0.1;
      z = eventAcceleration.z * 0.1;
    } else {
      x = (eventData["gamma"] / 90) * 0.981;
      y = -(eventData["beta"] / 90) * 0.981;
      z = (eventData["alpha"] / 90) * 0.981;
    }

    mAcceleration.x = x;
    mAcceleration.y = y;
    mAcceleration.z = z;

    mAcceleration.timestamp = eventData.timeStamp || Date.now();

    var tmpX = mAcceleration.x;
    if (w.orientation === InputManager.UIInterfaceOrientationLandscapeRight) {
      mAcceleration.x = -mAcceleration.y;
      mAcceleration.y = tmpX;
    } else if (
      w.orientation === InputManager.UIInterfaceOrientationLandscapeLeft
    ) {
      mAcceleration.x = mAcceleration.y;
      mAcceleration.y = -tmpX;
    } else if (
      w.orientation === InputManager.UIInterfaceOrientationPortraitUpsideDown
    ) {
      mAcceleration.x = -mAcceleration.x;
      mAcceleration.y = -mAcceleration.y;
    }
  }

  /**
   * @function
   * @param {Number} dt
   */
  update(dt) {
    if (this._accelCurTime > this._accelInterval) {
      this._accelCurTime -= this._accelInterval;
      this._eventManager.dispatchEvent(
        new EventAcceleration(this._acceleration)
      );
    }
    this._accelCurTime += dt;
  }
}

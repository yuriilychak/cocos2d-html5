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

import Event from "./event";

/**
 * The mouse event
 * @class
 * @extends Event
 */
export default class EventMouse extends Event {
  constructor(eventType) {
    super(Event.MOUSE);
    this._eventType = 0;
    this._button = 0;
    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
    this._scrollX = 0;
    this._scrollY = 0;

    this._eventType = eventType;
  }

  /**
   * Sets scroll data
   * @param {number} scrollX
   * @param {number} scrollY
   */
  setScrollData(scrollX, scrollY) {
    this._scrollX = scrollX;
    this._scrollY = scrollY;
  }

  /**
   * Returns the x axis scroll value
   * @returns {number}
   */
  getScrollX() {
    return this._scrollX;
  }

  /**
   * Returns the y axis scroll value
   * @returns {number}
   */
  getScrollY() {
    return this._scrollY;
  }

  /**
   * Sets cursor location
   * @param {number} x
   * @param {number} y
   */
  setLocation(x, y) {
    this._x = x;
    this._y = y;
  }

  /**
   * Returns cursor location
   * @return {Point} location
   */
  getLocation() {
    return { x: this._x, y: this._y };
  }

  /**
   * Returns the current cursor location in screen coordinates
   * @return {Point}
   */
  getLocationInView() {
    return { x: this._x, y: cc.view._designResolutionSize.height - this._y };
  }

  _setPrevCursor(x, y) {
    this._prevX = x;
    this._prevY = y;
  }

  /**
   * Returns the delta distance from the previous location to current location
   * @return {Point}
   */
  getDelta() {
    return { x: this._x - this._prevX, y: this._y - this._prevY };
  }

  /**
   * Returns the X axis delta distance from the previous location to current location
   * @return {Number}
   */
  getDeltaX() {
    return this._x - this._prevX;
  }

  /**
   * Returns the Y axis delta distance from the previous location to current location
   * @return {Number}
   */
  getDeltaY() {
    return this._y - this._prevY;
  }

  /**
   * Sets mouse button
   * @param {number} button
   */
  setButton(button) {
    this._button = button;
  }

  /**
   * Returns mouse button
   * @returns {number}
   */
  getButton() {
    return this._button;
  }

  /**
   * Returns location X axis data
   * @returns {number}
   */
  getLocationX() {
    return this._x;
  }

  /**
   * Returns location Y axis data
   * @returns {number}
   */
  getLocationY() {
    return this._y;
  }
}

//Different types of MouseEvent
/**
 * The none event code of  mouse event.
 * @constant
 * @type {number}
 */
EventMouse.NONE = 0;
/**
 * The event type code of mouse down event.
 * @constant
 * @type {number}
 */
EventMouse.DOWN = 1;
/**
 * The event type code of mouse up event.
 * @constant
 * @type {number}
 */
EventMouse.UP = 2;
/**
 * The event type code of mouse move event.
 * @constant
 * @type {number}
 */
EventMouse.MOVE = 3;
/**
 * The event type code of mouse scroll event.
 * @constant
 * @type {number}
 */
EventMouse.SCROLL = 4;

/**
 * The tag of Mouse left button
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_LEFT = 0;

/**
 * The tag of Mouse right button  (The right button number is 2 on browser)
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_RIGHT = 2;

/**
 * The tag of Mouse middle button  (The right button number is 1 on browser)
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_MIDDLE = 1;

/**
 * The tag of Mouse button 4
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_4 = 3;

/**
 * The tag of Mouse button 5
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_5 = 4;

/**
 * The tag of Mouse button 6
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_6 = 5;

/**
 * The tag of Mouse button 7
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_7 = 6;

/**
 * The tag of Mouse button 8
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_8 = 7;

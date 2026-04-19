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

import { NewClass } from "../../platform/class";

/**
 * <p>
 *     The base class of event listener.                                                                        <br/>
 *     If you need custom listener which with different callback, you need to inherit this class.               <br/>
 *     For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
 *      EventListenerTouchOneByOne, EventListenerCustom.
 * </p>
 * @class
 * @extends NewClass
 */
export default class EventListener extends NewClass {
  /**
   * Initializes event with type and callback function
   * @param {number} type
   * @param {string} listenerID
   * @param {function} callback
   */
  constructor(type, listenerID, callback) {
    super();
    this._onEvent = null;
    this._type = 0;
    this._listenerID = null;
    this._registered = false;

    this._fixedPriority = 0;
    this._node = null;
    this._paused = true;
    this._isEnabled = true;

    this._onEvent = callback;
    this._type = type || 0;
    this._listenerID = listenerID || "";
  }

  /**
   * <p>
   *     Sets paused state for the listener
   *     The paused state is only used for scene graph priority listeners.
   *     `EventDispatcher::resumeAllEventListenersForTarget(node)` will set the paused state to `true`,
   *     while `EventDispatcher::pauseAllEventListenersForTarget(node)` will set it to `false`.
   *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,
   *              call `setEnabled(false)` instead.
   *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners which associated with that node will be automatically updated.
   * </p>
   * @param {boolean} paused
   * @private
   */
  _setPaused(paused) {
    this._paused = paused;
  }

  /**
   * Checks whether the listener is paused
   * @returns {boolean}
   * @private
   */
  _isPaused() {
    return this._paused;
  }

  /**
   * Marks the listener was registered by EventDispatcher
   * @param {boolean} registered
   * @private
   */
  _setRegistered(registered) {
    this._registered = registered;
  }

  /**
   * Checks whether the listener was registered by EventDispatcher
   * @returns {boolean}
   * @private
   */
  _isRegistered() {
    return this._registered;
  }

  /**
   * Gets the type of this listener
   * @note It's different from `EventType`, e.g. TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce
   * @returns {number}
   * @private
   */
  _getType() {
    return this._type;
  }

  /**
   *  Gets the listener ID of this listener
   *  When event is being dispatched, listener ID is used as key for searching listeners according to event type.
   * @returns {string}
   * @private
   */
  _getListenerID() {
    return this._listenerID;
  }

  /**
   * Sets the fixed priority for this listener
   *  @note This method is only used for `fixed priority listeners`, it needs to access a non-zero value. 0 is reserved for scene graph priority listeners
   * @param {number} fixedPriority
   * @private
   */
  _setFixedPriority(fixedPriority) {
    this._fixedPriority = fixedPriority;
  }

  /**
   * Gets the fixed priority of this listener
   * @returns {number} 0 if it's a scene graph priority listener, non-zero for fixed priority listener
   * @private
   */
  _getFixedPriority() {
    return this._fixedPriority;
  }

  /**
   * Sets scene graph priority for this listener
   * @param {Node} node
   * @private
   */
  _setSceneGraphPriority(node) {
    this._node = node;
  }

  /**
   * Gets scene graph priority of this listener
   * @returns {Node} if it's a fixed priority listener, non-null for scene graph priority listener
   * @private
   */
  _getSceneGraphPriority() {
    return this._node;
  }

  /**
   * Checks whether the listener is available.
   * @returns {boolean}
   */
  checkAvailable() {
    return this._onEvent !== null;
  }

  /**
   * Clones the listener, its subclasses have to override this method.
   * @returns {EventListener}
   */
  clone() {
    return null;
  }

  /**
   *  Enables or disables the listener
   *  @note Only listeners with `enabled` state will be able to receive events.
   *          When an listener was initialized, it's enabled by default.
   *          An event listener can receive events when it is enabled and is not paused.
   *          paused state is always false when it is a fixed priority listener.
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this._isEnabled = enabled;
  }

  /**
   * Checks whether the listener is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this._isEnabled;
  }
}

// event listener type
/**
 * The type code of unknown event listener.
 * @constant
 * @type {number}
 */
EventListener.UNKNOWN = 0;
/**
 * The type code of one by one touch event listener.
 * @constant
 * @type {number}
 */
EventListener.TOUCH_ONE_BY_ONE = 1;
/**
 * The type code of all at once touch event listener.
 * @constant
 * @type {number}
 */
EventListener.TOUCH_ALL_AT_ONCE = 2;
/**
 * The type code of keyboard event listener.
 * @constant
 * @type {number}
 */
EventListener.KEYBOARD = 3;
/**
 * The type code of mouse event listener.
 * @constant
 * @type {number}
 */
EventListener.MOUSE = 4;
/**
 * The type code of acceleration event listener.
 * @constant
 * @type {number}
 */
EventListener.ACCELERATION = 6;
/**
 * The type code of Focus change event listener.
 * @constant
 * @type {number}
 */
EventListener.FOCUS = 7;
/**
 * The type code of custom event listener.
 * @constant
 * @type {number}
 */
EventListener.CUSTOM = 8;

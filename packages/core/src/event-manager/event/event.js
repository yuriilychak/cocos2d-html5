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

import NewClass from '../../platform/class';
import * as EventType from './constants';

/**
 * Base class of all kinds of events.
 * @class
 * @extends NewClass
 */
export default class Event extends NewClass {
    constructor(type) {
        super();
        this._type = 0;
        this._isStopped = false;
        this._currentTarget = null;

        this._type = type;
    }

    _setCurrentTarget(target) {
        this._currentTarget = target;
    }

    /**
     * Gets the event type
     * @function
     * @returns {Number}
     */
    getType() {
        return this._type;
    }

    /**
     * Stops propagation for current event
     * @function
     */
    stopPropagation() {
        this._isStopped = true;
    }

    /**
     * Checks whether the event has been stopped
     * @function
     * @returns {boolean}
     */
    isStopped() {
        return this._isStopped;
    }

    /**
     * <p>
     *     Gets current target of the event                                                            <br/>
     *     note: It only be available when the event listener is associated with node.                <br/>
     *          It returns 0 when the listener is associated with fixed priority.
     * </p>
     * @function
     * @returns {cc.Node}  The target with which the event associates.
     */
    getCurrentTarget() {
        return this._currentTarget;
    }
}

Event.TOUCH = EventType.TOUCH;
Event.KEYBOARD = EventType.KEYBOARD;
Event.ACCELERATION = EventType.ACCELERATION;
Event.MOUSE = EventType.MOUSE;
Event.FOCUS = EventType.FOCUS;
Event.CUSTOM = EventType.CUSTOM;

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

import EventListener from './event-listener';
import _EventListenerCustom from './event-listener-custom';
import _EventListenerMouse from './event-listener-mouse';
import _EventListenerTouchOneByOne from './event-listener-touch-one-by-one';
import _EventListenerTouchAllAtOnce from './event-listener-touch-all-at-once';
import _EventListenerFocus from './event-listener-focus';
import _EventListenerKeyboard from '../event-extension/event-listener-keyboard';
import _EventListenerAcceleration from '../event-extension/event-listener-acceleration';

/**
 * Create a EventListener object by json object
 * @function
 * @static
 * @param {object} argObj a json object
 * @returns {EventListener}
 * todo: It should be the direct use new
 * @example
 * EventListener.create({
 *       event: EventListener.TOUCH_ONE_BY_ONE,
 *       swallowTouches: true,
 *       onTouchBegan: function (touch, event) {
 *           //do something
 *           return true;
 *       }
 *    });
 */
EventListener.create = function(argObj){

    cc.assert(argObj&&argObj.event, cc._LogInfos.EventListener_create);

    var listenerType = argObj.event;
    delete argObj.event;

    var listener = null;
    if(listenerType === EventListener.TOUCH_ONE_BY_ONE)
        listener = new _EventListenerTouchOneByOne();
    else if(listenerType === EventListener.TOUCH_ALL_AT_ONCE)
        listener = new _EventListenerTouchAllAtOnce();
    else if(listenerType === EventListener.MOUSE)
        listener = new _EventListenerMouse();
    else if(listenerType === EventListener.CUSTOM){
        listener = new _EventListenerCustom(argObj.eventName, argObj.callback);
        delete argObj.eventName;
        delete argObj.callback;
    } else if(listenerType === EventListener.KEYBOARD)
        listener = new _EventListenerKeyboard();
    else if(listenerType === EventListener.ACCELERATION){
        listener = new _EventListenerAcceleration(argObj.callback);
        delete argObj.callback;
    } else if(listenerType === EventListener.FOCUS)
        listener = new _EventListenerFocus();

    for(var key in argObj) {
        listener[key] = argObj[key];
    }

    return listener;
};

export {
    EventListener,
    _EventListenerCustom,
    _EventListenerMouse,
    _EventListenerTouchOneByOne,
    _EventListenerTouchAllAtOnce,
    _EventListenerFocus
};

/****************************************************************************
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

import { Frame } from "./frame.js";


/**
 * Event frame
 * @extend Frame
 */
export class EventFrame extends Frame {
  constructor() {
    super();
    this._event = "";
    this._enterWhenPassed = true;
  }

  /**
   * the execution of the callback
   * @param {Frame} nextFrame
   */
  onEnter(nextFrame) {
    this._emitEvent();
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   * @return {EventFrame}
   */
  clone() {
    var frame = new EventFrame();
    frame.setEvent(this._event);

    frame._cloneProperty(this);

    return frame;
  }

  /**
   * Set the event
   * @param event
   */
  setEvent(event) {
    this._event = event;
  }

  /**
   * Gets the event
   * @returns {null}
   */
  getEvent() {
    return this._event;
  }
};

ccs.EventFrame = EventFrame;

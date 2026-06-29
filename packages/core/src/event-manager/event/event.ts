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

import { EventType } from "../../enums";
import { BaseClass } from "../../platform/class";

/**
 * Base class of all kinds of events.
 */
export default class Event extends BaseClass {
  #type: EventType = EventType.NONE;
  #isStopped: boolean = false;
  #currentTarget: unknown = null;

  constructor(type: EventType) {
    super();
    this.#type = type;
  }

  /**
   * Gets the event type
   */

  get type(): EventType {
    return this.#type;
  }

  /**
   * Stops propagation for current event
   */
  stopPropagation(): void {
    this.#isStopped = true;
  }

  /**
   * Checks whether the event has been stopped
   */
  get stopped(): boolean {
    return this.#isStopped;
  }

  /**
   * <p>
   *     Gets current target of the event                                                            <br/>
   *     note: It only be available when the event listener is associated with node.                <br/>
   *          It returns 0 when the listener is associated with fixed priority.
   * </p>
   * @returns {Node}  The target with which the event associates.
   */
  get currentTarget(): unknown {
    return this.#currentTarget;
  }

  set currentTarget(target: unknown) {
    this.#currentTarget = target;
  }
}
